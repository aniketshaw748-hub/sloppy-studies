# capfix.py: correct Whisper's words against the exact voiceover script, for burned-in captions only.
# Where Whisper and the script agree (numbers compared by value: "20" == "twenty"), Whisper's word is kept;
# where they differ ("minus 120" vs "minus a hundred, twenty"), the script's words are used, timed across
# the span Whisper gave those words. Phrase cues keep using the raw Whisper words.
import re, difflib

UNITS = {w: i for i, w in enumerate("zero one two three four five six seven eight nine ten eleven twelve thirteen "
                                    "fourteen fifteen sixteen seventeen eighteen nineteen".split())}
TENS = {w: 10 * (i + 2) for i, w in enumerate("twenty thirty forty fifty sixty seventy eighty ninety".split())}
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())

def _numword(t):
    t = norm(t)
    if t in UNITS or t in TENS or t in ("hundred", "thousand", "point"): return t
    parts = re.split(r"-", re.sub(r"[^a-z\-]", "", t.lower()))
    return None

def script_keys(tokens):
    """[(key, i0, i1)] with runs of number words collapsed to one numeric key."""
    out, i = [], 0
    while i < len(tokens):
        raw = tokens[i].lower().strip(".,;:!?()\"'")
        sub = raw.split("-")
        if all(s in UNITS or s in TENS for s in sub) and raw:
            j, val, cur, dec = i, 0, 0, None
            while j < len(tokens):
                r = tokens[j].lower().strip(".,;:!?()\"'"); ss = r.split("-")
                if dec is not None and r in UNITS: dec += str(UNITS[r]); j += 1; continue
                if all(s in UNITS or s in TENS for s in ss) and r:
                    v = sum(UNITS.get(s, TENS.get(s, 0)) for s in ss)
                    if cur and cur < 10 and 10 <= v < 100: cur = cur * 100 + v     # "four twenty-six" = 426
                    elif cur and (cur % 10 or v >= 10) and cur < 100 and v < 100: break
                    else: cur += v
                    j += 1
                elif r == "hundred" and cur: cur *= 100; j += 1
                elif r == "thousand" and cur: val += cur * 1000; cur = 0; j += 1
                elif r == "point" and dec is None and j + 1 < len(tokens): dec = ""; j += 1
                else: break
                if tokens[j - 1].rstrip()[-1:] in ",.;:": break     # a comma ends the number ("five, two")
            num = str(val + cur) + (dec or "")
            out.append((num, i, j)); i = j
        elif raw == "a" and i + 1 < len(tokens) and tokens[i + 1].lower().strip(".,;:") == "hundred":
            out.append(("100", i, i + 2)); i += 2
        else:
            out.append((norm(tokens[i]), i, i + 1)); i += 1
    return out

def fix(words, script):
    toks = script.split()
    sk = script_keys(toks)
    wk = [norm(w["w"]) for w in words]
    sm = difflib.SequenceMatcher(None, [k for k, _, _ in sk], wk, autojunk=False)
    out = []
    for op, a0, a1, b0, b1 in sm.get_opcodes():
        if op == "equal":                                   # keep Whisper's word, but take the script's punctuation
            for (_, i0, i1), w in zip(sk[a0:a1], words[b0:b1]):
                p = re.search(r"[.,;:!?]+$", toks[i1 - 1]); ww = re.sub(r"[.,;:!?]+$", "", w["w"])
                if re.match(r"-[\w]", ww): ww = ww[1:]   # Whisper's stray minus/hyphen ("B -11", "x -axis"); the script says "minus" when it means it
                out.append(dict(w, w=ww + (p.group(0) if p else "")))
            continue
        st = [toks[i] for _, i0, i1 in sk[a0:a1] for i in range(i0, i1)]
        if not st: continue                                  # Whisper heard extra words: drop them
        if b1 > b0: t0, t1 = words[b0]["t0"], words[b1 - 1]["t1"]
        else:                                                # Whisper skipped words: squeeze them in at the gap
            t0 = words[b0 - 1]["t1"] if b0 else 0.0
            t1 = words[b0]["t0"] if b0 < len(words) else t0 + 0.3 * len(st)
            if t1 - t0 < 0.15 * len(st): t1 = t0 + 0.15 * len(st)
        step = (t1 - t0) / len(st)
        out += [{"w": s, "t0": round(t0 + k * step, 3), "t1": round(t0 + (k + 1) * step, 3)} for k, s in enumerate(st)]
    return out

if __name__ == "__main__":
    w = [{"w": x, "t0": i * 0.4, "t1": i * 0.4 + 0.35} for i, x in enumerate("Scale x by 2, y by 1. minus 120. Move at 20 units left. Work: 2, 8, 8, 6.".split())]
    s = "Scale x by two, y by one. Minus a hundred, twenty. Move it twenty units left. Work: two, eight, eight, six."
    print(" ".join(x["w"] for x in fix(w, s)))

