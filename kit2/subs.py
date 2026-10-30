# subs.py: subtitle cues per the user's subtitle-pacing rule.
#  one cue = one breath (the words said without a long pause), one line, <= MAXC characters;
#  long pause (> 0.6 s, measured on the voice envelope) starts a new cue, "…" when the sentence carries on;
#  long breaths split at punctuation, never after a small leaning word; no blink cues (< 0.6 s merge);
#  cue shows 0.06 s before its first word, clears 0.25 s after its last voiced word, never overlaps the next.
import re, subprocess
import numpy as np
SMALL = set("the a an to of and or but so no my your his her its our their i in on at for with as is are was be by from that this".split())
LONG = 0.6
def envelope(mp3):
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", mp3, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"])
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768.0
    hop = 160; n = len(x) // hop
    rms = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(rms + 1e-9)          # dB per 10 ms
def voiced_end(db, w, nxt_t0):
    """where the word really ends: level stays 18 dB under the word's peak for 0.3 s (whisper smears ends into pauses)"""
    a, b = int(w["t0"] * 100), int(min(w["t1"] + 0.6, nxt_t0) * 100)
    seg = db[a:max(a + 1, int(w["t1"] * 100) + 1)]
    if not len(seg): return w["t1"]
    peak = float(seg.max()); thr = peak - 18
    for i in range(max(a + 3, int(w["t1"] * 100) - 30), max(b, a + 4)):
        win = db[i:i + 30]
        if len(win) and float(win.max()) < thr: return min(i / 100, nxt_t0)
    return min(w["t1"], nxt_t0)
def clean(s): return re.sub(r"[\"“”]", "", s)
def text_of(ws): return " ".join(clean(w["w"]) for w in ws)
def split_long(ws, maxc):
    if len(text_of(ws)) <= maxc or len(ws) < 2: return [ws]
    best, bscore = None, 1e9
    for i in range(1, len(ws)):
        L, R = text_of(ws[:i]), text_of(ws[i:])
        prev = re.sub(r"[^a-z']", "", ws[i - 1]["w"].lower())
        if prev in SMALL: continue                                   # never break after a leaning word
        end = bool(re.search(r"[.!?]$", ws[i - 1]["w"])); comma = bool(re.search(r"[,;:]$", ws[i - 1]["w"]))
        # a reader splits at a sentence end first, then a comma; otherwise near the middle. Tiny fragments are bad.
        score = abs(len(L) - len(R)) * 0.2 - (80 if end else 40 if comma else 0) + (30 if min(len(L), len(R)) < 8 else 0)
        if score < bscore: best, bscore = i, score
    if best is None: best = len(ws) // 2
    return split_long(ws[:best], maxc) + split_long(ws[best:], maxc)
def build(words, mp3, maxc=38, dur=None):
    if not words: return []
    db = envelope(mp3)
    ends = [voiced_end(db, w, words[i + 1]["t0"] if i + 1 < len(words) else w["t1"] + 1) for i, w in enumerate(words)]
    # breaths: split on long pauses (gap from voiced end to next word start)
    breaths, cur = [], []
    for i, w in enumerate(words):
        cur.append(dict(w, ve=ends[i]))
        gap = (words[i + 1]["t0"] - ends[i]) if i + 1 < len(words) else 9
        if gap > LONG or re.search(r"[.!?]$", w["w"]): breaths.append((cur, gap > LONG)); cur = []   # a sentence end also ends the subtitle
    if cur: breaths.append((cur, True))
    cues = []
    for ws, longpause in breaths:
        parts = split_long(ws, maxc)
        for j, p in enumerate(parts): cues.append({"ws": p, "pause_after": longpause and j == len(parts) - 1})
    # merges: lone word before a pause joins the next cue; anything under 0.6 s joins a neighbour if it fits
    def span(c): return c["ws"][-1]["ve"] + 0.25 - (c["ws"][0]["t0"] - 0.06)
    changed = True
    while changed:
        changed = False
        for k in range(len(cues)):
            c = cues[k]
            short = span(c) < 0.6 or len(c["ws"]) == 1
            if not short: continue
            for nb in ([k + 1, k - 1] if len(c["ws"]) == 1 else [k - 1, k + 1]):
                if 0 <= nb < len(cues):
                    a, b = (c, cues[nb]) if nb > k else (cues[nb], c)
                    if len(text_of(a["ws"] + b["ws"])) <= maxc:
                        merged = {"ws": a["ws"] + b["ws"], "pause_after": b["pause_after"]}
                        lo = min(k, nb); cues[lo:lo + 2] = [merged]; changed = True; break
            if changed: break
    out = []
    for k, c in enumerate(cues):
        ws = c["ws"]; t0 = max(0.0, ws[0]["t0"] - 0.06); t1 = ws[-1]["ve"] + 0.25
        if k + 1 < len(cues): t1 = min(t1, cues[k + 1]["ws"][0]["t0"] - 0.06)
        if out: t0 = max(t0, out[-1]["t1"])
        if dur: t1 = min(t1, dur)
        txt = [clean(w["w"]) for w in ws]
        if c["pause_after"] and k + 1 < len(cues) and not re.search(r"[.!?…]$", txt[-1]):
            txt[-1] = re.sub(r"[,;:]$", "", txt[-1]) + "…"           # sentence carries on after a long pause
        L = [len(re.sub(r"[^A-Za-z0-9]", "", x)) for x in txt]
        out.append({"t0": round(t0, 3), "t1": round(max(t1, t0 + 0.3), 3), "words": [{"w": x} for x in txt], "hot": L.index(max(L))})
    return out
