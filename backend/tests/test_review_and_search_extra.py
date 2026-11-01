"""Extra tests required by the spec (Section 11) and the review fixes.

Run from the project root:  python -m pytest backend/tests -q
"""
import pytest
from fastapi.testclient import TestClient

from backend.seed import seed
from backend.app import search as search_mod
from backend.app.search import search_resources
from backend.app.config import ADMIN_TOKEN
from backend.app.main import app

client = TestClient(app)
ADMIN = {"X-Admin-Token": ADMIN_TOKEN}


@pytest.fixture(autouse=True)
def fresh_db():
    seed()
    search_mod._TRANSLATION_CACHE.clear()
    yield


def _titles(res):
    return [i["title"] for i in res["items"]]


def test_hindi_query_finds_adalaj_with_mocked_translation(monkeypatch):
    def fake_translate(text, target):
        return "Adalaj Stepwell" if target == "en" else text
    monkeypatch.setattr(search_mod, "translate", fake_translate)
    res = search_resources(q="अडालज की वाव")
    assert any("Adalaj" in t for t in _titles(res))


def test_gujarati_query_finds_adalaj_via_monument_name(monkeypatch):
    monkeypatch.setattr(search_mod, "translate", lambda text, target: text)  # no LLM at all
    res = search_resources(q="અડાલજની વાવ")
    assert any("Adalaj" in t for t in _titles(res))


def test_pending_resource_never_found_by_title(monkeypatch):
    monkeypatch.setattr(search_mod, "translate", lambda text, target: text)
    res = search_resources(q="Draft Aerial View")
    assert 11 not in [i["id"] for i in res["items"]]


def test_delete_removes_resource_from_search_immediately(monkeypatch):
    monkeypatch.setattr(search_mod, "translate", lambda text, target: text)
    before = search_resources(q="Entrance View")
    assert 1 in [i["id"] for i in before["items"]]
    r = client.delete("/api/v1/resources/1", headers=ADMIN)
    assert r.status_code == 200
    after = search_resources(q="Entrance View")
    assert 1 not in [i["id"] for i in after["items"]]


def test_approve_publishes_but_does_not_verify():
    r = client.post("/api/v1/review/resource/11", json={"action": "approve"}, headers=ADMIN)
    assert r.status_code == 200
    d = client.get("/api/v1/resources/11").json()
    status = d.get("verify_status") or d.get("resource", {}).get("verify_status")
    assert status != "verified"


def test_claim_cannot_be_verified_without_tier1_or_reason():
    # claim 7 is the AI-suggested claim with no source
    r = client.post("/api/v1/review/claim/7", json={"status": "verified"}, headers=ADMIN)
    assert r.status_code == 400


def test_seed_has_no_verified_claims_or_resources():
    claims = client.get("/api/v1/claims").json()["claims"]
    assert all(c["status"] != "verified" for c in claims)
    res = search_resources(q="")
    assert all(i["verify_status"] != "verified" for i in res["items"])


def test_extract_claims_requires_admin():
    assert client.post("/api/v1/resources/3/extract-claims").status_code == 401


def test_models3d_job_requires_admin():
    r = client.post("/api/v1/models3d", json={"monument_id": 1, "photo_ids": []})
    assert r.status_code == 401
