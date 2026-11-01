from typing import Optional
from fastapi import APIRouter, Header, HTTPException, Body
from pydantic import BaseModel

from backend.app.config import ADMIN_TOKEN
from backend.app.db import get_db_connection, sync_fts_insert, sync_fts_delete

router = APIRouter(prefix="/api/v1/review", tags=["review"])

def check_admin(token: Optional[str] = Header(None, alias="X-Admin-Token")):
    if not token or token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing X-Admin-Token")

class ResourceReviewAction(BaseModel):
    action: str  # approve | reject
    reason: Optional[str] = "Reviewer action"
    reviewer: Optional[str] = "Reviewer Admin"

class ClaimReviewAction(BaseModel):
    status: str  # verified | sourced | disputed | conjectural | rejected
    reason: Optional[str] = None
    reviewer: Optional[str] = "Reviewer Admin"

@router.get("/queue")
def get_review_queue(token: Optional[str] = Header(None, alias="X-Admin-Token")):
    check_admin(token)
    conn = get_db_connection()
    cur = conn.cursor()

    # 1. Pending resources
    cur.execute(
        """SELECT r.*, m.name_en as monument_name
           FROM resources r
           LEFT JOIN monuments m ON r.monument_id = m.id
           WHERE r.publish_status = 'pending'
           ORDER BY r.id DESC"""
    )
    pending_resources = [dict(r) for r in cur.fetchall()]

    # 2. Open reports
    cur.execute("SELECT * FROM reports WHERE status = 'open' ORDER BY id DESC")
    open_reports = [dict(r) for r in cur.fetchall()]

    # 3. AI-suggested or unreviewed claims
    cur.execute(
        """SELECT c.*, m.name_en as monument_name, s.title as source_title, s.tier as source_tier
           FROM claims c
           LEFT JOIN monuments m ON c.monument_id = m.id
           LEFT JOIN sources s ON s.claim_id = c.id
           WHERE c.status = 'ai_suggested' OR c.status = 'disputed'
           ORDER BY c.id DESC"""
    )
    pending_claims = [dict(c) for c in cur.fetchall()]

    # 4. Recent audit reviews
    cur.execute("SELECT * FROM reviews ORDER BY id DESC LIMIT 20")
    recent_reviews = [dict(r) for r in cur.fetchall()]

    conn.close()
    return {
        "pending_resources": pending_resources,
        "open_reports": open_reports,
        "pending_claims": pending_claims,
        "recent_reviews": recent_reviews,
        "counts": {
            "pending_resources": len(pending_resources),
            "open_reports": len(open_reports),
            "pending_claims": len(pending_claims)
        }
    }

@router.post("/resource/{id}")
def review_resource(id: int, payload: ResourceReviewAction, token: Optional[str] = Header(None, alias="X-Admin-Token")):
    check_admin(token)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM resources WHERE id = ?", (id,))
    res = cur.fetchone()
    if not res:
        conn.close()
        raise HTTPException(status_code=404, detail="Resource not found")

    action = payload.action.lower()
    if action == "approve":
        cur.execute("UPDATE resources SET publish_status = 'published', verify_status = 'verified' WHERE id = ?", (id,))
        sync_fts_insert(conn, id, res["title"], res["text"], res["tags"])
    elif action == "reject":
        cur.execute("UPDATE resources SET publish_status = 'rejected' WHERE id = ?", (id,))
        sync_fts_delete(conn, id, res["title"], res["text"], res["tags"])
    else:
        conn.close()
        raise HTTPException(status_code=400, detail="Action must be 'approve' or 'reject'")

    cur.execute(
        "INSERT INTO reviews (target_type, target_id, action, reason, by) VALUES ('resource', ?, ?, ?, ?)",
        (id, action, payload.reason or f"Resource {action}d", payload.reviewer or "Admin")
    )
    conn.commit()
    conn.close()
    return {"success": True, "resource_id": id, "publish_status": "published" if action == "approve" else "rejected"}

@router.post("/claim/{id}")
def review_claim(id: int, payload: ClaimReviewAction, token: Optional[str] = Header(None, alias="X-Admin-Token")):
    check_admin(token)
    target_status = payload.status.lower()
    valid_statuses = {"verified", "sourced", "disputed", "conjectural", "rejected"}
    if target_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM claims WHERE id = ?", (id,))
    claim = cur.fetchone()
    if not claim:
        conn.close()
        raise HTTPException(status_code=404, detail="Claim not found")

    # Rule from Spec Section 7.3:
    # A claim can become 'verified' ONLY IF it has at least one Tier-1 source OR the reviewer gives an explicit reason.
    if target_status == "verified":
        cur.execute("SELECT tier FROM sources WHERE claim_id = ? AND tier = 1", (id,))
        has_tier1 = cur.fetchone() is not None
        if not has_tier1 and not (payload.reason and payload.reason.strip()):
            conn.close()
            raise HTTPException(
                status_code=400,
                detail="A claim without a Tier-1 source requires a reviewer verification justification reason."
            )

    cur.execute(
        "UPDATE claims SET status = ?, reviewer = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?",
        (target_status, payload.reviewer or "Admin Reviewer", id)
    )
    cur.execute(
        "INSERT INTO reviews (target_type, target_id, action, reason, by) VALUES ('claim', ?, ?, ?, ?)",
        (id, target_status, payload.reason or f"Claim marked {target_status}", payload.reviewer or "Admin")
    )
    conn.commit()
    conn.close()
    return {"success": True, "claim_id": id, "status": target_status}

@router.post("/report/{id}/resolve")
def resolve_report(id: int, token: Optional[str] = Header(None, alias="X-Admin-Token")):
    check_admin(token)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE reports SET status = 'resolved' WHERE id = ?", (id,))
    cur.execute(
        "INSERT INTO reviews (target_type, target_id, action, reason, by) VALUES ('report', ?, 'resolve', 'Report marked resolved', 'Admin')",
        (id,)
    )
    conn.commit()
    conn.close()
    return {"success": True, "report_id": id, "status": "resolved"}

