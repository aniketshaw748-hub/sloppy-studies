// Sloppy Studies worker (Pages advanced mode):
//  - serves the static site, answering byte-range requests for video/audio (iOS needs 206 Partial Content);
//  - POST /e         : first-party analytics intake (anonymous batched events -> D1, env.DB);
//  - GET  /api/stats : aggregated insights for the private dashboard (stats.html), needs ?key=<STATS_KEY secret>.
const TYPES = new Set(["visit", "home", "subject", "reel_view", "watch", "progress", "complete", "speed", "music", "sfx", "sound_on",
  "sound_off", "like", "unlike", "save", "unsave", "share", "answer_open", "answer_close", "scrub", "hint_shown", "hint_click",
  "pause", "resume", "next", "back_home", "tab", "github"]);

function uaInfo(ua) {
  ua = ua || "";
  const device = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android|iPhone/i.test(ua) ? "mobile" : "desktop";
  const os = /Android/i.test(ua) ? "Android" : /iPhone|iPad|iPod/i.test(ua) ? "iOS" : /Windows/i.test(ua) ? "Windows" : /Mac OS X/i.test(ua) ? "macOS" : /Linux/i.test(ua) ? "Linux" : "other";
  const browser = /SamsungBrowser/i.test(ua) ? "Samsung" : /Edg\//i.test(ua) ? "Edge" : /OPR\//i.test(ua) ? "Opera" : /Firefox/i.test(ua) ? "Firefox" : /CriOS|Chrome/i.test(ua) ? "Chrome" : /Safari/i.test(ua) ? "Safari" : "other";
  return { device, os, browser };
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
  const stmt = env.DB.prepare(`INSERT INTO events (ts,vid,sid,type,reel,subject,val,val2,extra,country,city,device,os,browser,ref,screen)
    VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16)`);
  const rows = [];
  for (const e of evs) {
    if (!e || !TYPES.has(e.t)) continue;
    const ago = Math.min(Math.max(0, num(e.ago) || 0), 600000);            // client-side delay since the event, capped
    rows.push(stmt.bind(now - ago, clip(body.vid, 40), clip(body.sid, 40), e.t, clip(e.r, 20), clip(e.s, 8), num(e.v), num(e.v2),
      clip(e.x, 200), clip(cf.country, 4), clip(cf.city, 60), u.device, u.os, u.browser, clip(body.ref, 120), clip(body.scr, 20)));
  }
  if (rows.length) await env.DB.batch(rows);
  return new Response(null, { status: 204 });
}

async function stats(url, env) {
  if (!env.STATS_KEY || url.searchParams.get("key") !== env.STATS_KEY) return new Response("forbidden", { status: 403 });
  const days = Math.min(365, Math.max(1, parseInt(url.searchParams.get("days") || "30", 10)));
  const since = Date.now() - days * 86400000;
  const q = (sql, ...a) => env.DB.prepare(sql).bind(since, ...a).all().then(r => r.results);
  const [totals, reels, speeds, devices, oss, browsers, countries, cities, subjects, daily, refs, hours, depth, sliders] = await Promise.all([
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
  ]);
  return Response.json({ days, generated: Date.now(), totals: totals[0], reels, speeds, devices, oss, browsers, countries, cities, subjects, daily, refs, hours, depth, sliders },
    { headers: { "Cache-Control": "no-store" } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/e" && request.method === "POST") return intake(request, env);
    if (url.pathname === "/api/stats") return stats(url, env);
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
