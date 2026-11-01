# Dharohar 4D: Google Colab Photo-to-3D Reconstruction Pipeline

> **Note on Free Colab Limits:** Free Google Colab GPU sessions are subject to timeout (typically 4-12 hours) and disconnection if idle. Always mount Google Drive to save checkpoints and intermediate point clouds!

This guide explains how to convert crowdsourced 2D photos of Indian heritage monuments into honest, interactive 3D GLB digital twins.

---

## Step 1: Set Runtime to GPU

In Google Colab:
1. Navigate to **Runtime** > **Change runtime type**.
2. Select **T4 GPU** (or any available GPU).
3. Click **Save**.

```python
# Verify GPU availability
!nvidia-smi
```

---

## Step 2: Install COLMAP & Photogrammetry Dependencies

```bash
!apt-get update -qq
!apt-get install -y -qq colmap ffmpeg libgl1-mesa-glx
!pip install -q pycolmap opencv-python pillow trimesh requests
!npm install -g @gltf-transform/cli
```

---

## Step 3: Connect to Dharohar 4D Worker API & Download Photos

```python
import os
import requests
import json
from pathlib import Path

BACKEND_URL = "https://dharohar-4d.onrender.com" # Or your ngrok tunnel
WORKER_TOKEN = "dharohar-worker-secret-2026"

headers = {"X-Worker-Token": WORKER_TOKEN}

# Claim next available photogrammetry job
res = requests.post(f"{BACKEND_URL}/api/v1/worker/claim-job", headers=headers)
job_data = res.json()
print("Claimed Job:", job_data)

if not job_data.get("job_id"):
    raise SystemExit("No queued jobs available at this moment.")

JOB_ID = job_data["job_id"]
IMAGE_DIR = Path("input_photos")
IMAGE_DIR.mkdir(parents=True, exist_ok=True)

# Download all monument photos
for p in job_data["photos"]:
    img_resp = requests.get(f"{BACKEND_URL}{p['download_url']}")
    with open(IMAGE_DIR / p["filename"], "wb") as f:
        f.write(img_resp.content)
print(f"Downloaded {len(job_data['photos'])} photos.")
```

---

## Step 4: Quality & Blur Filtering (Variance of Laplacian)

Discard blurred frames and low-resolution photos:

```python
import cv2

FILTERED_DIR = Path("filtered_photos")
FILTERED_DIR.mkdir(parents=True, exist_ok=True)

total_photos = 0
retained_photos = 0

for img_file in IMAGE_DIR.glob("*.*"):
    total_photos += 1
    img = cv2.imread(str(img_file))
    if img is None:
        continue
    h, w = img.shape[:2]
    # Filter tiny images
    if max(h, w) < 1000:
        continue
    # Compute Laplacian variance (sharpness metric)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    fm = cv2.Laplacian(gray, cv2.CV_64F).var()
    if fm < 80.0:  # Blurry threshold
        continue
    
    cv2.imwrite(str(FILTERED_DIR / img_file.name), img)
    retained_photos += 1

print(f"Sharpness filtering complete: {retained_photos} of {total_photos} photos kept.")
```

---

## Step 5: Structure-from-Motion (COLMAP / PyCOLMAP)

```python
import pycolmap

DATABASE_PATH = "colmap.db"
OUTPUT_PATH = Path("sparse_model")
OUTPUT_PATH.mkdir(parents=True, exist_ok=True)

# 1. Feature extraction
pycolmap.extract_features(DATABASE_PATH, FILTERED_DIR)

# 2. Exhaustive feature matching
pycolmap.match_exhaustive(DATABASE_PATH)

# 3. Incremental 3D Reconstruction
maps = pycolmap.incremental_mapping(DATABASE_PATH, FILTERED_DIR, OUTPUT_PATH)
rec = maps[0]

registered_images = rec.num_reg_images()
points3d = rec.num_points3D()
registration_ratio = round(registered_images / total_photos, 3) if total_photos > 0 else 0

quality_report = {
    "registered": registered_images,
    "total": total_photos,
    "ratio": registration_ratio,
    "points": points3d,
    "method": "COLMAP SfM + OpenMVS"
}
print("Quality Metrics:", quality_report)
```

---

## Step 6: Dense Mesh Reconstruction & GLB Export

```python
# Convert sparse point cloud / Poisson surface to textured mesh
!colmap model_converter --input_path sparse_model/0 --output_path model.ply --output_type PLY

import trimesh
mesh = trimesh.load("model.ply")
mesh.export("raw_model.glb")

# Optimize mesh with Draco compression
!gltf-transform optimize raw_model.glb optimized_model.glb --draco.compress
```

---

## Step 7: Submit 3D Model & Honest Quality Report back to Dharohar 4D

```python
with open("optimized_model.glb", "rb") as glb_file:
    files = {"file": ("adalaj_model.glb", glb_file, "model/gltf-binary")}
    data = {
        "job_id": JOB_ID,
        "method": "photogrammetry",
        "quality_json": json.dumps(quality_report)
    }
    resp = requests.post(f"{BACKEND_URL}/api/v1/worker/result", headers=headers, data=data, files=files)
    print("Submission Result:", resp.json())
```

---

## Section 10.3 Emergency Path (Free External Tool)

If Colab disconnects or GPU quota is exhausted:
1. Use **Meshroom** on desktop, or mobile photogrammetry (e.g. Luma AI, KIRI Engine free tier).
2. Export the resulting GLB.
3. Call `/api/v1/worker/result` with `method='external_tool'` and quality report indicating:
   `Processed with an external tool from N photos`.
4. The Dharohar 4D UI will display this transparently to judges and users.

