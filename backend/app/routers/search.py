import io
import csv
from typing import Optional
from fastapi import APIRouter, Query, Response
from fastapi.responses import StreamingResponse

from backend.app.search import search_resources

router = APIRouter(prefix="/api/v1", tags=["search & export"])

@router.get("/search")
def search_api(
    q: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    monument_id: Optional[int] = Query(None),
    district: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    period: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    verify_status: Optional[str] = Query(None),
    license: Optional[str] = Query(None),
    has_3d: Optional[bool] = Query(None),
    lang: Optional[str] = Query("en"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    return search_resources(
        q=q,
        res_type=type,
        monument_id=monument_id,
        district=district,
        state=state,
        period=period,
        language=language,
        verify_status=verify_status,
        license=license,
        has_3d=has_3d,
        page=page,
        limit=limit
    )

@router.get("/export")
def export_api(
    format: str = Query("csv", pattern="^(csv|json)$"),
    q: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    monument_id: Optional[int] = Query(None),
    district: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    period: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    verify_status: Optional[str] = Query(None),
    license: Optional[str] = Query(None),
    has_3d: Optional[bool] = Query(None)
):
    results = search_resources(
        q=q,
        res_type=type,
        monument_id=monument_id,
        district=district,
        state=state,
        period=period,
        language=language,
        verify_status=verify_status,
        license=license,
        has_3d=has_3d,
        page=1,
        limit=10000
    )
    items = results["items"]

    if format == "json":
        return {"total": len(items), "exported_items": items}

    # CSV Export
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Title", "Type", "Monument", "Language", "Verification Status", "License", "Snippet"])
    for item in items:
        writer.writerow([
            item.get("id"),
            item.get("title"),
            item.get("type"),
            item.get("monument"),
            item.get("language"),
            item.get("verify_status"),
            item.get("license"),
            item.get("snippet", "").replace("\n", " ")[:200]
        ])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=dharohar_archive_export.csv"}
    )
