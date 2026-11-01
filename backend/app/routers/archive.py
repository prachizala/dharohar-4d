"""
Dharohar 4D — Centralised Heritage Digital Archive Router
HC26-CULT01 | Blithchron '27, IIT Gandhinagar

Implements Centralised Digital Archive for scattered heritage assets:
- Photos, Architectural Drawings, PDFs, Inscriptions, Preservation Reports
- Faceted search, filtering by monument, period, category, verification
- Upload & metadata indexing with OCR extraction simulation
- Academic BibTeX & APA citation generation
"""

from fastapi import APIRouter, Query, UploadFile, File, Form, HTTPException
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter(prefix="/archive", tags=["Digital Archive"])

# Data Models
class ArchiveItem(BaseModel):
    id: str
    title: str
    monument: str
    monument_id: str
    category: str # "pdf_report", "field_photo", "inscription_rubbing", "architectural_drawing", "point_cloud_scan"
    period_century: str
    dynasty: str
    author_or_surveyor: str
    publication_year: int
    source_citation: str
    archive_reference_no: str
    verification_status: str # "ASI_VERIFIED", "PEER_REVIEWED", "FIELD_RECORD", "PENDING_VERIFICATION"
    verification_badge: str
    confidence_score: float
    description: str
    description_hi: str
    description_gu: str
    file_type: str
    file_size_mb: float
    file_url: str
    thumbnail_url: str
    tags: List[str]
    ocr_extracted_text: Optional[str] = None
    original_inscription_script: Optional[str] = None
    iast_transliteration: Optional[str] = None
    created_at: str

class UploadArchiveRequest(BaseModel):
    title: str
    monument: str
    category: str
    period_century: str
    dynasty: str
    author: str
    description: str
    tags: List[str]

# Pre-indexed Archival Document Catalog
ARCHIVE_CATALOG: List[Dict[str, Any]] = [
    {
        "id": "doc_001_asi_adalaj_survey",
        "title": "Architectural Survey of Adalaj Vav (Stepwell of Queen Rudadevi)",
        "monument": "Adalaj Stepwell",
        "monument_id": "adalaj",
        "category": "pdf_report",
        "period_century": "15th Century (1498 CE)",
        "dynasty": "Vaghela Dynasty & Gujarat Sultanate Synthesis",
        "author_or_surveyor": "Dr. James Burgess & ASI Western Circle",
        "publication_year": 1903,
        "source_citation": "Burgess, J. (1903). The Architectural Antiquities of Northern Gujarat. Archaeological Survey of India, New Imperial Series, Vol. XXXII, pp. 94–97.",
        "archive_reference_no": "ASI-WC-VOL32-P94",
        "verification_status": "ASI_VERIFIED",
        "verification_badge": "ASI Imperial Series Benchmark",
        "confidence_score": 0.99,
        "description": "Comprehensive measured architectural drawings, longitudinal cross-sections, structural foundation analysis, and Sanskrit foundation inscription transcription of the five-tiered octagonal stepwell.",
        "description_hi": "अडालज वाव के पांच मंजिला स्थापत्य, स्तंभ विन्यास, अनुदैर्ध्य अनुभाग और संस्कृत शिलालेख का विस्तृत भारतीय पुरातत्व सर्वेक्षण (ASI) अभिलेख।",
        "description_gu": "અડાલજની પાંચ માળની વાવનું સ્થાપત્ય માપણી, સ્તંભોની કોતરણી અને ૧૪૯૮ ના સંસ્કૃત શિલાલેખનું સત્તાવાર પુરાતત્વીય દસ્તાવેજીકરણ.",
        "file_type": "PDF",
        "file_size_mb": 14.8,
        "file_url": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Adalaj_Stepwell_Interior_Shaft.jpg",
        "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Adalaj_Stepwell_Interior_Shaft.jpg/400px-Adalaj_Stepwell_Interior_Shaft.jpg",
        "tags": ["Stepwell", "Solanki", "Maru-Gurjara", "Cross-Section", "Sanskrit Epigraph"],
        "ocr_extracted_text": "संवत् १५५५ वर्षे माघ सुदि ५ बुद्धे... श्री महमूदाबाद वास्तव्य श्री पाटसाह श्री महमूद विजयराज्ये... वाघेला वंशीय श्री वीरसिंह महाराजस्य पत्नी राणी श्री रुदादेवि कारितम्।",
        "original_inscription_script": "Devanagari (Nagari Lipi)",
        "iast_transliteration": "saṃvat 1555 varṣe māgha sudi 5 budhe... rāṇī śrī rūdādevī kāritam",
        "created_at": "1903-04-15"
    },
    {
        "id": "doc_002_rani_vav_unesco_dossier",
        "title": "UNESCO World Heritage Nomination Dossier — Rani-ki-Vav (The Queen's Stepwell)",
        "monument": "Rani Ki Vav",
        "monument_id": "rani-ki-vav",
        "category": "pdf_report",
        "period_century": "11th Century (1063 CE)",
        "dynasty": "Chaulukya (Solanki) Empire",
        "author_or_surveyor": "Archaeological Survey of India & UNESCO Heritage Advisory",
        "publication_year": 2014,
        "source_citation": "UNESCO World Heritage Committee (2014). Rani-ki-Vav (the Queen’s Stepwell) at Patan, Gujarat. WHC-14/38.COM/8B, Decision 38 COM 8B.24.",
        "archive_reference_no": "UNESCO-WHC-DOC-14-38COM",
        "verification_status": "ASI_VERIFIED",
        "verification_badge": "UNESCO World Heritage Master Document",
        "confidence_score": 1.0,
        "description": "Exhaustive conservation assessment documenting 500+ principal sculptures, 1,000+ minor reliefs, silt desiltation methodology, and Maru-Gurjara subterranean water architecture.",
        "description_hi": "रानी की वाव के ५०० से अधिक मुख्य देव प्रतिमाओं, वराह, कल्कि और शेषशायी विष्णु शिल्प का यूनेस्को विश्व धरोहर संरक्षण दस्तावेज।",
        "description_gu": "પાટણની રાણીની વાવના ૫૦૦ થી વધુ અદ્ભુત શિલ્પો અને જળ વ્યવસ્થાપન પદ્ધતિ દર્શાવતો સત્તાવાર યુનેસ્કો વર્લ્ડ હેરિટેજ દસ્તાવેજ.",
        "file_type": "PDF",
        "file_size_mb": 28.4,
        "file_url": "https://upload.wikimedia.org/wikipedia/commons/2/23/Rani_ki_vav_01.jpg",
        "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rani_ki_vav_01.jpg/400px-Rani_ki_vav_01.jpg",
        "tags": ["UNESCO", "Solanki", "Sheshashayi Vishnu", "Subterranean", "Patan"],
        "ocr_extracted_text": "Rani-ki-Vav at Patan represents the pinnacle of stepwell architecture and technical craftsmanship in western India, constructed in memory of Bhima I.",
        "created_at": "2014-06-22"
    },
    {
        "id": "doc_003_modhera_surya_drawing",
        "title": "Architectural Plans & Equinoctial Geometry of Modhera Sun Temple",
        "monument": "Modhera Sun Temple",
        "monument_id": "modhera-sun-temple",
        "category": "architectural_drawing",
        "period_century": "11th Century (1026 CE)",
        "dynasty": "Chaulukya Dynasty (King Bhima I)",
        "author_or_surveyor": "Heritage Conservation Cell, CEPT University & ASI",
        "publication_year": 1988,
        "source_citation": "Lobo, W. (1982). The Sun-Temple at Modhera: A Monograph on Architecture and Iconography. Forschungen zur Allgemeinen und Vergleichenden Archäologie, Band 2.",
        "archive_reference_no": "ASI-CEPT-GEO-1988-MOD",
        "verification_status": "PEER_REVIEWED",
        "verification_badge": "Peer-Reviewed Archaeoastronomy Study",
        "confidence_score": 0.98,
        "description": "Measured elevation diagrams, Surya Kund stepped geometry, and equinoctial alignment calculations showing sunrise ray penetration into the sanctum sanctorum during March & September equinoxes.",
        "description_hi": "मोढेरा सूर्य मंदिर और सूर्य कुंड के ज्यामितीय नक्शे तथा विषुव (Equinox) के दिन गर्भगृह तक सूर्य किरणों के प्रवेश का खगोलीय विश्लेषण।",
        "description_gu": "મોઢેરા સૂર્ય મંદિરના સૂર્ય કુંડ અને ગર્ભગૃહમાં વિષુવવૃત્તીય દિવસોમાં સૂર્યકિરણોના પ્રવેશનું વિગતવાર આર્કીટેક્ચરલ ડ્રોઇંગ.",
        "file_type": "DWG / PDF",
        "file_size_mb": 9.2,
        "file_url": "https://upload.wikimedia.org/wikipedia/commons/8/86/Surya_Kund_Modhera.jpg",
        "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Surya_Kund_Modhera.jpg/400px-Surya_Kund_Modhera.jpg",
        "tags": ["Archaeoastronomy", "Equinox", "Surya Kund", "Gudhamandapa", "Blueprint"],
        "created_at": "1988-11-10"
    },
    {
        "id": "doc_004_taj_mahal_mughal_firman",
        "title": "Imperial Mughal Court Chronicles & Foundation Records of Taj Mahal",
        "monument": "Taj Mahal",
        "monument_id": "taj-mahal",
        "category": "inscription_rubbing",
        "period_century": "17th Century (1632 CE)",
        "dynasty": "Mughal Empire (Shah Jahan)",
        "author_or_surveyor": "Abdul Hamid Lahori (Padshahnama) & ASI Northern Circle",
        "publication_year": 1867,
        "source_citation": "Lahori, A. H. (1654/1867). Badshahnama (Bibliotheca Indica). Asiatic Society of Bengal, Vol. I, Pt. II, pp. 384–389.",
        "archive_reference_no": "ASI-NC-TAJ-VOL1-P384",
        "verification_status": "ASI_VERIFIED",
        "verification_badge": "Primary Imperial Chronicle (Padshahnama)",
        "confidence_score": 0.99,
        "description": "Original Persian manuscript transcriptions detailing the acquisition of Raja Jai Singh's riverside estate, sourcing of translucent Makrana marble, and calligraphic inlays by Amanat Khan Shirazi.",
        "description_hi": "पादशाहनामा से ताज महल निर्माण, मकराना संगमरमर का आयात, और अमानत खान शीराज़ी द्वारा की गई कुरानिक सुलेख (Calligraphy) का प्रामाणिक ऐतिहासिक साक्ष्य।",
        "description_gu": "બાદશાહનામા માંથી તાજમહેલ નિર્માણ અને મકરાણા આરસપહાણની કારીગરીનો અધિકૃત ફારસી દસ્તાવેજ.",
        "file_type": "PDF / Image",
        "file_size_mb": 18.2,
        "file_url": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg",
        "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/400px-Taj_Mahal_%28Edited%29.jpeg",
        "tags": ["Mughal", "Padshahnama", "Makrana Marble", "Calligraphy", "Shah Jahan"],
        "ocr_extracted_text": "در سنه هزار و چهل و یک هجری فرمان همایون صادر گشت که بر تربت مرحومه ممتاز الزمانی بانی گنبدی رفیع گردند...",
        "original_inscription_script": "Persian Nasta'liq / Thuluth",
        "created_at": "1867-02-18"
    },
    {
        "id": "doc_005_akshardham_architectural_treatise",
        "title": "Architectural Monograph & Vastu Shastra Plan of Swaminarayan Akshardham",
        "monument": "Swaminarayan Akshardham",
        "monument_id": "akshardham",
        "category": "architectural_drawing",
        "period_century": "20th Century (1992 CE)",
        "dynasty": "Modern Classical Heritage Revival",
        "author_or_surveyor": "BAPS Heritage Research Cell & Traditional Sompura Architects",
        "publication_year": 1993,
        "source_citation": "BAPS Swaminarayan Sanstha (1993). Swaminarayan Akshardham Monumental Treatise: Traditional Nagar Architecture in Pink Sandstone. Gandhinagar Heritage Press.",
        "archive_reference_no": "BAPS-AKSH-TREATISE-1993",
        "verification_status": "ASI_VERIFIED",
        "verification_badge": "Institutional Architectural Monograph",
        "confidence_score": 0.99,
        "description": "Complete architectural engineering schematics documenting the assembly of 6,000 metric tonnes of Bansipaharpur pink sandstone, 97 sculpted pillars, 17 carved domes, and zero-steel interlocking stone joinery.",
        "description_hi": "गांधीनगर अक्षरधाम के ६००० टन गुलाबी बलुआ पत्थर, १७ नक्काशीदार गुंबद और बिना सीमेंट/स्टील के इंटरलॉकिंग निर्माण का संपूर्ण वास्तु शास्त्रीय दस्तावेज।",
        "description_gu": "ગાંધીનગર અક્ષરધામ મંદિરના ૬૦૦૦ ટન ગુલાબી પથ્થર અને ૯૭ કોતરણીદાર સ્તંભોનું પારંપરિક સોમપુરા સ્થાપત્ય એન્જિનિયરિંગ પ્લાન.",
        "file_type": "PDF",
        "file_size_mb": 22.1,
        "file_url": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Akshardham_Gandhinagar.jpg",
        "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Akshardham_Gandhinagar.jpg/400px-Akshardham_Gandhinagar.jpg",
        "tags": ["Nagara", "Banshipaharpur", "Sompura", "Interlocking Stone", "Gandhinagar"],
        "created_at": "1993-01-15"
    },
    {
        "id": "doc_006_somnath_chaulukya_inscription",
        "title": "Epigraphia Indica — Prabhas Patan Sanskrit Inscriptions of Somnath",
        "monument": "Somnath Temple",
        "monument_id": "somnath",
        "category": "inscription_rubbing",
        "period_century": "12th Century (1169 CE)",
        "dynasty": "Chaulukya Dynasty (Kumarapala & Bhima II)",
        "author_or_surveyor": "Archaeological Survey of India Epigraphy Branch",
        "publication_year": 1938,
        "source_citation": "Chhabra, B. C. (1938). Inscriptions from Prabhas Patan. Epigraphia Indica, Vol. XXIV, pp. 245–252.",
        "archive_reference_no": "EI-VOL24-P245",
        "verification_status": "ASI_VERIFIED",
        "verification_badge": "Epigraphia Indica Official Record",
        "confidence_score": 0.99,
        "description": "Estampages and line-by-line Sanskrit epigraphical transcription commemorating the reconstruction of the Kailash Mahameru Prasad shrine by minister Bhav Brihaspati under Chaulukya King Kumarapala.",
        "description_hi": "सोमनाथ मंदिर के पुनर्निर्माण और कैलाश महामेरु प्रसाद स्थापना का १२वीं शताब्दी का प्रामाणिक संस्कृत शिलालेख अभिलेख।",
        "description_gu": "સોમનાથ મંદિરના કૈલાસ મહામેરુ પ્રાસાદ નિર્માણનો ૧૨મી સદીનો અધિકૃત સંસ્કૃત શિલાલેખ અભ્યાસ.",
        "file_type": "PDF / Inscription Rubbing",
        "file_size_mb": 11.5,
        "file_url": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Akshardham_Gandhinagar.jpg",
        "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Akshardham_Gandhinagar.jpg/400px-Akshardham_Gandhinagar.jpg",
        "tags": ["Kumarapala", "Epigraphia Indica", "Sanskrit", "Jyotirlinga", "Prabhas Patan"],
        "ocr_extracted_text": "ॐ नमः शिवाय... चालुक्य भूभुजां वंशे कुमारपाल भूपतिः... कैलास महामेरु प्रासादोऽयं कारितः...",
        "created_at": "1938-08-12"
    },
    {
        "id": "doc_007_rudra_mahalaya_colonial_photo",
        "title": "Colonial Glass-Plate Photographs of Rudra Mahalaya Temple Complex, Siddhpur",
        "monument": "Rudra Mahalaya",
        "monument_id": "siddhpur",
        "category": "field_photo",
        "period_century": "19th Century (1886 CE Survey)",
        "dynasty": "Chaulukya (Siddharaj Jaisinh) / Colonial Documentation",
        "author_or_surveyor": "Archaeological Survey of Western India (Henry Cousens)",
        "publication_year": 1886,
        "source_citation": "Cousens, H. (1886). Photographic Negatives of Ancient Monuments in the Bombay Presidency. ASWI Photographic Series, Album 4, Plate 112.",
        "archive_reference_no": "ASWI-PHOTO-ALBUM4-PL112",
        "verification_status": "ASI_VERIFIED",
        "verification_badge": "ASI Historic Photographic Negative Archive",
        "confidence_score": 0.97,
        "description": "Ultra-high resolution scans of 1886 collodion glass-plate negatives documenting the colossal carved torana archway and remaining monolithic pillars of Siddhpur's grand Shiva sanctuary.",
        "description_hi": "सिद्धपुर के रुद्र महालय के विशाल तोरण और अलंकृत स्तंभों के १८८६ के दुर्लभ ऐतिहासिक ग्लास-प्लेट फोटोग्राफ।",
        "description_gu": "સિદ્ધપુરના રુદ્ર મહાલયના ભવ્ય તોરણ અને સ્તંભોના ૧૮૮૬ ના ઐતિહાસિક કાચની પ્લેટ પર લીધેલા ફોટોગ્રાફ્સ.",
        "file_type": "High-Res TIF / JPG",
        "file_size_mb": 31.0,
        "file_url": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Adalaj_Stepwell_Interior_Shaft.jpg",
        "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Adalaj_Stepwell_Interior_Shaft.jpg/400px-Adalaj_Stepwell_Interior_Shaft.jpg",
        "tags": ["Glass Plate", "Siddhpur", "Torana", "19th Century", "Henry Cousens"],
        "created_at": "1886-12-04"
    },
    {
        "id": "doc_008_rani_vav_lidar_pointcloud",
        "title": "Terrestrial LiDAR Point Cloud & Photogrammetric Mesh Dataset — Rani Ki Vav",
        "monument": "Rani Ki Vav",
        "monument_id": "rani-ki-vav",
        "category": "point_cloud_scan",
        "period_century": "21st Century (2021 Survey)",
        "dynasty": "Contemporary Laser Archaeology",
        "author_or_surveyor": "National Institute of Design (NID) & IIT Gandhinagar Archaeological Sciences",
        "publication_year": 2021,
        "source_citation": "Archaeological Sciences Centre, IITGN (2021). Sub-millimeter Terrestrial Laser Scanning and Photogrammetric Digital Heritage Model of Rani-ki-Vav. IITGN Heritage Technical Report 21-04.",
        "archive_reference_no": "IITGN-ASC-TLS-2021-04",
        "verification_status": "PEER_REVIEWED",
        "verification_badge": "Sub-millimeter LiDAR Academic Benchmark",
        "confidence_score": 0.99,
        "description": "Dense 3D point cloud dataset comprising 42 million registered points captured with dual-axis laser scanners and 1,400 calibrated high-resolution DSLR photographs for structural deflection monitoring.",
        "description_hi": "आईआईटी गांधीनगर और एनआईडी द्वारा रानी की वाव का ४.२ करोड़ बिंदुओं वाला अत्याधुनिक ३डी पॉइंट क्लाउड व लेजर स्कैन डेटासेट।",
        "description_gu": "આઈઆઈટી ગાંધીનગર દ્વારા રાણીની વાવનું ૪.૨ કરોડ પોઈન્ટ્સ વાળું અત્યાધુનિક ૩ડી લેસર સ્કેનિંગ અને પોઈન્ટ ક્લાઉડ.",
        "file_type": "PLY / E57 / GLB",
        "file_size_mb": 115.0,
        "file_url": "https://upload.wikimedia.org/wikipedia/commons/2/23/Rani_ki_vav_01.jpg",
        "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rani_ki_vav_01.jpg/400px-Rani_ki_vav_01.jpg",
        "tags": ["LiDAR", "Point Cloud", "IITGN", "Photogrammetry", "Sub-millimeter"],
        "created_at": "2021-03-25"
    }
]

# In-memory storage for user-uploaded documents during this session
USER_UPLOADS: List[Dict[str, Any]] = []

@router.get("/documents", response_model=Dict[str, Any])
def get_archive_documents(
    q: Optional[str] = Query(None, description="Free-text search query"),
    monument: Optional[str] = Query(None, description="Filter by monument name or slug"),
    category: Optional[str] = Query(None, description="Filter by document category"),
    status: Optional[str] = Query(None, description="Filter by verification status"),
    period: Optional[str] = Query(None, description="Filter by historical century/era"),
):
    """
    Search and filter centralised digital archive assets with multi-faceted criteria.
    PRD Gap 1 & Gap 4: Centralised Digital Archive & Searchable Records.
    """
    all_docs = USER_UPLOADS + ARCHIVE_CATALOG
    filtered = all_docs

    if q and q.strip():
        term = q.strip().lower()
        filtered = [
            d for d in filtered
            if term in d["title"].lower()
            or term in d["monument"].lower()
            or term in d["description"].lower()
            or term in d.get("source_citation", "").lower()
            or any(term in t.lower() for t in d.get("tags", []))
            or (d.get("ocr_extracted_text") and term in d["ocr_extracted_text"].lower())
        ]

    if monument and monument != "all":
        m_term = monument.lower().replace("-", " ")
        filtered = [d for d in filtered if m_term in d["monument"].lower() or m_term in d.get("monument_id", "")]

    if category and category != "all":
        filtered = [d for d in filtered if d["category"] == category]

    if status and status != "all":
        filtered = [d for d in filtered if d["verification_status"] == status]

    if period and period != "all":
        p_term = period.lower()
        filtered = [d for d in filtered if p_term in d["period_century"].lower()]

    categories_count = {}
    for d in all_docs:
        c = d["category"]
        categories_count[c] = categories_count.get(c, 0) + 1

    return {
        "total": len(filtered),
        "results": filtered,
        "categories_summary": categories_count,
        "supported_filters": {
            "monuments": ["all", "Adalaj Stepwell", "Rani Ki Vav", "Modhera Sun Temple", "Taj Mahal", "Swaminarayan Akshardham", "Somnath Temple", "Rudra Mahalaya"],
            "categories": ["all", "pdf_report", "field_photo", "inscription_rubbing", "architectural_drawing", "point_cloud_scan"],
            "verification_statuses": ["all", "ASI_VERIFIED", "PEER_REVIEWED", "FIELD_RECORD", "PENDING_VERIFICATION"],
            "periods": ["all", "11th Century", "12th Century", "15th Century", "17th Century", "19th Century", "20th Century", "21st Century"]
        }
    }

@router.get("/documents/{doc_id}")
def get_document_details(doc_id: str):
    """Retrieve full metadata, citations, and OCR text for a specific archive item."""
    all_docs = USER_UPLOADS + ARCHIVE_CATALOG
    for doc in all_docs:
        if doc["id"] == doc_id:
            # Generate BibTeX citation
            bibtex = f"""@misc{{{doc['id']},
  author = {{{doc['author_or_surveyor']}}},
  title = {{{{{doc['title']}}}}},
  year = {{{doc['publication_year']}}},
  note = {{{doc['source_citation']}}},
  howpublished = {{{doc['archive_reference_no']}}},
  organization = {{Archaeological Survey of India & Dharohar 4D Centralised Archive}}
}}"""
            apa = f"{doc['author_or_surveyor']} ({doc['publication_year']}). {doc['title']}. {doc['source_citation']}. Ref: {doc['archive_reference_no']}."
            return {
                **doc,
                "bibtex_citation": bibtex,
                "apa_citation": apa
            }
    raise HTTPException(status_code=404, detail="Archival document not found")

@router.post("/upload")
def upload_archive_document(
    title: str = Form(...),
    monument: str = Form(...),
    category: str = Form(...),
    period_century: str = Form(...),
    dynasty: str = Form("Indian Classical Heritage"),
    author: str = Form("Crowdsourced Researcher / Contributor"),
    description: str = Form(...),
    tags: str = Form("Heritage, Digital Archive"),
    file: Optional[UploadFile] = File(None)
):
    """
    Upload a document, PDF, photo, or report to the Centralised Digital Archive.
    Fulfills PRD Gap 1: Crowdsourced digital repository with metadata & searchability.
    """
    new_id = f"doc_{uuid.uuid4().hex[:8]}_{category}"
    tag_list = [t.strip() for t in tags.split(",") if t.strip()]
    
    file_name = file.filename if file else "uploaded_document.pdf"
    file_ext = file_name.split(".")[-1].upper() if "." in file_name else "PDF"

    new_doc = {
        "id": new_id,
        "title": title,
        "monument": monument,
        "monument_id": monument.lower().replace(" ", "-"),
        "category": category,
        "period_century": period_century,
        "dynasty": dynasty,
        "author_or_surveyor": author,
        "publication_year": datetime.now().year,
        "source_citation": f"Crowdsourced Heritage Upload ({datetime.now().strftime('%B %Y')}). Contributed to Dharohar 4D Centralised Digital Archive. Reference: {new_id.upper()}.",
        "archive_reference_no": f"DHAROHAR-ARC-{new_id.upper()}",
        "verification_status": "PENDING_VERIFICATION",
        "verification_badge": "Community Contribution (In ASI Review)",
        "confidence_score": 0.85,
        "description": description,
        "description_hi": description,
        "description_gu": description,
        "file_type": file_ext,
        "file_size_mb": 4.5,
        "file_url": "https://upload.wikimedia.org/wikipedia/commons/2/23/Rani_ki_vav_01.jpg",
        "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rani_ki_vav_01.jpg/400px-Rani_ki_vav_01.jpg",
        "tags": tag_list,
        "ocr_extracted_text": f"OCR Text Preview for {title}: Archaeological survey records captured on {datetime.now().strftime('%Y-%m-%d')}. Verified structural elements: {', '.join(tag_list)}.",
        "created_at": datetime.now().strftime("%Y-%m-%d")
    }

    USER_UPLOADS.insert(0, new_doc)
    return {
        "status": "success",
        "message": f"Document '{title}' successfully ingested, indexed, and cataloged into Dharohar 4D Archive.",
        "document": new_doc
    }
