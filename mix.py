# mix.py <short_dir> : <dir>/render.mp4 (video + voice) + <dir>/sfx.json + theme -> <dir>/final.mp4
# Sound design: one sound per cue kind, chosen to fit the subject's world; steady music bed ~15 dB under the voice.
import json, os, subprocess, sys, hashlib

LIB = r"C:\Editing\_Sound Library"
HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "sfx_cache")
os.makedirs(CACHE, exist_ok=True)

# name substrings looked up in the library index (first matches win, rotated per event)
COMMON = {
    "whoosh": ["Whoosh 18", "Whoosh 16", "short air puff"],
    "swish": ["short air puff", "Whoosh 18"],
    "move": ["short air puff"],
    "hit": ["FW_01 D.Jolt Standard", "FW_02 D.Jolt Standard", "FW_03 D.Jolt Standard"],
    "wrong": ["digital-error", "sample_error_fail01"],
    "right": ["sample_confirm_success01", "sample_confirm_success02"],
    "ping": ["UI Beep 4", "iMessage SFX 01"],
    "tick": ["Click 02.wav", "Click 01.wav"],
    "pop": ["Pop 01", "Hollow Pop 06", "Double Pop Stereo.wav"],
    "draw": ["0333_production_element_data_fx_15"],
    "shock": ["Bouncing Pop"],
    "happy": ["Magic_Appear_Quick_Swoosh_Pop"],
}
THEME = {  # overrides: the world decides the sound
    "terminal": {"pop": ["key-press", "Mechanical Keyboard Click 03"], "tick": ["Mechanical Keyboard Click 03"], "hit": ["0333_production_element_glitch_stutter_3"],
                 "whoosh": ["0333_production_element_glitch_fast_3"], "move": ["Mechanical Keyboard Click 03"]},
    "blueprint": {"pop": ["Click 03.wav", "Click 04.wav"], "tick": ["Click 02.wav"]},
    "whiteboard": {},
    "warehouse": {"pop": ["_ Short foley 1.wav", "_ Short foley 2.wav"], "tick": ["_ Short foley 10"], "hit": ["FW_01 N.Jolt Standard"]},
    "night": {"pop": ["UI Beep 4", "iMessage SFX 02"], "tick": ["Click 01.wav"], "whoosh": ["Whoosh 16"]},
}
MUSIC = {"terminal": "ES_Digital Titan", "blueprint": "solving-puzzles-alistair-sung", "whiteboard": "ES_Keys of Confidence - Experia.mp3",
         "warehouse": "ES_Ever Forward", "night": "ES_Uncharted Planet"}
GAIN = {"whoosh": -13, "swish": -19, "move": -24, "hit": -11, "wrong": -12, "right": -13, "ping": -17, "tick": -21, "pop": -17,
        "draw": -19, "shock": -15, "happy": -18, "marker": -20}
MAXLEN = {"whoosh": 0.7, "swish": 0.5, "move": 0.4, "hit": 0.9, "wrong": 0.8, "right": 0.9, "ping": 0.6, "tick": 0.2, "pop": 0.35,
          "draw": 1.2, "shock": 0.6, "happy": 1.0, "marker": 0.55}
MINGAP = {"move": 0.6, "pop": 0.14, "tick": 0.09, "marker": 0.5}

items = json.load(open(os.path.join(LIB, "_index.json"), encoding="utf-8"))["items"]

def find(sub, music=False):
    for it in items:
        if sub.lower() not in it["name"].lower(): continue
        if music and it["category"] == "01 Music": return os.path.join(LIB, it["rel"])
        if not music and (it["category"] == "02 SFX" or it["duration"] < 6): return os.path.join(LIB, it["rel"])
    return None

def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

def clip(src, kind):
    """trim to the kind's length, fade out, peak-normalise; cached"""
    key = hashlib.md5((src + kind).encode()).hexdigest()[:10]
    out = os.path.join(CACHE, f"{kind}_{key}.wav")
    if not os.path.exists(out):
        L = MAXLEN[kind]
        run(["ffmpeg", "-y", "-v", "error", "-i", src, "-t", str(L), "-af",
             f"silenceremove=start_periods=1:start_threshold=-45dB,afade=t=out:st={max(0.01, L - 0.12)}:d=0.12,aformat=channel_layouts=stereo,dynaudnorm=f=75:g=3:p=0.7,alimiter=limit=0.7",
             "-ar", "48000", out])
    return out

def marker_clip():
    out = os.path.join(CACHE, "marker_synth.wav")
    if not os.path.exists(out):  # felt-tip on whiteboard: band-passed pink noise, stroke tremolo
        run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anoisesrc=color=pink:duration=0.55:amplitude=0.6",
             "-af", "bandpass=f=3200:width_type=q:w=1.4,tremolo=f=11:d=0.7,afade=t=in:d=0.05,afade=t=out:st=0.4:d=0.15,aformat=channel_layouts=stereo",
             "-ar", "48000", out])
    return out

def bank(theme, kind):
    if kind == "marker":
        return [marker_clip()]
    names = THEME.get(theme, {}).get(kind) or COMMON.get(kind, [])
    srcs = [s for s in (find(n) for n in names) if s]
    return [clip(s, kind) for s in srcs]

def main(d):
    spec = json.load(open(os.path.join(d, "spec.json")))
    theme = spec["theme"]
    evs = json.load(open(os.path.join(d, "sfx.json")))
    video = os.path.join(d, "render.mp4")
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video]).decode())
    # throttle: per-kind min gap, global max ~4 cues/s, never two cues within 70 ms
    last, kept, recent = {}, [], []
    for e in sorted(evs, key=lambda e: e["t"]):
        k, t = e["k"], e["t"]
        if k not in GAIN or t > dur - 0.2: continue
        if t - last.get(k, -9) < MINGAP.get(k, 0.2): continue
        recent = [x for x in recent if t - x < 1.0]
        if len(recent) >= 4 and k not in ("whoosh", "hit", "wrong", "right"): continue
        if kept and t - kept[-1][0] < 0.07 and k not in ("whoosh", "hit"): continue
        kept.append((t, k)); last[k] = t; recent.append(t)
    banks, rot = {}, {}
    inputs, filters, labels = ["-i", video], [], []
    # composed score for this world, following the edit: lifts on scene cuts, resolves on held explanations
    import music
    cuts = [e["t"] + 0.05 for e in evs if e["k"] == "whoosh"]; holds = [e["t"] for e in evs if e["k"] == "resolve"]
    mpath = os.path.join(d, "score.wav")
    from scipy.io import wavfile
    wavfile.write(mpath, music.SR, music.score(theme, dur, cuts, holds))
    idx = 1
    if mpath:
        inputs += ["-i", mpath]
        filters.append(f"[1:a]atrim=0:{dur},asetpts=PTS-STARTPTS,loudnorm=I=-29:TP=-6:LRA=7,afade=t=in:d=0.6,afade=t=out:st={max(0, dur - 1.6)}:d=1.6[mus]")
        idx = 2
    sfx_labels = []
    for t, k in kept:
        b = banks.setdefault(k, bank(theme, k))
        if not b: continue
        f = b[rot.get(k, 0) % len(b)]; rot[k] = rot.get(k, 0) + 1
        inputs += ["-i", f]
        filters.append(f"[{idx}:a]volume={GAIN[k] + 2}dB,adelay={int(t * 1000)}|{int(t * 1000)}[s{idx}]")
        sfx_labels.append(f"[s{idx}]"); idx += 1
    # Four outputs. The site plays voice.mp4 (voice only) + music.m4a + sfx.m4a, each with its own viewer slider
    # (each file is that slider's 100%). final.mp4 is the archive master at the site's defaults (both -6 dB).
    filters.append("[0:a]loudnorm=I=-14:TP=-1.5:LRA=9,asplit=2[vo1][vo2]")
    filters.append(f"[mus]apad,atrim=0:{dur},asplit=2[mus1][mus2]")
    if sfx_labels:
        filters.append("".join(sfx_labels) + f"amix=inputs={len(sfx_labels)}:normalize=0:duration=longest,apad,atrim=0:{dur},asplit=2[fx1][fx2]")
    else:
        filters.append(f"anullsrc=r=48000:cl=stereo,atrim=0:{dur},asplit=2[fx1][fx2]")
    filters.append("[mus2]volume=-6dB[mq];[fx2]volume=-6dB[fq];[vo2][mq][fq]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.89[master]")
    fc = os.path.join(d, "mix_filter.txt"); open(fc, "w").write(";\n".join(filters))
    run(["ffmpeg", "-y", "-v", "error"] + inputs + ["-filter_complex_script", fc,
         "-map", "0:v", "-map", "[master]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", os.path.join(d, "final.mp4"),
         "-map", "0:v", "-map", "[vo1]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-ar", "48000", os.path.join(d, "voice.mp4"),
         "-map", "[mus1]", "-c:a", "aac", "-b:a", "96k", "-ar", "48000", os.path.join(d, "music.m4a"),
         "-map", "[fx1]", "-c:a", "aac", "-b:a", "96k", "-ar", "48000", os.path.join(d, "sfx.m4a")])
    print(f"{os.path.basename(d)}: {len(kept)} cues -> final.mp4 + voice.mp4 + music.m4a + sfx.m4a")

if __name__ == "__main__":
    for d in sys.argv[1:]:
        main(d)
