from typing import Optional, List
from fastapi import APIRouter, Header, HTTPException, Query
from pydantic import BaseModel

try:
    from app.config import ADMIN_TOKEN
    from app.db import get_db_connection
except ImportError:
    from backend.app.config import ADMIN_TOKEN
    from backend.app.db import get_db_connection

router = APIRouter(prefix="/api/v1", tags=["claims & reports"])

def check_admin(token: Optional[str] = Header(None, alias="X-Admin-Token")):
    if not token or token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing X-Admin-Token")

class SourceCreate(BaseModel):
    title: str
    author: Optional[str] = None
    year: Optional[str] = None
    url: Optional[str] = None
    locator: Optional[str] = None
    tier: Optional[int] = 3

class ClaimCreate(BaseModel):
    monument_id: int
    resource_id: Optional[int] = None
    type: str  # date | builder | dynasty | dimension | style | inscription | event
    text: str
    date_certainty: Optional[str] = "exact"  # exact | circa | range
    snippet: Optional[str] = None
    sources: Optional[List[SourceCreate]] = []

class ReportCreate(BaseModel):
    target_type: str  # resource | claim | model3d
    target_id: int
    message: str

@router.get("/claims")
def list_claims(monument_id: Optional[int] = Query(None)):
    conn = get_db_connection()
    cur = conn.cursor()
    query = """
        SELECT c.*, s.id as source_id, s.title as source_title, s.author as source_author,
               s.year as source_year, s.url as source_url, s.locator as source_locator, s.tier as source_tier
        FROM claims c
        LEFT JOIN sources s ON s.claim_id = c.id
    """
    params = []
    if monument_id:
        query += " WHERE c.monument_id = ?"
        params.append(monument_id)
    query += " ORDER BY c.id ASC"

    cur.execute(query, params)
    rows = cur.fetchall()

    claims_map = {}
    for r in rows:
        cid = r["id"]
        if cid not in claims_map:
            claims_map[cid] = {
                "id": r["id"],
                "monument_id": r["monument_id"],
                "resource_id": r["resource_id"],
                "type": r["type"],
                "text": r["text"],
                "date_certainty": r["date_certainty"],
                "snippet": r["snippet"],
                "status": r["status"],
                "reviewer": r["reviewer"],
                "reviewed_at": r["reviewed_at"],
                "created_at": r["created_at"],
                "sources": []
            }
        if r["source_id"]:
            claims_map[cid]["sources"].append({
                "id": r["source_id"],
                "title": r["source_title"],
                "author": r["source_author"],
                "year": r["source_year"],
                "url": r["source_url"],
                "locator": r["source_locator"],
                "tier": r["source_tier"]
            })

    conn.close()
    return {"claims": list(claims_map.values()), "total": len(claims_map)}

@router.post("/claims")
def create_claim(payload: ClaimCreate, token: Optional[str] = Header(None, alias="X-Admin-Token")):
    check_admin(token)
    conn = get_db_connection()
    cur = conn.cursor()

    # If has sources, default to 'sourced', else 'ai_suggested'
    initial_status = "sourced" if payload.sources and len(payload.sources) > 0 else "ai_suggested"

    cur.execute(
        """INSERT INTO claims (monument_id, resource_id, type, text, date_certainty, snippet, status, reviewer)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'Admin')""",
        (payload.monument_id, payload.resource_id, payload.type, payload.text, payload.date_certainty, payload.snippet, initial_status)
    )
    claim_id = cur.lastrowid

    if payload.sources:
        for s in payload.sources:
            cur.execute(
                """INSERT INTO sources (claim_id, title, author, year, url, locator, tier)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (claim_id, s.title, s.author, s.year, s.url, s.locator, s.tier or 3)
            )

    conn.commit()
    conn.close()
    return {"success": True, "claim_id": claim_id, "status": initial_status}

@router.post("/reports")
def submit_report(payload: ReportCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO reports (target_type, target_id, message, status)
           VALUES (?, ?, ?, 'open')""",
        (payload.target_type, payload.target_id, payload.message)
    )
    report_id = cur.lastrowid
    conn.commit()
    conn.close()
    return {"success": True, "report_id": report_id, "message": "Report submitted successfully to review queue."}

