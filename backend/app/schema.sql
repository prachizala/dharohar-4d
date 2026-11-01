PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS monuments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en TEXT NOT NULL,
  name_hi TEXT,
  name_gu TEXT,
  district TEXT,
  state TEXT,
  period TEXT,
  lat REAL, lon REAL
);

CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monument_id INTEGER REFERENCES monuments(id),
  type TEXT NOT NULL,                 -- photo|pdf|pptx|docx|report|link
  title TEXT NOT NULL,
  language TEXT DEFAULT 'en',         -- en|hi|gu|sa|other
  creator TEXT,
  license TEXT NOT NULL,
  contributor TEXT NOT NULL,
  file_path TEXT,
  original_name TEXT,
  sha256 TEXT,
  phash TEXT,
  text TEXT,                          -- extracted text
  tags TEXT,                          -- comma separated
  ai_tags TEXT,                       -- AI suggested, shown separately
  ai_summary TEXT,
  alt_text TEXT,
  publish_status TEXT DEFAULT 'pending',   -- pending|published|rejected
  verify_status TEXT DEFAULT 'ai_suggested', -- ai_suggested|sourced|verified|disputed|conjectural
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_res_sha ON resources(sha256);

CREATE TABLE IF NOT EXISTS claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monument_id INTEGER REFERENCES monuments(id),
  resource_id INTEGER REFERENCES resources(id),
  type TEXT,            -- date|builder|dynasty|dimension|style|inscription|event
  text TEXT NOT NULL,
  date_certainty TEXT,  -- exact|circa|range
  snippet TEXT,
  status TEXT DEFAULT 'ai_suggested',
  reviewer TEXT,
  reviewed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  claim_id INTEGER NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  title TEXT, author TEXT, year TEXT, url TEXT, locator TEXT,
  tier INTEGER DEFAULT 3  -- 1 official/scholarly, 2 wikipedia/wikidata, 3 other
);

CREATE TABLE IF NOT EXISTS models3d (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monument_id INTEGER NOT NULL REFERENCES monuments(id),
  method TEXT NOT NULL,   -- photogrammetry|splat|triposr|parametric|external_tool
  label TEXT NOT NULL,    -- text shown to user
  photo_count INTEGER DEFAULT 0,
  quality_json TEXT,      -- {"registered":38,"total":45,"ratio":0.84,"points":120000}
  file_path TEXT,         -- e.g. /models/adalaj.glb
  status TEXT DEFAULT 'queued',  -- queued|processing|done|failed
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  target_type TEXT, target_id INTEGER,
  action TEXT, reason TEXT, by TEXT,
  at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  target_type TEXT, target_id INTEGER,
  message TEXT, status TEXT DEFAULT 'open',
  at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE VIRTUAL TABLE IF NOT EXISTS resources_fts USING fts5(
  title, text, tags, content='', tokenize='unicode61'
);

