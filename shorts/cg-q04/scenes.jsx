import { Label, Layer, Mover, Ring, Check, XMark, Box, bb } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
// cg-q04 v3 · Cohen–Sutherland: window 50 ≤ x ≤ 80, 10 ≤ y ≤ 40.
// One mapping for every figure: x-axis shown from 30 (axis break), U = 12 px per unit.
const W = 1080, H = 1920, U = 12, OY = 936;
const P = (x, y) => [108 + (x - 30) * U, OY - y * U];
const fr = (key, at, len, kids, anim) => <frame key={key} at={at} duration={Math.max(0.05, len)} width={W} height={H} layout="none" animate={anim || []}>{kids}</frame>;
const ln = (a, b) => `M ${a[0].toFixed(1)} ${a[1].toFixed(1)} L ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
const pth = (key, d, color, width, o = {}) => <path key={key} d={d} x={0} y={0} width={W} height={H} opacity={o.op} stroke={{ width, color, cap: "round" }} dash={o.dash} />;
function drawOn(key, pts, t0, until, color, width, speed = 2400) {
  const out = []; let t = t0;
  for (let s = 0; s + 1 < pts.length; s++) {
    const [x1, y1] = pts[s], [x2, y2] = pts[s + 1]; const L = Math.hypot(x2 - x1, y2 - y1); const n = Math.max(1, Math.ceil(L / 48)); const dt = L / speed;
    for (let i = 0; i < n; i++) { const a = i / n, b = Math.min(1, (i + 1) / n + 0.02); const ta = t + dt * a;
      out.push(fr(key + s + "_" + i, ta, until - ta, <path d={`M ${x1 + (x2 - x1) * a} ${y1 + (y2 - y1) * a} L ${x1 + (x2 - x1) * b} ${y1 + (y2 - y1) * b}`} x={0} y={0} width={W} height={H} stroke={{ width, color, cap: "round" }} />)); }
    t += dt;
  }
  return out;
}
// axes: x 30..104 (break mark at the corner), y 0..52; ticks every 10. hx/hy: {value: time} to light a tick label red.
function Axes(C, d, at, anim, hx = {}, hy = {}) {
  const [x0, y0] = P(30, 0), xe = P(104, 0)[0], ye = P(0, 52)[1]; const out = [];
  if (anim) { out.push(...drawOn("ax", [[x0, y0], [xe, y0]], at, d, C.navy, 5, 3600), ...drawOn("ay", [[x0, y0], [x0, ye]], at, d, C.navy, 5, 3600)); }
  else out.push(<Layer key="axs" at={0} dur={d}>{pth("a1", ln([x0, y0], [xe, y0]), C.navy, 5)}{pth("a2", ln([x0, y0], [x0, ye]), C.navy, 5)}</Layer>);
  const t2 = anim ? at + 0.25 : 0; const tk = [];
  for (let v = 40; v <= 100; v += 10) { const x = P(v, 0)[0]; tk.push(`M ${x} ${y0 - 9} L ${x} ${y0 + 9}`); }
  for (let v = 10; v <= 50; v += 10) { const y = P(0, v)[1]; tk.push(`M ${x0 - 9} ${y} L ${x0 + 9} ${y}`); }
  const brk = `M ${x0 + 14} ${y0 + 12} L ${x0 + 22} ${y0 - 12} M ${x0 + 26} ${y0 + 12} L ${x0 + 34} ${y0 - 12}`;
  out.push(<Layer key="tk" at={t2} dur={d}>{pth("t", tk.join(" "), C.navy, 4)}{pth("b", brk, C.navy, 4)}
    <path d={`M ${xe + 14} ${y0} L ${xe - 6} ${y0 - 11} L ${xe - 6} ${y0 + 11} Z`} x={0} y={0} width={W} height={H} fill={C.navy} />
    <path d={`M ${x0} ${ye - 14} L ${x0 - 11} ${ye + 6} L ${x0 + 11} ${ye + 6} Z`} x={0} y={0} width={W} height={H} fill={C.navy} /></Layer>);
  for (let v = 30; v <= 100; v += 10) { const h = hx[v];
    out.push(<Label key={"tx" + v} text={String(v)} x={P(v, 0)[0]} y={y0 + 14} w={70} size={30} font={C.fMono} at={t2} out={h} dur={d} />);
    if (h != null) out.push(<Label key={"hx" + v} text={String(v)} x={P(v, 0)[0]} y={y0 + 14} w={70} size={30} font={C.fMono} color={C.coral} at={h} dur={d} />); }
  for (let v = 10; v <= 50; v += 10) { const h = hy[v];
    out.push(<Label key={"ty" + v} text={String(v)} x={70} y={P(0, v)[1] - 19} w={60} size={30} font={C.fMono} at={t2} out={h} dur={d} />);
    if (h != null) out.push(<Label key={"hy" + v} text={String(v)} x={70} y={P(0, v)[1] - 19} w={60} size={30} font={C.fMono} color={C.coral} at={h} dur={d} />); }
  out.push(<Label key="xl" text="x" x={1024} y={y0 - 54} w={40} size={34} font={C.fMono} at={t2} dur={d} />);
  out.push(<Label key="yl" text="y" x={146} y={ye - 30} w={40} size={34} font={C.fMono} at={t2} dur={d} />);
  return out;
}
const WX = P(50, 40);
const Win = (C, d, at = 0) => <Layer key="win" at={at} dur={d} anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.3 }]}>
  <rect x={WX[0]} y={WX[1]} width={30 * U} height={30 * U} fill={C.cobalt} opacity={0.1} />
  {pth("wb", `M ${WX[0]} ${WX[1]} L ${WX[0] + 360} ${WX[1]} L ${WX[0] + 360} ${WX[1] + 360} L ${WX[0]} ${WX[1] + 360} Z`, C.navy, 6)}</Layer>;
const dotN = (C, key, p, col, at, dur, out, r = 12) => <Layer key={key} at={at} out={out} dur={dur}><rect x={p[0] - r} y={p[1] - r} width={2 * r} height={2 * r} radius={r} fill={col} strokeColor={C.navy} strokeWidth={3} /></Layer>;
// line piece styles
function Seg(C, key, a, b, style, at, dur, out) {
  const d = ln(a, b); let k, op = 1;
  if (style === "ink") k = [pth("i", d, C.navy, 7)];
  else if (style === "test") k = [pth("o", d, C.navy, 16), pth("i", d, C.chip, 9)];
  else if (style === "keep") k = [pth("i", d, C.cobalt, 11)];
  else if (style === "glow") return [Seg(C, key + "g", a, b, "halo", at, dur, out), Seg(C, key, a, b, "keep", at, dur, out)];
  else if (style === "halo") { k = [pth("g", d, C.cobalt, 32)]; op = 0.25; }
  else if (style === "reject") k = [pth("i", d, C.coral, 11)];
  else if (style === "gone") { k = [pth("i", d, C.navy, 5, { dash: [10, 12] })]; op = 0.4; }
  else { k = [pth("i", d, C.navy, 6)]; op = 0.22; }
  return <Layer key={key} at={at} out={out} dur={dur} anim={[{ property: "opacity", from: 0, to: op, at: 0, duration: 0.25 }]}>{k}</Layer>;
}
const tag = (C, key, text, cx, y, at, dur, out, color) => <Label key={key} text={text} x={cx} y={y} w={text.length * 18.6 + 6} size={30} font={C.fMono} color={color || C.navy} at={at} out={out} dur={dur} />;
const row = (C, key, text, y, at, dur, color, size = 36, x = 70) => <Label key={key} text={text} x={x} y={y} w={text.length * size * 0.62 + 6} size={size} font={C.fMono} align="left" color={color || C.navy} at={at} dur={dur} />;
// mono pieces written left to right on one row: [[text, at, color], ...]
function Pieces(C, key, x0, y, fs, parts, dur) {
  const cw = 0.62 * fs; let x = x0; const out = [];
  parts.forEach(([s, at, color], i) => { const lead = s.length - s.trimStart().length; x += lead * cw; s = s.trimStart(); out.push(<Label key={key + i} text={s} x={x} y={y} w={s.length * cw + 4} size={fs} font={C.fMono} align="left" color={color} at={at} dur={dur} />); x += s.length * cw; });
  return out;
}
const P1 = P(40, 15), P2 = P(75, 45), P3 = P(70, 20), P4 = P(100, 10);
const P1c = P(50, 165 / 7), P2c = P(415 / 6, 40), P4c = P(80, 50 / 3);
// the nine regions and their codes (T B R L)
const XB = [[30, 50], [50, 80], [80, 104]], YB = [[40, 52], [10, 40], [0, 10]];
const CODES = [["1001", "1000", "1010"], ["0001", "0000", "0010"], ["0101", "0100", "0110"]];
const LX = [40, 65, 92], LY = [46, 20, 5];
function Regions(C, d, times, labels = true) {
  const out = [];
  YB.forEach((yb, i) => XB.forEach((xb, j) => { const t = times[i * 3 + j]; if (t == null) return; const a = P(xb[0], yb[1]), b = P(xb[1], yb[0]);
    const ctr = i === 1 && j === 1, corner = i !== 1 && j !== 1;
    out.push(<Layer key={"rg" + i + j} at={t} dur={d} sfx="pop" anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.3 }]}>
      <rect x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} fill={ctr ? C.cobalt : C.coral} opacity={ctr ? 0.16 : corner ? 0.2 : 0.1} /></Layer>);
    if (labels) { const p = P(LX[j], LY[i]); out.push(<Label key={"rl" + i + j} text={CODES[i][j]} x={p[0]} y={p[1] - 22} w={104} size={38} font={C.fMono} color={ctr ? C.cobalt : C.coral} at={t + 0.1} dur={d} />); }
  }));
  return out;
}
const ext = (C, d, at) => <Layer key="ext" at={at} dur={d} sfx="swish" anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.4 }]}>
  {pth("e1", ln(P(50, 0), P(50, 52)), C.navy, 4, { dash: [14, 10] })}{pth("e2", ln(P(80, 0), P(80, 52)), C.navy, 4, { dash: [14, 10] })}
  {pth("e3", ln(P(30, 10), P(104, 10)), C.navy, 4, { dash: [14, 10] })}{pth("e4", ln(P(30, 40), P(104, 40)), C.navy, 4, { dash: [14, 10] })}</Layer>;
const ring = (C, key, p, r, at, dur, out) => <Layer key={key} at={at} out={out} dur={dur} sfx="ping" anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.15 }, { property: "scale", from: 0.6, to: 1, at: 0, duration: 0.3 }]}>
  <rect x={p[0] - r} y={p[1] - r} width={2 * r} height={2 * r} radius={r} fill="#00000000" strokeColor={C.coral} strokeWidth={8} /></Layer>;
const RDOT = (C) => <rect x={0} y={0} width={30} height={30} radius={15} fill={C.coral} strokeColor={C.navy} strokeWidth={4} />;
const DOT26 = (C) => <rect x={0} y={0} width={26} height={26} radius={13} fill={C.coral} strokeColor={C.navy} strokeWidth={3} />;
const camS = (d) => [{ t: 0, x: 540, y: 930, z: 1.0 }, { t: d, x: 540, y: 930, z: 1.03 }];
// tag anchors (centre x, top y)
const TG = { P1: [228, 778], P2: [762, 378], P1c: [232, 598], P2c: [462, 402], P3: [470, 690], P4: [920, 838], P4c: [835, 676] };
const Y0 = 1010, ST = 62; const RY = (i) => Y0 + i * ST;
// both lines with their four labelled ends
const Lines = (C, d, at = 0) => [Seg(C, "L1", P1, P2, "ink", at, d), Seg(C, "L2", P3, P4, "ink", at, d),
  dotN(C, "d1", P1, C.coral, at, d), dotN(C, "d2", P2, C.coral, at, d), dotN(C, "d3", P3, C.coral, at, d), dotN(C, "d4", P4, C.coral, at, d)];
const Tags = (C, d, at = 0, out) => [tag(C, "t1", "P1(40, 15)", ...TG.P1, at, d, out), tag(C, "t2", "P2(75, 45)", ...TG.P2, at, d, out),
  tag(C, "t3", "P3(70, 20)", ...TG.P3, at, d, out), tag(C, "t4", "P4(100, 10)", ...TG.P4, at, d, out)];
// recall of cg-q01: the window rectangle (2, 2)–(6, 10) inside a picture
function RecallQ1(C, d, at, out) {
  const bx = 250, by = 1030, bw = 580, bh = 290; bb({ k: "box", n: "recall Q1", x: bx, y: by, w: bw, h: bh, t0: at, t1: out });
  const m = (x, y) => [bx + 60 + x * 26, by + 250 - y * 20]; const a = m(2, 10), b = m(6, 2), o = m(0, 0);
  return [<Layer key="rc" at={at} out={out} dur={d} anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.2 }]}>
    <rect x={bx} y={by} width={bw} height={bh} radius={12} fill={C.paper} strokeColor={C.navy} strokeWidth={4} />
    {pth("ma", `M ${o[0]} ${o[1]} L ${o[0] + 200} ${o[1]} M ${o[0]} ${o[1]} L ${o[0]} ${o[1] - 225}`, C.navy, 4)}
    <rect x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} fill={C.cobalt} opacity={0.18} />
    {pth("mr", `M ${a[0]} ${a[1]} L ${b[0]} ${a[1]} L ${b[0]} ${b[1]} L ${a[0]} ${b[1]} Z`, C.navy, 5)}</Layer>,
    <Label key="rq" text="from Q1" x={bx + 400} y={by + 26} w={220} size={36} color={C.coral} at={at} out={out} dur={d} />,
    <Label key="rw" text="window" x={bx + 400} y={by + 110} w={220} size={40} color={C.cobalt} at={at + 0.15} out={out} dur={d} />,
    <Label key="rx" text="(2, 2) – (6, 10)" x={bx + 400} y={by + 180} w={320} size={30} font={C.fMono} at={at + 0.3} out={out} dur={d} />];
}

export const SCENES = ({ S, ctx, C, TOP, D, cue }) => {
  // a scene that starts at an absolute time (for answer pages that begin between words)
  const SAt = (t, draw, o = {}) => { const s = S(null, draw, o); return { ...s, at: t, draw: d => { globalThis.__T0 = t; globalThis.__SKEND = 0; return draw(() => 0, d); } }; };
  const tEx = cue("In your exam"), NP = ANSWERS["cg-q04"].length, dp = (D - tEx) / NP;
  return [
  // Question: axes, the two lines, then the window.
  S(null, (r, d) => {
    const out = [...Axes(C, d, 0, true)];
    out.push(...drawOn("l1", [P1, P2], 0.3, d, C.navy, 7, 1400), ...drawOn("l2", [P3, P4], 0.55, d, C.navy, 7, 1400));
    out.push(dotN(C, "d1", P1, C.coral, 0.3, d), dotN(C, "d2", P2, C.coral, 0.72, d), dotN(C, "d3", P3, C.coral, 0.55, d), dotN(C, "d4", P4, C.coral, 0.85, d));
    out.push(tag(C, "t1", "P1(40, 15)", ...TG.P1, 0.5, d), tag(C, "t2", "P2(75, 45)", ...TG.P2, 0.8, d), tag(C, "t3", "P3(70, 20)", ...TG.P3, 0.7, d), tag(C, "t4", "P4(100, 10)", ...TG.P4, 0.95, d));
    const w0 = r("clip"); const c = [P(50, 10), P(80, 10), P(80, 40), P(50, 40), P(50, 10)];
    out.push(...drawOn("win", c, w0, d, C.navy, 6, 2400));
    out.push(<Layer key="wf" at={w0 + 0.6} dur={d}><rect x={WX[0]} y={WX[1]} width={360} height={360} fill={C.cobalt} opacity={0.1} /></Layer>);
    out.push(<Label key="wl" text="window" x={528} y={WX[1] + 300} w={200} size={34} color={C.cobalt} at={w0 + 0.7} dur={d} />);
    return out;
  }, { cam: [{ t: 0, x: 540, y: 930, z: 1.0 }] }),

  // From zero: recall the window (Q1); clipping keeps the inside part; the window's bounds.
  S("Remember the window", (r, d) => {
    const out = [...Axes(C, d, 0, false, { 50: r("50"), 80: r("80") }, { 10: r("10"), 40: r("40") }), Win(C, d)];
    out.push(<Label key="wl" text="window" x={528} y={WX[1] + 300} w={200} size={34} color={C.cobalt} at={0} dur={d} />);
    const tIn = r("inside"), tCut = r("cutting");
    out.push(Seg(C, "L1", P1, P2, "ink", 0, d, tIn), Seg(C, "L2", P3, P4, "ink", 0, d, tIn));
    out.push(Seg(C, "k1", P1c, P2c, "keep", tIn, d), Seg(C, "k2", P3, P4c, "keep", tIn, d));
    out.push(Seg(C, "o1", P1, P1c, "ink", tIn, d, tCut), Seg(C, "o2", P2c, P2, "ink", tIn, d, tCut), Seg(C, "o3", P4c, P4, "ink", tIn, d, tCut));
    out.push(Seg(C, "g1", P1, P1c, "gone", tCut, d), Seg(C, "g2", P2c, P2, "gone", tCut, d), Seg(C, "g3", P4c, P4, "gone", tCut, d));
    out.push(dotN(C, "d1", P1, C.coral, 0, d), dotN(C, "d2", P2, C.coral, 0, d), dotN(C, "d3", P3, C.coral, 0, d), dotN(C, "d4", P4, C.coral, 0, d));
    out.push(...Tags(C, d, 0));
    out.push(...RecallQ1(C, d, 0.05, r("Clipping")));
    out.push(<Label key="c1" text="clipping: keep only the inside part" x={540} y={1030} w={980} size={42} color={C.cobalt} at={r("Clipping")} dur={d} />);
    out.push(<Label key="c2" text="cut the rest away" x={540} y={1100} w={900} size={42} color={C.coral} at={tCut} dur={d} />);
    out.push(<Label key="b1" text="50 ≤ x ≤ 80" x={540} y={1230} w={600} size={56} font={C.fMono} at={r("50")} dur={d} />);
    out.push(<Label key="b2" text="10 ≤ y ≤ 40" x={540} y={1330} w={600} size={56} font={C.fMono} at={r("10")} dur={d} />);
    return out;
  }, { cam: camS(14) }),

  // Codes: a point visits each side; its bit lights and the region gets its code.
  S("Cohen Sutherland gives", (r, d) => {
    const tT = r("above"), tB = r("below"), tR = r("right"), tL = r("left"), tIn = r("All zeros"), tC = r("inside");
    const tTest = r("Each digit");
    const rt = [tC, tT, tC + 0.15, tL, tIn, tR, tC + 0.3, tB, tC + 0.45];
    const out = [...Axes(C, d, 0, false), Win(C, d), ext(C, d, tTest), ...Regions(C, d, rt)];
    const pI = P(60, 30), pT = P(56, 46), pB = P(56, 5), pR = P(92, 32), pL = P(40, 32);
    out.push(<Mover key="mv" at={0.2} dur={d} cw={30} ch={30} pts={[{ t: 0.2, x: pI[0], y: pI[1] }, { t: tT - 0.4, x: pI[0], y: pI[1] }, { t: tT, x: pT[0], y: pT[1] }, { t: tB - 0.35, x: pT[0], y: pT[1] },
      { t: tB, x: pB[0], y: pB[1] }, { t: tR - 0.35, x: pB[0], y: pB[1] }, { t: tR, x: pR[0], y: pR[1] }, { t: tL - 0.3, x: pR[0], y: pR[1] }, { t: tL, x: pL[0], y: pL[1] },
      { t: tIn - 0.4, x: pL[0], y: pL[1] }, { t: tIn, x: pI[0], y: pI[1] }]}>{RDOT(C)}</Mover>);
    // the 4-digit code: one digit per question
    const BX = [270, 450, 630, 810], names = ["above", "below", "right", "left"], tests = ["y > 40", "y < 10", "x > 80", "x < 50"], when = [tT, tB, tR, tL];
    names.forEach((nm, i) => { out.push(<Box key={"nm" + i} x={BX[i]} y={1040} w={164} h={74} label={nm} tone="b" size={36} at={tTest + i * 0.12} dur={d} />);
      out.push(<Label key={"ts" + i} text={tests[i]} x={BX[i]} y={1094} w={170} size={34} font={C.fMono} at={tTest + 0.1 + i * 0.12} dur={d} />);
      const t1 = i < 3 ? when[i + 1] : tIn;
      out.push(<Layer key={"hl" + i} at={when[i]} out={t1} dur={d}><rect x={BX[i] - 92} y={996} width={184} height={260} radius={14} fill="#00000000" strokeColor={C.coral} strokeWidth={6} /></Layer>); });
    out.push(<Label key="cd" text="code" x={110} y={1166} w={130} size={38} at={r("four")} dur={d} />);
    const seq = [[r("four"), "0000"], [tT, "1000"], [tB, "0100"], [tR, "0010"], [tL, "0001"], [tIn, "0000"]];
    seq.forEach(([t, code], k) => { const t1 = k + 1 < seq.length ? seq[k + 1][0] : d;
      [...code].forEach((ch, i) => out.push(<Box key={"bit" + k + i} x={BX[i]} y={1192} w={120} h={92} label={ch} tone={ch === "1" ? "hot" : "a"} size={52} at={t} out={t1} dur={d} />)); });
    out.push(<Label key="one" text="1 = yes" x={330} y={1300} w={300} size={44} color={C.coral} at={r("One means")} dur={d} />);
    out.push(<Label key="zero" text="0000 = inside" x={740} y={1300} w={400} size={44} color={C.cobalt} at={tIn} dur={d} />);
    return out;
  }, { cam: [{ t: 0, x: 540, y: 950, z: 1.0 }] }),

  // Rules: keep, throw away, cut — one small line each.
  S("Then three rules", (r, d) => {
    const all = [0, 0, 0, 0, 0, 0, 0, 0, 0]; const out = [...Axes(C, d, 0, false), Win(C, d), ext(C, d, 0), ...Regions(C, d, all)];
    const tK = r("If both"), tKeep = r("Keep"), tX = r("ends have"), tThrow = r("Throw"), tO = r("Otherwise"), tE = r("edge"), tA = r("again");
    const a1 = P(56, 30), b1 = P(74, 36), a2 = P(84, 36), b2 = P(100, 24), a3 = P(36, 30), b3 = P(60, 34), c3 = P(50, 30 + 4 * 14 / 24);
    out.push(Seg(C, "s1", a1, b1, "ink", tK, d, tKeep), Seg(C, "s1k", a1, b1, "keep", tKeep, d), dotN(C, "s1a", a1, C.cobalt, tK, d, undefined, 10), dotN(C, "s1b", b1, C.cobalt, tK, d, undefined, 10));
    out.push(Seg(C, "s2", a2, b2, "ink", tX, d, tThrow), Seg(C, "s2r", a2, b2, "reject", tThrow, d), dotN(C, "s2a", a2, C.coral, tX, d, undefined, 10), dotN(C, "s2b", b2, C.coral, tX, d, undefined, 10));
    out.push(Seg(C, "s3", a3, b3, "test", tO, d, tE), Seg(C, "s3o", a3, c3, "test", tE, d, tE + 0.4), Seg(C, "s3g", a3, c3, "gone", tE + 0.4, d));
    out.push(Seg(C, "s3i", c3, b3, "test", tE, d, tA + 0.3), Seg(C, "s3k", c3, b3, "keep", tA + 0.3, d));
    out.push(dotN(C, "s3a", a3, C.chip, tO, d, tE + 0.4, 10), dotN(C, "s3b", b3, C.chip, tO, d, tA + 0.3, 10), dotN(C, "s3bk", b3, C.cobalt, tA + 0.3, d, undefined, 10), dotN(C, "s3c", c3, C.cobalt, tE + 0.3, d, undefined, 10));
    out.push(ring(C, "rc", c3, 26, tE, d, tA + 0.3));
    out.push(tag(C, "nc", "0000", 400, 470, tA, d, undefined, C.cobalt));
    out.push(<Check key="c1" x={650} y={600} size={56} at={tKeep} dur={d} />);
    out.push(<XMark key="x1" x={852} y={480} size={52} at={tThrow} dur={d} />);
    out.push(...Pieces(C, "r1", 70, RY(0), 38, [["0000 & 0000", tK, C.navy], [" → KEEP", tKeep, C.cobalt]], d));
    out.push(...Pieces(C, "r2", 70, RY(1) + 20, 38, [["0010 & 0010: same 1", r("same"), C.navy], [" → THROW AWAY", tThrow, C.coral]], d));
    out.push(...Pieces(C, "r3", 70, RY(2) + 40, 38, [["0001 & 0000: no shared 1", tO, C.navy], [" → CUT", r("cut"), C.navy]], d));
    out.push(<Label key="r4" text="cut at the window's edge, then check again" x={540} y={RY(4)} w={980} size={40} color={C.coral} at={tE} dur={d} />);
    return out;
  }, { cam: camS(17) }),

  // Line 1: codes, no shared 1, slope, cut at x = 50 and y = 40, keep the middle.
  S("Line one goes", (r, d) => {
    const out = [...Axes(C, d, 0, false), Win(C, d)];
    out.push(Seg(C, "g2", P3, P4, "ghost", 0, d));
    const tL = r("left"), tAb = r("above"), tSh = r("share"), tCt = r("we cut"), tSl = r("slope"), tC1 = r("Cutting"), tA = r("about"), tC2 = r("Cutting at Y"), tB = r("about 69"), tK = r("part between");
    const tA2 = tA + 0.9, tB2 = tB + 0.9;
    out.push(Seg(C, "l0", P1, P2, "ink", 0, d, tCt));
    out.push(Seg(C, "lA", P1, P1c, "test", tCt, d, tA2), Seg(C, "lAg", P1, P1c, "gone", tA2, d));
    out.push(Seg(C, "lB", P1c, P2c, "test", tCt, d, tK), Seg(C, "lBk", P1c, P2c, "keep", tK, d));
    out.push(Seg(C, "lC", P2c, P2, "test", tCt, d, tB2), Seg(C, "lCg", P2c, P2, "gone", tB2, d));
    out.push(<Mover key="m1" at={0} dur={d} cw={26} ch={26} pts={[{ t: 0, x: P1[0], y: P1[1] }, { t: tA, x: P1[0], y: P1[1] }, { t: tA2, x: P1c[0], y: P1c[1] }]}>{DOT26(C)}</Mover>);
    out.push(<Mover key="m2" at={0} dur={d} cw={26} ch={26} pts={[{ t: 0, x: P2[0], y: P2[1] }, { t: tB, x: P2[0], y: P2[1] }, { t: tB2, x: P2c[0], y: P2c[1] }]}>{DOT26(C)}</Mover>);
    out.push(tag(C, "p1", "P1(40, 15)", ...TG.P1, 0, d, tL), tag(C, "p1c", "P1 · 0001", ...TG.P1, tL, d, tA, C.coral));
    out.push(tag(C, "p2", "P2(75, 45)", ...TG.P2, 0, d, tAb), tag(C, "p2c", "P2 · 1000", ...TG.P2, tAb, d, tB, C.coral));
    out.push(tag(C, "q1", "(50, 23.57)", ...TG.P1c, tA2, d, undefined, C.cobalt), tag(C, "q2", "(69.17, 40)", ...TG.P2c, tB2, d, undefined, C.cobalt));
    out.push(ring(C, "i1", P1c, 30, tC1, d, tA2), ring(C, "i2", P2c, 30, tC2, d, tB2));
    // working, building downward
    out.push(row(C, "w1", "P1(40, 15): x < 50 → 0001", RY(0), tL, d));
    out.push(row(C, "w2", "P2(75, 45): y > 40 → 1000", RY(1), tAb, d));
    out.push(...Pieces(C, "w3", 70, RY(2), 36, [["0001 & 1000 = 0000", tSh, C.navy], [" → cut", tCt, C.coral]], d));
    out.push(...Pieces(C, "w4", 70, RY(3), 36, [["m = (45 − 15)/(75 − 40)", tSl, C.navy], [" = 6/7", r("six"), C.coral]], d));
    out.push(...Pieces(C, "w5", 70, RY(4), 36, [["x = 50: ", tC1, C.coral], ["y = 15 + (6/7)(10)", tC1 + 0.5, C.navy]], d));
    out.push(...Pieces(C, "w6", 70, RY(5), 36, [["  ≈ 23.57 → (50, 23.57)", tA, C.navy]], d));
    out.push(...Pieces(C, "w7", 70, RY(6), 36, [["y = 40: ", tC2, C.coral], ["x = 40 + (7/6)(25)", tC2 + 0.5, C.navy]], d));
    out.push(...Pieces(C, "w8", 70, RY(7), 36, [["  ≈ 69.17 → (69.17, 40)", tB, C.navy]], d));
    out.push(row(C, "w9", "keep (50, 23.57) – (69.17, 40)", RY(8), tK, d, C.cobalt, 38));
    out.push(<Check key="ck" x={880} y={RY(8) + 24} size={50} at={tK + 0.2} dur={d} />);
    return out;
  }, { cam: [{ t: 0, x: 540, y: 945, z: 1.0 }, { t: 25, x: 540, y: 945, z: 1.02 }] }),

  // Line 2: P3 inside, P4 right; slope; cut at x = 80. Then both kept pieces.
  S("Line two goes", (r, d) => {
    const out = [...Axes(C, d, 0, false), Win(C, d)];
    out.push(Seg(C, "a1", P1, P1c, "gone", 0, d), Seg(C, "a2", P1c, P2c, "keep", 0, d), Seg(C, "a3", P2c, P2, "gone", 0, d));
    out.push(dotN(C, "a1d", P1c, C.cobalt, 0, d), dotN(C, "a2d", P2c, C.cobalt, 0, d));
    out.push(tag(C, "q1", "(50, 23.57)", ...TG.P1c, 0, d, undefined, C.cobalt), tag(C, "q2", "(69.17, 40)", ...TG.P2c, 0, d, undefined, C.cobalt));
    const tI = r("inside"), tRt = r("right"), tSl = r("slope"), tC = r("Cutting"), tA = r("about"), tA2 = tA + 0.9, tK = tA + 1.2;
    out.push(Seg(C, "l0", P3, P4, "ink", 0, d, tRt + 0.6));
    out.push(Seg(C, "lA", P3, P4c, "test", tRt + 0.6, d, tK), ...Seg(C, "lAk", P3, P4c, "glow", tK, d), ...Seg(C, "k1", P1c, P2c, "glow", tK, d));
    out.push(Seg(C, "lB", P4c, P4, "test", tRt + 0.6, d, tA2), Seg(C, "lBg", P4c, P4, "gone", tA2, d));
    out.push(dotN(C, "p3d", P3, C.coral, 0, d));
    out.push(<Mover key="m4" at={0} dur={d} cw={26} ch={26} pts={[{ t: 0, x: P4[0], y: P4[1] }, { t: tA, x: P4[0], y: P4[1] }, { t: tA2, x: P4c[0], y: P4c[1] }]}>{DOT26(C)}</Mover>);
    out.push(tag(C, "p3", "P3(70, 20)", ...TG.P3, 0, d, tI), tag(C, "p3c", "P3 · 0000", ...TG.P3, tI, d, undefined, C.cobalt));
    out.push(tag(C, "p4", "P4(100, 10)", ...TG.P4, 0, d, tRt), tag(C, "p4c", "P4 · 0010", ...TG.P4, tRt, d, tA, C.coral));
    out.push(tag(C, "q4", "(80, 16.67)", ...TG.P4c, tA2, d, undefined, C.cobalt));
    out.push(ring(C, "i4", P4c, 30, tC, d, tA2));
    out.push(row(C, "w1", "P3(70, 20): inside → 0000", RY(0), tI, d));
    out.push(row(C, "w2", "P4(100, 10): x > 80 → 0010", RY(1), tRt, d));
    out.push(row(C, "w2b", "(y = 10 is on the edge, not below it)", RY(2), tRt + 0.6, d, C.navy, 34));
    out.push(...Pieces(C, "w4", 70, RY(3), 36, [["m = (10 − 20)/(100 − 70)", tSl, C.navy], [" = −1/3", r("minus"), C.coral]], d));
    out.push(...Pieces(C, "w5", 70, RY(4), 36, [["x = 80: ", tC, C.coral], ["y = 20 − (1/3)(10)", tC + 0.5, C.navy]], d));
    out.push(...Pieces(C, "w6", 70, RY(5), 36, [["  ≈ 16.67 → (80, 16.67)", tA, C.navy]], d));
    out.push(row(C, "w7", "keep (70, 20) – (80, 16.67)", RY(6) + 10, tK, d, C.cobalt, 38));
    out.push(<Check key="ck" x={760} y={RY(6) + 34} size={50} at={tK + 0.2} dur={d} />);
    return out;
  }, { cam: [{ t: 0, x: 540, y: 945, z: 1.0 }, { t: 12, x: 540, y: 945, z: 1.02 }] }),

  // Answer cards: "In your exam, write this" to the end, pages split evenly.
  ...ANSWERS["cg-q04"].map((pg, k) => SAt(tEx + k * dp, (r, d) => [...AnswerCard({ page: pg, title: "WRITE THIS · 5 MARKS · " + (k + 1) + "/" + NP, at: 0, dur: d, y: TOP + 24 })],
    { cam: [{ t: 0, x: 540, y: 960, z: 1.0 }] })),
  ];
};
