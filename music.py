# music.py: a score composed in code for each Sloppy Studies world, following the edit.
# usage: python music.py <theme> <duration_s> <out.wav> [cuts.json]
# cuts.json = {"cuts":[t,...], "holds":[t,...]}: scene changes get a lift, completed explanations a soft resolve.
import json, sys
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

SR = 48000
rng = np.random.default_rng(7)

def env(n, a=0.005, d=0.3, s=0.0, r=0.05):
    t = np.arange(n) / SR; e = np.ones(n)
    a_n = max(1, int(a * SR)); e[:a_n] = np.linspace(0, 1, a_n)
    dec = np.exp(-(t - a) / max(1e-3, d)); e[a_n:] = s + (1 - s) * dec[a_n:]
    r_n = min(n, int(r * SR)); e[-r_n:] *= np.linspace(1, 0, r_n)
    return e

def lp(x, f, order=2):
    return sosfilt(butter(order, min(f, SR / 2 - 100) / (SR / 2), "low", output="sos"), x)

def hp(x, f, order=2):
    return sosfilt(butter(order, f / (SR / 2), "high", output="sos"), x)

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)

def tone(kind, m, dur, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m)
    if kind == "piano":    # felt piano: few harmonics, quick decay, soft attack
        x = sum((0.6 ** k) * np.sin(2 * np.pi * f * (k + 1) * t * (1 + 0.0007 * k)) for k in range(5))
        x = lp(x * env(n, 0.006, 0.9, 0.0, 0.2), 2600)
    elif kind == "square":  # terminal arp: narrow pulse, filtered
        x = np.sign(np.sin(2 * np.pi * f * t) + 0.3); x = lp(x * env(n, 0.003, 0.18, 0.0, 0.05), 1800) * 0.35
    elif kind == "marimba":
        x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 4.0 * t) * np.exp(-t * 30)
        x = x * env(n, 0.002, 0.35, 0.0, 0.05)
    elif kind == "pluck":   # muted pluck (warehouse)
        x = lp(np.sign(np.sin(2 * np.pi * f * t)) * env(n, 0.002, 0.12, 0.0, 0.03), 1200) * 0.5
    elif kind == "bell":    # FM bell (night, resolves)
        x = np.sin(2 * np.pi * f * t + 2.0 * np.exp(-t * 3) * np.sin(2 * np.pi * f * 3.5 * t)) * env(n, 0.002, 1.6, 0.0, 0.3)
    elif kind == "pad":
        x = sum(np.sign(np.sin(2 * np.pi * f * (1 + d) * t)) for d in (-0.004, 0, 0.005)) / 3
        x = lp(x, 900) * env(n, 0.6, 3.0, 0.7, 0.8) * 0.5
    elif kind == "bass":
        x = lp(2 * (t * f % 1) - 1, 380) * env(n, 0.005, 0.5, 0.4, 0.06) * 0.8
    return x * vel

def kick(): n = int(0.35 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * (45 + 90 * np.exp(-t * 30)) * t) * np.exp(-t * 9)
def hat():  n = int(0.06 * SR); return hp(rng.standard_normal(n), 7000) * np.exp(-np.arange(n) / SR * 60) * 0.25
def snare(): n = int(0.2 * SR); return (hp(rng.standard_normal(n), 1500) * 0.5) * np.exp(-np.arange(n) / SR * 22)
def shaker(): n = int(0.09 * SR); return hp(rng.standard_normal(n), 5000) * np.hanning(n) * 0.2
def swell(d=0.9):
    n = int(d * SR); return lp(rng.standard_normal(n), 3000) * np.linspace(0, 1, n) ** 2 * 0.25

THEMES = {  # bpm, chords (midi roots + quality), lead instrument, groove
    "whiteboard": dict(bpm=84, inst="piano", prog=[(65, "maj7"), (64, "m7"), (62, "m7"), (60, "maj7")], drums="brush"),
    "terminal":   dict(bpm=92, inst="square", prog=[(57, "m"), (53, "maj"), (60, "maj"), (55, "maj")], drums="soft"),
    "blueprint":  dict(bpm=96, inst="marimba", prog=[(60, "maj"), (55, "maj"), (57, "m"), (53, "maj")], drums="tick"),
    "warehouse":  dict(bpm=90, inst="pluck", prog=[(52, "m7"), (55, "maj"), (57, "m7"), (50, "maj")], drums="shop"),
    "machine":    dict(bpm=88, inst="pluck", prog=[(57, "m7"), (53, "maj7"), (55, "maj"), (52, "m7")], drums="tick"),
    "graph":      dict(bpm=94, inst="marimba", prog=[(62, "maj"), (59, "m"), (55, "maj"), (57, "sus")], drums="brush"),
    "night":      dict(bpm=76, inst="bell", prog=[(62, "m9"), (58, "maj7"), (55, "m7"), (57, "sus")], drums=None),
}
Q = {"maj": [0, 4, 7], "m": [0, 3, 7], "maj7": [0, 4, 7, 11], "m7": [0, 3, 7, 10], "m9": [0, 3, 7, 10, 14], "sus": [0, 5, 7, 10]}

def add(buf, x, t, gain=1.0):
    i = int(t * SR)
    if i >= len(buf): return
    j = min(len(buf), i + len(x)); buf[i:j] += x[: j - i] * gain

def score(theme, dur, cuts=(), holds=()):
    P = THEMES[theme]; beat = 60 / P["bpm"]; bar = beat * 4
    n = int((dur + 2) * SR); mel = np.zeros(n); drm = np.zeros(n); low = np.zeros(n)
    bars = int(dur / bar) + 2
    for b in range(bars):
        root, q = P["prog"][b % len(P["prog"])]; notes = [root + i for i in Q[q]]; t0 = b * bar
        add(low, tone("bass", root - 24, bar * 0.95), t0, 0.5)
        if theme in ("night",):
            for m in notes[:4]: add(mel, tone("pad", m - 12, bar * 1.05), t0, 0.18)
            if b % 2 == 0: add(mel, tone("bell", notes[-1] + 12, 2.5), t0 + beat * 2, 0.10)
        else:  # gentle arpeggio, sparser on whiteboard (it's a classroom)
            step = beat / 2 if theme in ("terminal", "blueprint") else beat
            pattern = [0, 2, 1, 2, 3 % len(notes), 2, 1, 2]
            for k in range(int(bar / step)):
                m = notes[pattern[k % len(pattern)] % len(notes)] + (12 if theme == "terminal" else 0)
                add(mel, tone(P["inst"], m, step * 2.2, 0.9 if k % 2 == 0 else 0.6), t0 + k * step, 0.16)
        if P["drums"]:
            for k in range(4):
                tb = t0 + k * beat
                if P["drums"] in ("soft", "shop") and k in (0, 2): add(drm, kick(), tb, 0.35)
                if P["drums"] == "brush": add(drm, shaker(), tb + beat / 2, 0.5); (k in (1, 3)) and add(drm, snare(), tb, 0.10)
                if P["drums"] == "soft": add(drm, hat(), tb + beat / 2, 0.6)
                if P["drums"] == "tick": add(drm, hat(), tb, 0.35); add(drm, hat(), tb + beat / 2, 0.2)
                if P["drums"] == "shop": add(drm, shaker(), tb + beat / 2, 0.7); (k in (1, 3)) and add(drm, snare(), tb, 0.12)
    for c in cuts:  # scene change: a lift into the new idea
        add(mel, swell(0.8), max(0, c - 0.8), 0.6)
    for h in holds:  # an explanation landed: soft resolving chord
        root = THEMES[theme]["prog"][0][0]
        for m in (root + 12, root + 16, root + 19): add(mel, tone("bell", m, 2.2), h, 0.07)
    mix = mel + drm + low
    ir_n = int(1.6 * SR); ir = rng.standard_normal(ir_n) * np.exp(-np.arange(ir_n) / SR * 3.2); ir /= np.sqrt((ir ** 2).sum())
    wet = fftconvolve(mix, ir)[: len(mix)]
    out = 0.8 * mix + 0.35 * wet
    L = out + 0.08 * np.roll(wet, 280); R = out + 0.08 * np.roll(wet, -280)
    st = np.stack([L, R], 1)[: int(dur * SR)]
    fade = int(1.5 * SR); st[:int(0.6 * SR)] *= np.linspace(0, 1, int(0.6 * SR))[:, None]; st[-fade:] *= np.linspace(1, 0, fade)[:, None]
    st /= (np.abs(st).max() + 1e-9); return (st * 0.8).astype(np.float32)

if __name__ == "__main__":
    theme, dur, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
    cut = json.load(open(sys.argv[4])) if len(sys.argv) > 4 else {}
    from scipy.io import wavfile
    wavfile.write(out, SR, score(theme, dur, cut.get("cuts", []), cut.get("holds", [])))
    print("wrote", out)
