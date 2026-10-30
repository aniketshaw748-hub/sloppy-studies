// Visual primitives. Every prim: absolute canvas px (1080x1920), `at` = seconds from SCENE start, `dur` = scene length.
import { C } from "./theme.jsx";
// SFX cue log: every prim reports (absolute time, kind); the mixer turns these into sound.
// Layout registry for the overlap checker: every solid element logs its box + lifetime (scene-relative -> absolute).
export const BB=[]; export const bb=(o)=>{ const T=globalThis.__T0||0; if(o.path&&!o.abs) o={...o,path:o.path.map(q=>({...q,t:+(T+q.t).toFixed(3)}))}; BB.push({...o,t0:+(T+Math.max(0,o.t0)).toFixed(3),t1:+(T+o.t1).toFixed(3),sc:globalThis.__SC||0}); };
const FW={"DejaVu Sans Mono":0.62,"JetBrains Mono":0.6,"Space Mono":0.61,"Orbitron":0.78,"Caveat":0.43,"Bebas Neue":0.42,"Anton":0.48,"Oswald":0.5,"Inter":0.6,"Archivo Black":0.72};
// per-character width estimate: capitals/digits wider, spaces/punctuation narrower (monospace stays flat)
const cw=(ch,mono)=> mono?1: /[A-Z0-9MW@#%&]/.test(ch)?1.35: /[ .,;:'!|il1()\[\]]/.test(ch)?0.55: 1;
export const textW=(s,fs,font)=>{ const mono=/Mono/.test(font||""); return Math.max(...String(s).split("\n").map(l=>[...l].reduce((a,ch)=>a+cw(ch,mono),0)))*fs*(FW[font]||0.6); };
export const EV=[]; export const ev=(at,k)=>{ if(k) EV.push({t:+((globalThis.__T0||0)+Math.max(0,at)).toFixed(3),k}); };
const SPRING=[0.34,1.56,0.64,1], QUINT=[0.22,1,0.36,1];
const W=1080,H=1920;
const pop=(at=0)=>[{property:"opacity",from:0,to:1,at,duration:0.12},{property:"scale",from:0.55,to:1,at,duration:0.38,easing:SPRING}];
const fade=(at=0,d=0.2)=>[{property:"opacity",from:0,to:1,at,duration:d}];
// fit(anim,len): drop/shrink keyframe chains that would outlive the node (prims never fail the build on short scenes)
const fit=(anim,len)=>anim.map(a=>{ if(a.keyframes){const end=a.keyframes[a.keyframes.length-1].at; if(end<=len-0.02) return a; const k=(len-0.02)/end; return {...a,keyframes:a.keyframes.map(q=>({...q,at:q.at*k}))};}
  const end=(a.at||0)+(a.duration||0); if(end<=len-0.02) return a; const dd=Math.max(0.01,len-0.02-(a.at||0)); return dd>0.02?{...a,duration:dd}:null; }).filter(Boolean);
export const Layer=({at=0,dur,children,anim,out,sfx})=>{ ev(at,sfx); const a0=Math.max(0,Math.min(at,Math.max(0,dur-0.25))); const len=Math.max(0.2,(out??dur)-a0);
  return <frame at={a0} duration={len} width={W} height={H} layout="none" origin="center" animate={fit(anim||fade(0),len)}>{children}</frame>; };
// box with label; tone: a|b|hot|ghost
export function Box({x,y,w=300,h=110,label="",tone="a",at=0,dur,size,sub,out,r=14,id,on}){
  const f= tone==="hot"?C.coral: tone==="b"?C.cobalt: tone==="ghost"?"#00000000": C.chip;
  const tc= tone==="hot"||tone==="b"? C.ink : C.chipText;
  const fs=size||Math.max(26,Math.min(h*0.5, Math.floor((w-30)/Math.max(1,label.length)*1.45)));
  bb({k:"box",n:label||sub||"box",x:x-w/2,y:y-h/2,w:w+9,h:h+9,t0:at,t1:out??dur,id:id,on});
  return <Layer at={at} dur={dur} out={out} anim={pop(0)} sfx="pop">
    {tone!=="ghost"?<rect x={x-w/2+9} y={y-h/2+9} width={w} height={h} radius={r} fill={C.navy} opacity={0.9}/>:null}
    <rect x={x-w/2} y={y-h/2} width={w} height={h} radius={r} fill={f} strokeColor={C.navy} strokeWidth={4}/>
    {label?<text x={x-w/2+12} y={y-(sub?fs*0.95:fs*0.62)} width={w-24} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={fs*C.bScale} lineHeight={1} color={tc}>{label}</text>:null}
    {sub?<text x={x-w/2+12} y={y+8} width={w-24} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={Math.round(fs*0.55)} color={tc}>{sub}</text>:null}
  </Layer>;
}
// straight arrow with head; grows in
export function Arrow({x1,y1,x2,y2,at=0,dur,label,color,width=7,out,head=true}){
  const col=color||C.cobalt; const a=Math.atan2(y2-y1,x2-x1), L=26;
  const hx1=x2-L*Math.cos(a-0.45), hy1=y2-L*Math.sin(a-0.45), hx2=x2-L*Math.cos(a+0.45), hy2=y2-L*Math.sin(a+0.45);
  return <Layer at={at} dur={dur} out={out} anim={fade(0,0.25)} sfx="swish">
    <path d={`M ${x1} ${y1} L ${x2} ${y2}`} x={0} y={0} width={W} height={H} stroke={{width,color:col,cap:"round"}}/>
    {head?<path d={`M ${x2} ${y2} L ${hx1} ${hy1} L ${hx2} ${hy2} Z`} x={0} y={0} width={W} height={H} fill={col}/>:null}
    {label?<text x={(x1+x2)/2-160} y={(y1+y2)/2-52} width={320} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={34} color={C.coral}>{label}</text>:null}
  </Layer>;
}
// a thing that moves along keyframed points: pts=[{t,x,y}] (t = scene seconds). children drawn around (0,0)->(cw,ch) box at its own origin.
export function Mover({pts,dur,children,cw=200,ch=200,at=0,out,on}){
  at=Math.max(0,Math.min(at,dur-0.2));
  const len=Math.max(0.2,(out??dur)-at); let last=-1;
  pts=pts.map(p=>({...p,t:Math.min(Math.max(0,p.t-at),len-0.02)})).filter(p=>{if(p.t<=last+0.005) return false; last=p.t; return true;}).map(p=>({...p,t:p.t+at}));
  if(pts.length<2) pts=[pts[0],{...pts[0],t:pts[0].t+0.01}];
  ev(pts[0].t,"move"); bb({k:"mover",n:"mover",path:pts.map(p=>({t:p.t,x:p.x-cw/2,y:p.y-ch/2})),w:cw,h:ch,t0:at,t1:len+at,on});
  return <frame at={at} duration={len} width={W} height={H} layout="none">
    <group x={0} y={0} width={cw} height={ch}
      animate={[{property:"offsetX",keyframes:pts.map(p=>({at:Math.max(0,p.t-at),value:p.x-cw/2})),easing:"ease-in-out"},
                {property:"offsetY",keyframes:pts.map(p=>({at:Math.max(0,p.t-at),value:p.y-ch/2})),easing:"ease-in-out"}]}>{children}</group>
  </frame>;
}
// lucide icon popped in. name from `higgsedit icons <q>`
export function Ico({ctx,name,x,y,size=160,color,at=0,dur,out,sw=2.2,on}){
  bb({k:"icon",n:name,x:x-size/2,y:y-size/2,w:size,h:size,t0:at,t1:out??dur,on});
  return <Layer at={at} dur={dur} out={out} anim={pop(0)} sfx="pop">{ctx.icon(name,{x:x-size/2,y:y-size/2,size,color:color||C.navy,strokeWidth:sw})}</Layer>;
}
// tree: nodes [{id,label,parent,tone,at}] auto-laid out top-down inside box (bx,by,bw,bh)
export function Tree({nodes,bx=60,by=380,bw=960,bh=900,dur,nodeW,edgeLabels={}}){
  const kids={}; nodes.forEach(n=>{ if(n.parent){(kids[n.parent]=kids[n.parent]||[]).push(n.id);} });
  const root=nodes.find(n=>!n.parent); const pos={}; let leaf=0; const depth={};
  const walk=(id,d)=>{depth[id]=d; const k=kids[id]||[]; if(!k.length){pos[id]=leaf++;return pos[id];} const xs=k.map(c=>walk(c,d+1)); pos[id]=(xs[0]+xs[xs.length-1])/2; return pos[id];};
  walk(root.id,0); const maxD=Math.max(...Object.values(depth)); const nl=Math.max(1,leaf);
  const X=id=>bx+bw*(pos[id]+0.5)/nl, Y=id=>by+(maxD?bh*depth[id]/maxD:bh/2);
  const w=nodeW||Math.min(320,bw/nl-24); const by_={}; nodes.forEach(n=>by_[n.id]=n);
  return [ ...nodes.filter(n=>n.parent).map(n=> <Arrow key={"e"+n.id} x1={X(n.parent)} y1={Y(n.parent)+66} x2={X(n.id)} y2={Y(n.id)-68} at={n.at||0} dur={dur} head={false} width={5} label={edgeLabels[n.id]}/>),
           ...nodes.map(n=> <Box key={n.id} x={X(n.id)} y={Y(n.id)} w={w} h={130} label={n.label} tone={n.tone||"a"} at={n.at||0} dur={dur} sub={n.sub}/>) ];
}
// table: header row + rows; cells appear at cellAt[r][c] (scene s) or row index * 0.4
export function Table({x=60,y=420,w=960,cols,rows,rowH=96,dur,cellAt,hot=[],at=0,fs}){
  const cw=w/cols.length; const out=[]; bb({k:"row",n:"header",x:x,y:y,w:w,h:rowH,t0:at,t1:dur});
  out.push(<Layer key="h" at={at} dur={dur}>{cols.map((c,i)=> <group key={i} x={0} y={0} width={W} height={H}>
     <rect x={x+i*cw} y={y} width={cw-6} height={rowH} radius={6} fill={C.navy}/>
     {String(c).trim()===""?null:<text x={x+i*cw+6} y={y+rowH/2-(fs||40)*0.62} width={cw-18} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={fs||40} color={C.paper}>{c}</text>}</group>)}</Layer>);
  rows.forEach((r,ri)=>r.forEach((cell,ci)=>{ const t=(cellAt&&cellAt[ri]&&cellAt[ri][ci]!=null)?cellAt[ri][ci]:at+0.3+ri*0.4;
    const isHot=hot.some(h=>h[0]===ri&&h[1]===ci);
    { const f=fs||40; const tw=textW(cell,f,ci===0?C.fBody:C.fMono); if(tw>cw-18) bb({k:"cellOverflow",n:String(cell),x:x+ci*cw,y:y+(ri+1)*(rowH+6),w:tw,h:rowH,t0:t,t1:dur}); }
    if(ci===0) bb({k:"row",n:"row"+ri,x:x,y:y+(ri+1)*(rowH+6),w:w,h:rowH,t0:t,t1:dur});
    out.push(<Layer key={ri+"_"+ci} at={t} dur={dur} anim={pop(0)} sfx="tick">
      <rect x={x+ci*cw} y={y+(ri+1)*(rowH+6)} width={cw-6} height={rowH} radius={6} fill={isHot?C.coral:C.chip} strokeColor={C.navy} strokeWidth={3}/>
      {String(cell).trim()===""?null:<text x={x+ci*cw+6} y={y+(ri+1)*(rowH+6)+rowH/2-(fs||40)*0.62} width={cw-18} align="center" fontFamily={ci===0?C.fBody:C.fMono} fontWeight={ci===0?400:700} fontSize={fs||40} color={isHot?C.ink:C.chipText}>{cell}</text>}</Layer>);}));
  return out;
}
// plot: axes + curve from points [[x,y],...] in data units; reveals left->right from at over drawDur
export function Plot({x=120,y=460,w=860,h=760,pts,xmax,ymax,at=0,drawDur=1.2,dur,color,xlabel,ylabel,width=9,marks=[]}){
  const P=([a,b])=>[x+w*a/xmax, y+h-h*b/ymax]; bb({k:"plot",n:"plot",x:x,y:y-60,w:w,h:h+70,t0:0,t1:dur}); const d=pts.map((p,i)=>(i?"L ":"M ")+P(p).join(" ")).join(" ");
  return <Layer at={0} dur={dur}>
    <path d={`M ${x} ${y} L ${x} ${y+h} L ${x+w} ${y+h}`} x={0} y={0} width={W} height={H} stroke={{width:6,color:C.navy,cap:"round"}}/>
    {xlabel?<text x={x+w-400} y={y+h+16} width={400} align="right" fontFamily={C.fMono} fontWeight={700} fontSize={34} color={C.navy}>{xlabel}</text>:null}
    {ylabel?<text x={x+16} y={y-50} width={600} fontFamily={C.fMono} fontWeight={700} fontSize={34} color={C.navy}>{ylabel}</text>:null}
    {(ev(at,"draw"),null)}
    <frame at={at} duration={Math.max(0.2,dur-at)} width={W} height={H} layout="none" mask={{x:x-20,y:0,width:1,height:H}}
      animate={[{property:"maskWidth",from:1,to:w+60,at:0,duration:drawDur,easing:"ease-in-out"}]}>
      <path d={d} x={0} y={0} width={W} height={H} stroke={{width,color:color||C.coral,cap:"round"}}/>
    </frame>
    {marks.map((m,i)=>{const [mx,my]=P([m.x,m.y]); return <Layer key={i} at={m.at||at+drawDur} dur={dur} anim={pop(0)} sfx="pop">
      <rect x={mx-16} y={my-16} width={32} height={32} radius={16} fill={C.cobalt} strokeColor={C.navy} strokeWidth={4}/>
      {m.label?<text x={mx-200} y={my-80} width={400} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={38} color={C.navy}>{m.label}</text>:null}</Layer>;})}
  </Layer>;
}
// sequence-diagram lanes: actors [names], msgs [{from,to,label,at}]
export function Lanes({actors,msgs,y=360,h=1150,dur}){
  const n=actors.length, X=i=>90+900*(i+0.5)/n; const idx=a=>actors.indexOf(a); bb({k:"lanes",n:"lanes",x:90,y:y,w:900,h:h,t0:0,t1:dur});
  return [ ...actors.map((a,i)=> <Layer key={"a"+i} dur={dur}>
      <rect x={X(i)-130} y={y} width={260} height={90} radius={10} fill={i%2?C.cobalt:C.coral} strokeColor={C.navy} strokeWidth={4}/>
      <text x={X(i)-125} y={y+22} width={250} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={a.length>9?30:38} color={C.ink}>{a}</text>
      <path d={`M ${X(i)} ${y+90} L ${X(i)} ${y+h}`} x={0} y={0} width={W} height={H} stroke={{width:4,color:C.navy}} dash={[18,14]}/></Layer>),
    ...msgs.map((m,k)=>{const yy=y+170+k*Math.min(150,(h-200)/Math.max(1,msgs.length)); const a=X(idx(m.from)), b=X(idx(m.to));
      return <Arrow key={"m"+k} x1={a} y1={yy} x2={b} y2={yy} at={m.at||k*0.6} dur={dur} label={m.label} width={6} color={m.reply?C.coral:C.cobalt}/>;}) ];
}
// vertical stack of items, push order; pops: [{i,at}] fade out
export function Stack({x=540,y=1300,w=520,items,dur,pops=[]}){
  return items.map((it,i)=>{const p=pops.find(q=>q.i===i);
    return <Box key={i} x={x} y={y-i*118} w={w} h={104} label={it.label} tone={it.tone||(i%2?"b":"a")} at={it.at||i*0.4} out={p?p.at:undefined} dur={dur}/>;});
}
// big headline: each line rises through a clip (ease-out-quint), accent shadow offset
export function Head({text,y=230,size=170,dur,at=0,color,sub}){
  const lines=text.split("\n"); const longest=Math.max(...lines.map(l=>l.length));
  const fs=Math.round(Math.min(size, 1650/(longest*C.hScale*0.62+0.01)/1.0, size));
  const fz=Math.min(fs, Math.floor(960/(longest*(FW[C.fHead]||0.6))));
  const lh=fz*0.98; ev(at,"hit");
  lines.forEach((l,i)=>{const tw=textW(l,fz,C.fHead); bb({k:"head",n:l,x:540-tw/2,y:y+i*lh+fz*0.08,w:tw+6,h:fz*0.9,t0:at,t1:dur});});
  if(sub){const sf=Math.round(50*C.bScale); const tw=textW(sub,sf,C.fSerif); bb({k:"sub",n:sub,x:540-Math.min(920,tw)/2,y:y+lines.length*lh+18,w:Math.min(920,tw),h:sf*1.25*Math.ceil(tw/920),t0:at+0.25,t1:dur});}
  return <Layer at={at} dur={dur} anim={[{property:"opacity",from:0,to:1,at:0,duration:0.06}]}>
    {lines.map((l,i)=> <frame key={i} at={Math.min(i*0.08,0.3)} duration={Math.max(0.2,dur-at-Math.min(i*0.08,0.3))} width={W} height={H} layout="none"><group x={0} y={0} width={W} height={H} mask={{x:0,y:y+i*lh-10,width:W,height:lh+24}}>
      <group x={0} y={0} width={W} height={H} animate={[{property:"offsetY",from:lh*1.3,to:0,at:0,duration:0.42,easing:QUINT}]}>
        <text x={46} y={y+i*lh+7} width={988} align="center" fontFamily={C.fHead} fontWeight={C.wHead} fontSize={fz} lineHeight={0.98} color={C.coral}>{l}</text>
        <text x={40} y={y+i*lh} width={988} align="center" fontFamily={C.fHead} fontWeight={C.wHead} fontSize={fz} lineHeight={0.98} color={color||C.navy}>{l}</text>
      </group></group></frame>)}
    {sub?<frame at={0.25} duration={Math.max(0.2,dur-at-0.25)} width={W} height={H} layout="none"><group x={0} y={0} width={W} height={H} mask={{x:0,y:y+lines.length*lh+8,width:W,height:90}}>
      <group x={0} y={0} width={W} height={H} animate={[{property:"offsetY",from:80,to:0,at:0,duration:0.4,easing:QUINT}]}>
      <text x={80} y={y+lines.length*lh+18} width={920} align="center" fontFamily={C.fSerif} fontWeight={C.wBody} fontSize={Math.round(50*C.bScale)} color={C.cobalt}>{sub}</text></group></group></frame>:null}
  </Layer>;
}
// small label text anywhere
export function Label({text,x,y,w=600,size=40,at=0,dur,color,align="center",font,out,on}){
  { const fs=size*C.bScale, tw=Math.min(w,textW(text,fs,font||C.fBody)); const nl=Math.max(String(text).split("\n").length,Math.ceil(textW(text,fs,font||C.fBody)/w));
    bb({k:"label",n:text,x:align==="center"?x-tw/2:x,y:y,w:tw,h:fs*1.25*nl,t0:at,t1:out??dur,on}); }
  return <Layer at={at} dur={dur} out={out} anim={[{property:"opacity",from:0,to:1,at:0,duration:0.06}]}>
    <frame at={0} duration={Math.max(0.2,(out??dur)-at)} width={W} height={H} layout="none"><group x={0} y={0} width={W} height={H} mask={{x:0,y:y-6,width:W,height:size*1.3*(text.split("\n").length)+12}}>
    <group x={0} y={0} width={W} height={H} animate={[{property:"offsetY",from:size*1.3,to:0,at:0,duration:0.36,easing:QUINT}]}>
    <text x={x-(align==="center"?w/2:0)} y={y} width={w} align={align} fontFamily={font||C.fBody} fontWeight={C.wBody} fontSize={size*C.bScale} color={color||C.navy}>{text}</text></group></group></frame></Layer>;
}
// cross-out / stamp mark
export function XMark({x,y,size=180,at=0,dur,color}){
  const s=size/2; return <Layer at={at} dur={dur} anim={pop(0)} sfx="wrong"><path d={`M ${x-s} ${y-s} L ${x+s} ${y+s} M ${x+s} ${y-s} L ${x-s} ${y+s}`} x={0} y={0} width={W} height={H} stroke={{width:22,color:color||C.coral,cap:"round"}}/></Layer>;
}
export function Check({x,y,size=180,at=0,dur,color}){
  const s=size/2; return <Layer at={at} dur={dur} anim={pop(0)} sfx="right"><path d={`M ${x-s} ${y} L ${x-s*0.3} ${y+s*0.7} L ${x+s} ${y-s*0.7}`} x={0} y={0} width={W} height={H} stroke={{width:24,color:color||C.cobalt,cap:"round"}}/></Layer>;
}
// pulse ring highlight around a point
export function Ring({x,y,r=120,at=0,dur,color}){
  return <Layer at={at} dur={dur} sfx="ping" anim={[{property:"opacity",keyframes:[{at:0,value:0},{at:0.15,value:1},{at:0.9,value:1}]},{property:"scale",keyframes:[{at:0,value:0.6},{at:0.3,value:1.05},{at:0.6,value:1}]}]}>
    <rect x={x-r} y={y-r} width={r*2} height={r*2} radius={r} fill="#00000000" strokeColor={color||C.coral} strokeWidth={10}/></Layer>;
}
