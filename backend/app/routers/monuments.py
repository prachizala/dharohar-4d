import json
from fastapi import APIRouter, HTTPException

try:
    from app.db import get_db_connection
except ImportError:
    from backend.app.db import get_db_connection

router = APIRouter(prefix="/api/v1/monuments", tags=["monuments"])

@router.get("")
def list_monuments():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT m.*,
                  COUNT(DISTINCT r.id) as resource_count,
                  COUNT(DISTINCT c.id) as claim_count,
                  MAX(CASE WHEN m3d.status = 'done' THEN 1 ELSE 0 END) as has_3d
           FROM monuments m
           LEFT JOIN resources r ON r.monument_id = m.id AND r.publish_status = 'published'
           LEFT JOIN claims c ON c.monument_id = m.id
           LEFT JOIN models3d m3d ON m3d.monument_id = m.id AND m3d.status = 'done'
           GROUP BY m.id
           ORDER BY m.id ASC"""
    )
    rows = cur.fetchall()
    monuments = [dict(r) for r in rows]
    conn.close()
    return {"monuments": monuments, "total": len(monuments)}

@router.get("/{id}")
def get_monument(id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM monuments WHERE id = ?", (id,))
    monument = cur.fetchone()
    if not monument:
        conn.close()
        raise HTTPException(status_code=404, detail="Monument not found")

    mon_dict = dict(monument)

    # Fetch published resources grouped by type
    cur.execute("SELECT * FROM resources WHERE monument_id = ? AND publish_status = 'published' ORDER BY id DESC", (id,))
    res_rows = cur.fetchall()
    resources_by_type = {
        "photos": [],
        "pdfs": [],
        "pptxs": [],
        "docxs": [],
        "reports": []
    }
    for r in res_rows:
        rd = dict(r)
        t = rd["type"]
        if t == "photo":
            resources_by_type["photos"].append(rd)
        elif t == "pdf":
            resources_by_type["pdfs"].append(rd)
        elif t == "pptx":
            resources_by_type["pptxs"].append(rd)
        elif t == "docx":
            resources_by_type["docxs"].append(rd)
        else:
            resources_by_type["reports"].append(rd)

    mon_dict["resources"] = resources_by_type
    mon_dict["total_resources"] = len(res_rows)

    # Fetch claims with sources
    cur.execute(
        """SELECT c.*, s.title as source_title, s.author as source_author, s.year as source_year,
                  s.url as source_url, s.locator as source_locator, s.tier as source_tier
           FROM claims c
           LEFT JOIN sources s ON s.claim_id = c.id
           WHERE c.monument_id = ?
           ORDER BY c.id ASC""",
        (id,)
    )
    mon_dict["claims"] = [dict(c) for c in cur.fetchall()]

    # Fetch latest 3D model
    cur.execute("SELECT * FROM models3d WHERE monument_id = ? AND status = 'done' ORDER BY id DESC LIMIT 1", (id,))
    m3d = cur.fetchone()
    if m3d:
        m3d_dict = dict(m3d)
        if m3d_dict.get("quality_json") and isinstance(m3d_dict["quality_json"], str):
            try:
                m3d_dict["quality"] = json.loads(m3d_dict["quality_json"])
            except Exception:
                m3d_dict["quality"] = {}
        mon_dict["model3d"] = m3d_dict
    else:
        mon_dict["model3d"] = None

    conn.close()
    return mon_dict

