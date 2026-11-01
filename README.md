# Dharohar 4D (धरोहर 4D)

Centralised digital archive for Indian cultural heritage resources with verified historical claims, multilingual search, and honest 3D reconstructions.

## Quick Setup (3 Commands)

```bash
# 1. Install dependencies
pip install -r backend/requirements.txt && npm install

# 2. Seed database & run backend (Terminal 1)
python -m backend.seed && python backend/run.py

# 3. Start frontend web server (Terminal 2)
npm run dev
```

Visit **http://localhost:3000** for the web application and **http://localhost:8000/docs** for API documentation.
Review Queue: set `ADMIN_TOKEN` in `backend/.env` (copy from `.env.example`) and enter it on `/review`.
Colab 3D photogrammetry notebook guide: `colab/reconstruct.md`.
