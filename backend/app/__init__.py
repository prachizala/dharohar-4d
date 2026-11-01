import sys
import types
from pathlib import Path

# Add backend directory and parent directory to sys.path
_current_dir = Path(__file__).resolve().parent
_backend_dir = _current_dir.parent
_repo_root = _backend_dir.parent

for _p in [str(_backend_dir), str(_repo_root)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

# Create compatibility alias so `backend.app` resolves whether imported as `app` or `backend.app`
if "backend" not in sys.modules:
    _backend_mod = types.ModuleType("backend")
    _backend_mod.__path__ = [str(_backend_dir)]
    sys.modules["backend"] = _backend_mod

if "app" in sys.modules and "backend.app" not in sys.modules:
    sys.modules["backend.app"] = sys.modules["app"]
