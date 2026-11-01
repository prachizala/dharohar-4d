import sqlite3
from typing import List, Dict, Any, Optional
from rapidfuzz import fuzz, process

try:
    from app.db import get_db_connection
    from app.llm import translate
except ImportError:
    from backend.app.db import get_db_connection
    from backend.app.llm import translate

# In-memory translation cache for query expansions
_TRANSLATION_CACHE: Dict[str, Dict[str, str]] = {}

def get_query_terms(query: str) -> List[str]:
    q = (query or "").strip()
    if not q:
        return []
    terms = [q]
    if q not in _TRANSLATION_CACHE:
        cached = {}
        for lang in ("en", "hi", "gu"):
            try:
                t = translate(q, lang)
                if t and t.lower() != q.lower():
                    cached[lang] = t
            except Exception:
                pass
        _TRANSLATION_CACHE[q] = cached
    
    for t in _TRANSLATION_CACHE[q].values():
        if t and t not in terms:
            terms.append(t)
    return terms

def search_resources(
    q: Optional[str] = None,
    res_type: Optional[str] = None,
    monument_id: Optional[int] = None,
    district: Optional[str] = None,
    state: Optional[str] = None,
    period: Optional[str] = None,
    language: Optional[str] = None,
    verify_status: Optional[str] = None,
    license: Optional[str] = None,
    has_3d: Optional[bool] = None,
    page: int = 1,
    limit: int = 20
) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()

    query = (q or "").strip()
    terms = get_query_terms(query) if query else []

    # Base SQL filter for published resources
    base_where = ["r.publish_status = 'published'"]
    params: List[Any] = []

    if res_type:
        base_where.append("r.type = ?")
        params.append(res_type)
    if monument_id:
        base_where.append("r.monument_id = ?")
        params.append(monument_id)
    if language:
        base_where.append("r.language = ?")
        params.append(language)
    if verify_status:
        base_where.append("r.verify_status = ?")
        params.append(verify_status)
    if license:
        base_where.append("r.license = ?")
        params.append(license)
    if district:
        base_where.append("m.district LIKE ?")
        params.append(f"%{district}%")
    if state:
        base_where.append("m.state LIKE ?")
        params.append(f"%{state}%")
    if period:
        base_where.append("m.period LIKE ?")
        params.append(f"%{period}%")
    if has_3d:
        base_where.append("m.id IN (SELECT DISTINCT monument_id FROM models3d WHERE status = 'done')")

    where_clause = " AND ".join(base_where)

    results_by_id: Dict[int, Dict[str, Any]] = {}

    if not query:
        # No query: return all published matching filters ordered by created_at DESC
        sql = f"""
            SELECT r.*, m.name_en as monument_name_en, m.name_hi as monument_name_hi, m.name_gu as monument_name_gu,
                   m.district, m.state, m.period
            FROM resources r
            LEFT JOIN monuments m ON r.monument_id = m.id
            WHERE {where_clause}
            ORDER BY r.id DESC
        """
        cur.execute(sql, params)
        rows = cur.fetchall()
        for row in rows:
            results_by_id[row["id"]] = {
                "id": row["id"],
                "monument_id": row["monument_id"],
                "title": row["title"],
                "type": row["type"],
                "monument": row["monument_name_en"],
                "monument_hi": row["monument_name_hi"],
                "monument_gu": row["monument_name_gu"],
                "language": row["language"],
                "verify_status": row["verify_status"],
                "license": row["license"],
                "snippet": (row["text"] or "")[:180],
                "file_path": row["file_path"],
                "original_name": row["original_name"],
                "score": 1.0
            }
    else:
        # 1. FTS5 Search for each term
        for term in terms:
            words = [w.replace('"', '') for w in term.split() if w.strip()]
            if not words:
                continue
            fts_query = " ".join([f'"{w}"*' for w in words])
            fts_sql = f"""
                SELECT r.*, m.name_en as monument_name_en, m.name_hi as monument_name_hi, m.name_gu as monument_name_gu,
                       m.district, m.state, m.period, bm25(resources_fts) as rank
                FROM resources_fts fts
                JOIN resources r ON r.id = fts.rowid
                LEFT JOIN monuments m ON r.monument_id = m.id
                WHERE resources_fts MATCH ? AND {where_clause}
                ORDER BY rank
            """
            try:
                cur.execute(fts_sql, [fts_query] + params)
                fts_rows = cur.fetchall()
                for row in fts_rows:
                    rid = row["id"]
                    # FTS bm25 is negative/lower is better
                    score = 100.0 - abs(row["rank"])
                    if rid not in results_by_id or score > results_by_id[rid]["score"]:
                        results_by_id[rid] = {
                            "id": row["id"],
                            "monument_id": row["monument_id"],
                            "title": row["title"],
                            "type": row["type"],
                            "monument": row["monument_name_en"],
                            "monument_hi": row["monument_name_hi"],
                            "monument_gu": row["monument_name_gu"],
                            "language": row["language"],
                            "verify_status": row["verify_status"],
                            "license": row["license"],
                            "snippet": (row["text"] or "")[:180],
                            "file_path": row["file_path"],
                            "original_name": row["original_name"],
                            "score": score
                        }
            except Exception as e:
                print(f"FTS query error for '{term}': {e}")

        # 2. If results < 5, run LIKE fallback and RapidFuzz matching (Spec 7.5 Step 3)
        if len(results_by_id) < 5:
            # Query all candidate published resources
            cand_sql = f"""
                SELECT r.*, m.name_en as monument_name_en, m.name_hi as monument_name_hi, m.name_gu as monument_name_gu,
                       m.district, m.state, m.period
                FROM resources r
                LEFT JOIN monuments m ON r.monument_id = m.id
                WHERE {where_clause}
            """
            cur.execute(cand_sql, params)
            all_published = cur.fetchall()

            for row in all_published:
                rid = row["id"]
                title = row["title"] or ""
                mon_en = row["monument_name_en"] or ""
                mon_hi = row["monument_name_hi"] or ""
                mon_gu = row["monument_name_gu"] or ""
                tags = row["tags"] or ""
                text = row["text"] or ""

                # Direct LIKE check
                has_like = False
                for term in terms:
                    tl = term.lower()
                    if tl in title.lower() or tl in mon_en.lower() or tl in mon_hi.lower() or tl in mon_gu.lower() or tl in tags.lower():
                        has_like = True
                        break

                if has_like:
                    if rid not in results_by_id:
                        results_by_id[rid] = {
                            "id": row["id"],
                            "monument_id": row["monument_id"],
                            "title": row["title"],
                            "type": row["type"],
                            "monument": mon_en,
                            "monument_hi": mon_hi,
                            "monument_gu": mon_gu,
                            "language": row["language"],
                            "verify_status": row["verify_status"],
                            "license": row["license"],
                            "snippet": text[:180],
                            "file_path": row["file_path"],
                            "original_name": row["original_name"],
                            "score": 80.0
                        }

                # Rapidfuzz fuzzy match on title and monument names
                best_ratio = 0
                for term in terms:
                    for target in (title, mon_en, mon_hi, mon_gu):
                        ratio = fuzz.partial_ratio(term.lower(), target.lower())
                        if ratio > best_ratio:
                            best_ratio = ratio

                if best_ratio >= 70:
                    if rid not in results_by_id or best_ratio > results_by_id[rid]["score"]:
                        results_by_id[rid] = {
                            "id": row["id"],
                            "monument_id": row["monument_id"],
                            "title": row["title"],
                            "type": row["type"],
                            "monument": mon_en,
                            "monument_hi": mon_hi,
                            "monument_gu": mon_gu,
                            "language": row["language"],
                            "verify_status": row["verify_status"],
                            "license": row["license"],
                            "snippet": text[:180],
                            "file_path": row["file_path"],
                            "original_name": row["original_name"],
                            "score": float(best_ratio)
                        }

    # Rank results by score DESC
    sorted_items = sorted(results_by_id.values(), key=lambda x: x["score"], reverse=True)

    # Compute Facets from sorted_items
    facet_type: Dict[str, int] = {}
    facet_language: Dict[str, int] = {}
    facet_verify: Dict[str, int] = {}

    for item in sorted_items:
        t = item["type"]
        l = item["language"]
        v = item["verify_status"]
        facet_type[t] = facet_type.get(t, 0) + 1
        facet_language[l] = facet_language.get(l, 0) + 1
        facet_verify[v] = facet_verify.get(v, 0) + 1

    total = len(sorted_items)
    start_idx = (page - 1) * limit
    paginated_items = sorted_items[start_idx : start_idx + limit]

    conn.close()
    return {
        "items": paginated_items,
        "total": total,
        "page": page,
        "limit": limit,
        "facets": {
            "type": facet_type,
            "language": facet_language,
            "verify_status": facet_verify
        }
    }

