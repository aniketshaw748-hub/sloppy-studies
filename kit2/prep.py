# usage: python3 prep.py <dir>   (dir has spec.json + voice.mp3) -> words.json, edit/spec.js
import json,sys,re,os,subprocess
d=sys.argv[1]; spec=json.load(open(f"{d}/spec.json"))
wf=f"{d}/words.json"
if not os.path.exists(wf):
    from faster_whisper import WhisperModel
    m=WhisperModel("small",compute_type="int8")
    segs,_=m.transcribe(f"{d}/voice.mp3",word_timestamps=True,language="en")
    words=[{"w":w.word.strip(),"t0":round(w.start,3),"t1":round(w.end,3)} for s in segs for w in s.words]
    json.dump(words,open(wf,"w"))
words=json.load(open(wf))
dur=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f"{d}/voice.mp3"]).decode())+0.6
norm=lambda s:re.sub(r"[^a-z0-9]","",s.lower())
nw=[norm(w["w"]) for w in words]
cursor=[0]
def find(cue,soft=False):
    toks=[norm(t) for t in cue.split() if norm(t)]
    for i in range(cursor[0],len(nw)):
        if nw[i:i+len(toks)]==toks or (len(toks)>0 and nw[i].startswith(toks[0]) and all(nw[i+k].startswith(toks[k][:4]) for k in range(1,min(len(toks),len(nw)-i)))):
            if not soft: cursor[0]=i
            return words[i]["t0"]
    print("CUE NOT FOUND:",cue,file=sys.stderr); return None
for i,sc in enumerate(spec.get("scenes",[])):
    t=0.0 if i==0 else find(sc["cue"])
    sc["t"]=t if t is not None else (spec["scenes"][i-1]["t"]+2)
    save=cursor[0]
    for key in ("lines","aItems","bItems"):
        if key in sc:
            sc.setdefault("times_"+key,[])
            for it in sc[key]:
                c=it.get("cue") if isinstance(it,dict) else None
                tt=find(c,True) if c else None
                sc["times_"+key].append(None if tt is None else tt)
    if "nodes" in sc:
        sc["ntimes"]={n["id"]:find(n["cue"],True) for n in sc["nodes"] if n.get("cue")}
for i,sc in enumerate(spec.get("scenes",[])):
    sc["dur"]=round((spec["scenes"][i+1]["t"] if i+1<len(spec["scenes"]) else dur)-sc["t"],3)
# captions: subtitle-pacing cues (one breath, one line, <= MAXC chars), see _kit2/subs.py
sys.path.insert(0,"/home/user/what-if/_kit2"); import subs
MAXC={"terminal":30,"blueprint":30,"night":32,"warehouse":40,"whiteboard":40}.get(spec.get("theme"),36)
cw=words
if os.path.exists(f"{d}/script.txt"):   # captions follow the exact script where Whisper misheard (cues keep Whisper's words)
    import capfix; cw=capfix.fix(words, open(f"{d}/script.txt").read())
G=subs.build(cw,f"{d}/voice.mp3",MAXC,dur-0.6)
spec["captions"]=G; spec["words"]=words; spec["dur"]=round(dur,3)
os.makedirs(f"{d}/edit",exist_ok=True)
open(f"{d}/edit/spec.js","w").write("export const SPEC = "+json.dumps(spec)+";\n")
print("dur",dur)
