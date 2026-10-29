# finish.py <id> [<id> ...] : download a rendered short's package, mix its sound, make the web copy + poster,
# and refresh site/shorts.json from every finished short.
#   out/<id>/      package (render.mp4, sfx.json, spec.json, words.json) + final.mp4 (1080p master)
#   site/v/<id>.mp4, site/v/<id>.jpg   web copy (720p, under 24 MB for Cloudflare Pages) + poster
import json, os, subprocess, sys, urllib.request, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT, SITE = os.path.join(HERE, "out"), os.path.join(HERE, "site")
URLS = os.path.join(HERE, "render_urls.json")   # {id: package url}, written when uploads are requested

def run(cmd): subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

def dur(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).decode())

def fetch(i):
    d = os.path.join(OUT, i); os.makedirs(d, exist_ok=True)
    if not os.path.exists(os.path.join(d, "render.mp4")):
        url = json.load(open(URLS))[i]; z = os.path.join(d, "pkg.zip")
        urllib.request.urlretrieve(url, z); zipfile.ZipFile(z).extractall(d); os.remove(z)
    return d

def web(i, d):
    os.makedirs(os.path.join(SITE, "v"), exist_ok=True)
    src = os.path.join(d, "voice.mp4"); t = dur(src)          # site video carries the voice only; music and SFX are separate tracks
    vbr = int(min(2200, (23.0 * 8 * 1024) / t - 160))       # kbit/s so the file stays under ~24 MB
    run(["ffmpeg", "-y", "-v", "error", "-i", src, "-vf", "scale=720:1280:flags=lanczos", "-c:v", "libx264", "-preset", "slow",
         "-b:v", f"{vbr}k", "-maxrate", f"{int(vbr * 1.4)}k", "-bufsize", f"{vbr * 2}k", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", os.path.join(SITE, "v", f"{i}.mp4")])
    for stem in ("music", "sfx"):   # separate tracks, one slider each on the site
        run(["ffmpeg", "-y", "-v", "error", "-i", os.path.join(d, f"{stem}.m4a"), "-c", "copy", os.path.join(SITE, "v", f"{i}.{stem}.m4a")])
    run(["ffmpeg", "-y", "-v", "error", "-ss", "1.2", "-i", src, "-frames:v", "1", "-vf", "scale=720:1280", "-q:v", "4", os.path.join(SITE, "v", f"{i}.jpg")])

def hint_at(sid):
    """when to show 'Scroll for the next question': as the answer sheet starts ("so in your exam, write this"),
    else 15 s before the end"""
    d = os.path.join(OUT, sid); wf = os.path.join(d, "words.json"); vf = os.path.join(d, "voice.mp4")
    if not os.path.exists(vf): vf = os.path.join(SITE, "v", sid + ".mp4")     # a contributed reel has only its web copy
    try: T = dur(vf) if os.path.exists(vf) else 0
    except Exception: T = 0          # file still being written
    if os.path.exists(wf):
        import re
        w = json.load(open(wf, encoding="utf-8")); n = [re.sub(r"[^a-z]", "", x["w"].lower()) for x in w]
        for i in range(len(n) - 2):
            if n[i] == "in" and n[i + 1] == "your" and n[i + 2] in ("exam", "exams"):
                j = i - 1 if i > 0 and n[i - 1] == "so" else i
                if not T or w[j]["t0"] > T * 0.4: return round(w[j]["t0"], 2)
    return round(max(0, T - 15), 2)

def ver(rel):
    """version tag from the file's size+mtime, so a replaced file gets a new URL (phones can't serve a stale cached copy)"""
    import hashlib
    f = os.path.join(SITE, rel); st = os.stat(f)
    return rel + "?v=" + hashlib.md5(f"{st.st_size}-{int(st.st_mtime)}".encode()).hexdigest()[:8]

def manifest():
    qs = json.load(open(os.path.join(HERE, "questions.json"), encoding="utf-8"))
    order = {k: n for n, k in enumerate(qs)}; items = []      # subjects in questions.json order
    for i in sorted(os.listdir(os.path.join(SITE, "v"))):
        if not i.endswith(".mp4"): continue
        sid = i[:-4]; subj, q = sid.split("-q"); q = int(q)
        mf = os.path.join(HERE, "shorts", sid, "meta.json")
        m = json.load(open(mf, encoding="utf-8")) if os.path.exists(mf) else {}
        items.append({"id": sid, "subject": subj, "qno": q, "question": qs[subj][q - 1], "title": m.get("title") or f"Q{q}",
                      "answer": m.get("answer", []), "voice": m.get("voice", ""), "marks": m.get("marks") or (2 if subj == "oop" and q <= 10 else 5),
                      "video": ver(f"v/{sid}.mp4"), **({"music": ver(f"v/{sid}.music.m4a"), "sfx": ver(f"v/{sid}.sfx.m4a")} if os.path.exists(os.path.join(SITE, "v", f"{sid}.sfx.m4a")) else {}), "poster": ver(f"v/{sid}.jpg"), "hint": hint_at(sid)})
    items.sort(key=lambda x: (order[x["subject"]], x["qno"]))
    json.dump(items, open(os.path.join(SITE, "shorts.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return len(items)

if __name__ == "__main__":
    import mix
    for i in sys.argv[1:]:
        d = fetch(i)
        if not os.path.exists(os.path.join(d, "sfx.m4a")) or os.path.getmtime(os.path.join(d, "voice.mp4")) < os.path.getmtime(os.path.join(d, "render.mp4")):
            mix.main(d)
        web(i, d); print(i, "web copy ok", round(os.path.getsize(os.path.join(SITE, "v", i + ".mp4")) / 1e6, 1), "MB")
    print("shorts.json:", manifest(), "reels")
