// Sloppy Studies worker (Pages advanced mode):
//  - serves the static site, answering byte-range requests for video/audio (iOS needs 206 Partial Content);
//  - POST /e         : first-party analytics intake (anonymous batched events -> D1, env.DB);
//  - POST /api/me, /api/comments, /api/comment, /api/comment/delete; GET /api/comment-counts : anonymous accounts and
//    public, video-timestamped comment threads per reel (moderated from stats.html);
//  - GET  /api/stats : aggregated insights for the private dashboard (stats.html), needs ?key=<STATS_KEY secret>.
const TYPES = new Set(["visit", "home", "subject", "reel_view", "watch", "progress", "complete", "speed", "music", "sfx", "sound_on",
  "sound_off", "like", "unlike", "save", "unsave", "share", "answer_open", "answer_close", "scrub", "hint_shown", "hint_click",
  "pause", "resume", "next", "back_home", "tab", "github"]);

function uaInfo(ua) {
  ua = ua || "";
  const device = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android|iPhone/i.test(ua) ? "mobile" : "desktop";
  const os = /Android/i.test(ua) ? "Android" : /iPhone|iPad|iPod/i.test(ua) ? "iOS" : /Windows/i.test(ua) ? "Windows" : /Mac OS X/i.test(ua) ? "macOS" : /Linux/i.test(ua) ? "Linux" : "other";
  const browser = /SamsungBrowser/i.test(ua) ? "Samsung" : /Edg\//i.test(ua) ? "Edge" : /OPR\//i.test(ua) ? "Opera" : /Firefox/i.test(ua) ? "Firefox" : /CriOS|Chrome/i.test(ua) ? "Chrome" : /Safari/i.test(ua) ? "Safari" : "other";
  // phone model: Chrome hides it in the UA ("Android 10; K") but sends it when asked (body.mdl); older UAs still carry it
  const m = /Android [\d.]+;(?: [a-z]{2}[-_][a-z]{2};)? ([^;)]+?)(?: Build[^;)]*)?\)/i.exec(ua);
  const model = /iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) ? "iPad" : m && m[1] !== "K" ? m[1].trim() : null;
  return { device, os, browser, model };
}
const clip = (s, n) => (s == null ? null : String(s).slice(0, n));
const num = v => (typeof v === "number" && isFinite(v) ? v : null);

async function intake(request, env) {
  if (!env.DB) return new Response(null, { status: 204 });
  let body; try { body = await request.json(); } catch { return new Response("bad json", { status: 400 }); }
  const evs = Array.isArray(body.e) ? body.e.slice(0, 60) : [];
  if (!evs.length || !body.vid || !body.sid) return new Response(null, { status: 204 });
  const cf = request.cf || {}, u = uaInfo(request.headers.get("User-Agent"));
  const now = Date.now();
  const model = clip(body.mdl, 40) || u.model, net = clip(cf.asOrganization, 60);   // net = mobile network / ISP, e.g. Reliance Jio
  const stmt = env.DB.prepare(`INSERT INTO events (ts,vid,sid,type,reel,subject,val,val2,extra,country,city,device,os,browser,ref,screen,model,net)
    VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18)`);
  const rows = [];
  for (const e of evs) {
    if (!e || !TYPES.has(e.t)) continue;
    const ago = Math.min(Math.max(0, num(e.ago) || 0), 600000);            // client-side delay since the event, capped
    rows.push(stmt.bind(now - ago, clip(body.vid, 40), clip(body.sid, 40), e.t, clip(e.r, 20), clip(e.s, 8), num(e.v), num(e.v2),
      clip(e.x, 200), clip(cf.country, 4), clip(cf.city, 60), u.device, u.os, u.browser, clip(body.ref, 120), clip(body.scr, 20), model, net));
  }
  if (rows.length) await env.DB.batch(rows);
  return new Response(null, { status: 204 });
}

// accounts + comments: tables are created (and upgraded) on first use, same definitions as analytics/schema.sql,
// so a deploy needs no migration step. An account is the browser's anonymous visitor id (vid, never sent back out)
// with a display name; comments are public per reel, tagged with the video time, with one level of replies.
let cmtReady = null;
const ensureComments = env => cmtReady ||= (async () => {
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (vid TEXT PRIMARY KEY, num INTEGER NOT NULL, name TEXT NOT NULL, ts INTEGER NOT NULL)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, vid TEXT NOT NULL, sid TEXT,
      reel TEXT NOT NULL, subject TEXT, t REAL, text TEXT NOT NULL, country TEXT, city TEXT, device TEXT, os TEXT, browser TEXT, screen TEXT, model TEXT, net TEXT,
      parent INTEGER, hidden INTEGER NOT NULL DEFAULT 0)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS cm_ts ON comments(ts)`),
  ]);
  // the first version's table was a private feedback inbox: add the new columns and keep those rows out of public view
  const cols = (await env.DB.prepare(`PRAGMA table_info(comments)`).all()).results.map(c => c.name);
  if (!cols.includes("hidden")) await env.DB.batch([
    env.DB.prepare(`ALTER TABLE comments ADD COLUMN parent INTEGER`),
    env.DB.prepare(`ALTER TABLE comments ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0`),
    env.DB.prepare(`UPDATE comments SET hidden=1`),
  ]);
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS cm_reel ON comments(reel, hidden)`).run();
})().catch(e => { cmtReady = null; throw e; });

const readBody = async request => {
  if (+request.headers.get("Content-Length") > 8000) return null;
  try { const b = await request.json(); return b && typeof b.vid === "string" && b.vid ? b : null; } catch { return null; }
};
// display names: 2-24 characters, no impersonating the site or its author
const cleanName = n => {
  n = typeof n === "string" ? n.replace(/\s+/g, " ").trim() : "";
  return n.length >= 2 && n.length <= 24 && !/aniket|sloppy\s*studies|admin|moderator/i.test(n) ? n : null;
};
async function account(env, vid) {
  const num = 1000 + Math.floor(Math.random() * 9000);
  await env.DB.prepare(`INSERT OR IGNORE INTO users (vid,num,name,ts) VALUES (?1,?2,?3,?4)`).bind(vid, num, "Anonymous " + num, Date.now()).run();
  return env.DB.prepare(`SELECT num, name FROM users WHERE vid=?1`).bind(vid).first();
}

// POST /api/me {vid[, name]} : the visitor's account (made on first visit); with name, renames it
async function me(request, env) {
  const b = await readBody(request); if (!b) return new Response("bad request", { status: 400 });
  await ensureComments(env);
  const vid = clip(b.vid, 40), u = await account(env, vid);
  if (b.name === undefined) return Response.json(u);
  const name = cleanName(b.name); if (!name) return new Response("bad name", { status: 400 });
  await env.DB.prepare(`UPDATE users SET name=?2 WHERE vid=?1`).bind(vid, name).run();
  return Response.json({ num: u.num, name });
}

const CM_COLS = `c.id, c.ts, c.t, c.text, c.parent, COALESCE(u.name, 'Anonymous') name, u.num, c.vid=?2 mine`;
// POST /api/comments {vid, r} : the public thread of one reel
async function thread(request, env) {
  const b = await readBody(request); if (!b || !b.r) return new Response("bad request", { status: 400 });
  await ensureComments(env);
  const { results } = await env.DB.prepare(`SELECT ${CM_COLS} FROM comments c LEFT JOIN users u ON u.vid=c.vid
    WHERE c.reel=?1 AND c.hidden=0 ORDER BY c.id LIMIT 1000`).bind(clip(b.r, 20), clip(b.vid, 40)).all();
  return Response.json(results, { headers: { "Cache-Control": "no-store" } });
}

// POST /api/comment {vid, r, s, t, text[, parent]} : post a comment or a reply; returns it
async function comment(request, env) {
  const b = await readBody(request); if (!b) return new Response("bad request", { status: 400 });
  const text = typeof b.text === "string" ? b.text.trim() : "";
  if (!b.r || text.length < 1 || text.length > 500) return new Response("bad comment", { status: 400 });
  await ensureComments(env);
  const now = Date.now(), vid = clip(b.vid, 40), reel = clip(b.r, 20);
  // abuse limits: 8 per account per 10 min, 60 per account per day, 300 per hour site-wide
  const lim = await env.DB.prepare(`SELECT SUM(vid=?1 AND ts>=?2) m10, SUM(vid=?1) day, SUM(ts>=?3) hour FROM comments WHERE ts>=?4`)
    .bind(vid, now - 600000, now - 3600000, now - 86400000).first();
  if (lim && (lim.m10 >= 8 || lim.day >= 60 || lim.hour >= 300)) return new Response("slow down", { status: 429 });
  // a reply hangs off a top-level comment of the same reel and takes its moment in the video
  let parent = null, t = Math.min(Math.max(0, num(b.t) || 0), 36000);
  if (b.parent != null) {
    const p = await env.DB.prepare(`SELECT id, parent, t FROM comments WHERE id=?1 AND reel=?2 AND hidden=0`).bind(num(b.parent), reel).first();
    if (!p) return new Response("no such comment", { status: 404 });
    const top = p.parent ? await env.DB.prepare(`SELECT id, t FROM comments WHERE id=?1`).bind(p.parent).first() : p;
    parent = top.id; t = top.t;
  }
  await account(env, vid);
  const cf = request.cf || {}, u = uaInfo(request.headers.get("User-Agent"));
  const row = await env.DB.prepare(`INSERT INTO comments (ts,vid,sid,reel,subject,t,text,country,city,device,os,browser,screen,model,net,parent)
    VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16) RETURNING id`)
    .bind(now, vid, clip(b.sid, 40), reel, clip(b.s, 8), Math.round(t * 10) / 10, text, clip(cf.country, 4), clip(cf.city, 60),
      u.device, u.os, u.browser, clip(b.scr, 20), clip(b.mdl, 40) || u.model, clip(cf.asOrganization, 60), parent).first();
  return Response.json(await env.DB.prepare(`SELECT ${CM_COLS} FROM comments c LEFT JOIN users u ON u.vid=c.vid WHERE c.id=?1`).bind(row.id, vid).first());
}

// POST /api/comment/delete {vid, id} : delete your own comment (and its replies); the owner may delete any with ?key=
async function uncomment(request, url, env) {
  const b = await readBody(request); if (!b) return new Response("bad request", { status: 400 });
  await ensureComments(env);
  const owner = env.STATS_KEY && url.searchParams.get("key") === env.STATS_KEY;
  const c = await env.DB.prepare(`SELECT id, vid FROM comments WHERE id=?1`).bind(num(b.id)).first();
  if (!c || (!owner && c.vid !== clip(b.vid, 40))) return new Response("not yours", { status: 403 });
  await env.DB.prepare(`DELETE FROM comments WHERE id=?1 OR parent=?1`).bind(c.id).run();
  return new Response(null, { status: 204 });
}

// public comment counts per reel (comments + replies); edge-cached 30 s
async function commentCounts(request, env) {
  const cache = caches.default, hit = await cache.match(request.url);
  if (hit) return hit;
  await ensureComments(env);
  const { results } = await env.DB.prepare(`SELECT reel, COUNT(*) n FROM comments WHERE hidden=0 GROUP BY reel`).all();
  const res = Response.json(Object.fromEntries(results.map(r => [r.reel, r.n])), { headers: { "Cache-Control": "public, max-age=30" } });
  await cache.put(request.url, res.clone());
  return res;
}

// public like counts: one per visitor per reel, using their latest like/unlike; edge-cached 30 s
async function likeCounts(request, env) {
  const cache = caches.default, hit = await cache.match(request.url);
  if (hit) return hit;
  const { results } = await env.DB.prepare(`SELECT reel, COUNT(*) n FROM (SELECT vid, reel, type FROM events e WHERE type IN ('like','unlike')
      AND id = (SELECT MAX(id) FROM events WHERE vid=e.vid AND reel=e.reel AND type IN ('like','unlike'))) WHERE type='like' GROUP BY reel`).all();
  const res = Response.json(Object.fromEntries(results.map(r => [r.reel, r.n])), { headers: { "Cache-Control": "public, max-age=30" } });
  await cache.put(request.url, res.clone());
  return res;
}

async function stats(url, env) {
  if (!env.STATS_KEY || url.searchParams.get("key") !== env.STATS_KEY) return new Response("forbidden", { status: 403 });
  const days = Math.min(365, Math.max(1, parseInt(url.searchParams.get("days") || "30", 10)));
  const since = Date.now() - days * 86400000;
  const q = (sql, ...a) => env.DB.prepare(sql).bind(since, ...a).all().then(r => r.results);
  await ensureComments(env);
  const [totals, reels, speeds, devices, oss, browsers, countries, cities, subjects, daily, refs, hours, depth, sliders, models, nets, comments] = await Promise.all([
    q(`SELECT COUNT(DISTINCT vid) visitors, COUNT(DISTINCT sid) sessions,
         SUM(type='reel_view') reel_views, SUM(type='complete') completes, ROUND(SUM(CASE WHEN type='watch' THEN val ELSE 0 END)/60.0,1) watch_min,
         SUM(type='like') likes, SUM(type='save') saves, SUM(type='share') shares, SUM(type='answer_open') answers,
         SUM(type='hint_click') hint_clicks, SUM(type='scrub') scrubs, SUM(type='sound_on') sound_on
       FROM events WHERE ts>=?1`),
    q(`SELECT reel, MAX(subject) subject,
         SUM(type='reel_view') views, COUNT(DISTINCT CASE WHEN type='reel_view' THEN vid END) viewers,
         ROUND(SUM(CASE WHEN type='watch' THEN val ELSE 0 END)/60.0,1) watch_min,
         SUM(type='progress' AND val=25) p25, SUM(type='progress' AND val=50) p50, SUM(type='progress' AND val=75) p75, SUM(type='complete') completes,
         SUM(type='like')-SUM(type='unlike') likes, SUM(type='save')-SUM(type='unsave') saves, SUM(type='share') shares,
         SUM(type='answer_open') answers, ROUND(AVG(CASE WHEN type='answer_close' THEN val END),1) answer_read_s,
         SUM(type='hint_shown') hints, SUM(type='hint_click') hint_clicks, SUM(type='scrub') scrubs,
         ROUND(SUM(CASE WHEN type='watch' THEN val*val2 ELSE 0 END)/NULLIF(SUM(CASE WHEN type='watch' THEN val END),0),2) avg_speed
       FROM events WHERE ts>=?1 AND reel IS NOT NULL GROUP BY reel ORDER BY views DESC`),
    q(`SELECT val2 speed, ROUND(SUM(val)/60.0,1) watch_min, COUNT(DISTINCT vid) viewers FROM events WHERE ts>=?1 AND type='watch' GROUP BY val2 ORDER BY val2`),
    q(`SELECT device k, COUNT(DISTINCT vid) n FROM events WHERE ts>=?1 GROUP BY device ORDER BY n DESC`),
    q(`SELECT os k, COUNT(DISTINCT vid) n FROM events WHERE ts>=?1 GROUP BY os ORDER BY n DESC`),
    q(`SELECT browser k, COUNT(DISTINCT vid) n FROM events WHERE ts>=?1 GROUP BY browser ORDER BY n DESC`),
    q(`SELECT country k, COUNT(DISTINCT vid) n FROM events WHERE ts>=?1 GROUP BY country ORDER BY n DESC LIMIT 15`),
    q(`SELECT city k, COUNT(DISTINCT vid) n FROM events WHERE ts>=?1 AND city IS NOT NULL GROUP BY city ORDER BY n DESC LIMIT 15`),
    q(`SELECT subject k, COUNT(*) n FROM events WHERE ts>=?1 AND type='subject' GROUP BY subject ORDER BY n DESC`),
    q(`SELECT date(ts/1000,'unixepoch','+5 hours','+30 minutes') d, COUNT(DISTINCT vid) visitors, SUM(type='reel_view') views,
         ROUND(SUM(CASE WHEN type='watch' THEN val ELSE 0 END)/60.0,1) watch_min FROM events WHERE ts>=?1 GROUP BY d ORDER BY d`),
    q(`SELECT COALESCE(NULLIF(ref,''),'direct') k, COUNT(DISTINCT vid) n FROM events WHERE ts>=?1 AND type='visit' GROUP BY k ORDER BY n DESC LIMIT 10`),
    q(`SELECT CAST(strftime('%H', ts/1000,'unixepoch','+5 hours','+30 minutes') AS INT) h, COUNT(*) n FROM events WHERE ts>=?1 AND type='reel_view' GROUP BY h ORDER BY h`),
    q(`SELECT n reels, COUNT(*) sessions FROM (SELECT sid, COUNT(DISTINCT reel) n FROM events WHERE ts>=?1 AND type='reel_view' GROUP BY sid) GROUP BY n ORDER BY n`),
    q(`SELECT type k, ROUND(AVG(val),2) avg_level, COUNT(DISTINCT vid) n FROM events WHERE ts>=?1 AND type IN ('music','sfx') GROUP BY type`),
    q(`SELECT model k, COUNT(DISTINCT vid) n FROM events WHERE ts>=?1 AND model IS NOT NULL GROUP BY model ORDER BY n DESC LIMIT 15`),
    q(`SELECT net k, COUNT(DISTINCT vid) n FROM events WHERE ts>=?1 AND net IS NOT NULL GROUP BY net ORDER BY n DESC LIMIT 10`),
    q(`SELECT c.id, c.ts, c.reel, c.subject, c.t, c.text, c.parent, c.hidden, u.name, c.device, c.os, c.browser, c.model, c.net, c.city, c.country
       FROM comments c LEFT JOIN users u ON u.vid=c.vid WHERE c.ts>=?1 ORDER BY c.ts DESC LIMIT 1000`),
  ]);
  return Response.json({ days, generated: Date.now(), totals: totals[0], reels, speeds, devices, oss, browsers, countries, cities, subjects, daily, refs, hours, depth, sliders, models, nets, comments },
    { headers: { "Cache-Control": "no-store" } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/e" && request.method === "POST") return intake(request, env);
    if (request.method === "POST" && env.DB) {
      if (url.pathname === "/api/me") return me(request, env);
      if (url.pathname === "/api/comments") return thread(request, env);
      if (url.pathname === "/api/comment") return comment(request, env);
      if (url.pathname === "/api/comment/delete") return uncomment(request, url, env);
    }
    if (url.pathname === "/api/comment-counts") return env.DB ? commentCounts(request, env) : Response.json({});
    if (url.pathname === "/api/stats") return stats(url, env);
    if (url.pathname === "/api/likes") return env.DB ? likeCounts(request, env) : Response.json({});
    const res = await env.ASSETS.fetch(request);
    const range = request.headers.get("Range");
    if (!range || !/\.(mp4|m4a)$/.test(url.pathname) || res.status !== 200) {
      if (/\.(mp4|m4a)$/.test(url.pathname)) {
        const h = new Headers(res.headers); h.set("Accept-Ranges", "bytes"); h.set("Cache-Control", "public, max-age=31536000, immutable");
        return new Response(res.body, { status: res.status, headers: h });
      }
      if (url.pathname === "/" || url.pathname.endsWith(".html") || url.pathname.endsWith(".json") || url.pathname === "/stats") {
        const h = new Headers(res.headers); h.set("Cache-Control", "no-cache");
        if (url.pathname.startsWith("/stats")) h.set("X-Robots-Tag", "noindex");
        return new Response(res.body, { status: res.status, headers: h });
      }
      return res;
    }
    const buf = await res.arrayBuffer();
    const size = buf.byteLength;
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    let start = m && m[1] ? parseInt(m[1], 10) : 0;
    let end = m && m[2] ? parseInt(m[2], 10) : size - 1;
    if (m && !m[1] && m[2]) { start = Math.max(0, size - parseInt(m[2], 10)); end = size - 1; }  // suffix range
    if (start >= size || start > end) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    end = Math.min(end, size - 1);
    const h = new Headers(res.headers);
    h.set("Content-Range", `bytes ${start}-${end}/${size}`);
    h.set("Content-Length", String(end - start + 1));
    h.set("Accept-Ranges", "bytes");
    h.set("Cache-Control", "public, max-age=31536000, immutable");
    return new Response(buf.slice(start, end + 1), { status: 206, headers: h });
  },
};
