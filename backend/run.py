import sys
from pathlib import Path
import uvicorn
import os

# Ensure project root and backend dir are in sys.path
backend_dir = Path(__file__).resolve().parent
root_dir = backend_dir.parent
for p in [str(backend_dir), str(root_dir)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from app.config import PORT
except ImportError:
    from backend.app.config import PORT

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    print(f"Starting Dharohar 4D Backend on {host}:{port}...")
    uvicorn.run("app.main:app", host=host, port=port, reload=False)
