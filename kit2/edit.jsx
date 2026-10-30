import { SPEC } from "./spec.js";
import { C, useTheme, Set, Header, Grain, Captions, QBar, qbarLayout } from "./theme.jsx";
import { EV, ev, BB } from "./prims.jsx";
import { SCENES } from "./scenes.jsx";
const W=1080,H=1920;
export default async (ctx) => {
  useTheme(SPEC.theme);
  const p = await ctx.project({ dir: ".", size: "1080x1920", fps: 30, background: C.paper });
  const voice = await p.add("../voice.mp3");
  globalThis.__BG = await p.add("./bg.png");
  await p.add("/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"); await p.add("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf");
  const D=SPEC.dur, words=SPEC.words, norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,""), nw=words.map(w=>norm(w.w));
  const match=(i,tk)=>tk.every((t,k)=>nw[i+k]&&(nw[i+k]===t||nw[i+k].startsWith(t)));
  const cue=(phrase,n=1)=>{const tk=phrase.split(/\s+/).map(norm).filter(Boolean); let c=0; for(let i=0;i<nw.length;i++) if(match(i,tk)&&++c===n) return words[i].t0; throw new Error("cue not found: "+phrase); };
  const cueFrom=(phrase,t0)=>{const tk=phrase.split(/\s+/).map(norm).filter(Boolean); for(let i=0;i<nw.length;i++){ if(words[i].t0+0.001<t0) continue; if(match(i,tk)) return words[i].t0; } throw new Error("cue not found after "+t0.toFixed(2)+"s: "+phrase); };
  const S=(phrase,draw,o={})=>{ const at=phrase? cue(phrase,o.n||1) : 0; const r=t=> typeof t==="string"? Math.max(0,cueFrom(t,at)-at) : (t||0);
    let cam=(o.cam||[]).map(c=>({...c,t:r(c.t)}));
    let holdT=null; if(o.hold){ holdT=r(o.hold); const last=cam.length?cam[cam.length-1]:{x:540,y:900,z:1.06}; cam=[...cam.filter(c=>c.t<holdT),{...last,t:Math.max(0,holdT-0.05)},{t:holdT+1.2,x:o.holdX||540,y:o.holdY||900,z:o.holdZ||1.0}]; }
    return {at,...o,cam,holdT,draw:d=>{ globalThis.__T0=at; globalThis.__SKEND=0; if(holdT!=null) ev(holdT,"resolve"); return draw(r,d); }}; };
  // question bar items: one question (whole video) or several, each from its cue
  const QI = SPEC.questions ? SPEC.questions.map((q,i)=>({text:q.text, table:q.table, after:q.after, t: i===0?0:cue(q.cue, q.n||1)})) : SPEC.question ? [{text:SPEC.question, table:SPEC.qtable, after:SPEC.qafter, t:0}] : null;
  const TOP = QI ? Math.max(...QI.map(q=>qbarLayout(q.text,q.table,q.after).h))+24 : 118;
  globalThis.__TOP=TOP;
  const list=SCENES({S,cue,D,ctx,C,TOP}).sort((a,b)=>a.at-b.at);
  const camKF=(s,d,i)=>{ let k=s.cam.length? s.cam : (i%3===0?[{t:0,x:540,y:900,z:1.0},{t:d,x:540,y:900,z:1.045}] : i%3===1?[{t:0,x:540,y:900,z:1.045},{t:d,x:540,y:900,z:1.0}] : [{t:0,x:520,y:900,z:1.02},{t:d,x:560,y:900,z:1.04}]);
    k=k.map(c=>({...c,t:Math.min(Math.max(0,c.t),d-0.02)})); const o=[]; k.forEach(c=>{ if(!o.length||c.t>o[o.length-1].t+0.01) o.push(c); }); if(o.length<2) o.push({...o[0],t:Math.min(d-0.01,o[0].t+0.02)});
    const z=c=>c.z||1; return [{property:"scale",keyframes:o.map(c=>({at:c.t,value:z(c)})),easing:"ease-in-out"},
      {property:"offsetX",keyframes:o.map(c=>({at:c.t,value:-(c.x-540)*z(c)})),easing:"ease-in-out"},{property:"offsetY",keyframes:o.map(c=>({at:c.t,value:-(c.y-960)*z(c)})),easing:"ease-in-out"}]; };
  const nodes=list.map((s,i)=>{ const t=i===0?0:s.at, e=i+1<list.length?list[i+1].at:D, d=e-t; if(i){ globalThis.__T0=0; ev(t-0.05,"whoosh"); }
    const kind = i===0? "none" : (s.cut||"slide");
    const tr = kind==="none"? [] : kind==="slide"
      ? [{property:"offsetY",from:90,to:0,at:0,duration:Math.min(0.45,d-0.02),easing:[0.22,1,0.36,1]},{property:"opacity",from:0,to:1,at:0,duration:Math.min(0.25,d-0.02)}]
      : kind==="whip"
      ? [{property:"offsetX",from:320,to:0,at:0,duration:Math.min(0.22,d-0.02),easing:[0.22,1,0.36,1]},{property:"opacity",from:0,to:1,at:0,duration:Math.min(0.08,d-0.02)}]
      : [{property:"scale",from:1.28,to:1,at:0,duration:Math.min(0.24,d-0.02),easing:[0.22,1,0.36,1]},{property:"opacity",from:0,to:1,at:0,duration:Math.min(0.08,d-0.02)}];
    return <frame key={i} at={t} duration={d} width={W} height={H} layout="none" origin="center" animate={tr}>
      <Set dur={d} />
      <frame at={0} duration={d} width={W} height={H} layout="none" origin="center" animate={camKF(s,d,i)}>{(globalThis.__SC=i, s.draw(d))}</frame>
    </frame>; });
  p.compose(<frame width={W} height={H} layout="none">{nodes}
      {QI ? <QBar dur={D} items={QI} /> : <Header dur={D} left={SPEC.header_left} right={SPEC.header_right} />}
      <Captions dur={D} groups={SPEC.captions} cuts={list.map(s=>s.at).filter(t=>t>0)} />
      <Grain dur={D} /></frame>, { at: 0, dur: D });
  p.cut(voice, { at: 0 });
  console.log("@@SFX"+JSON.stringify(EV.sort((a,b)=>a.t-b.t)));
  console.log("@@BB"+JSON.stringify({top:TOP,scenes:list.map((s,i)=>({i,t:i===0?0:s.at,e:i+1<list.length?list[i+1].at:D,cam:camKF(s,(i+1<list.length?list[i+1].at:D)-(i===0?0:s.at),i)})),boxes:BB}));
};
