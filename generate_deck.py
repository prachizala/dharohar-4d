import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Colors
    BG_COLOR = RGBColor(15, 23, 42)       # Slate 900 #0F172A
    CARD_BG = RGBColor(30, 41, 59)        # Slate 800 #1E293B
    BORDER_COLOR = RGBColor(71, 85, 105)  # Slate 600
    GOLD = RGBColor(212, 175, 55)         # Imperial Gold #D4AF37
    EMERALD = RGBColor(16, 185, 129)      # Emerald 500 #10B981
    WHITE = RGBColor(248, 250, 252)       # White #F8FAFC
    MUTED = RGBColor(148, 163, 184)       # Muted Slate #94A3B8
    CYAN = RGBColor(56, 189, 248)         # Sky #38BDF8

    def add_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def add_header(slide, tag, title, subtitle=None):
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.733), Inches(1.2))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p_tag = tf.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = GOLD

        p_title = tf.add_paragraph()
        p_title.text = title
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = WHITE
        p_title.space_before = Pt(4)

        if subtitle:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.size = Pt(13)
            p_sub.font.color.rgb = MUTED
            p_sub.space_before = Pt(4)

    def add_card(slide, left, top, width, height, title, items, tag=None, accent=GOLD):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = accent
        card.line.width = Pt(1.2)

        tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), height - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p0 = tf.paragraphs[0]
        if tag:
            p0.text = tag.upper()
            p0.font.size = Pt(10)
            p0.font.bold = True
            p0.font.color.rgb = accent
            p_title = tf.add_paragraph()
        else:
            p_title = p0

        p_title.text = title
        p_title.font.size = Pt(16)
        p_title.font.bold = True
        p_title.font.color.rgb = WHITE
        p_title.space_before = Pt(2)

        for item in items:
            p_item = tf.add_paragraph()
            p_item.text = f"•  {item}"
            p_item.font.size = Pt(12)
            p_item.font.color.rgb = MUTED
            p_item.space_before = Pt(6)

    # ─────────────────────────────────────────────────────────────
    # SLIDE 1: TITLE SLIDE
    # ─────────────────────────────────────────────────────────────
    s1 = prs.slides.add_slide(blank_layout)
    add_background(s1)

    # Decorative Border Card
    deco = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.0), Inches(10.333), Inches(5.5))
    deco.fill.solid()
    deco.fill.fore_color.rgb = CARD_BG
    deco.line.color.rgb = GOLD
    deco.line.width = Pt(2)

    tb1 = s1.shapes.add_textbox(Inches(2.0), Inches(1.5), Inches(9.333), Inches(4.5))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "BLITHCHRON '27 | IIT GANDHINAGAR • PROBLEM HC26-CULT01"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = GOLD
    p.alignment = PP_ALIGN.CENTER

    p = tf1.add_paragraph()
    p.text = "DHAROHAR 4D (धरोहर 4D)"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(14)

    p = tf1.add_paragraph()
    p.text = "4D Spatiotemporal Digital Twin & Cultural Heritage Authenticity Engine"
    p.font.size = Pt(18)
    p.font.color.rgb = CYAN
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(8)

    p = tf1.add_paragraph()
    p.text = "Preserving Ancient Monuments through Multimodal Archiving, WebXR AR, and Cryptographic Authenticity"
    p.font.size = Pt(13)
    p.font.color.rgb = MUTED
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(12)

    p = tf1.add_paragraph()
    p.text = "Presented by: Prachi Zala & Team  |  Status: 100% Deployed & Live on Render"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = EMERALD
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(36)

    # ─────────────────────────────────────────────────────────────
    # SLIDE 2: THE HERITAGE CRISIS (PROBLEM STATEMENT)
    # ─────────────────────────────────────────────────────────────
    s2 = prs.slides.add_slide(blank_layout)
    add_background(s2)
    add_header(s2, "The Challenge", "The Cultural Heritage Crisis: Preserving What Is Being Lost",
               "Why 3,600+ monuments need an AI-driven, authentic 4th-dimensional digital twin today.")

    add_card(s2, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8),
             "1. Physical Degradation",
             ["Over 3,690 centrally protected ASI monuments are subjected to weathering, urban expansion, and environmental erosion.",
              "Physical restoration is irreversible if original geometric baselines and architectural states are lost.",
              "Traditional laser LIDAR scanning is prohibitively expensive and cannot capture historical epochs."],
             tag="Conservation Barrier", accent=RGBColor(239, 68, 68))

    add_card(s2, Inches(4.866), Inches(2.0), Inches(3.6), Inches(4.8),
             "2. Archival Fragmentation",
             ["Critical historical records are trapped in 19th-century colonial surveys (James Burgess, Cousens) and scattered archives.",
              "Tourist photos, academic field notes, and local epigraphs remain siloed in incompatible formats.",
              "Zero standardized metadata schema linking physical artifacts to architectural epochs."],
             tag="Data Disconnection", accent=RGBColor(245, 158, 11))

    add_card(s2, Inches(8.933), Inches(2.0), Inches(3.6), Inches(4.8),
             "3. Hallucination Risk",
             ["Generic GenAI tools invent fictional carvings, wrong dynasties, and fabricated architectural timelines.",
              "Lack of strict ground-truth verification undermines scholarly credibility.",
              "Museums and scholars cannot trust unverified digital reconstructions without provenance."],
             tag="Authenticity Failure", accent=GOLD)

    # ─────────────────────────────────────────────────────────────
    # SLIDE 3: OUR SOLUTION: DHAROHAR 4D
    # ─────────────────────────────────────────────────────────────
    s3 = prs.slides.add_slide(blank_layout)
    add_background(s3)
    add_header(s3, "Our Innovation", "Dharohar 4D: Bridging Time, Geometry & Authenticity",
               "A holistic, end-to-end platform turning scattered media into interactive, verified 4D twins.")

    add_card(s3, Inches(0.8), Inches(2.0), Inches(2.7), Inches(4.8),
             "1. 4D Digital Twins",
             ["3D photogrammetric geometry combined with the 4th dimension (Time).",
              "Explore monuments across historical eras: 11th-century Solanki, 1890 ASI colonial surveys, and 2026 current state.",
              "Interactive solar simulation matching monument alignment."],
             tag="Spatial + Temporal", accent=GOLD)

    add_card(s3, Inches(3.8), Inches(2.0), Inches(2.7), Inches(4.8),
             "2. Evidence Grounding",
             ["Dual-stage verification pipeline with zero tolerance for AI hallucination.",
              "Every architectural claim is cross-verified against primary literature.",
              "Fuzzy matching guarantees claims are backed by verbatim citations."],
             tag="100% Verifiable", accent=EMERALD)

    add_card(s3, Inches(6.8), Inches(2.0), Inches(2.7), Inches(4.8),
             "3. Mobile WebXR AR",
             ["No app installation required; runs natively on iOS & Android browsers.",
              "Project ancient stepwells and temple sanctums into physical reality at 1:1 scale.",
              "Multilingual audio guide in English, Hindi, and Gujarati."],
             tag="Accessible to All", accent=CYAN)

    add_card(s3, Inches(9.8), Inches(2.0), Inches(2.7), Inches(4.8),
             "4. Cryptographic Trust",
             ["SHA-256 asset finger-printing prevents tampering or metadata alteration.",
              "Curatorial audit trail with side-by-side archival diff review.",
              "Exportable ASI Verification Certificates with cryptographic hashes."],
             tag="Institutional Grade", accent=WHITE)

    # ─────────────────────────────────────────────────────────────
    # SLIDE 4: SYSTEM ARCHITECTURE
    # ─────────────────────────────────────────────────────────────
    s4 = prs.slides.add_slide(blank_layout)
    add_background(s4)
    add_header(s4, "Engineering Design", "4-Tier Production Architecture",
               "Designed for high throughput, cryptographic provenance, and instant mobile responsiveness.")

    add_card(s4, Inches(0.8), Inches(2.0), Inches(5.6), Inches(2.3),
             "Layer 1: Multi-Modal Ingestion & Archive",
             ["Automated EXIF extraction (focal length, GPS, timestamp).",
              "Perceptual image hashing (pHash) for deduplication & tamper detection.",
              "SQLite FTS5 full-text search with multilingual query expansion."],
             tag="Ingestion & Storage", accent=CYAN)

    add_card(s4, Inches(6.8), Inches(2.0), Inches(5.6), Inches(2.3),
             "Layer 2: 3D Photogrammetry & 4D Temporal Engine",
             ["Multi-view photogrammetry reconstruction generating optimized GLB/glTF twins.",
              "Dynamic solar azimuth calculation for Solanki sun-temple alignments.",
              "Stepwell water level simulation & aging material shaders."],
             tag="Visual & Geometry", accent=GOLD)

    add_card(s4, Inches(0.8), Inches(4.6), Inches(5.6), Inches(2.3),
             "Layer 3: Authenticity & Claim Verification Engine",
             ["LLM extraction strictly constrained to uploaded archival documents.",
              "RapidFuzz fuzzy verification verifying exact text snippets.",
              "Cryptographic SHA-256 certificate generation for verified assets."],
             tag="Rigor & Trust", accent=EMERALD)

    add_card(s4, Inches(6.8), Inches(4.6), Inches(5.6), Inches(2.3),
             "Layer 4: Immersive Frontend & Reviewer Portal",
             ["Next.js 14 App Router with React Three Fiber & Google Model-Viewer.",
              "Interactive India Geo-Explorer map with coordinate pins & dynasty filters.",
              "Side-by-side 3D review diff viewer with 1-click evaluator bypass."],
             tag="User Experience", accent=WHITE)

    # ─────────────────────────────────────────────────────────────
    # SLIDE 5: IMMERSIVE 3D & WEBXR AR
    # ─────────────────────────────────────────────────────────────
    s5 = prs.slides.add_slide(blank_layout)
    add_background(s5)
    add_header(s5, "User Experience", "Interactive 3D Digital Twin & Mobile WebXR AR",
               "Bringing cultural heritage into the physical world through cutting-edge browser capabilities.")

    add_card(s5, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8),
             "WebXR AR Experience",
             ["Instant 1-click AR mode via WebXR & iOS Quick-Look.",
              "Zero external app downloads required.",
              "Place full-scale 3D monuments on tables, floors, or open grounds.",
              "Real-world scale perception for architectural education."],
             tag="Spatial Computing", accent=CYAN)

    add_card(s5, Inches(4.866), Inches(2.0), Inches(3.6), Inches(4.8),
             "Curated 3D Hotspots",
             ["Interactive 3D pins placed directly on architectural features.",
              "Click to inspect: Solanki pillar carvings, octagonal well shafts, torana gates.",
              "Every hotspot displays verified primary literature citations & page numbers.",
              "Direct connection between 3D geometry and historical scholarship."],
             tag="Scholarly Annotation", accent=GOLD)

    add_card(s5, Inches(8.933), Inches(2.0), Inches(3.6), Inches(4.8),
             "Solar Lighting & Audio Tour",
             ["Simulate Sunrise, Golden Hour, and Night illumination in real-time.",
              "Observe solar alignment of temples (e.g. Modhera equinox rays).",
              "Integrated Web Speech TTS narration.",
              "Listen to architectural explanations in English, Hindi, and Gujarati."],
             tag="Multi-Sensory", accent=EMERALD)

    # ─────────────────────────────────────────────────────────────
    # SLIDE 6: SPATIOTEMPORAL EXPLORER
    # ─────────────────────────────────────────────────────────────
    s6 = prs.slides.add_slide(blank_layout)
    add_background(s6)
    add_header(s6, "Exploration Tools", "Spatiotemporal Heritage: Geo-Explorer & Time-Slider",
               "Navigate India's sacred geography and witness architectural transformation across centuries.")

    add_card(s6, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8),
             "India Geo-Explorer Interactive Map",
             ["Cartographic visualization mapping protected heritage sites across India.",
              "Interactive coordinate pins with instant 3D twin previews.",
              "Filter monuments by Dynasty (Solanki, Vaghela, Eastern Ganga, Chola).",
              "State-level architectural clustering (Gujarat, Odisha, Tamil Nadu).",
              "Bridges regional heritage data into one unified national map."],
             tag="Geographic Dimension", accent=CYAN)

    add_card(s6, Inches(6.8), Inches(2.0), Inches(5.6), Inches(4.8),
             "Then-vs-Now Archival Comparison Slider",
             ["Interactive split-screen comparison slider.",
              "Side A: 1890 James Burgess ASI colonial photographs & archaeological plates.",
              "Side B: 2026 photogrammetric 3D digital twin of the current monument state.",
              "Examine structural weathering, missing sculptures, and ASI conservation work.",
              "Essential tool for archaeological damage assessment and educational walkthroughs."],
             tag="Temporal Dimension (4D)", accent=GOLD)

    # ─────────────────────────────────────────────────────────────
    # SLIDE 7: CURATORIAL RIGOR & CRYPTOGRAPHIC TRUST
    # ─────────────────────────────────────────────────────────────
    s7 = prs.slides.add_slide(blank_layout)
    add_background(s7)
    add_header(s7, "Authenticity Engine", "Curatorial Rigor & Cryptographic Verification",
               "Preventing historical falsification through cryptographic provenance and peer review.")

    add_card(s7, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8),
             "Cryptographic Hashing",
             ["Every uploaded photo, 3D model, and archival text receives a SHA-256 fingerprint.",
              "Immutable digital ledger guarantees no unrecorded alterations occur.",
              "Perceptual hashing (pHash) detects cropped, resized, or re-compressed duplicates."],
             tag="Data Integrity", accent=WHITE)

    add_card(s7, Inches(4.866), Inches(2.0), Inches(3.6), Inches(4.8),
             "Automated Claim Verification",
             ["LLM extracts claims with mandatory snippet citations.",
              "Fuzzy string matcher verifies snippet exists verbatim in source PDF/doc.",
              "Unverified or contradictory claims are rejected automatically with zero human bias."],
             tag="Anti-Hallucination", accent=EMERALD)

    add_card(s7, Inches(8.933), Inches(2.0), Inches(3.6), Inches(4.8),
             "ASI Verification Certificates",
             ["Generates official digital Authenticity Certificates.",
              "Contains monument metadata, epoch timestamps, curator signature, and SHA-256 seal.",
              "Exportable as JSON metadata and printable formal verification documents."],
             tag="Institutional Value", accent=GOLD)

    # ─────────────────────────────────────────────────────────────
    # SLIDE 8: MODERN REVIEWER PORTAL
    # ─────────────────────────────────────────────────────────────
    s8 = prs.slides.add_slide(blank_layout)
    add_background(s8)
    add_header(s8, "Evaluator Experience", "Modern Reviewer Portal & Side-by-Side Review Diff",
               "Streamlined workflow empowering ASI curators and competition evaluators.")

    add_card(s8, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8),
             "1-Click Evaluator Access",
             ["No credentials barrier for hackathon judges: 1-click evaluator bypass button.",
              "Optional Magic Link token authentication for secure administrative sessions.",
              "Role-based access control preventing unauthorized state modifications."],
             tag="Frictionless Access", accent=CYAN)

    add_card(s8, Inches(4.866), Inches(2.0), Inches(3.6), Inches(4.8),
             "Side-by-Side Review Diff",
             ["Compare pending digital twin submissions directly against approved reference models.",
              "Inspect texture resolution, dense point count, and reprojection error metrics.",
              "Curator can approve, flag for re-capture, or reject with architectural feedback."],
             tag="Quality Assurance", accent=GOLD)

    add_card(s8, Inches(8.933), Inches(2.0), Inches(3.6), Inches(4.8),
             "Resilience & Offline Fallback",
             ["Includes complete offline showcase dataset (Adalaj, Modhera, Rani Ki Vav, Konark).",
              "Auto-switching interceptor detects network dropouts seamlessly.",
              "Gold shimmering skeleton loaders provide a polished 60 FPS experience."],
             tag="100% Reliability", accent=EMERALD)

    # ─────────────────────────────────────────────────────────────
    # SLIDE 9: TECH STACK & PRODUCTION DEPLOYMENT
    # ─────────────────────────────────────────────────────────────
    s9 = prs.slides.add_slide(blank_layout)
    add_background(s9)
    add_header(s9, "Deployment & DevOps", "Full-Stack Technology Stack & Production Cloud Deployment",
               "Built on battle-tested open technologies and deployed live on Render.")

    add_card(s9, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8),
             "Modern Frontend",
             ["Next.js 14 (App Router) for high-performance server-side rendering.",
              "React Three Fiber & Three.js for interactive 3D rendering.",
              "Google Model-Viewer for standard-compliant WebXR AR.",
              "Tailwind CSS for responsive heritage-themed dark-gold UI."],
             tag="Client Layer", accent=CYAN)

    add_card(s9, Inches(4.866), Inches(2.0), Inches(3.6), Inches(4.8),
             "High-Speed Backend",
             ["FastAPI (Python 3.11) with asynchronous endpoints.",
              "SQLite + FTS5 for lightning-fast full-text search across documents.",
              "RapidFuzz for high-speed fuzzy text citation verification.",
              "Groq Llama 3.3 for grounded claim extraction."],
             tag="API & Engine", accent=GOLD)

    add_card(s9, Inches(8.933), Inches(2.0), Inches(3.6), Inches(4.8),
             "Cloud Infrastructure",
             ["Render Cloud Blueprint (render.yaml) for automated Infrastructure-as-Code.",
              "Dual Web Services: Python FastAPI Backend + Next.js Frontend.",
              "Automatic zero-downtime CI/CD sync from GitHub main branch.",
              "Live health-checks on /healthz endpoint."],
             tag="Production Cloud", accent=EMERALD)

    # ─────────────────────────────────────────────────────────────
    # SLIDE 10: CONCLUSION & SUMMARY
    # ─────────────────────────────────────────────────────────────
    s10 = prs.slides.add_slide(blank_layout)
    add_background(s10)

    deco10 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.0), Inches(10.333), Inches(5.5))
    deco10.fill.solid()
    deco10.fill.fore_color.rgb = CARD_BG
    deco10.line.color.rgb = GOLD
    deco10.line.width = Pt(2)

    tb10 = s10.shapes.add_textbox(Inches(2.0), Inches(1.5), Inches(9.333), Inches(4.5))
    tf10 = tb10.text_frame
    tf10.word_wrap = True

    p = tf10.paragraphs[0]
    p.text = "CONCLUSION & IMPACT"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = GOLD
    p.alignment = PP_ALIGN.CENTER

    p = tf10.add_paragraph()
    p.text = "Preserving the Past, Empowering the Future"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(8)

    p = tf10.add_paragraph()
    p.text = "Dharohar 4D solves the critical tension between cutting-edge AI immersion and scholarly authenticity."
    p.font.size = Pt(15)
    p.font.color.rgb = CYAN
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(12)

    p = tf10.add_paragraph()
    p.text = "✓ Overcomes physical loss by archiving multi-epoch architectural baselines.\n" \
             "✓ Delivers zero-install WebXR AR directly in mobile browsers.\n" \
             "✓ Provides 100% citation-grounded authenticity with cryptographic certificates.\n" \
             "✓ Production-deployed, live on Render, and ready for institutional ASI adoption."
    p.font.size = Pt(13)
    p.font.color.rgb = MUTED
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(14)

    p = tf10.add_paragraph()
    p.text = "Ready for Live Demonstration  •  Thank You!"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = EMERALD
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(24)

    prs.save("Dharohar_4D_Presentation.pptx")
    print("Presentation saved successfully as Dharohar_4D_Presentation.pptx")

if __name__ == "__main__":
    create_presentation()
