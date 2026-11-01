import os
import uuid
import hashlib
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException, Query, Response
from fastapi.responses import FileResponse
import imagehash
from PIL import Image

from backend.app.config import UPLOAD_PATH, MAX_UPLOAD_MB, ADMIN_TOKEN
from backend.app.db import get_db_connection, sync_fts_delete, sync_fts_insert
from backend.app.extract import extract_text_for_file, extract_exif
from backend.app.llm import suggest_metadata, extract_claims
from backend.app.verify import filter_claims

router = APIRouter(prefix="/api/v1/resources", tags=["resources"])

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "pdf", "pptx", "docx", "txt", "doc", "ppt"}

def compute_sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def check_admin(token: Optional[str] = Header(None, alias="X-Admin-Token")):
    if not token or token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing X-Admin-Token")

@router.post("")
async def upload_resources(
    files: List[UploadFile] = File(...),
    title: Optional[str] = Form(None),
    monument_id: Optional[int] = Form(None),
    language: Optional[str] = Form("en"),
    creator: Optional[str] = Form("Anonymous"),
    license: Optional[str] = Form("CC-BY-4.0"),
    contributor: Optional[str] = Form("Community Contributor"),
    tags: Optional[str] = Form("")
):
    conn = get_db_connection()
    cur = conn.cursor()
    results = []

    for f in files:
        filename = f.filename or "uploaded_file"
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
        if ext not in ALLOWED_EXTENSIONS:
            results.append({"filename": filename, "status": "error", "detail": f"File extension '{ext}' not allowed."})
            continue

        contents = await f.read()
        size_mb = len(contents) / (1024 * 1024)
        if size_mb > MAX_UPLOAD_MB:
            results.append({"filename": filename, "status": "error", "detail": f"File size {size_mb:.1f}MB exceeds limit of {MAX_UPLOAD_MB}MB."})
            continue

        file_sha = compute_sha256(contents)

        # 3. Check exact SHA-256 duplicate
        cur.execute("SELECT id, title, publish_status FROM resources WHERE sha256 = ?", (file_sha,))
        existing = cur.fetchone()
        if existing:
            # If a single file upload, return 409 as per spec
            if len(files) == 1:
                conn.close()
                raise HTTPException(status_code=409, detail={"message": "already exists", "existing_resource_id": existing["id"]})
            results.append({"filename": filename, "status": "duplicate", "detail": "already exists", "existing_resource_id": existing["id"]})
            continue

        # Save to UPLOAD_PATH with safe unique filename
        safe_name = f"{uuid.uuid4().hex}.{ext}"
        save_path = UPLOAD_PATH / safe_name
        with open(save_path, "wb") as out_f:
            out_f.write(contents)

        # Type categorization
        if ext in ("jpg", "jpeg", "png", "webp"):
            res_type = "photo"
        elif ext == "pdf":
            res_type = "pdf"
        elif ext in ("pptx", "ppt"):
            res_type = "pptx"
        elif ext in ("docx", "doc"):
            res_type = "docx"
        else:
            res_type = "report"

        # 4. Image phash and near duplicate check
        phash_str = None
        near_duplicate_of = None
        if res_type == "photo":
            try:
                img = Image.open(save_path)
                curr_phash = imagehash.phash(img)
                phash_str = str(curr_phash)

                # Check hamming distance against existing image hashes
                cur.execute("SELECT id, phash FROM resources WHERE phash IS NOT NULL")
                all_hashes = cur.fetchall()
                for h_row in all_hashes:
                    try:
                        other_hash = imagehash.hex_to_hash(h_row["phash"])
                        dist = curr_phash - other_hash
                        if dist < 6:
                            near_duplicate_of = h_row["id"]
                            break
                    except Exception:
                        continue
            except Exception as e:
                print(f"Error computing phash: {e}")

        # 5. Extract text
        extracted_text = extract_text_for_file(str(save_path), ext)

        # 6. Groq AI Suggestions
        item_title = title if title and len(files) == 1 else filename.rsplit(".", 1)[0].replace("_", " ").title()
        ai_meta = suggest_metadata(item_title, tags or "", extracted_text, is_image=(res_type == "photo"))

        detected_lang = language or ai_meta.get("language") or "en"
        ai_tags = ai_meta.get("ai_tags", "")
        ai_summary = ai_meta.get("ai_summary", "")
        alt_text = ai_meta.get("alt_text", item_title)

        # 7. Save with publish_status='pending'
        cur.execute(
            """INSERT INTO resources
               (monument_id, type, title, language, creator, license, contributor,
                file_path, original_name, sha256, phash, text, tags, ai_tags, ai_summary,
                alt_text, publish_status, verify_status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'ai_suggested')""",
            (
                monument_id, res_type, item_title, detected_lang, creator, license, contributor,
                str(save_path), filename, file_sha, phash_str, extracted_text, tags,
                ai_tags, ai_summary, alt_text
            )
        )
        new_id = cur.lastrowid
        conn.commit()

        results.append({
            "id": new_id,
            "filename": filename,
            "status": "pending_review",
            "title": item_title,
            "type": res_type,
            "near_duplicate_of": near_duplicate_of,
            "ai_tags": ai_tags,
            "ai_summary": ai_summary,
            "alt_text": alt_text,
            "extracted_text_chars": len(extracted_text)
        })

    conn.close()
    return {"uploaded": results, "count": len(results)}

@router.get("/{id}")
def get_resource(id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT r.*, m.name_en as monument_name_en, m.name_hi as monument_name_hi, m.name_gu as monument_name_gu,
                  m.district, m.state, m.period
           FROM resources r
           LEFT JOIN monuments m ON r.monument_id = m.id
           WHERE r.id = ?""",
        (id,)
    )
    res = cur.fetchone()
    if not res:
        conn.close()
        raise HTTPException(status_code=404, detail="Resource not found")

    res_dict = dict(res)

    # Claims linked to this resource or monument
    cur.execute(
        """SELECT c.*, s.title as source_title, s.author as source_author, s.year as source_year,
                  s.url as source_url, s.locator as source_locator, s.tier as source_tier
           FROM claims c
           LEFT JOIN sources s ON s.claim_id = c.id
           WHERE c.resource_id = ? OR c.monument_id = ?""",
        (id, res["monument_id"])
    )
    claims = [dict(c) for c in cur.fetchall()]
    res_dict["claims"] = claims

    # Linked 3D models for this monument
    cur.execute("SELECT * FROM models3d WHERE monument_id = ? AND status = 'done' ORDER BY id DESC LIMIT 1", (res["monument_id"],))
    m3d = cur.fetchone()
    res_dict["model3d"] = dict(m3d) if m3d else None

    conn.close()
    return res_dict

@router.get("/{id}/download")
def download_resource(id: int, inline: bool = False):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT file_path, original_name, type FROM resources WHERE id = ?", (id,))
    res = cur.fetchone()
    conn.close()
    if not res or not res["file_path"]:
        raise HTTPException(status_code=404, detail="File not found")
    
    fp = Path(res["file_path"])
    if not fp.exists():
        raise HTTPException(status_code=404, detail="Underlying file on disk not found")
    
    filename = res["original_name"] or fp.name
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    media_map = {
        "pdf": "application/pdf",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "webp": "image/webp",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "txt": "text/plain; charset=utf-8"
    }
    m_type = media_map.get(ext, "application/octet-stream")
    # For PDFs and images, allow inline viewing in browser and iframes
    disp_type = "inline" if (inline or ext in ("pdf", "jpg", "jpeg", "png", "webp", "txt")) else "attachment"

    return FileResponse(
        path=str(fp),
        filename=filename,
        media_type=m_type,
        content_disposition_type=disp_type
    )

@router.delete("/{id}")
def delete_resource(id: int, token: Optional[str] = Header(None, alias="X-Admin-Token")):
    check_admin(token)
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT file_path, title, text, tags FROM resources WHERE id = ?", (id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Resource not found")

        # Delete from FTS5
        sync_fts_delete(conn, id, row["title"], row["text"], row["tags"])

        # Remove file on disk if exists
        if row["file_path"]:
            try:
                fp = Path(row["file_path"])
                if fp.exists():
                    fp.unlink()
            except Exception:
                pass

        # Delete referencing claims first to respect foreign keys
        cur.execute("DELETE FROM claims WHERE resource_id = ?", (id,))
        cur.execute("DELETE FROM resources WHERE id = ?", (id,))
        # Also log review action
        cur.execute("INSERT INTO reviews (target_type, target_id, action, reason, by) VALUES ('resource', ?, 'delete', 'Admin deleted resource', 'Admin')", (id,))
        conn.commit()
        return {"success": True, "message": f"Resource {id} deleted successfully"}
    finally:
        conn.close()

@router.get("/{id}/cite")
def get_citation(id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT title, creator, contributor, created_at FROM resources WHERE id = ?", (id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Resource not found")
    creator = row["creator"] or "Unknown Creator"
    title = row["title"] or "Untitled"
    contributor = row["contributor"] or "Dharohar 4D Contributor"
    year = row["created_at"][:4] if row["created_at"] else "2026"
    citation = f'{creator}. "{title}." Dharohar 4D Archive, contributed by {contributor}, {year}. https://dharohar-4d.onrender.com/resource/{id}'
    return {"id": id, "citation": citation}

@router.post("/{id}/extract-claims")
def extract_claims_for_resource(id: int, token: Optional[str] = Header(None, alias="X-Admin-Token")):
    check_admin(token)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, monument_id, title, text FROM resources WHERE id = ?", (id,))
    res = cur.fetchone()
    if not res:
        conn.close()
        raise HTTPException(status_code=404, detail="Resource not found")
    
    text = res["text"] or ""
    if not text.strip():
        conn.close()
        return {"claims": [], "saved": 0, "rejected_claims": 0, "message": "No text extracted from this resource."}
    
    # Call Groq LLM
    raw_claims = extract_claims(text)
    # Anti-hallucination verification
    survivors = filter_claims(raw_claims, text)
    rejected_count = len(raw_claims) - len(survivors)

    saved_claims = []
    for sc in survivors:
        cur.execute(
            """INSERT INTO claims (monument_id, resource_id, type, text, date_certainty, snippet, status)
               VALUES (?, ?, ?, ?, ?, ?, 'ai_suggested')""",
            (res["monument_id"], id, sc.get("type", "event"), sc.get("text", ""), sc.get("date_certainty"), sc.get("snippet", ""))
        )
        claim_id = cur.lastrowid
        # Add source linking to uploaded resource
        cur.execute(
            """INSERT INTO sources (claim_id, title, author, year, locator, tier)
               VALUES (?, ?, 'Uploaded Document Source', '2026', 'uploaded document', 3)""",
            (claim_id, res["title"])
        )
        saved_claims.append({"id": claim_id, **sc, "status": "ai_suggested"})
    
    conn.commit()
    conn.close()
    return {
        "saved_count": len(saved_claims),
        "rejected_claims": rejected_count,
        "claims": saved_claims
    }

