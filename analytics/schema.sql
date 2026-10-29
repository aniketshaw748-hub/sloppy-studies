-- Sloppy Studies first-party analytics. Anonymous: a random visitor id per browser, no names or contact details.
CREATE TABLE IF NOT EXISTS events (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  ts      INTEGER NOT NULL,          -- server time, ms
  vid     TEXT NOT NULL,             -- anonymous visitor id (localStorage)
  sid     TEXT NOT NULL,             -- session id (one visit)
  type    TEXT NOT NULL,             -- event name, see analytics/README.md
  reel    TEXT,                      -- e.g. "cd-q03"
  subject TEXT,                      -- se | cd | oop | im | ai | all
  val     REAL,                      -- main number (seconds watched, position, speed, level...)
  val2    REAL,                      -- second number (playback rate, from-position, ...)
  extra   TEXT,                      -- small JSON/text detail
  country TEXT, city TEXT, device TEXT, os TEXT, browser TEXT, ref TEXT, screen TEXT
);
CREATE INDEX IF NOT EXISTS ev_type_ts ON events(type, ts);
CREATE INDEX IF NOT EXISTS ev_reel ON events(reel, type);
CREATE INDEX IF NOT EXISTS ev_vid ON events(vid);
CREATE INDEX IF NOT EXISTS ev_ts ON events(ts);
