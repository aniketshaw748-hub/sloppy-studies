# overlap.py <build.log>  -> prints every overlap / zone / overflow problem; exit 1 if any.
# Checks on-screen boxes (camera applied) every 0.1 s. Allowed: a label inside its own rect, annotations
# (rings/marks/arrows are not registered), the drawing marker, things passing by while moving.
import json,sys,re
raw=open(sys.argv[1]).read(); m=re.search(r'@@BB(.*)',raw)
if not m: print("NO LAYOUT LOG"); sys.exit(1)
L=json.loads(m.group(1)); boxes=L["boxes"]; scenes=L["scenes"]; TOPY=L.get("top",118)
SOLID={"box","icon","head","sub","label","stext","srect","soval","mover","mascot","plot","lanes","row"}
REGION={"plot","lanes"}
TOL=6
def kfval(kfs,t,default):
    if not kfs: return default
    if t<=kfs[0]["at"]: return kfs[0]["value"]
    for a,b in zip(kfs,kfs[1:]):
        if a["at"]<=t<=b["at"]:
            u=(t-a["at"])/max(1e-6,b["at"]-a["at"]); u=u*u*(3-2*u); return a["value"]+(b["value"]-a["value"])*u
    return kfs[-1]["value"]
def cam(sc,tl):
    z=ox=oy=None
    for a in sc["cam"]:
        if a["property"]=="scale": z=kfval(a["keyframes"],tl,1)
        if a["property"]=="offsetX": ox=kfval(a["keyframes"],tl,0)
        if a["property"]=="offsetY": oy=kfval(a["keyframes"],tl,0)
    return z or 1,ox or 0,oy or 0
def pos(b,t):
    if "path" not in b: return b["x"],b["y"],True
    P=b["path"]
    if t<=P[0]["t"]: return P[0]["x"],P[0]["y"],True
    for a,c in zip(P,P[1:]):
        if a["t"]<=t<=c["t"]:
            mv=(abs(c["x"]-a["x"])+abs(c["y"]-a["y"]))>2; u=(t-a["t"])/max(1e-6,c["t"]-a["t"]); return a["x"]+(c["x"]-a["x"])*u,a["y"]+(c["y"]-a["y"])*u, not mv
    return P[-1]["x"],P[-1]["y"],True
probs={}
def add(key,msg,t):
    if key not in probs: probs[key]=(msg,t)
for b in boxes:
    if b["k"]=="cellOverflow": add(("cell",b["n"]),f'table cell text too wide for its cell: "{b["n"]}"',b["t0"])
byid={b.get("id"):b for b in boxes if b.get("id")}
for sc in scenes:
    t=sc["t"]+0.05
    while t<sc["e"]-0.02:
        tl=t-sc["t"]; z,ox,oy=cam(sc,tl)
        act=[]
        for b in boxes:
            if b["sc"]!=sc["i"] or b["k"] not in SOLID|{"marker"} or not (b["t0"]<=t<b["t1"]): continue
            x,y,still=pos(b,t)
            X=540+(x-540)*z+ox; Y=960+(y-960)*z+oy; Wd=b["w"]*z; Ht=b["h"]*z
            act.append((b,X,Y,Wd,Ht,still))
        for b,X,Y,Wd,Ht,still in act:
            if b["k"]=="marker": continue
            if still and (X<30 or X+Wd>1050 or Y<TOPY or Y+Ht>1598) and b["k"] not in REGION|{"row"}:
                add(("zone",b["k"],b["n"],sc["i"]),f'scene {sc["i"]}: {b["k"]} "{b["n"]}" leaves the safe area (x {X:.0f}..{X+Wd:.0f}, y {Y:.0f}..{Y+Ht:.0f}; keep x 30-1050, y {TOPY}-1598 incl. camera zoom)',t)
        for i in range(len(act)):
            for j in range(i+1,len(act)):
                a,ax,ay,aw,ah,ast=act[i]; c,cx,cy,cw,ch,cst=act[j]
                if "marker" in (a["k"],c["k"]): continue
                if not (ast and cst): continue
                if a.get("on") or c.get("on"): continue
                if a["k"]=="row" and c["k"]=="row": continue
                # child label vs its own container: must be inside
                for p_,q_ ,px,py,pw,ph,qx,qy,qw,qh in ((a,c,ax,ay,aw,ah,cx,cy,cw,ch),(c,a,cx,cy,cw,ch,ax,ay,aw,ah)):
                    pass
                a_in_c = bool(a.get("parent")) and a["parent"]==c.get("id"); c_in_a = bool(c.get("parent")) and c["parent"]==a.get("id")
                if a_in_c or c_in_a:
                    ch_,par=(a,c) if a_in_c else (c,a)
                    (chx,chy,chw,chh)=(ax,ay,aw,ah) if ch_ is a else (cx,cy,cw,ch)
                    (pax,pay,paw,pah)=(cx,cy,cw,ch) if ch_ is a else (ax,ay,aw,ah)
                    if chx<pax-TOL or chx+chw>pax+paw+TOL: add(("ovf",ch_["n"],sc["i"]),f'scene {sc["i"]}: text "{ch_["n"]}" is wider than its box "{par["n"]}"',t)
                    continue
                # full containment inside a container (drawn rect/oval, box, plot, lanes, table row) is intentional
                CONT={"srect","soval","box","plot","lanes","row"}
                def inside(px,py,pw,ph,qx,qy,qw,qh): return qx>=px-TOL and qy>=py-TOL and qx+qw<=px+pw+TOL and qy+qh<=py+ph+TOL
                if (a["k"] in CONT and inside(ax,ay,aw,ah,cx,cy,cw,ch)) or (c["k"] in CONT and inside(cx,cy,cw,ch,ax,ay,aw,ah)): continue
                if (a["k"] in REGION) != (c["k"] in REGION) and not ({a["k"],c["k"]}&{"head","sub"}): continue
                ix=min(ax+aw,cx+cw)-max(ax,cx); iy=min(ay+ah,cy+ch)-max(ay,cy)
                if ix>TOL and iy>TOL:
                    k=tuple(sorted([f'{a["k"]}:{a["n"]}',f'{c["k"]}:{c["n"]}']))+(sc["i"],)
                    add(k,f'scene {sc["i"]} @ {t:.1f}s: {a["k"]} "{a["n"]}" overlaps {c["k"]} "{c["n"]}" by {ix:.0f}x{iy:.0f}px',t)
        t+=0.1
for k,(msg,t) in sorted(probs.items(),key=lambda kv:kv[1][1]): print("OVERLAP:",msg)
print(f"OVERLAPS={len(probs)}"); sys.exit(1 if probs else 0)
