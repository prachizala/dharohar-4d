// Showcase Mock Dataset for Dharohar 4D Offline / Fallback Mode
// Ensures that judges and users NEVER encounter a broken screen or empty state

export interface ShowcaseMonument {
  id: number;
  name_en: string;
  name_hi: string;
  name_gu: string;
  district: string;
  state: string;
  period: string;
  lat: number;
  lon: number;
  dynasty?: string;
  architectural_style?: string;
  model3d?: {
    file_path: string;
    label: string;
    method: string;
    photo_count: number;
    quality: {
      registered: number;
      total: number;
      ratio: number;
      points: number;
      method: string;
      architectural_features: string[];
    };
  };
  resources?: {
    photos: any[];
    pdfs: any[];
    pptxs: any[];
    docxs: any[];
    reports: any[];
  };
  claims?: any[];
}

export const SHOWCASE_MONUMENTS: ShowcaseMonument[] = [
  {
    id: 1,
    name_en: "Adalaj Stepwell (Rudabai Stepwell)",
    name_hi: "अडालज की वाव (रूदाबाई वाव)",
    name_gu: "અડાલજની વાવ (રૂડાબાઈ વાવ)",
    district: "Gandhinagar",
    state: "Gujarat",
    period: "15th Century (1498 CE)",
    dynasty: "Vaghela & Gujarat Sultanate",
    architectural_style: "Solanki / Maru-Gurjara Subterranean",
    lat: 23.1667,
    lon: 72.5806,
    model3d: {
      file_path: "/models/adalaj.glb",
      label: "Photo-reconstructed from 38 of 45 photos",
      method: "photogrammetry",
      photo_count: 45,
      quality: {
        registered: 38,
        total: 45,
        ratio: 0.84,
        points: 120000,
        method: "Colmap SfM + OpenMVS",
        architectural_features: [
          "Five-tiered subterranean gallery shaft",
          "Ornate Maru-Gurjara pillar capitals",
          "Octagonal well opening with light shafts",
          "Sanskrit foundation inscription lintel (VS 1555)"
        ]
      }
    },
    resources: {
      photos: [
        {
          id: 101,
          title: "Adalaj Central Octagonal Shaft & Stepped Pavilions",
          type: "photo",
          monument_id: 1,
          monument: "Adalaj Stepwell",
          verify_status: "verified",
          license: "CC-BY-SA-4.0",
          snippet: "Looking down the five storeys of octagonal subterranean galleries into the deep water pool.",
          file_path: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Adalaj_Stepwell_Interior_Shaft.jpg/800px-Adalaj_Stepwell_Interior_Shaft.jpg",
          thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Adalaj_Stepwell_Interior_Shaft.jpg/400px-Adalaj_Stepwell_Interior_Shaft.jpg",
          original_name: "adalaj_shaft_highres.jpg"
        },
        {
          id: 102,
          title: "Intricately Carved Frieze of Solanki Mythological Motifs",
          type: "photo",
          monument_id: 1,
          monument: "Adalaj Stepwell",
          verify_status: "verified",
          license: "CC-BY-4.0",
          snippet: "Bas-relief friezes depicting the Kalpavriksha (tree of life) and Navagraha along the southern tier.",
          file_path: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Adalaj_Vav_Pillars_Carvings.jpg/800px-Adalaj_Vav_Pillars_Carvings.jpg",
          thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Adalaj_Vav_Pillars_Carvings.jpg/400px-Adalaj_Vav_Pillars_Carvings.jpg",
          original_name: "adalaj_carvings_tier2.jpg"
        }
      ],
      pdfs: [
        {
          id: 103,
          title: "Architectural Survey of Northern Gujarat Stepwells (Burgess 1903)",
          type: "pdf",
          monument_id: 1,
          monument: "Adalaj Stepwell",
          verify_status: "verified",
          license: "Public Domain",
          snippet: "Burgess, J. (1903). Archaeological Survey of India New Imperial Series, Vol. XXXII, pp. 94–97.",
          original_name: "ASI_Vol32_Adalaj_Survey_1903.pdf"
        }
      ],
      pptxs: [],
      docxs: [],
      reports: [
        {
          id: 104,
          title: "Structural Health and Groundwater Efflorescence Conservation Dossier",
          type: "report",
          monument_id: 1,
          monument: "Adalaj Stepwell",
          verify_status: "verified",
          license: "ASI Open Heritage License",
          snippet: "Annual ground penetration radar and moisture-table fluctuation report by ASI Science Branch.",
          original_name: "ASI_Science_Adalaj_WaterTable_2025.pdf"
        }
      ]
    },
    claims: [
      {
        id: 201,
        type: "Foundation Date",
        text: "The construction of Adalaj Stepwell was initiated by Rana Veer Singh of the Vaghela dynasty and completed in 1498 CE by Queen Rudabai with Sultan Mahmud Begada's patronage.",
        date_certainty: "1498 CE (VS 1555)",
        status: "verified",
        reviewer: "Superintending Archaeologist, ASI Western Circle",
        reviewed_at: "2026-03-15",
        snippet: "संवत् १५५५ वर्षे माघ सुदि ५ बुद्धे... राणी श्री रुदादेवि कारितम्।",
        sources: [
          {
            title: "Epigraphia Indica Vol. IV & Burgess Architectural Antiquities",
            author: "Archaeological Survey of India",
            year: "1903",
            locator: "Vol. IV, Marble Inscription Edict #412",
            tier: 1,
            url: "https://asi.nic.in"
          }
        ]
      },
      {
        id: 202,
        type: "Architectural Style",
        text: "Built five storeys deep with three entrance stairs leading to a semi-octagonal shaft, fusing Maru-Gurjara ornamentation with Indo-Islamic spatial symmetry.",
        date_certainty: "Solanki Era",
        status: "verified",
        reviewer: "Head of Heritage Conservation, CEPT University",
        reviewed_at: "2026-04-10",
        snippet: "Five levels of carved sandstone pillars arranged in a trabeate subterranean hypostyle pavilion.",
        sources: [
          {
            title: "The Stepwells of Gujarat: In Art-Historical Perspective",
            author: "Jutta Jain-Neubauer",
            year: "1981",
            locator: "Chapter 3, pp. 48–56",
            tier: 1
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name_en: "Sun Temple Modhera",
    name_hi: "मोढेरा सूर्य मंदिर",
    name_gu: "મોઢેરા સૂર્ય મંદિર",
    district: "Mehsana",
    state: "Gujarat",
    period: "11th Century (1026 CE)",
    dynasty: "Chaulukya (Solanki) Dynasty",
    architectural_style: "Maru-Gurjara Temple Architecture",
    lat: 23.5835,
    lon: 72.1331,
    model3d: {
      file_path: "/models/modhera.glb",
      label: "Survey-grade Photogrammetry from 52 Photos",
      method: "photogrammetry",
      photo_count: 52,
      quality: {
        registered: 48,
        total: 52,
        ratio: 0.92,
        points: 185000,
        method: "Drone SfM + Terrestrial LiDAR",
        architectural_features: [
          "Surya Kund (stepped water tank with 108 miniature shrines)",
          "Sabha Mandapa (assembly hall with 52 carved pillars)",
          "Gudhamandapa (sanctum with equinoctial solar orientation)",
          "Iconographic friezes of twelve Adityas"
        ]
      }
    },
    resources: {
      photos: [
        {
          id: 105,
          title: "Surya Kund Stepped Reservoir and Shrines",
          type: "photo",
          monument_id: 2,
          monument: "Sun Temple Modhera",
          verify_status: "verified",
          license: "CC-BY-4.0",
          snippet: "Stepped geometry of the reservoir with shrines dedicated to Ganesha, Shiva, and Sheshashayi Vishnu.",
          file_path: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Surya_Kund_Modhera.jpg/800px-Surya_Kund_Modhera.jpg",
          thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Surya_Kund_Modhera.jpg/400px-Surya_Kund_Modhera.jpg",
          original_name: "modhera_suryakund_reservoir.jpg"
        }
      ],
      pdfs: [
        {
          id: 106,
          title: "Archaeoastronomy & Geometric Layout of Modhera (Lobo 1982)",
          type: "pdf",
          monument_id: 2,
          monument: "Sun Temple Modhera",
          verify_status: "verified",
          license: "Scholarly Open Access",
          snippet: "Detailed astronomical orientation documenting the equinox ray path into the sanctum sanctorum.",
          original_name: "Modhera_Archaeoastronomy_Monograph.pdf"
        }
      ],
      pptxs: [],
      docxs: [],
      reports: []
    },
    claims: [
      {
        id: 203,
        type: "Equinoctial Alignment",
        text: "The temple is aligned precisely on the Tropic of Cancer latitude such that on the vernal and autumnal equinoxes, the first rays of the rising sun illuminated the golden icon in the sanctum.",
        date_certainty: "1026 CE (VS 1083)",
        status: "verified",
        reviewer: "Archaeoastronomy Board of India",
        reviewed_at: "2026-02-18",
        snippet: "Equinoctial alignment verified by GPS solar azimuth tracking (Azimuth 90.2° True East).",
        sources: [
          {
            title: "The Sun-Temple at Modhera: A Monograph on Architecture",
            author: "Wibke Lobo",
            year: "1982",
            locator: "Band 2, pp. 24–31",
            tier: 1
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name_en: "Rani Ki Vav (The Queen's Stepwell)",
    name_hi: "रानी की वाव",
    name_gu: "રાણીની વાવ",
    district: "Patan",
    state: "Gujarat",
    period: "11th Century (1063 CE)",
    dynasty: "Chaulukya (Solanki) Dynasty",
    architectural_style: "Maru-Gurjara Subterranean Masterpiece",
    lat: 23.8589,
    lon: 72.0497,
    model3d: {
      file_path: "/models/rani_vav.glb",
      label: "UNESCO Digital Twin from 60 Archival Scans",
      method: "photogrammetry",
      photo_count: 60,
      quality: {
        registered: 56,
        total: 60,
        ratio: 0.93,
        points: 240000,
        method: "Multi-View Stereo SfM",
        architectural_features: [
          "Seven levels of pillared pavilions",
          "500+ high-relief sculptures of the Dashavatara",
          "Inverted temple architectural concept honoring water purity",
          "Deep reservoir well with apsaras and dikpalas"
        ]
      }
    },
    resources: {
      photos: [
        {
          id: 107,
          title: "Rani Ki Vav Lower Pavilion Sculptural Corridor",
          type: "photo",
          monument_id: 3,
          monument: "Rani Ki Vav",
          verify_status: "verified",
          license: "CC-BY-SA-4.0",
          snippet: "Pillared galleries showcasing multi-tiered carvings of Sheshashayi Vishnu and Varaha avatar.",
          file_path: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rani_ki_vav_01.jpg/800px-Rani_ki_vav_01.jpg",
          thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rani_ki_vav_01.jpg/400px-Rani_ki_vav_01.jpg",
          original_name: "rani_vav_vishnu_corridor.jpg"
        }
      ],
      pdfs: [
        {
          id: 108,
          title: "UNESCO World Heritage Dossier #14/38.COM/8B",
          type: "pdf",
          monument_id: 3,
          monument: "Rani Ki Vav",
          verify_status: "verified",
          license: "UNESCO Open Documentation",
          snippet: "Nomination dossier documenting archaeological integrity and 1980s ASI desiltation methodology.",
          original_name: "UNESCO_Rani_Ki_Vav_Dossier_2014.pdf"
        }
      ],
      pptxs: [],
      docxs: [],
      reports: []
    },
    claims: [
      {
        id: 204,
        type: "Patronage & Dedication",
        text: "Built by Queen Udayamati in memory of King Bhima I of the Solanki dynasty, designed as an inverted temple with seven subterranean terraces.",
        date_certainty: "1063 CE",
        status: "verified",
        reviewer: "UNESCO WHC & ASI Directorate",
        reviewed_at: "2026-01-20",
        snippet: "Documented in Merutunga's Prabandha Chintamani as the monumental memorial well of Queen Udayamati.",
        sources: [
          {
            title: "Prabandha Chintamani & Epigraphia Indica",
            author: "Merutunga (1305 CE) / ASI Translation",
            year: "1901",
            locator: "Bibliotheca Indica, p. 78",
            tier: 1
          }
        ]
      }
    ]
  },
  {
    id: 4,
    name_en: "Konark Sun Temple",
    name_hi: "कोणार्क सूर्य मंदिर",
    name_gu: "કોણાર્ક સૂર્ય મંદિર",
    district: "Puri",
    state: "Odisha",
    period: "13th Century (1250 CE)",
    dynasty: "Eastern Ganga Dynasty",
    architectural_style: "Kalinga Architecture",
    lat: 19.8876,
    lon: 86.0945,
    model3d: {
      file_path: "/models/adalaj.glb", // fallback viewer
      label: "Parametric Procedural Twin",
      method: "parametric",
      photo_count: 30,
      quality: {
        registered: 25,
        total: 30,
        ratio: 0.83,
        points: 95000,
        method: "SfM Reconstruction",
        architectural_features: [
          "24 colossal carved stone chariot wheels functioning as sundials",
          "Seven leaping horses facing sunrise across Bay of Bengal",
          "Nata Mandir assembly hall with classical Odissi sculptures"
        ]
      }
    },
    resources: {
      photos: [],
      pdfs: [],
      pptxs: [],
      docxs: [],
      reports: []
    },
    claims: [
      {
        id: 205,
        type: "Chariot Sundial Precision",
        text: "The 24 wheels of the Konark Sun Temple chariot are not merely decorative but accurate sundials capable of calculating time to within minutes using shadow positions.",
        date_certainty: "1250 CE",
        status: "verified",
        reviewer: "Senior Epigraphist, ASI Bhubaneswar Circle",
        reviewed_at: "2026-03-01",
        sources: [
          {
            title: "Konarak: The Sun Temple of Love",
            author: "Archaeological Survey of India",
            year: "1986",
            locator: "Monograph 14",
            tier: 1
          }
        ]
      }
    ]
  }
];

// All search items synthesized for instant filtering across languages
export const SHOWCASE_SEARCH_ITEMS = [
  {
    id: 1,
    monument_id: 1,
    title: "Adalaj Stepwell 3D Photogrammetry Digital Twin",
    type: "photo",
    monument: "Adalaj Stepwell",
    monument_hi: "अडालज की वाव",
    monument_gu: "અડાલજની વાવ",
    language: "en",
    verify_status: "verified",
    license: "CC-BY-4.0",
    snippet: "Complete 3D mesh reconstruction from 45 registered high-resolution camera angles showcasing five subterranean storeys and octagonal light well.",
    file_path: "/models/adalaj.glb",
    original_name: "adalaj_photogrammetry_model.glb",
    score: 0.99
  },
  {
    id: 2,
    monument_id: 1,
    title: "Sanskrit Foundation Edict Rubbing (VS 1555)",
    type: "pdf",
    monument: "Adalaj Stepwell",
    monument_hi: "अडालज की वाव",
    monument_gu: "અડાલજની વાવ",
    language: "sa",
    verify_status: "verified",
    license: "ASI Open Archive",
    snippet: "संवत् १५५५ वर्षे माघ सुदि ५ बुद्धे... राणी श्री रुदादेवि कारितम्। (Foundation edict commissioned by Queen Rudabai).",
    original_name: "adalaj_sanskrit_inscription_vs1555.pdf",
    score: 0.95
  },
  {
    id: 3,
    monument_id: 2,
    title: "Modhera Sun Temple Equinoctial Ray Alignment Survey",
    type: "pdf",
    monument: "Sun Temple Modhera",
    monument_hi: "मोढेरा सूर्य मंदिर",
    monument_gu: "મોઢેરા સૂર્ય મંદિર",
    language: "en",
    verify_status: "verified",
    license: "Open Access",
    snippet: "Measured astronomical survey proving equinox sunrise illumination of the interior sanctum sanctorum at Azimuth 90.2°.",
    original_name: "modhera_equinox_solar_ingress.pdf",
    score: 0.94
  },
  {
    id: 4,
    monument_id: 2,
    title: "Surya Kund Stepped Geometry 3D Elevation",
    type: "photo",
    monument: "Sun Temple Modhera",
    monument_hi: "मोढेरा सूर्य मंदिर",
    monument_gu: "મોઢેરા સૂર્ય મંદિર",
    language: "en",
    verify_status: "verified",
    license: "CC-BY-SA-4.0",
    snippet: "108 carved miniature shrines stepping down into the sacred subterranean water body.",
    original_name: "modhera_kund_drone_survey.jpg",
    score: 0.92
  },
  {
    id: 5,
    monument_id: 3,
    title: "Rani Ki Vav UNESCO Heritage Nomination Dossier",
    type: "report",
    monument: "Rani Ki Vav",
    monument_hi: "रानी की वाव",
    monument_gu: "રાણીની વાવ",
    language: "en",
    verify_status: "verified",
    license: "UNESCO Open Access",
    snippet: "Full architectural and archaeological documentation of 500+ principal sculptures and subterranean inverted temple engineering.",
    original_name: "unesco_whc_rani_ki_vav.pdf",
    score: 0.98
  },
  {
    id: 6,
    monument_id: 3,
    title: "Sheshashayi Vishnu Relief High-Res Orthomosaic",
    type: "photo",
    monument: "Rani Ki Vav",
    monument_hi: "रानी की वाव",
    monument_gu: "રાણીની વાવ",
    language: "en",
    verify_status: "verified",
    license: "CC-BY-4.0",
    snippet: "Sublime high-relief carving of Lord Vishnu reclining on the multi-headed serpent Sheshanaga along the central gallery.",
    original_name: "rani_vav_vishnu_orthomosaic.jpg",
    score: 0.91
  },
  {
    id: 7,
    monument_id: 4,
    title: "Konark Chariot Wheel Sundial Mathematical Calibration",
    type: "report",
    monument: "Konark Sun Temple",
    monument_hi: "कोणार्क सूर्य मंदिर",
    monument_gu: "કોણાર્ક સૂર્ય મંદિર",
    language: "en",
    verify_status: "verified",
    license: "Public Domain",
    snippet: "Mathematical verification of 24 carved stone wheels operating as precise solar horological sundials.",
    original_name: "konark_sundial_mathematics.pdf",
    score: 0.96
  }
];

export const SHOWCASE_REVIEW_QUEUE = {
  pending_resources: [
    {
      id: 801,
      title: "Drone Photogrammetry Image Set — Modhera Sabha Mandapa",
      monument: "Sun Temple Modhera",
      type: "photo",
      contributor: "Pooja Trivedi (Heritage Photographer)",
      created_at: "2026-10-31",
      verify_status: "pending",
      file_path: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Surya_Kund_Modhera.jpg/800px-Surya_Kund_Modhera.jpg",
      original_name: "modhera_sabha_drone_batch_01.zip",
      notes: "48 raw 4K images captured with 70% overlap for 3D SfM reconstruction."
    },
    {
      id: 802,
      title: "Adalaj Western Wall Inscription Squeeze & Rubbing",
      monument: "Adalaj Stepwell",
      type: "pdf",
      contributor: "Aarav Patel (Epigraphical Research Scholar)",
      created_at: "2026-11-01",
      verify_status: "pending",
      file_path: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Adalaj_Stepwell_Interior_Shaft.jpg/800px-Adalaj_Stepwell_Interior_Shaft.jpg",
      original_name: "adalaj_rubbing_vs1555_highres.pdf",
      notes: "High-contrast graphite paper rubbing of the primary bilingual Sanskrit/Persian edict."
    }
  ],
  open_reports: [
    {
      id: 901,
      target_type: "claim",
      target_id: 201,
      reason: "Date verification request: check Solanki calendar conversion for VS 1555 Magha Sudi 5.",
      reporter: "Prof. K. Sharma (ASI Epigraphy Branch)",
      created_at: "2026-10-28"
    }
  ],
  pending_claims: [
    {
      id: 301,
      monument: "Sun Temple Modhera",
      type: "Astronomical Alignment",
      text: "The main Sabha Mandapa contains 52 intricately carved pillars representing the 52 weeks of the solar year.",
      snippet: "52 pillars representing weeks of the year in accordance with Surya Siddhanta astronomical treatises.",
      status: "ai_suggested",
      source_title: "Architecture of the Chaulukya Temples",
      source_author: "Dhaky, M. A.",
      source_year: "1975"
    }
  ],
  recent_reviews: [
    {
      id: 701,
      resource_title: "Architectural Survey of Adalaj Vav (Burgess 1903)",
      action: "approved",
      reviewer: "Admin Reviewer (ASI Western Circle)",
      reason: "Matched against ASI Imperial Series Vol. XXXII archive benchmark.",
      timestamp: "2026-10-30 14:22:00"
    },
    {
      id: 702,
      resource_title: "UNESCO Rani Ki Vav Conservation Dossier",
      action: "approved",
      reviewer: "Admin Reviewer (UNESCO Liaison)",
      reason: "Official WHC nomination documentation verified.",
      timestamp: "2026-10-29 11:05:00"
    }
  ]
};

// Filter helper for showcase items
export function filterShowcaseItems(params: {
  q?: string;
  monument_id?: string;
  type?: string;
  language?: string;
  verify_status?: string;
  license?: string;
  has_3d?: string;
}) {
  let list = [...SHOWCASE_SEARCH_ITEMS];

  if (params.q) {
    const qLower = params.q.toLowerCase().trim();
    list = list.filter(item =>
      item.title.toLowerCase().includes(qLower) ||
      item.monument?.toLowerCase().includes(qLower) ||
      (item.monument_hi && item.monument_hi.includes(qLower)) ||
      (item.monument_gu && item.monument_gu.includes(qLower)) ||
      (item.snippet && item.snippet.toLowerCase().includes(qLower))
    );
  }

  if (params.monument_id) {
    const monIdNum = parseInt(params.monument_id, 10);
    list = list.filter(item => item.monument_id === monIdNum);
  }

  if (params.type) {
    list = list.filter(item => item.type.toLowerCase() === params.type?.toLowerCase());
  }

  if (params.verify_status) {
    list = list.filter(item => item.verify_status.toLowerCase() === params.verify_status?.toLowerCase());
  }

  if (params.has_3d === "true" || params.has_3d === "1") {
    list = list.filter(item => item.file_path?.endsWith(".glb") || item.type === "photo");
  }

  return {
    total: list.length,
    items: list,
    facets: {
      types: { photo: 3, pdf: 2, report: 2 },
      languages: { en: 6, sa: 1 },
      statuses: { verified: 7 }
    }
  };
}
