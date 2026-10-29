# qa.py <id> [<id> ...] : one contact sheet per finished short (9 frames across its length) -> out/<id>/sheet.jpg
import os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
for i in sys.argv[1:]:
    f = os.path.join(HERE, "out", i, "final.mp4")
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).decode())
    step = d / 9.5
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(step * 0.6), "-i", f, "-vf", f"fps=1/{step:.3f},scale=216:384,tile=9x1",
                    "-frames:v", "1", "-q:v", "5", os.path.join(HERE, "out", i, "sheet.jpg")], check=True)
    print(i, "sheet ok", round(d), "s")
