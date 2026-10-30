// Kit v2 worlds. Each subject's look has a reason (see GUIDE2.md).
const W=1080,H=1920;
export const THEMES = {
 // Compiler Design: a compiler lives in the terminal.
 terminal:{ paper:"#050E08", navy:"#9DFFC4", coral:"#FFB000", cobalt:"#2BD97A", chip:"#0B2214", chipText:"#C8FFDD", ink:"#03140A", line:"#2BD97A",
   fHead:"DejaVu Sans Mono", wHead:700, fBody:"DejaVu Sans Mono", wBody:700, fMono:"DejaVu Sans Mono", fSerif:"DejaVu Sans Mono", hScale:0.62, grain:0.10, mascot:"tok" },
 // OOP: a class is a blueprint; objects are built from it.
 blueprint:{ paper:"#0E3B82", navy:"#FFFFFF", coral:"#FFC94A", cobalt:"#8FD3FF", chip:"#134A9C", chipText:"#FFFFFF", ink:"#0A2A5E", line:"#FFFFFF",
   fHead:"Bebas Neue", wHead:400, fBody:"Space Mono", wBody:700, fMono:"DejaVu Sans Mono", fSerif:"Space Mono", hScale:1.0, grain:0.12, mascot:"obj" },
 // Software Engineering: UML is drawn on whiteboards; the exam asks you to draw.
 whiteboard:{ paper:"#F6F6F2", navy:"#1C1F26", coral:"#E0352B", cobalt:"#1F5FD1", chip:"#FFE45C", chipText:"#1C1F26", ink:"#1C1F26", line:"#1C1F26",
   fHead:"Caveat", wHead:700, fBody:"Caveat", wBody:700, fMono:"DejaVu Sans Mono", fSerif:"Caveat", hScale:1.15, bScale:1.35, grain:0.06, mascot:null },
 // Industrial Management: inventory, production and flow on a warehouse floor.
 warehouse:{ paper:"#C79A5E", navy:"#1A1611", coral:"#C8410B", cobalt:"#2F2A24", chip:"#E9D3A8", chipText:"#1A1611", ink:"#1A1611", line:"#1A1611",
   fHead:"Anton", wHead:400, fBody:"Oswald", wBody:600, fMono:"DejaVu Sans Mono", fSerif:"Oswald", hScale:1.0, grain:0.30, mascot:"crate" },
 // AI: an agent searching a state space.
 // Operating Systems: the machine room, where the OS juggles processes, memory and locks.
 machine:{ paper:"#141A22", navy:"#E9EEF3", coral:"#FFB000", cobalt:"#4FD1C5", chip:"#1F2833", chipText:"#E9EEF3", ink:"#0B0F14", line:"#E9EEF3",
   fHead:"Archivo Black, DejaVu Sans Mono", wHead:400, fBody:"Inter, DejaVu Sans Mono", wBody:700, fMono:"DejaVu Sans Mono", fSerif:"Inter, DejaVu Sans Mono", hScale:0.9, grain:0.08, mascot:null },
 // Computer Graphics: graph paper, because every answer is coordinates, lines and matrices.
 graph:{ paper:"#FBF6E8", navy:"#1B2A41", coral:"#E4572E", cobalt:"#2F6BFF", chip:"#FFE7A0", chipText:"#1B2A41", ink:"#1B2A41", line:"#1B2A41",
   fHead:"Archivo Black, DejaVu Sans Mono", wHead:400, fBody:"Inter, DejaVu Sans Mono", wBody:700, fMono:"DejaVu Sans Mono", fSerif:"Inter, DejaVu Sans Mono", hScale:0.9, grain:0.05, mascot:null },
 night:{ paper:"#0A0820", navy:"#EDE8FF", coral:"#22E5FF", cobalt:"#9B7BFF", chip:"#1B1446", chipText:"#EDE8FF", ink:"#07051A", line:"#9B7BFF",
   fHead:"Orbitron", wHead:700, fBody:"Inter", wBody:900, fMono:"DejaVu Sans Mono", fSerif:"Inter", hScale:0.7, grain:0.10, mascot:"bot" }
};
export const C = { ...THEMES.whiteboard };
export function useTheme(n){ Object.keys(C).forEach(k=>delete C[k]); Object.assign(C, THEMES[n]||THEMES.whiteboard, {name:n}); C.bScale=C.bScale||1; }
const SH = {
 terminal:`vec4 pixel(vec2 uv){ float s=step(0.5,fract(uv.y*640.0)); float v=length((uv-0.5)*vec2(1.0,1.5)); return vec4(0.0,0.0,0.0, s*0.22 + smoothstep(0.45,0.95,v)*0.75); }`,
 blueprint:`vec4 pixel(vec2 uv){ vec2 g=uv*vec2(1080.0,1920.0); vec2 a=abs(fract(g/54.0)-0.5); vec2 b=abs(fract(g/270.0)-0.5);
   float mi=1.0-smoothstep(0.0,0.035,min(0.5-a.x,0.5-a.y)); float ma=1.0-smoothstep(0.0,0.008,min(0.5-b.x,0.5-b.y));
   return vec4(1.0,1.0,1.0, mi*0.07+ma*0.16); }`,
 whiteboard:`vec4 pixel(vec2 uv){ float gl=smoothstep(0.35,0.0,abs(uv.x+uv.y*0.35-0.55))*0.35; return vec4(1.0,1.0,1.0,gl); }`,
 warehouse:`float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} vec4 pixel(vec2 uv){ vec2 g=uv*vec2(1080.0,1920.0);
   float f=h(floor(vec2(g.x/2.0,g.y/9.0))); float d=h(floor(g/3.0)); float a=(f>0.82?0.10:0.0)+(d>0.985?0.25:0.0); return vec4(0.25,0.15,0.05,a); }`,
 machine:`vec4 pixel(vec2 uv){ vec2 g=uv*vec2(1080.0,1920.0); float rk=step(0.5,fract(g.y/6.0))*0.025; float v=length((uv-0.5)*vec2(1.0,1.4)); return vec4(0.0,0.0,0.0, rk+smoothstep(0.35,0.95,v)*0.55); }`,
 graph:`vec4 pixel(vec2 uv){ vec2 g=uv*vec2(1080.0,1920.0); vec2 a=abs(fract(g/36.0)-0.5); vec2 b=abs(fract(g/180.0)-0.5);
   float mi=1.0-smoothstep(0.0,0.04,min(0.5-a.x,0.5-a.y)); float ma=1.0-smoothstep(0.0,0.008,min(0.5-b.x,0.5-b.y));
   return vec4(0.18,0.42,1.0, mi*0.10+ma*0.18); }`,
 night:`vec4 pixel(vec2 uv){ vec2 g=uv*vec2(1080.0,1920.0); vec2 c=fract(g/90.0)-0.5; float d=length(c*90.0); float dot=1.0-smoothstep(2.0,3.4,d);
   float v=length((uv-0.5)*vec2(1.0,1.4)); return vec4(0.6,0.5,1.0, dot*0.22*(1.0-v)); }`
};
// The world's background is baked once to bg/<theme>.png (renders ~3x faster than a live shader). BAKE=1 draws it live.
export function Set({ dur }) {
  if(globalThis.__BG) return <frame at={0} duration={dur} width={W} height={H} layout="none"><media file={globalThis.__BG} x={0} y={0} width={W} height={H} /></frame>;
  const n=C.name; const k=[];
  k.push(<rect x={0} y={0} width={W} height={H} fill={C.paper} />);
  if(n==="night") k.push(<rect x={0} y={0} width={W} height={H} fill={{kind:"radial",stops:[{offset:0,color:"#231A5C"},{offset:0.7,color:C.paper}]}} />);
  if(n==="machine") k.push(<rect x={0} y={0} width={W} height={H} fill={{kind:"radial",stops:[{offset:0,color:"#22303D"},{offset:0.75,color:C.paper}]}} />);
  if(n==="blueprint") k.push(<rect x={0} y={0} width={W} height={H} fill={{kind:"radial",stops:[{offset:0,color:"#1550A8"},{offset:0.7,color:C.paper}]}} />);
  k.push(<rect x={0} y={0} width={W} height={H} fill="#00000000" effects={[{kind:"shader",params:{glsl:SH[n]}}]} />);
  if(n==="warehouse") [0,1].forEach(i=>k.push(<rect key={"hz"+i} x={0} y={i?1896:0} width={W} height={24} fill="#1A1611" />, ...Array.from({length:26},(_,j)=> <path key={"s"+i+j} d={`M ${j*48} ${i?1896:0} L ${j*48+24} ${i?1896:0} L ${j*48+4} ${i?1920:24} L ${j*48-20} ${i?1920:24} Z`} x={0} y={0} width={W} height={H} fill="#F5C400" />)));
  return <frame at={0} duration={dur} width={W} height={H} layout="none">{k}</frame>;
}
export function Header({ left, right, dur }) {
  return <frame at={0} duration={dur} width={W} height={H} layout="none">
    <text x={64} y={70} width={560} fontFamily={C.fMono} fontWeight={700} fontSize={26} color={C.navy} letterSpacing={3}>{left}</text>
    <text x={456} y={70} width={560} align="right" fontFamily={C.fMono} fontWeight={700} fontSize={26} color={C.coral} letterSpacing={3}>{right}</text>
  </frame>;
}
// Question bar: the exact question as printed in the suggestion sheet, pinned at the top.
// qbarLayout() sizes the type so the longest question still fits; the content area starts at its bottom (TOP).
export function qbarLayout(text, table, after){
  const tl=table?table.length:0; let fs=34, n=1; const cnt=f=>{const c=Math.floor(968/(f*0.47)); return wrapLines(text,c).length+(after?wrapLines(after,c).length:0);};
  for(fs=34; fs>=22; fs-=2){ n=cnt(fs); if(n+tl*0.85<=5) break; }
  if(tl){ fs=30; n=cnt(fs); }                      // a question with a data table: keep text and table phone-readable
  const lh=Math.round(fs*1.28), tfs=tl?27:Math.max(20,fs-4), th=tl?Math.round(tl*tfs*1.3)+14:0, cpl=Math.floor(968/(fs*0.47));
  return { fs, lh, lines:wrapLines(text,cpl), after:after?wrapLines(after,cpl):[], h:30+n*lh+th+26, tfs, th };
}
function wrapLines(s,cpl){ const out=[]; let cur=""; for(const w of s.split(/\s+/)){ if((cur+" "+w).trim().length>cpl){ out.push(cur.trim()); cur=w; } else cur+=" "+w; } if(cur.trim()) out.push(cur.trim()); return out; }
export function QBar({ items, dur }) {
  return <frame at={0} duration={dur} width={W} height={H} layout="none">
    {items.map((q,i)=>{ const L=qbarLayout(q.text,q.table,q.after); const t1=i+1<items.length?items[i+1].t:dur; const len=Math.max(0.1,t1-q.t);
      return <frame key={i} at={q.t} duration={len} width={W} height={H} layout="none"
        animate={i?[{property:"opacity",from:0,to:1,at:0,duration:Math.min(0.25,len-0.01)}]:[]}>
        <rect x={0} y={0} width={W} height={L.h} fill={C.chip} />
        <rect x={0} y={L.h-5} width={W} height={5} fill={C.coral} />
        <text x={56} y={30} width={968} lineHeight={1.28} fontFamily={C.fBody} fontWeight={700} fontSize={L.fs} color={C.chipText}>{q.text}</text>
        {(q.table||[]).flatMap((row,j)=> row.map((cell,c)=> cell? <text key={"t"+j+"_"+c} x={56+[0,80,330,600][c]} y={30+L.lines.length*L.lh+10+j*Math.round(L.tfs*1.3)} width={270} fontFamily={C.fMono} fontWeight={700} fontSize={L.tfs} color={j<2?C.coral:C.chipText}>{cell}</text> : null).filter(Boolean))}
        {q.after? <text x={56} y={30+L.lines.length*L.lh+L.th} width={968} lineHeight={1.28} fontFamily={C.fBody} fontWeight={700} fontSize={L.fs} color={C.chipText}>{q.after}</text> : null}
      </frame>; })}
  </frame>;
}
export function Grain({ dur }) {
  return [];   // no animated grain: the world textures are baked into bg/<theme>.png (cardboard does not flicker)
  return <rect at={0} duration={dur} x={0} y={0} width={W} height={H} fill="#808080" blendMode="overlay"
    effects={[{kind:"film-grain",params:{grainAmount:C.grain,grainSize:1.5,scratchIntensity:0,vignetteStrength:0,fadeToSepia:0}}]} />;
}
// captions (subtitle-pacing): one breath per cue, ONE line, shown whole while it is said; hot word in accent.
// Font shrinks only as needed so a cue never wraps. cuts: scene-cut times; a cue starting <0.2 s before a cut starts on it.
const CW={"DejaVu Sans Mono":0.62,"Space Mono":0.62,"Inter":0.62,"Oswald":0.47,"Caveat":0.42,"Archivo Black":0.72};
const capW=(s,fs)=>[...s].reduce((a,ch)=>a+(/[A-Z0-9MW]/.test(ch)?1.25:/[ .,;:'!|il1…]/.test(ch)?0.55:1),0)*fs*(CW[C.fBody]||0.6);
export function Captions({ groups, dur, cuts=[] }) {
  const base=Math.round(54*(C.bScale||1));
  return <frame at={0} duration={dur} width={W} height={H} layout="none">
    {groups.map((g,gi)=>{ let t0=g.t0; const cut=cuts.find(c=>c>t0&&c-t0<0.2); if(cut) t0=cut;
      const t1=Math.min(dur,g.t1); const len=Math.max(0.2,t1-t0);
      const words=g.words.map(w=>C.name==="whiteboard"?w.w:w.w.toUpperCase()); const line=words.join(" ");
      const fs=Math.max(30,Math.min(base,Math.floor(base*920/Math.max(1,capW(line,base)))));
      const wpx=Math.min(1000,capW(line,fs)+70);
      return <frame key={gi} at={t0} duration={len} width={W} height={H} layout="none">
        <rect x={540-wpx/2} y={1616} width={wpx} height={fs+46} radius={C.name==="night"?40:8} fill={C.chip}
          shadow={{x:C.name==="night"?0:7,y:C.name==="night"?0:7,blur:C.name==="night"?24:0,color:C.name==="night"?C.cobalt:C.navy}} />
        <row x={40} y={1616+23} width={1000} gap={Math.round(fs*0.26)} wrap={false} justify="center">
          {words.map((w,wi)=> <text key={wi} fontFamily={C.fBody} fontWeight={C.wBody} fontSize={fs} color={wi===g.hot?C.coral:C.chipText}>{w}</text>)}
        </row></frame>;})}
  </frame>;
}
