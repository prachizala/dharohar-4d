import json
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Body, Header
from pydantic import BaseModel

from backend.app.config import ADMIN_TOKEN
from backend.app.db import get_db_connection

router = APIRouter(prefix="/api/v1", tags=["3D Models"])

class CreateModelJob(BaseModel):
    monument_id: int
    photo_ids: Optional[List[int]] = []

@router.get("/monuments/{id}/model")
def get_monument_model(id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT * FROM models3d
           WHERE monument_id = ? AND status = 'done'
           ORDER BY id DESC LIMIT 1""",
        (id,)
    )
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="No 3D model found for this monument")
    
    data = dict(row)
    if data.get("quality_json") and isinstance(data["quality_json"], str):
        try:
            data["quality"] = json.loads(data["quality_json"])
        except Exception:
            data["quality"] = {}
    return data

@router.post("/models3d")
def request_3d_reconstruction(payload: CreateModelJob, token: Optional[str] = Header(None, alias="X-Admin-Token")):
    if not token or token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing X-Admin-Token")
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name_en FROM monuments WHERE id = ?", (payload.monument_id,))
    monument = cur.fetchone()
    if not monument:
        conn.close()
        raise HTTPException(status_code=404, detail="Monument not found")

    photo_count = len(payload.photo_ids) if payload.photo_ids else 0
    label = f"Queued photogrammetry job ({photo_count} photos)"
    cur.execute(
        """INSERT INTO models3d (monument_id, method, label, photo_count, quality_json, file_path, status)
           VALUES (?, 'photogrammetry', ?, ?, '{}', NULL, 'queued')""",
        (payload.monument_id, label, photo_count)
    )
    job_id = cur.lastrowid
    conn.commit()
    conn.close()
    return {"job_id": job_id, "monument_id": payload.monument_id, "status": "queued", "message": "Job queued for Colab/GPU worker"}

