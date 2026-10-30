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

-- Accounts and comments. The worker creates (and upgrades) both on first use, so this is documentation.
-- An account is automatic: one per browser (vid), shown as "Anonymous 4821" until renamed.
CREATE TABLE IF NOT EXISTS users (
  vid     TEXT PRIMARY KEY,          -- anonymous visitor id (same as events.vid); never sent to other viewers
  num     INTEGER NOT NULL,          -- random 4-digit number in the default name
  name    TEXT NOT NULL,             -- display name on comments, 2-24 characters
  ts      INTEGER NOT NULL           -- created, ms
);
-- Public comment threads per reel, tagged with the moment in the video; one level of replies.
CREATE TABLE IF NOT EXISTS comments (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  ts      INTEGER NOT NULL,          -- server time, ms
  vid     TEXT NOT NULL,             -- anonymous visitor id (same as events.vid)
  sid     TEXT,                      -- session id
  reel    TEXT NOT NULL,             -- e.g. "cd-q03"
  subject TEXT,
  t       REAL,                      -- video position the comment is about, seconds
  text    TEXT NOT NULL,             -- the comment, up to 500 characters
  country TEXT, city TEXT, device TEXT, os TEXT, browser TEXT, screen TEXT, model TEXT, net TEXT,
  parent  INTEGER,                   -- top-level comment this replies to (replies take its t)
  hidden  INTEGER NOT NULL DEFAULT 0 -- 1 = private feedback from the first version, shown only on stats.html
);
CREATE INDEX IF NOT EXISTS cm_ts ON comments(ts);
CREATE INDEX IF NOT EXISTS cm_reel ON comments(reel, hidden);
