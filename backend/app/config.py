import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env
backend_dir = Path(__file__).resolve().parent.parent
env_path = backend_dir / ".env"
root_env = backend_dir.parent / ".env"

if env_path.exists():
    load_dotenv(env_path)
elif root_env.exists():
    load_dotenv(root_env)
else:
    load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/dharohar.db")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./data/uploads")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "dharohar-admin-secret-2026")
WORKER_TOKEN = os.getenv("WORKER_TOKEN", "dharohar-worker-secret-2026")
MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "25"))
PORT = int(os.getenv("PORT", "8000"))

# Ensure uploads directory exists
upload_path = Path(UPLOAD_DIR)
if not upload_path.is_absolute():
    upload_path = backend_dir / upload_path
upload_path.mkdir(parents=True, exist_ok=True)
UPLOAD_PATH = upload_path

# Ensure data directory exists
data_path = backend_dir / "data"
data_path.mkdir(parents=True, exist_ok=True)

