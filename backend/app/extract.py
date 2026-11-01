import os
from pathlib import Path
from PIL import Image
from PIL.ExifTags import TAGS

def extract_pdf(path: str) -> str:
    try:
        import pdfplumber
        out = []
        with pdfplumber.open(path) as pdf:
            for p in pdf.pages:
                out.append(p.extract_text() or "")
        text = "\n".join(out).strip()
        if len(text) < 30:  # probably scanned -> try OCR if available
            text = try_ocr_pdf(path) or text
        return text
    except Exception as e:
        print(f"Error extracting PDF {path}: {e}")
        return ""

def extract_pptx(path: str) -> str:
    try:
        from pptx import Presentation
        prs = Presentation(path)
        out = []
        for s in prs.slides:
            for sh in s.shapes:
                if getattr(sh, "has_text_frame", False):
                    out.append(sh.text_frame.text)
            if s.has_notes_slide:
                out.append(s.notes_slide.notes_text_frame.text)
        return "\n".join(out).strip()
    except Exception as e:
        print(f"Error extracting PPTX {path}: {e}")
        return ""

def extract_docx(path: str) -> str:
    try:
        import docx
        doc = docx.Document(path)
        return "\n".join(p.text for p in doc.paragraphs).strip()
    except Exception as e:
        print(f"Error extracting DOCX {path}: {e}")
        return ""

def extract_txt(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read().strip()
    except Exception:
        return ""

def extract_exif(path: str) -> dict:
    try:
        img = Image.open(path)
        ex = img._getexif() or {}
        return {TAGS.get(k, k): str(v) for k, v in ex.items() if TAGS.get(k) in ("DateTimeOriginal", "Model", "Make")}
    except Exception:
        return {}

def try_ocr_pdf(path: str) -> str:
    try:
        import pytesseract
        from pdf2image import convert_from_path
        pages = convert_from_path(path, dpi=200)
        return "\n".join(pytesseract.image_to_string(p, lang="eng+hin+guj") for p in pages)
    except Exception:
        return ""  # OCR not available: skip gracefully, never crash

def extract_text_for_file(path: str, ext: str) -> str:
    ext = ext.lower().strip(".")
    if ext == "pdf":
        return extract_pdf(path)
    elif ext in ("pptx", "ppt"):
        return extract_pptx(path)
    elif ext in ("docx", "doc"):
        return extract_docx(path)
    elif ext in ("txt", "text", "md", "csv"):
        return extract_txt(path)
    return ""

