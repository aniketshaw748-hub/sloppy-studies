// QuestionCard + AnswerSheet: the question and the answer, each in the container native to the world
// (exam sheet / terminal / drawing title block / work order / mission briefing).
import { C } from "./theme.jsx";
import { ev, bb, textW, Layer } from "./prims.jsx";
const W=1080,H=1920, QUINT=[0.22,1,0.36,1];
const LOOK={ whiteboard:{tag:"EXAM · Q", box:"paper"}, terminal:{tag:"$ cat question_", box:"term"}, blueprint:{tag:"PROBLEM SHEET · Q", box:"sheet"},
  warehouse:{tag:"WORK ORDER #Q", box:"ticket"}, night:{tag:"MISSION · Q", box:"mission"} };
const fitSize=(s,w,max)=>{ let f=max; while(f>34){ const per=w/(f*0.56*(C.bScale||1)); if(Math.ceil(s.length/per)*f*1.25 < 520) break; f-=2; } return f; };
function Panel({x,y,w,h,tag,dur,at}){
  const n=C.name, k=[];
  const fill = n==="whiteboard"||n==="graph"?"#FFFFFF": n==="terminal"?"#06180C": n==="blueprint"?"#103F8A": n==="warehouse"?"#F3E6C8": n==="machine"?"#1F2833":"#160F3A";
  const edge = n==="night"?C.coral : C.navy;
  k.push(<rect x={x+10} y={y+12} width={w} height={h} radius={n==="night"?26:8} fill={n==="night"?C.cobalt:"#00000033"} opacity={n==="night"?0.35:1} />);
  k.push(<rect x={x} y={y} width={w} height={h} radius={n==="night"?26:8} fill={fill} strokeColor={edge} strokeWidth={n==="terminal"?3:5}
     shadow={n==="night"?{x:0,y:0,blur:40,color:C.cobalt}:undefined} />);
  if(n==="blueprint"){ k.push(<rect x={x+16} y={y+16} width={w-32} height={h-32} radius={4} fill="#00000000" strokeColor={C.navy} strokeWidth={2} />); }
  if(n==="warehouse"){ for(let i=0;i<Math.floor(w/40);i++) k.push(<rect key={"p"+i} x={x+14+i*40} y={y+92} width={20} height={6} radius={3} fill="#B9A27A" />); }
  if(n==="terminal"){ [0,1,2].forEach(i=>k.push(<rect key={"d"+i} x={x+24+i*34} y={y+24} width={20} height={20} radius={10} fill={["#FF5F56","#FFBD2E","#27C93F"][i]} />)); }
  k.push(<text x={x+(n==="terminal"?140:34)} y={y+22} width={w-180} fontFamily={C.fMono} fontWeight={700} fontSize={32} letterSpacing={2}
     color={n==="whiteboard"||n==="warehouse"?C.coral:C.coral}>{tag}</text>);
  return <Layer at={at} dur={dur} anim={[{property:"opacity",from:0,to:1,at:0,duration:0.15},{property:"offsetY",from:80,to:0,at:0,duration:0.5,easing:QUINT}]}>{k}</Layer>;
}
// QuestionCard: shows the exam question, typed/written in at reading speed.
export function QuestionCard({ text, n=1, marks=5, at=0, dur, y=430, typeDur }){
  const x=70,w=940; const fs=fitSize(text,w-80,64); const per=(w-80)/(fs*0.56*(C.bScale||1)); const lines=Math.ceil(text.length/per);
  const h=150+lines*fs*1.25*(C.bScale||1)+90; const td=typeDur||Math.min(4.5,Math.max(1.2,text.length*0.035));
  ev(at,"hit"); ev(at+0.3,"type");
  bb({k:"box",n:"question card",x,y,w:w+10,h:h+12,t0:at,t1:dur});
  const textCol = C.name==="whiteboard"||C.name==="warehouse"? C.navy : C.navy;
  return [ <Panel key="p" x={x} y={y} w={w} h={h} tag={LOOK[C.name].tag+n+"   ·   "+marks+" MARKS"} dur={dur} at={at} />,
    <Layer key="t" at={Math.min(dur-0.3,at+0.35)} dur={dur} anim={[{property:"opacity",from:1,to:1,at:0,duration:0.05}]}>
      <text x={x+40} y={y+130} width={w-80} fontFamily={C.fBody} fontWeight={C.wBody} fontSize={Math.round(fs*(C.bScale||1))} lineHeight={1.25} color={textCol}
        motion={{by:"character",from:{opacity:0},at:0,duration:Math.min(td,Math.max(0.3,dur-at-0.5)),overlap:0.5,easing:"linear"}}>{text}</text>
    </Layer> ];
}
// AnswerSheet: what to write in the exam. points appear at times[i] (scene seconds), each ticked.
export function AnswerSheet({ points, times=[], title="WRITE THIS", at=0, dur, y=300, fs=44 }){
  const x=60,w=960; const f=Math.round(fs*(C.bScale||1)); const lh=f*1.22;
  const per=(w-150)/(f*0.56); const rows=points.map(p=>Math.max(1,Math.ceil(p.length/per)));
  const h=130+rows.reduce((a,b)=>a+b,0)*lh+points.length*22+40;
  bb({k:"box",n:"answer sheet",x,y,w:w+10,h:h+12,t0:at,t1:dur});
  let yy=y+120; const out=[<Panel key="p" x={x} y={y} w={w} h={h} tag={title} dur={dur} at={at} />];
  points.forEach((p,i)=>{ const t=times[i]!=null?times[i]:at+0.6+i*1.2; ev(t,"tick");
    out.push(<Layer key={"n"+i} at={t} dur={dur} anim={[{property:"opacity",from:0,to:1,at:0,duration:0.12},{property:"offsetX",from:-30,to:0,at:0,duration:0.35,easing:QUINT}]}>
      <rect x={x+34} y={yy+6} width={52} height={52} radius={26} fill={C.coral} />
      <text x={x+34} y={yy+12} width={52} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={32} color={C.ink}>{String(i+1)}</text>
      <text x={x+110} y={yy} width={w-150} fontFamily={C.fBody} fontWeight={C.wBody} fontSize={f} lineHeight={1.22} color={C.navy}>{p}</text>
    </Layer>); yy+=rows[i]*lh+22; });
  return out;
}

// mono rows keep their columns: the renderer collapses repeated spaces, so each run of non-spaces is placed at its column
const monoRuns = line => { const out = []; let col = 0; for (const m of line.split(/(\s+)/)) { if (m && !/^\s+$/.test(m)) out.push({ s: m, col }); col += [...m].length; } return out; };
// AnswerCard: the scannable "WRITE THIS" card. The lead (the answer at a glance) is the biggest thing and the only accent;
// each item is a bold key with its detail one step smaller and quieter; code and matrices sit in mono rows.
// page = ANSWERS[id][k] (see answers.jsx). Lines reveal one by one: on `times` if given, else spread over the scene.
export function AnswerCard({ page, title = "WRITE THIS", at = 0, dur, y = 300, fs = 40, times, bottom = 1480 }){
  const x = 72, w = 936, ix = x + 42, iw = w - 84;
  const groups = page.groups || [{ lead: page.lead, items: page.items || [], q: page.q }];
  const fam = f => String(f).split(",")[0].trim();
  const wrap = (s, size, font, width = iw) => { const lines = []; let cur = "";
    const toks = []; let depth = 0;
    for (const w of String(s).split(" ")) { if (depth > 0 && toks.length) toks[toks.length - 1] += " " + w; else toks.push(w);
      depth += (w.match(/[(\[]/g) || []).length - (w.match(/[)\]]/g) || []).length; if (depth < 0) depth = 0; }
    for (const w of toks) { const t = cur ? cur + " " + w : w; if (cur && textW(t, size, fam(font)) * (fam(font) === "Archivo Black" ? 1.2 : 1.06) > width) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur); return lines; };
  const leadRows = (s, size) => Math.max(1, Math.ceil(textW(s, size, "Archivo Black") * 1.02 / iw));   // cautious: a wrong guess leaves space, never a collision
  const monoFit = (lines, size) => Math.min(size, (iw - 20) / (Math.max(...lines.map(l => [...l].length)) * 0.602));
  const rowsOf = (s, size, font) => Math.max(1, Math.ceil(textW(s, size, String(font).split(",")[0].trim()) * 1.0 / iw));   // first family = the measured face
  const layout = s => {                       // returns [elements, height] at scale s
    const L0 = Math.min(fs * 1.15 * s, 64);
    // the lead stays the biggest thing: pick its size first (one line if possible), then cap everything else below it
    const leadSize = g => { const src = [].concat(g.lead || []); for (const k of [1, 0.9, 0.82]) if (src.every(t => wrap(t, L0 * k, "Archivo Black").length === 1)) return L0 * k; return L0 * 0.82; };
    const Lmin = Math.min(...groups.filter(g => g.lead).map(leadSize), L0);
    const L = L0, K = Math.min(fs * 0.95 * s, Lmin * 0.84), D = Math.min(fs * 0.85 * s, Lmin * 0.72), M = Math.min(fs * 0.8 * s, Lmin * 0.68), Q = Math.min(fs * 0.8 * s, Lmin * 0.6);
    const el = []; let yy = y + 92;
    groups.forEach((g, gi) => {
      if (gi) { el.push({ kind: "rule", y: yy + 4 }); yy += 30; }
      if (g.q) { const ls = wrap(g.q, Q, C.fBody); el.push({ kind: "q", y: yy, lines: ls, size: Q }); yy += ls.length * Q * 1.3 + 8; }
      if (g.lead) { const src = [].concat(g.lead); const LL = leadSize(g);   // one line where it fits, else two lines at the smallest lead size
        const ls = src.flatMap(t => wrap(t, LL, "Archivo Black")); el.push({ kind: "lead", y: yy, lines: ls, size: LL, rev: true }); yy += ls.length * LL * 1.22 + 18; }
      (g.items || []).forEach(it => {
        const y0 = yy;
        const parts = [];
        if (it.k) { const ls = wrap(it.k, K, C.fBody); parts.push({ kind: "key", y: yy, lines: ls, size: K }); yy += ls.length * K * 1.22 + 4; }
        const MM = it.code ? monoFit(it.code, M) : M;
        (it.code || []).forEach(line => { parts.push({ kind: "code", y: yy, text: line, size: MM }); yy += MM * 1.34; });
        if (it.code) yy += 4;
        if (it.d) { const ls = wrap(it.d, D, C.fBody); parts.push({ kind: "detail", y: yy, lines: ls, size: D }); yy += ls.length * D * 1.3; }
        el.push({ kind: "item", y: y0, parts, rev: true }); yy += 20 * s;
      });
      yy += 6;
    });
    return [el, yy - y + 44];
  };
  let s = 1, el, h;
  for (s = 1.6; s >= 0.7; s -= 0.04) { [el, h] = layout(s); if (y + h <= bottom) break; }   // as large as fits above the captions
  bb({ k: "box", n: "answer sheet", x, y, w: w + 10, h: h + 12, t0: at, t1: dur });
  const revs = el.filter(e => e.rev), n = revs.length, span = Math.max(1, dur - at);
  const step = Math.min(1.1, (span * 0.75) / Math.max(1, n));
  revs.forEach((e, i) => { e.t = times && times[i] != null ? times[i] : at + 0.35 + i * step; ev(e.t, "tick"); });
  const out = [<Panel key="p" x={x} y={y} w={w} h={h} tag={title} dur={dur} at={at} />];
  const fade = t => [{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.14 }, { property: "offsetX", from: -24, to: 0, at: 0, duration: 0.32, easing: QUINT }];
  let lastT = at;
  el.forEach((e, i) => {
    if (e.kind === "rule") { out.push(<Layer key={"r" + i} at={lastT} dur={dur}><rect x={ix} y={e.y} width={iw} height={2} fill={C.navy} opacity={0.18} /></Layer>); return; }
    if (e.kind === "q") { out.push(<Layer key={"q" + i} at={lastT} dur={dur}>{e.lines.map((ln, j) => <text key={j} x={ix} y={e.y + j * e.size * 1.3} width={iw + 60} fontFamily={C.fBody} fontWeight={600} fontSize={e.size} color={C.navy} opacity={0.66}>{ln}</text>)}</Layer>); return; }
    if (e.kind === "lead") { lastT = e.t; out.push(<Layer key={"l" + i} at={e.t} dur={dur} anim={fade()}>{e.lines.map((ln, j) => <text key={j} x={ix} y={e.y + j * e.size * 1.22} width={iw + 60} fontFamily={C.fHead} fontWeight={C.wHead || 400} fontSize={e.size} color={C.coral}>{ln}</text>)}</Layer>); return; }
    lastT = e.t;
    out.push(<Layer key={"i" + i} at={e.t} dur={dur} anim={fade()}>{e.parts.map((p, j) =>
      p.kind === "key" ? <group key={j} x={0} y={0} width={W} height={H}>{p.lines.map((ln, q) => <text key={q} x={ix} y={p.y + q * p.size * 1.22} width={iw + 60} fontFamily={C.fBody} fontWeight={700} fontSize={p.size} color={C.navy}>{ln}</text>)}</group>
      : p.kind === "code" ? (!monoRuns(p.text).length ? null : <group key={j} x={0} y={0} width={W} height={H}>{monoRuns(p.text).map((r, q) =>
          <text key={q} x={ix + 12 + r.col * p.size * 0.602} y={p.y} width={r.s.length * p.size * 0.62 + 8} fontFamily={C.fMono} fontWeight={700} fontSize={p.size} color={C.navy}>{r.s}</text>)}</group>)
      : <group key={j} x={0} y={0} width={W} height={H}>{p.lines.map((ln, q) => <text key={q} x={ix} y={p.y + q * p.size * 1.3} width={iw + 60} fontFamily={C.fBody} fontWeight={500} fontSize={p.size} color={C.navy} opacity={0.78}>{ln}</text>)}</group>)}</Layer>);
  });
  return out;
}

