import sqlite3
from pathlib import Path

try:
    from app.config import DATABASE_URL
except ImportError:
    from backend.app.config import DATABASE_URL

def get_db_path() -> Path:
    # URL format: sqlite:///./data/dharohar.db
    raw_path = DATABASE_URL.replace("sqlite:///", "")
    p = Path(raw_path)
    if not p.is_absolute():
        backend_dir = Path(__file__).resolve().parent.parent
        p = (backend_dir / p).resolve()
    p.parent.mkdir(parents=True, exist_ok=True)
    return p

def get_db():
    db_path = get_db_path()
    conn = sqlite3.connect(str(db_path), timeout=30.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    try:
        yield conn
    finally:
        conn.close()

def get_db_connection() -> sqlite3.Connection:
    db_path = get_db_path()
    conn = sqlite3.connect(str(db_path), timeout=30.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    schema_path = Path(__file__).resolve().parent / "schema.sql"
    with open(schema_path, "r", encoding="utf-8") as f:
        sql = f.read()
    conn = get_db_connection()
    try:
        conn.executescript(sql)
        conn.commit()
    finally:
        conn.close()

def sync_fts_insert(conn: sqlite3.Connection, resource_id: int, title: str, text: str, tags: str):
    """Insert or update row in resources_fts for published resources."""
    try:
        # Delete existing if present in contentless table
        conn.execute("INSERT INTO resources_fts(resources_fts, rowid, title, text, tags) VALUES('delete', ?, ?, ?, ?)",
                     (resource_id, title or "", text or "", tags or ""))
    except Exception:
        pass
    try:
        conn.execute("INSERT INTO resources_fts(rowid, title, text, tags) VALUES (?, ?, ?, ?)",
                     (resource_id, title or "", text or "", tags or ""))
        conn.commit()
    except Exception as e:
        print(f"FTS insert warning for {resource_id}: {e}")

def sync_fts_delete(conn: sqlite3.Connection, resource_id: int, title: str = "", text: str = "", tags: str = ""):
    """Delete row from resources_fts."""
    try:
        conn.execute("INSERT INTO resources_fts(resources_fts, rowid, title, text, tags) VALUES('delete', ?, ?, ?, ?)",
                     (resource_id, title or "", text or "", tags or ""))
        conn.commit()
    except Exception:
        pass

