import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.config import UPLOAD_PATH
from backend.app.db import get_db_connection, init_db
from backend.app.routers import resources, monuments, claims, review, models3d, search, worker

app = FastAPI(
    title="Dharohar 4D API",
    description="Centralised Digital Archive, Photo-to-3D, Authenticity Verification, and Multilingual Search for Cultural Heritage",
    version="2.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "https://dharohar-4d.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for hackathon/presentation flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resources.router)
app.include_router(monuments.router)
app.include_router(claims.router)
app.include_router(review.router)
app.include_router(models3d.router)
app.include_router(search.router)
app.include_router(worker.router)

# Mount uploads directory for previews
UPLOAD_PATH.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_PATH)), name="uploads")

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/healthz", tags=["health"])
def health_check():
    db_ok = False
    try:
        conn = get_db_connection()
        conn.execute("SELECT 1")
        conn.close()
        db_ok = True
    except Exception as e:
        print(f"Health DB error: {e}")

    return {
        "status": "healthy" if db_ok else "unhealthy",
        "database": "connected" if db_ok else "disconnected",
        "service": "dharohar-4d-backend",
        "version": "2.0.0"
    }

@app.get("/", tags=["health"])
def root():
    return {
        "message": "Dharohar 4D Heritage Archive API is running.",
        "health": "/healthz",
        "docs": "/docs"
    }
