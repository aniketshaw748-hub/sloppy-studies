// Whiteboard drawing: strokes appear in exam drawing order while the Marker mascot's tip draws them.
import { C } from "./theme.jsx";
import { ev, bb, textW } from "./prims.jsx";
const W=1080,H=1920;
// items: {rect:[x,y,w,h], label?, tone?} | {line:[x1,y1,x2,y2], arrow?, dashed?, label?} | {text:"..", x, y, size?, w?, color?} | {oval:[cx,cy,rx,ry], label?}
// returns nodes. Drawings in one scene run strictly in sequence (object first, then its labels).
export function Sketch({ items, at=0, dur, speed=2600, color, gap=0.05, together=false }) {
  const col=color||C.line; const out=[]; const mp=[]; if(!together) at=Math.max(at,globalThis.__SKEND||0); let t=at;
  // a stroke = short chunks that appear in order (works in any direction)
  const seg=(x1,y1,x2,y2,w=7,c=col,dashed=false,g=gap)=>{ const L=Math.hypot(x2-x1,y2-y1); const d=Math.max(0.015,L/speed); const t0=t;
    const k=Math.max(1,Math.ceil(L/(dashed?38:48)));
    for(let i=0;i<k;i++){ if(dashed&&i%2) continue; const a=i/k,b=(i+1)/k; const ta=t0+d*a; const len=Math.max(0.2,dur-ta);
      out.push(<frame at={Math.min(ta,Math.max(0,dur-0.2))} duration={dur-Math.min(ta,Math.max(0,dur-0.2))} width={W} height={H} layout="none">
        <path d={`M ${x1+(x2-x1)*a} ${y1+(y2-y1)*a} L ${x1+(x2-x1)*Math.min(1,b+0.02)} ${y1+(y2-y1)*Math.min(1,b+0.02)}`} x={0} y={0} width={W} height={H} stroke={{width:w,color:c,cap:"round"}} /></frame>); }
    mp.push({t:t0,x:x1,y:y1},{t:t0+d,x:x2,y:y2}); t+=d+g; };
  let parent=null;
  const txt=(s,x,y,size=58,w=600,c=C.navy,align="center")=>{ const d=Math.max(0.12,s.length*0.03); const t0=Math.min(t,Math.max(0,dur-0.2)); const len=dur-t0;
    const fs=Math.round(size*(C.bScale||1)); const tw=Math.min(w,s.length*fs*0.42+20); const x0=align==="center"?x-tw/2:x;
    out.push(<frame at={t0} duration={len} width={W} height={H} layout="none">
      <text x={align==="center"?x-w/2:x} y={y} width={w} align={align} fontFamily={C.fBody} fontWeight={C.wBody} fontSize={fs} color={c}
        motion={{by:"character",from:{opacity:0,y:6},at:0,duration:Math.min(d,len-0.05),overlap:0.6,easing:"linear"}}>{s}</text></frame>);
    { const ew=textW(s,fs,C.fBody), nl=Math.ceil(ew/w); const bw=Math.min(w,ew); bb({k:"stext",n:s,x:align==="center"?x-bw/2:x,y:y+fs*0.1,w:bw,h:fs*1.15*nl,t0:t0,t1:dur,parent}); }
    mp.push({t:t0,x:x0,y:y+fs},{t:t0+d,x:x0+tw,y:y+fs}); t+=d+gap; };
  ev(at,"marker");
  items.forEach(it=>{
    if(it.at!=null && it.at>t) t=it.at;
    if(it.rect){const [x,y,w,h]=it.rect; const pid="r"+Math.round(x)+"_"+Math.round(y)+"_"+Math.round(globalThis.__T0||0); bb({k:"srect",n:it.label||"rect",x,y,w,h,t0:t,t1:dur,id:pid}); parent=pid; seg(x,y,x+w,y,7,col,false,0); seg(x+w,y,x+w,y+h,7,col,false,0); seg(x+w,y+h,x,y+h,7,col,false,0); seg(x,y+h,x,y,7,col,false,gap);
      if(it.divider) it.divider.forEach(dy=>seg(x,y+dy,x+w,y+dy,5));
      if(it.label){ const lf=(it.size||56)*(C.bScale||1); txt(it.label,x+w/2,y+(it.divider?it.divider[0]/2:h/2)-lf*0.62,it.size||56,w-20,it.tone==="hot"?C.coral:C.navy); }
      if(it.lines) it.lines.forEach((l,i)=>txt(l,x+24,y+(it.divider?it.divider[0]:0)+18+i*54,40,w-40,C.navy,"left")); parent=null; }
    else if(it.line){const [x1,y1,x2,y2]=it.line; seg(x1,y1,x2,y2,6,it.color||col,it.dashed);
      if(it.arrow){const a=Math.atan2(y2-y1,x2-x1),L=30; seg(x2,y2,x2-L*Math.cos(a-0.5),y2-L*Math.sin(a-0.5),6,it.color||col); seg(x2,y2,x2-L*Math.cos(a+0.5),y2-L*Math.sin(a+0.5),6,it.color||col);}
      if(it.label) txt(it.label,(x1+x2)/2,(y1+y2)/2-(Math.abs(y2-y1)<4?70:30),it.size||44,420,it.labelColor||C.coral); }
    else if(it.oval){const [cx,cy,rx,ry]=it.oval; if(it.label){ const pid="o"+cx+"_"+cy; bb({k:"soval",n:it.label,x:cx-rx,y:cy-ry,w:rx*2,h:ry*2,t0:t,t1:dur,id:pid}); parent=pid; } const n=14; for(let i=0;i<n;i++){const a1=i/n*6.283,a2=(i+1)/n*6.283; seg(cx+rx*Math.cos(a1),cy+ry*Math.sin(a1),cx+rx*Math.cos(a2),cy+ry*Math.sin(a2),6,col,false,0);} if(it.label) txt(it.label,cx,cy-30,it.size||48,rx*2-30); parent=null;}
    else if(it.text) txt(it.text,it.x,it.y,it.size||58,it.w||700,it.color||C.navy,it.align||"center");
  });
  globalThis.__SKEND=Math.max(globalThis.__SKEND||0,t);   // next drawing in this scene waits for this one
  return out;
}
export const sketchEnd=(items,at=0,speed=2200)=>at; // (kept for API symmetry)
