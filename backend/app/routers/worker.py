import os
import json
import uuid
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Header, HTTPException, UploadFile, File, Form

try:
    from app.config import WORKER_TOKEN, UPLOAD_PATH
    from app.db import get_db_connection
except ImportError:
    from backend.app.config import WORKER_TOKEN, UPLOAD_PATH
    from backend.app.db import get_db_connection

router = APIRouter(prefix="/api/v1/worker", tags=["worker"])

def check_worker(token: Optional[str] = Header(None, alias="X-Worker-Token")):
    if not token or token != WORKER_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing X-Worker-Token")

@router.post("/claim-job")
def claim_job(token: Optional[str] = Header(None, alias="X-Worker-Token")):
    check_worker(token)
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM models3d WHERE status = 'queued' ORDER BY id ASC LIMIT 1")
    job = cur.fetchone()
    if not job:
        conn.close()
        return {"job": None, "message": "No queued jobs available"}

    job_id = job["id"]
    monument_id = job["monument_id"]

    # Mark as processing
    cur.execute("UPDATE models3d SET status = 'processing' WHERE id = ?", (job_id,))

    # Fetch available photos for this monument
    cur.execute(
        "SELECT id, file_path, original_name FROM resources WHERE monument_id = ? AND type = 'photo' AND publish_status = 'published'",
        (monument_id,)
    )
    photos = [
        {
            "id": r["id"],
            "filename": r["original_name"],
            "download_url": f"/api/v1/resources/{r['id']}/download"
        }
        for r in cur.fetchall()
    ]
    conn.commit()
    conn.close()

    return {
        "job_id": job_id,
        "monument_id": monument_id,
        "photo_count": len(photos),
        "photos": photos,
        "status": "processing"
    }

@router.post("/result")
async def submit_result(
    job_id: int = Form(...),
    method: str = Form("photogrammetry"),
    quality_json: str = Form("{}"),
    file: UploadFile = File(...),
    token: Optional[str] = Header(None, alias="X-Worker-Token")
):
    check_worker(token)
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM models3d WHERE id = ?", (job_id,))
    job = cur.fetchone()
    if not job:
        conn.close()
        raise HTTPException(status_code=404, detail="Job not found")

    # Save GLB model in frontend public/models or data/uploads/models
    # Let's save to frontend public/models if possible, else UPLOAD_PATH/models
    models_dir = Path(__file__).resolve().parent.parent.parent.parent / "public" / "models"
    if not models_dir.exists():
        models_dir = UPLOAD_PATH / "models"
    models_dir.mkdir(parents=True, exist_ok=True)

    glb_filename = f"model_{job['monument_id']}_{uuid.uuid4().hex[:8]}.glb"
    save_dest = models_dir / glb_filename

    contents = await file.read()
    with open(save_dest, "wb") as f_out:
        f_out.write(contents)

    # Determine honest label as specified in Section 10
    parsed_q = {}
    try:
        parsed_q = json.loads(quality_json)
    except Exception:
        pass

    reg = parsed_q.get("registered", 0)
    tot = parsed_q.get("total", 0)
    ratio = parsed_q.get("ratio", (reg / tot) if tot > 0 else 0)

    if method == "photogrammetry":
        if tot > 0 and ratio < 0.6:
            label = f"Low quality reconstruction ({reg} of {tot} photos)"
        else:
            label = f"Photo-reconstructed ({reg} of {tot} photos)"
    elif method == "triposr":
        label = "AI-estimated from a single photo (not survey-grade)"
    elif method == "external_tool":
        label = f"Processed with an external tool from {tot or reg} photos"
    else:
        label = "Parametric (not photo-based)"

    web_path = f"/models/{glb_filename}"
    cur.execute(
        """UPDATE models3d
           SET method = ?, label = ?, quality_json = ?, file_path = ?, status = 'done'
           WHERE id = ?""",
        (method, label, quality_json, web_path, job_id)
    )
    conn.commit()
    conn.close()

    return {
        "success": True,
        "job_id": job_id,
        "file_path": web_path,
        "label": label,
        "status": "done"
    }

