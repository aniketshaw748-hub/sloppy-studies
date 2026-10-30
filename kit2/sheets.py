# sheets.py <dir> : one still per scene (just before it cuts, when its picture is complete) -> <dir>/review/sheet_N.jpg (3x2 tiles)
import json, re, subprocess, sys, os
d = sys.argv[1]; raw = open(f"{d}/build.log").read()
L = json.loads(re.search(r"@@BB(.*)", raw).group(1)); sc = L["scenes"]
os.makedirs(f"{d}/review", exist_ok=True); subprocess.run(f"rm -f {d}/review/*", shell=True)
ts = [round(s["e"] - min(0.4, 0.05 * (s["e"] - s["t"])), 2) for s in sc]
for i, t in enumerate(ts):
    subprocess.run(["higgsedit", "frame", ".", str(t), "--out", f"{d}/review/f{i:02d}.png"], cwd=f"{d}/edit", capture_output=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{d}/review/f{i:02d}.png", "-vf",
                    f"scale=360:640,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf:text='{i+1} · {t:.0f}s':x=8:y=h-30:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6",
                    f"{d}/review/f{i:02d}.jpg"])
fs = sorted(f for f in os.listdir(f"{d}/review") if f.endswith(".jpg"))
for k in range(0, len(fs), 6):
    grp = [f"{d}/review/{f}" for f in fs[k:k + 6]]
    subprocess.run(["montage", *grp, "-tile", "3x2", "-geometry", "+4+4", "-background", "#888888", "-quality", "82", f"{d}/review/sheet_{k // 6 + 1}.jpg"])
print(d, "scenes", len(ts), "sheets", (len(fs) + 5) // 6)
