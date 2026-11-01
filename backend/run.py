import sys
from pathlib import Path
import uvicorn
import os

# Ensure project root is in sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.app.config import PORT

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    print(f"Starting Dharohar 4D Backend on {host}:{port}...")
    uvicorn.run("backend.app.main:app", host=host, port=port, reload=False)
