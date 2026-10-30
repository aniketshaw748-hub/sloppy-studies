# card_pauses.py <dir> '<json list of {"line","pause"}>'  (runs in the sandbox)
# Gives each answer card time to be read: inserts `pause` seconds of silence into voice.mp3 right after the card's
# spoken line, and shifts words.json to match, so phrase cues and captions stay in sync without re-transcribing.
import json, os, re, subprocess, sys
d, cards = sys.argv[1], json.loads(sys.argv[2])
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
if not os.path.exists(f"{d}/voice_orig.mp3"): os.rename(f"{d}/voice.mp3", f"{d}/voice_orig.mp3")
if not os.path.exists(f"{d}/words_orig.json"): os.rename(f"{d}/words.json", f"{d}/words_orig.json")
words = json.load(open(f"{d}/words_orig.json")); nw = [norm(w["w"]) for w in words]
def find(tokens, start):
    for i in range(start, len(nw) - len(tokens) + 1):
        if all(nw[i + k].startswith(t[:5]) or t.startswith(nw[i + k][:5]) for k, t in enumerate(tokens) if nw[i + k]): return i
    return None
cuts, pos = [], 0
for c in cards:
    tk = [norm(t) for t in c["line"].split() if norm(t)]
    i = find(tk[:3], pos)
    if i is None: print("card line not found:", c["line"]); continue
    j = min(len(words) - 1, i + len(tk) - 1)          # last word of the card's line
    t = round(words[j]["t1"] + 0.12, 3)
    cuts.append((t, min(7.0, c["pause"]))); pos = j + 1
FMT = "aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=mono"
segs, prev = [], 0.0
for t, L in cuts: segs += [("a", prev, t), ("s", L)]; prev = t
segs.append(("a", prev, None))
parts = []
for k, s in enumerate(segs):
    if s[0] == "a":
        f = f"atrim=start={s[1]}" + (f":end={s[2]}" if s[2] else "") + ",asetpts=PTS-STARTPTS"
        parts.append(f"[0:a]{f},{FMT}[p{k}]")
    else:
        parts.append(f"anullsrc=r=44100:cl=mono,atrim=duration={s[1]},{FMT}[p{k}]")
fc = ";".join(parts) + ";" + "".join(f"[p{k}]" for k in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1[out]"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{d}/voice_orig.mp3", "-filter_complex", fc, "-map", "[out]",
                "-ac", "1", "-ar", "44100", "-b:a", "128k", f"{d}/voice.mp3"], check=True)
shifted = []
for w in words:
    add = sum(L for t, L in cuts if w["t0"] >= t)
    shifted.append({**w, "t0": round(w["t0"] + add, 3), "t1": round(w["t1"] + add, 3)})
json.dump(shifted, open(f"{d}/words.json", "w"))
print(d, "pauses at", [(t, L) for t, L in cuts])
