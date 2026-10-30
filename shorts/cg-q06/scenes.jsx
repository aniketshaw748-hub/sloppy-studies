import { Box, Arrow, Label, Ring, Check, Table, Layer, Mover, bb, ev } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
import { C } from "./theme.jsx";
// cg-q06 v3 · Liang–Barsky: A(−1, 7) → B(11, 1), window 1 ≤ x ≤ 9, 2 ≤ y ≤ 8 → clipped (1, 6) to (9, 2).
const W = 1080, H = 1920;
// ONE mapping for every graph scene: 1 unit = 72 px
const U = 72, OX = 180, OY = 900; const P = (x, y) => [OX + x * U, OY - y * U];
const STATIC = [{ t: 0, x: 540, y: 960, z: 1 }, { t: 0.5, x: 540, y: 960, z: 1 }];
const [AX, AY] = P(-1, 7), [BX, BY] = P(11, 1), [WL, WT] = P(1, 8), [WR, WB] = P(9, 2);
const M = (n) => String(n).replace(/-/g, "−");
const PU = (u) => P(-1 + 12 * u, 7 - 6 * u);
const path = (k, d, at, end, col, w = 6, dash) => <frame key={k} at={Math.max(0, at)} duration={Math.max(0.2, end - Math.max(0, at))} width={W} height={H} layout="none"><path d={d} x={0} y={0} width={W} height={H} stroke={{ width: w, color: col, cap: "round" }} dash={dash} /></frame>;
function draw(k, segs, t0, end, col, w = 6, speed = 2400) {
  const out = []; let t = t0; ev(t0, "swish");
  segs.forEach(([x1, y1, x2, y2], si) => { const L = Math.hypot(x2 - x1, y2 - y1), dd = L / speed, n = Math.max(1, Math.ceil(L / 40));
    for (let i = 0; i < n; i++) { const a = i / n, b = Math.min(1, (i + 1) / n + 0.02); const ta = Math.min(t + dd * a, end - 0.2);
      out.push(path(k + si + "_" + i, `M ${x1 + (x2 - x1) * a} ${y1 + (y2 - y1) * a} L ${x1 + (x2 - x1) * b} ${y1 + (y2 - y1) * b}`, ta, end, col, w)); }
    t += dd; });
  return out;
}
const dot = (k, x, y, at, dur, col) => <Layer key={k} at={at} dur={dur} sfx="pop" anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.1 }, { property: "scale", from: 0.4, to: 1, at: 0, duration: 0.3 }]}>
  <rect x={x - 12} y={y - 12} width={24} height={24} radius={12} fill={col || C.navy} /></Layer>;
const WALL = { left: [WL, WT, WL, WB], right: [WR, WT, WR, WB], bottom: [WL, WB, WR, WB], top: [WL, WT, WR, WT] };
const wall = (k, which, at, end, col) => { const [a, b, c, e] = WALL[which]; return <Layer key={k} at={at} dur={end} sfx="ping" anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.2 }]}>
  <path d={`M ${a} ${b} L ${c} ${e}`} x={0} y={0} width={W} height={H} stroke={{ width: 14, color: col || C.coral, cap: "round" }} /></Layer>; };
function axes(d, { at = 0, xAt = {}, yAt = {} } = {}) {
  const [x0] = P(-1.4, 0), [x1] = P(11.7, 0), [, yt] = P(0, 8.7), [, yb] = P(0, -0.35);
  const tk = []; for (let i = -1; i <= 11; i++) { if (!i) continue; const [x] = P(i, 0); tk.push(`M ${x} ${OY - 8} L ${x} ${OY + 8}`); }
  for (let j = 1; j <= 8; j++) { const [, y] = P(0, j); tk.push(`M ${OX - 8} ${y} L ${OX + 8} ${y}`); }
  const n = [<Layer key="ax" at={at} dur={d} anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.25 }]}>
    <path d={`M ${x0} ${OY} L ${x1} ${OY} M ${OX} ${yb} L ${OX} ${yt}`} x={0} y={0} width={W} height={H} stroke={{ width: 5, color: C.navy, cap: "round" }} />
    <path d={`M ${x1 + 4} ${OY} L ${x1 - 20} ${OY - 11} L ${x1 - 20} ${OY + 11} Z M ${OX} ${yt - 4} L ${OX - 11} ${yt + 20} L ${OX + 11} ${yt + 20} Z`} x={0} y={0} width={W} height={H} fill={C.navy} />
    <path d={tk.join(" ")} x={0} y={0} width={W} height={H} stroke={{ width: 4, color: C.navy, cap: "round" }} /></Layer>];
  [-1, 1, 3, 5, 7, 9, 11].forEach(v => n.push(<Label key={"tx" + v} text={M(v)} x={P(v, 0)[0]} y={OY + 12} w={80} size={30} font={C.fMono} at={xAt[v] ?? at + 0.1} dur={d} />));
  [2, 8].forEach(v => n.push(<Label key={"ty" + v} text={String(v)} x={OX - 22} y={P(0, v)[1] - 19} w={60} size={30} font={C.fMono} at={yAt[v] ?? at + 0.1} dur={d} />));
  n.push(<Label key="xn" text="x" x={1026} y={OY + 10} w={40} size={34} font={C.fMono} at={at + 0.15} dur={d} />);
  n.push(<Label key="yn" text="y" x={210} y={250} w={40} size={34} font={C.fMono} at={at + 0.15} dur={d} />);
  return n;
}
function win(d, at = 0) {
  return [<Layer key="win" at={at} dur={d} anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.3 }]}>
    <rect x={WL} y={WT} width={WR - WL} height={WB - WT} fill={C.cobalt} opacity={0.08} />
    <path d={`M ${WL} ${WT} L ${WR} ${WT} L ${WR} ${WB} L ${WL} ${WB} Z`} x={0} y={0} width={W} height={H} stroke={{ width: 6, color: C.navy, cap: "round" }} /></Layer>,
  <Layer key="gd" at={at} dur={d}><path d={`M ${WL} ${OY} L ${WL} ${WB} M ${WR} ${OY} L ${WR} ${WB}`} x={0} y={0} width={W} height={H} stroke={{ width: 3, color: C.cobalt }} dash={[10, 10]} /></Layer>];
}
const ABlabels = (d, ta = 0, tb = 0) => [
  <Label key="la" text="A(−1,7)" x={AX} y={344} w={200} size={30} font={C.fMono} at={ta} dur={d} />,
  <Label key="lb" text="B(11, 1)" x={950} y={BY + 18} w={200} size={30} font={C.fMono} at={tb} dur={d} />];
const lineAB = (d, at = 0, w = 5) => [path("ab", `M ${AX} ${AY} L ${BX} ${BY}`, at, d, C.navy, w), dot("da", AX, AY, at, d), dot("db", BX, BY, at, d), ...ABlabels(d, at, at)];
const fig = (d, { line = true } = {}) => [...axes(d), ...win(d), ...(line ? lineAB(d) : [])];
const BEAD = (C) => <rect x={0} y={0} width={40} height={40} radius={20} fill={C.coral} strokeColor={C.navy} strokeWidth={4} />;
const mono = (k, text, y, at, dur, size = 44, color, x = 540, w = 1000, align = "center", out) => <Label key={k} text={text} x={x} y={y} w={w} size={size} font={C.fMono} at={at} out={out} dur={dur} color={color} align={align} />;
const FR = ["0", "1/6", "1/3", "1/2", "2/3", "5/6", "1"];

export const SCENES = ({ S, ctx, C, TOP, D, cue }) => {
  const SAt = (t, draw, o = {}) => { const s = S(null, draw, o); return { ...s, at: t, draw: d => { globalThis.__T0 = t; globalThis.__SKEND = 0; return draw(() => 0, d); } }; };
  const tEx = cue("In your exam"), NP = ANSWERS["cg-q06"].length, dp = (D - tEx) / NP;
  return [
  // Question: axes, A and B, the line, the window and its four edges.
  S(null, (r, d) => {
    const tA = r("A"), tB = r("B"), tW = r("window"), t1 = r("from 1") + 0.3, t9 = r("9"), t2 = r("2"), t8 = r("8");
    const n = [...axes(d, { xAt: { 1: t1, 9: t9 }, yAt: { 2: t2, 8: t8 } })];
    n.push(dot("da", AX, AY, tA, d), dot("db", BX, BY, tB, d), ...ABlabels(d, tA + 0.1, tB + 0.1));
    n.push(...draw("ab", [[AX, AY, BX, BY]], tB + 0.15, d, C.navy, 5, 1700));
    n.push(...draw("w", [[WL, WT, WR, WT], [WR, WT, WR, WB], [WR, WB, WL, WB], [WL, WB, WL, WT]], tW, d, C.navy, 6, 3200));
    n.push(<Layer key="wt" at={tW + 0.65} dur={d}><rect x={WL} y={WT} width={WR - WL} height={WB - WT} fill={C.cobalt} opacity={0.08} /></Layer>);
    n.push(<Layer key="g1" at={t1} dur={d}><path d={`M ${WL} ${OY} L ${WL} ${WB}`} x={0} y={0} width={W} height={H} stroke={{ width: 3, color: C.cobalt }} dash={[10, 10]} /></Layer>);
    n.push(<Layer key="g9" at={t9} dur={d}><path d={`M ${WR} ${OY} L ${WR} ${WB}`} x={0} y={0} width={W} height={H} stroke={{ width: 3, color: C.cobalt }} dash={[10, 10]} /></Layer>);
    n.push(wall("hl", "left", t1, t9), wall("hr", "right", t9, t2), wall("hb", "bottom", t2, t8), wall("ht", "top", t8, t8 + 1.2));
    n.push(<Label key="wn" text="window" x={540} y={WB - 60} w={240} size={36} color={C.cobalt} at={tW + 0.7} dur={d} />);
    return n;
  }, { cam: STATIC }),

  // Recall (Q4) + idea: the line as a moving point; u from 0 at A to 1 at B.
  S("This is the same", (r, d) => {
    const n = [...fig(d)];
    n.push(<Label key="wn" text="window" x={540} y={WB - 60} w={240} size={36} color={C.cobalt} at={0} dur={d} />);
    // recall card: Cohen–Sutherland clipping from Q4
    const tT = r("It treats"); bb({ k: "box", n: "recall Q4", x: 120, y: 990, w: 840, h: 290, t0: 0, t1: tT });
    const mx1 = 220, mx2 = 420, my1 = 1060, my2 = 1230, la = [170, 1090], lb = [480, 1210], yAt = (x) => la[1] + (lb[1] - la[1]) * (x - la[0]) / (lb[0] - la[0]);
    n.push(<Layer key="rc" at={0} out={tT} dur={d}>
      <rect x={120} y={990} width={840} height={290} radius={12} fill={C.paper} strokeColor={C.navy} strokeWidth={4} />
      <rect x={mx1} y={my1} width={mx2 - mx1} height={my2 - my1} fill={C.cobalt} opacity={0.12} />
      <path d={`M ${mx1} ${my1} L ${mx2} ${my1} L ${mx2} ${my2} L ${mx1} ${my2} Z`} x={0} y={0} width={W} height={H} stroke={{ width: 4, color: C.navy }} />
      <path d={`M ${la[0]} ${la[1]} L ${mx1} ${yAt(mx1)} M ${mx2} ${yAt(mx2)} L ${lb[0]} ${lb[1]}`} x={0} y={0} width={W} height={H} stroke={{ width: 4, color: C.navy }} dash={[8, 8]} opacity={0.45} />
      <path d={`M ${mx1} ${yAt(mx1)} L ${mx2} ${yAt(mx2)}`} x={0} y={0} width={W} height={H} stroke={{ width: 9, color: C.cobalt, cap: "round" }} /></Layer>);
    n.push(<Label key="rq" text="from Q4" x={720} y={1012} w={400} size={36} color={C.coral} at={0.1} out={tT} dur={d} />);
    n.push(<Label key="rn" text="Cohen–Sutherland" x={720} y={1080} w={420} size={38} at={0.2} out={tT} dur={d} />);
    n.push(<Label key="rk" text={"keep only the part\ninside the window"} x={720} y={1150} w={420} size={36} color={C.cobalt} at={r("Keep only")} out={tT} dur={d} />);
    // first sweep: u from 0 at A to 1 at B
    const tG = r("goes from"), tB1 = r("1 at B") + 0.6, tH = r("Here");
    n.push(<Mover key="b1" at={tT} out={tH} dur={d} cw={40} ch={40} pts={[{ t: tT, x: AX, y: AY }, { t: tG, x: AX, y: AY }, { t: tB1, x: BX, y: BY }]}>{BEAD(C)}</Mover>);
    n.push(<Label key="mp" text="moving point" x={540} y={1000} w={600} size={44} color={C.coral} at={r("moving")} out={tH} dur={d} />);
    n.push(<Label key="u0" text="u = 0" x={95} y={448} w={110} size={32} font={C.fMono} color={C.coral} at={r("0")} dur={d} />);
    n.push(<Label key="u1" text="u = 1" x={985} y={740} w={110} size={32} font={C.fMono} color={C.coral} at={r("1 at B")} dur={d} />);
    n.push(<Label key="ur" text="u: 0 → 1" x={540} y={1080} w={600} size={48} font={C.fMono} at={r("number")} out={tH} dur={d} />);
    // second sweep, in sixths, with the point's coordinates
    const tX = r("X is"), step = 0.72; const ts = FR.map((_, k) => tX + k * step);
    const pts = [{ t: tH, x: AX, y: AY }]; for (let k = 1; k <= 6; k++) { const [x0, y0] = PU((k - 1) / 6), [x1, y1] = PU(k / 6); pts.push({ t: ts[k] - 0.4, x: x0, y: y0 }, { t: ts[k], x: x1, y: y1 }); }
    n.push(<Mover key="b2" at={tH} dur={d} cw={40} ch={40} pts={pts}>{BEAD(C)}</Mover>);
    FR.forEach((f, k) => { const [x, y] = [-1 + 2 * k, 7 - k]; n.push(mono("c" + k, `u = ${f}  →  (${M(x)}, ${y})`, 1000, ts[k], d, 44, k === 0 || k === 6 ? C.coral : C.navy, 540, 1000, "center", k < 6 ? ts[k + 1] : undefined)); });
    n.push(mono("ex", "x = −1 + 12u", 1100, tX, d, 52));
    n.push(mono("ey", "y = 7 − 6u", 1185, r("Y is"), d, 52));
    return n;
  }, { cam: STATIC }),

  // Edge limits: each edge gives p and q; u = q / p.
  S("Each of the four", (r, d) => {
    const n = [...fig(d)];
    const t4 = r("four"), tPQ = r("P and"), tL = r("Left"), tRt = r("Right"), tBt = r("Bottom"), tTp = r("Top");
    const tL2 = r("6th"), tR2 = r("6ths"), tB2 = tBt + 0.8, tT2 = r("minus 1");
    ["left", "right", "bottom", "top"].forEach((w_, i) => n.push(wall("a" + i, w_, t4 + i * 0.3, t4 + i * 0.3 + 0.6, C.cobalt)));
    n.push(<Label key="lim" text="each edge → one limit on u" x={540} y={1000} w={960} size={44} color={C.coral} at={r("limit")} out={tPQ} dur={d} />);
    const cellAt = [[tL, tL + 0.15, tL + 0.3, tL2], [tRt, tRt + 0.15, tRt + 0.3, tR2], [tBt, tBt + 0.15, tBt + 0.3, tB2], [tTp, tTp + 0.15, tTp + 0.3, tT2]];
    n.push(...Table({ x: 60, y: 985, w: 960, cols: ["edge", "p", "q", "u = q/p"], rows: [["left", "−12", "−2", "1/6"], ["right", "12", "10", "5/6"], ["bottom", "6", "5", "5/6"], ["top", "−6", "1", "−1/6"]], rowH: 80, fs: 40, cellAt, dur: d, at: tPQ }));
    n.push(wall("wl", "left", tL, tRt), wall("wr", "right", tRt, tBt), wall("wb", "bottom", tBt, tTp), wall("wt", "top", tTp, d));
    n.push(<Label key="rl" text="1/6" x={300} y={560} w={100} size={40} font={C.fMono} color={C.coral} at={tL2} dur={d} />);
    n.push(<Label key="rr" text="5/6" x={890} y={560} w={100} size={40} font={C.fMono} color={C.coral} at={tR2} dur={d} />);
    n.push(<Label key="rb" text="5/6" x={540} y={772} w={100} size={40} font={C.fMono} color={C.coral} at={tB2} dur={d} />);
    n.push(<Label key="rt" text="−1/6" x={540} y={266} w={120} size={40} font={C.fMono} color={C.coral} at={tT2} dur={d} />);
    n.push(<Label key="dx" text="Δx = 12,  Δy = −6" x={540} y={1440} w={900} size={38} font={C.fMono} color={C.cobalt} at={tPQ + 0.4} dur={d} />);
    return n;
  }, { cam: STATIC }),

  // Enter / leave: p < 0 entering, p > 0 leaving; latest entry 1/6, earliest exit 5/6.
  S("When P is negative", (r, d) => {
    const tNeg = r("negative"), tPos = r("positive"), tLat = r("latest"), tEar = r("earliest"), tVis = r("5 6ths");
    const n = [];
    n.push(...Table({ x: 60, y: TOP + 30, w: 960, cols: ["edge", "p", "q", "q/p", "line is"], rows: [["left", "−12", "−2", "1/6", "entering"], ["right", "12", "10", "5/6", "leaving"], ["bottom", "6", "5", "5/6", "leaving"], ["top", "−6", "1", "−1/6", "entering"]], rowH: 80, fs: 34,
      cellAt: [[0.05, 0.05, 0.05, 0.05, tNeg + 0.3], [0.05, 0.05, 0.05, 0.05, tPos + 0.3], [0.05, 0.05, 0.05, 0.05, tPos + 0.6], [0.05, 0.05, 0.05, 0.05, tNeg + 0.6]], dur: d, at: 0.05 }));
    [0, 3].forEach((i, k) => n.push(<Layer key={"pn" + i} at={tNeg} dur={d} sfx={k ? undefined : "ping"}><rect x={60 + 192} y={TOP + 30 + (i + 1) * 86} width={186} height={80} radius={8} fill="#00000000" strokeColor={C.cobalt} strokeWidth={6} /></Layer>));
    [1, 2].forEach((i, k) => n.push(<Layer key={"pp" + i} at={tPos} dur={d} sfx={k ? undefined : "ping"}><rect x={60 + 192} y={TOP + 30 + (i + 1) * 86} width={186} height={80} radius={8} fill="#00000000" strokeColor={C.coral} strokeWidth={6} /></Layer>));
    // the u number line
    const NY = 900, NX = (u) => 230 + 690 * u;
    const tk = []; [-1 / 6, 0, 1 / 6, 5 / 6, 1].forEach(u => tk.push(`M ${NX(u)} ${NY - 12} L ${NX(u)} ${NY + 12}`));
    n.push(<Layer key="nl" at={0.15} dur={d} anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.25 }]}>
      <path d={`M 50 ${NY} L 1010 ${NY} ${tk.join(" ")}`} x={0} y={0} width={W} height={H} stroke={{ width: 5, color: C.navy, cap: "round" }} />
      <path d={`M 1018 ${NY} L 996 ${NY - 11} L 996 ${NY + 11} Z`} x={0} y={0} width={W} height={H} fill={C.navy} /></Layer>);
    [["−1/6", -1 / 6], ["0", 0], ["1/6", 1 / 6], ["5/6", 5 / 6], ["1", 1]].forEach(([s, u], i) => n.push(<Label key={"nt" + i} text={s} x={NX(u)} y={NY + 22} w={100} size={30} font={C.fMono} at={0.2} dur={d} />));
    n.push(<Label key="nu" text="u" x={1015} y={NY + 20} w={40} size={34} font={C.fMono} at={0.2} dur={d} />);
    const band = (k, u0, u1, at, col, keys) => <Layer key={k} at={at} dur={d} anim={keys ? [{ property: "opacity", keyframes: keys }] : [{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.25 }]}>
      <rect x={NX(u0)} y={NY - 13} width={NX(u1) - NX(u0)} height={26} radius={4} fill={col} opacity={0.75} /></Layer>;
    n.push(band("b0", 0, 1 / 6, 0.3, C.cobalt, [{ at: 0, value: 0 }, { at: 0.25, value: 1 }, { at: tLat - 0.3, value: 1 }, { at: tLat + 0.2, value: 0.12 }]));
    n.push(band("b2", 5 / 6, 1, 0.3, C.cobalt, [{ at: 0, value: 0 }, { at: 0.25, value: 1 }, { at: tEar - 0.3, value: 1 }, { at: tEar + 0.2, value: 0.12 }]));
    n.push(band("b1", 1 / 6, 5 / 6, 0.3, C.cobalt));
    n.push(<Layer key="b3" at={tVis} dur={d} anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.25 }]}><rect x={NX(1 / 6)} y={NY - 13} width={NX(5 / 6) - NX(1 / 6)} height={26} radius={4} fill={C.coral} /></Layer>);
    // entry and exit marks
    const mk = (k, x, ux, label, tone, at) => [<Box key={k} x={x} y={790} w={150} h={64} label={label} tone={tone} size={34} at={at} dur={d} />,
      <Arrow key={k + "a"} x1={x} y1={826} x2={NX(ux)} y2={NY - 18} at={at + 0.15} dur={d} width={5} color={tone === "hot" ? C.coral : C.cobalt} />];
    n.push(...mk("m4", NX(-1 / 6), -1 / 6, "enter", "b", tNeg + 0.6), ...mk("m1", NX(1 / 6), 1 / 6, "enter", "b", tNeg + 0.3));
    n.push(...mk("m2", NX(5 / 6), 5 / 6, "leave", "hot", tPos + 0.3));
    n.push(<Label key="s1" text="start: the latest entry" x={540} y={1010} w={900} size={38} color={C.cobalt} at={r("starts")} dur={d} />);
    n.push(mono("u1", "u1 = max(0, 1/6, −1/6) = 1/6", 1065, tLat, d, 42));
    n.push(<Label key="s2" text="end: the earliest exit" x={540} y={1165} w={900} size={38} color={C.coral} at={r("ends")} dur={d} />);
    n.push(mono("u2", "u2 = min(1, 5/6, 5/6) = 5/6", 1220, tEar, d, 42));
    n.push(mono("v", "visible: 1/6 ≤ u ≤ 5/6", 1340, tVis, d, 50, C.coral));
    return n;
  }, { cam: STATIC, hold: "The visible", holdY: 960 }),

  // Answer: u = 1/6 → (1, 6), u = 5/6 → (9, 2); the clipped line.
  S("Put those", (r, d) => {
    const n = [...fig(d)];
    const tGo1 = r("1 6th"), t16 = r("point"), tGo2 = r("5 6th"), t92 = r("gives 9"), tSo = r("So the");
    const [X1, Y1] = PU(1 / 6), [X2, Y2] = PU(5 / 6);
    n.push(<Mover key="bd" at={0.1} dur={d} cw={40} ch={40} pts={[{ t: 0.1, x: AX, y: AY }, { t: tGo1, x: AX, y: AY }, { t: tGo1 + 0.8, x: X1, y: Y1 }, { t: tGo2, x: X1, y: Y1 }, { t: tGo2 + 0.9, x: X2, y: Y2 }]}>{BEAD(C)}</Mover>);
    n.push(dot("k1", X1, Y1, tGo1 + 0.8, d, C.coral));
    n.push(<Label key="p1" text="(1, 6)" x={340} y={410} w={140} size={32} font={C.fMono} color={C.coral} at={t16} dur={d} />);
    n.push(<Label key="p2" text="(9, 2)" x={716} y={772} w={140} size={32} font={C.fMono} color={C.coral} at={t92 + 0.1} dur={d} />);
    n.push(path("gA", `M ${AX} ${AY} L ${X1} ${Y1}`, tSo, d, C.paper, 7), path("gB", `M ${X2} ${Y2} L ${BX} ${BY}`, tSo, d, C.paper, 7));
    n.push(path("gA2", `M ${AX} ${AY} L ${X1} ${Y1}`, tSo, d, C.navy, 4, [10, 10]), path("gB2", `M ${X2} ${Y2} L ${BX} ${BY}`, tSo, d, C.navy, 4, [10, 10]));
    n.push(...draw("vis", [[X1, Y1, X2, Y2]], tSo, d, C.coral, 12, 1500));
    n.push(mono("r1", "u = 1/6 → (−1 + 2, 7 − 1) = (1, 6)", 995, tGo1, d, 40));
    n.push(mono("r2", "u = 5/6 → (−1 + 10, 7 − 5) = (9, 2)", 1075, tGo2, d, 40));
    n.push(<Label key="res" text="clipped line: (1, 6) to (9, 2)" x={540} y={1200} w={1000} size={52} color={C.coral} at={tSo} dur={d} />);
    n.push(<Check key="ck" x={540} y={1330} size={70} at={tSo + 0.8} dur={d} />);
    return n;
  }, { cam: STATIC }),

  ...ANSWERS["cg-q06"].map((pg, k) => SAt(tEx + k * dp, (r, d) => [...AnswerCard({ page: pg, title: "WRITE THIS · 5 MARKS · " + (k + 1) + "/" + NP, at: 0, dur: d, y: TOP + 24 })], { cam: STATIC })),
  ];
};
