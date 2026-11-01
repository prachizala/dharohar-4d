import pytest
from backend.seed import seed
from backend.app.search import search_resources

@pytest.fixture(scope="module", autouse=True)
def setup_seed():
    seed()

def test_fuzzy_search_adhalaj_vav():
    """Fuzzy match test: 'Adhalaj vav' should find 'Adalaj Stepwell'."""
    res = search_resources(q="Adhalaj vav")
    assert res["total"] > 0
    found_titles = [item["title"] for item in res["items"]]
    assert any("Adalaj" in t for t in found_titles)

def test_unpublished_pending_never_in_results():
    """Pending resource (id=11) must never appear in public search."""
    res = search_resources(q="")
    ids = [item["id"] for item in res["items"]]
    assert 11 not in ids

def test_type_filter():
    """Filters narrow results accurately."""
    res_photos = search_resources(res_type="photo")
    for item in res_photos["items"]:
        assert item["type"] == "photo"

    res_pdf = search_resources(res_type="pdf")
    for item in res_pdf["items"]:
        assert item["type"] == "pdf"

def test_monument_filter():
    res = search_resources(monument_id=2)
    for item in res["items"]:
        assert item["monument_id"] == 2
        assert "Rani" in item["monument"]

def test_facets_returned():
    res = search_resources(q="")
    assert "facets" in res
    assert "type" in res["facets"]
    assert "language" in res["facets"]
    assert "verify_status" in res["facets"]

