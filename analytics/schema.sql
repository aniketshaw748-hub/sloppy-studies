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
  country TEXT, city TEXT, device TEXT, os TEXT, browser TEXT, ref TEXT, screen TEXT,
  model   TEXT,                      -- phone model when the browser shares it, e.g. "Redmi Note 12"
  net     TEXT                       -- mobile network / ISP, e.g. "Reliance Jio Infocomm Limited"
);
CREATE INDEX IF NOT EXISTS ev_type_ts ON events(type, ts);
CREATE INDEX IF NOT EXISTS ev_reel ON events(reel, type);
CREATE INDEX IF NOT EXISTS ev_vid ON events(vid);
CREATE INDEX IF NOT EXISTS ev_ts ON events(ts);

-- Feedback comments from the reel player (private inbox on stats.html). The worker also creates this on first use.
CREATE TABLE IF NOT EXISTS comments (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  ts      INTEGER NOT NULL,          -- server time, ms
  vid     TEXT NOT NULL,             -- anonymous visitor id (same as events.vid)
  sid     TEXT,                      -- session id
  reel    TEXT NOT NULL,             -- e.g. "cd-q03"
  subject TEXT,
  t       REAL,                      -- video position the comment is about, seconds
  text    TEXT NOT NULL,             -- the feedback, up to 1000 characters
  country TEXT, city TEXT, device TEXT, os TEXT, browser TEXT, screen TEXT, model TEXT, net TEXT
);
CREATE INDEX IF NOT EXISTS cm_ts ON comments(ts);
