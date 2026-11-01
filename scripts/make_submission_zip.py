import os
import zipfile
from pathlib import Path
import shutil

def create_project_zip():
    root_dir = Path(__file__).resolve().parent.parent
    zip_filename = "dharohar-4d-submission.zip"
    zip_path = root_dir / zip_filename

    # Directories and files to exclude
    exclude_dirs = {
        ".git",
        ".next",
        "node_modules",
        "__pycache__",
        ".pytest_cache",
        ".turbo",
        ".venv",
        "venv",
        "_old_lifepulse",
    }
    exclude_exts = {
        ".pyc",
        ".pyo",
        ".pyd",
    }
    exclude_files = {
        zip_filename,
        "dharohar-4d.zip",
        ".DS_Store",
        "thumbs.db",
        ".env",
        ".env.local",
        "lifepulse.db",
    }

    print(f"Creating project submission zip from: {root_dir}")
    print(f"Destination: {zip_path}")

    total_files = 0
    total_bytes = 0

    with zipfile.ZipFile(str(zip_path), "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
        for foldername, subfolders, filenames in os.walk(str(root_dir)):
            # Filter out excluded directories in-place
            subfolders[:] = [
                d for d in subfolders
                if d not in exclude_dirs and not d.endswith(" - Copy") and not d.startswith(".git")
            ]

            for filename in filenames:
                if filename in exclude_files:
                    continue
                if filename.startswith(".env") and not filename.endswith(".example"):
                    continue
                if filename.endswith(".db") and filename != "dharohar.db":
                    continue
                if any(filename.endswith(ext) for ext in exclude_exts):
                    continue
                if " - Copy" in filename:
                    continue

                filepath = Path(foldername) / filename
                rel_path = filepath.relative_to(root_dir)

                # Skip any paths that somehow contain excluded dirs
                if any(part in exclude_dirs for part in rel_path.parts):
                    continue

                try:
                    zipf.write(str(filepath), arcname=str(rel_path))
                    total_files += 1
                    total_bytes += filepath.stat().st_size
                except Exception as e:
                    print(f"Warning: skipped {rel_path}: {e}")

    zip_size_mb = zip_path.stat().st_size / (1024 * 1024)
    print(f"SUCCESS: Zipped {total_files} files ({total_bytes / (1024 * 1024):.2f} MB uncompressed) into:")
    print(f"-> {zip_path} ({zip_size_mb:.2f} MB compressed)")

    # Also copy to Downloads and Desktop for user convenience
    destinations = [
        Path(r"C:\Users\yashp\Downloads") / zip_filename,
        Path(r"C:\Users\yashp\OneDrive\Desktop") / zip_filename,
    ]

    for dest in destinations:
        try:
            if dest.parent.exists():
                shutil.copy2(str(zip_path), str(dest))
                print(f"-> Copied to: {dest}")
        except Exception as e:
            print(f"Could not copy to {dest}: {e}")

if __name__ == "__main__":
    create_project_zip()

