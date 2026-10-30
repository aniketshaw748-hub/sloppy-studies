import { Label, Layer, Ring, Check, XMark, Box, Arrow, bb, ev } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
// cg-q12 · curves, smooth curves, the natural cubic spline.
// Spline data (real): points P_i = (x, y) = (2t, y_i) at t_i = i, y = [1, 2.5, 2, 5, 2, 3], n = 5.
// Natural cubic spline in t (h = 1): M[i-1] + 4M[i] + M[i+1] = 6(y[i-1] - 2y[i] + y[i+1]), M0 = M5 = 0
//   -> RHS [-12, 21, -36, 24], M = [0, -5.53, 10.11, -13.89, 9.47, 0]. x(t) = 2t exactly.
const W = 1080, H = 1920;
const Y = [1, 2.5, 2, 5, 2, 3];
const pth = (pts) => pts.map((p, i) => (i ? "L " : "M ") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
// natural cubic spline, uniform h = 1 (Thomas algorithm on tridiag(1,4,1))
const natM = (y) => { const n = y.length - 1, m = n - 1, rhs = (i) => 6 * (y[i + 1] - 2 * y[i] + y[i - 1]);
  const cp = [], dp = []; cp[0] = 1 / 4; dp[0] = rhs(1) / 4;
  for (let k = 1; k < m; k++) { const den = 4 - cp[k - 1]; cp[k] = 1 / den; dp[k] = (rhs(k + 1) - dp[k - 1]) / den; }
  const x = []; x[m - 1] = dp[m - 1]; for (let k = m - 2; k >= 0; k--) x[k] = dp[k] - cp[k] * x[k + 1];
  return [0, ...x, 0]; };
const evS = (y, M, t) => { const i = Math.min(Math.floor(t), y.length - 2), u = t - i;
  return (M[i] * (1 - u) ** 3 + M[i + 1] * u ** 3) / 6 + (y[i] - M[i] / 6) * (1 - u) + (y[i + 1] - M[i + 1] / 6) * u; };
const dS = (y, M, t) => { const i = Math.min(Math.floor(t), y.length - 2), u = t - i;
  return (-M[i] * (1 - u) ** 2 + M[i + 1] * u * u) / 2 + (y[i + 1] - y[i]) - (M[i + 1] - M[i]) / 6; };
const lag = (y, t) => y.reduce((s, yi, i) => s + yi * y.reduce((p, _, j) => (j === i ? p : p * (t - j) / (i - j)), 1), 0);
const MY = natM(Y);
// the spline figure: ONE mapping for every spline scene
const SU = 72, SX = 180, SY = 690; const SP = (x, y) => [SX + x * SU, SY - y * SU];

export const SCENES = ({ S, cue, D, ctx, C, TOP }) => {
  const tExam = cue("In your exam"), tMid = tExam + (D - tExam) / 2;
  // ---------- helpers (d = scene length) ----------
  const fr = (d, key, at, len, kids, anim) => { const a = Math.min(Math.max(0, at), d - 0.05); const l = Math.max(0.04, Math.min(len, d - a));
    return <frame key={key} at={a} duration={l} width={W} height={H} layout="none" animate={anim || []}>{kids}</frame>; };
  const fade = (dd = 0.25) => [{ property: "opacity", from: 0, to: 1, at: 0, duration: dd }];
  const line = (key, pts, color, width, o = {}) => <path key={key} d={pth(pts)} x={0} y={0} width={W} height={H} opacity={o.op} dash={o.dash} stroke={{ width, color, cap: "round" }} />;
  // stroke that draws itself between t0 and t1 (chunks by arc length), visible until `until`
  const drawOn = (d, key, pts, t0, t1, until, color, width, op) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const tot = L[L.length - 1] || 1, out = []; let s = 0; ev(t0, "draw");
    for (let i = 1; i < pts.length; i++) if (L[i] - L[s] >= 30 || i === pts.length - 1) { const ta = t0 + (t1 - t0) * L[s] / tot;
      out.push(fr(d, key + "_" + i, ta, until - ta, line("l", pts.slice(s, i + 1), color, width, { op }))); s = i; }
    return out; };
  const dot = (d, key, x, y, r, fill, at, until, stroke) => fr(d, key, at, (until ?? d) - at,
    <rect x={x - r} y={y - r} width={2 * r} height={2 * r} radius={r} fill={fill} strokeColor={stroke || C.navy} strokeWidth={4} />, fade(0.15));
  const ring = (d, key, x, y, r, color, at, until, w = 5) => fr(d, key, at, (until ?? d) - at,
    <rect x={x - r} y={y - r} width={2 * r} height={2 * r} radius={r} fill="#00000000" strokeColor={color} strokeWidth={w} />, fade(0.15));
  const L = (key, text, x, y, at, d, o = {}) => <Label key={key} text={text} x={x} y={y} w={o.w || 960} size={o.size || 38} font={o.font || C.fMono} align={o.align || "center"} color={o.color} at={at} out={o.out} dur={d} on={o.on} />;
  const spline = (y, M, P, t0 = 0, t1 = 5, n = 160) => Array.from({ length: n + 1 }, (_, k) => { const t = t0 + (t1 - t0) * k / n; return P(2 * t, evS(y, M, t)); });
  const flat = (a) => a.flat(3).filter(Boolean);
  const still = { cam: [{ t: 0, x: 540, y: 960, z: 1 }, { t: 30, x: 540, y: 960, z: 1.012 }] };
  // axes for the spline figure
  const axesS = (d) => { const P = SP, OX = SX, OY = SY, out = [];
    const tk = []; [2, 4, 6, 8, 10].forEach((i) => tk.push(`M ${P(i, 0)[0]} ${OY - 9} L ${P(i, 0)[0]} ${OY + 9}`)); [1, 2, 3, 4, 5].forEach((j) => tk.push(`M ${OX - 9} ${P(0, j)[1]} L ${OX + 9} ${P(0, j)[1]}`));
    out.push(<Layer key="ax" at={0} dur={d}>{line("x", [P(-0.4, 0), P(10.7, 0)], C.navy, 5)}{line("y", [P(0, -0.8), P(0, 6.2)], C.navy, 5)}
      <path d={tk.join(" ")} x={0} y={0} width={W} height={H} stroke={{ width: 4, color: C.navy, cap: "round" }} /></Layer>);
    [2, 4, 6, 8, 10].forEach((i) => out.push(L("tx" + i, String(i), P(i, 0)[0], OY + 14, 0, d, { w: 60, size: 30 })));
    [1, 2, 3, 4, 5].forEach((j) => out.push(L("ty" + j, String(j), OX - 34, P(0, j)[1] - 19, 0, d, { w: 50, size: 30 })));
    out.push(L("xl", "x", P(10.7, 0)[0] + 26, OY - 56, 0, d, { w: 40, size: 34 }), L("yl", "y", OX + 34, P(0, 6.2)[1] - 18, 0, d, { w: 40, size: 34 }));
    return out; };
  const pts6 = (d, at, step = 0, until) => Y.map((y, i) => dot(d, "p" + i, ...SP(2 * i, y), 13, C.cobalt, at + i * step, until));
  // a count row: text on the left, its count right-aligned
  const crow = (d, k, y, text, cnt, at, at2, color) => [L(k + "a", text, 70, y, at, d, { align: "left", size: 36, w: cnt ? 740 : 940, color }), cnt ? L(k + "b", cnt, 820, y, at2 ?? at, d, { align: "right", size: 38, w: 190, color: color || C.coral }) : null];

  return [
  // ===== 1 · the question: points on a grid, a smooth curve through them =====
  S(null, (r, d) => {
    const out = [...axesS(d), ...pts6(d, 0.15, 0.12)];
    const tS = r("smooth");
    out.push(...drawOn(d, "cv", spline(Y, MY, SP), tS, tS + 1.4, d, C.navy, 8));
    out.push(L("q", "curve?   smooth?   natural cubic spline?", 540, 800, r("natural"), d, { size: 36, font: C.fBody, color: C.coral }));
    return flat(out);
  }, still),

  // ===== 2 · a curve: the path a moving point traces; x(t), y(t); loops =====
  S("A curve is", (r, d) => {
    const U = 100, OX = 320, OY = 545; const P = (x, y) => [OX + x * U, OY - y * U];
    const out = [];
    const tk = []; [1, 2, 3, 4].forEach((i) => tk.push(`M ${P(i, 0)[0]} ${OY - 9} L ${P(i, 0)[0]} ${OY + 9}`)); [-3, -2, -1, 1, 2, 3].forEach((j) => tk.push(`M ${OX - 9} ${P(0, j)[1]} L ${OX + 9} ${P(0, j)[1]}`));
    out.push(<Layer key="ax" at={0} dur={d}>{line("x", [P(-0.5, 0), P(4.9, 0)], C.navy, 5)}{line("y", [P(0, -3.3), P(0, 3.3)], C.navy, 5)}
      <path d={tk.join(" ")} x={0} y={0} width={W} height={H} stroke={{ width: 4, color: C.navy, cap: "round" }} />
      <path d={`M ${P(4.9, 0)[0] + 14} ${OY} L ${P(4.9, 0)[0] - 6} ${OY - 11} L ${P(4.9, 0)[0] - 6} ${OY + 11} Z`} x={0} y={0} width={W} height={H} fill={C.navy} />
      <path d={`M ${OX} ${P(0, 3.3)[1] - 14} L ${OX - 11} ${P(0, 3.3)[1] + 6} L ${OX + 11} ${P(0, 3.3)[1] + 6} Z`} x={0} y={0} width={W} height={H} fill={C.navy} /></Layer>);
    [1, 2, 4].forEach((i) => out.push(L("tx" + i, String(i), P(i, 0)[0], OY + 14, 0, d, { w: 60, size: 30 })));
    [-3, -2, -1, 1, 2, 3].forEach((j) => out.push(L("ty" + j, j < 0 ? "−" + (-j) : String(j), OX - 36, P(0, j)[1] - 19, 0, d, { w: 60, size: 30 })));
    out.push(L("xl", "x", P(4.9, 0)[0] + 34, OY - 58, 0, d, { w: 40, size: 34 }), L("yl", "y", OX + 36, P(0, 3.3)[1] - 26, 0, d, { w: 40, size: 34 }));
    // the moving point: x = t², y = t³ − 3t, t from −2.1 to 2.1
    const N = 140, tv = (k) => -2.1 + 4.2 * k / N, cpts = Array.from({ length: N + 1 }, (_, k) => { const t = tv(k); return P(t * t, t * t * t - 3 * t); });
    const head = (key, t0, t1, tag) => { const K = 60, o = []; ev(t0, "move");
      for (let k = 0; k <= K; k++) { const i = Math.round(k / K * N), p = cpts[i]; o.push(fr(d, key + k, t0 + (t1 - t0) * k / K, k === K ? 0.6 : (t1 - t0) / K + 0.01,
        [<rect key="h" x={p[0] - 17} y={p[1] - 17} width={34} height={34} radius={17} fill={C.cobalt} strokeColor={C.navy} strokeWidth={4} />,
         tag ? <rect key="tb" x={p[0] + 14} y={p[1] - 64} width={190} height={48} radius={10} fill={C.paper} strokeColor={C.cobalt} strokeWidth={3} /> : null,
         tag ? <text key="t" x={p[0] + 26} y={p[1] - 58} width={180} fontFamily={C.fMono} fontWeight={700} fontSize={32} color={C.cobalt}>{"t = " + tv(i).toFixed(1)}</text> : null].filter(Boolean))); }
      return o; };
    out.push(...drawOn(d, "cv", cpts, 0.15, 3.6, d, C.coral, 8), ...head("hd", 0.15, 3.6, false));
    out.push(L("def", "curve: the path a moving point traces", 540, 905, r("path"), d, { size: 40, font: C.fBody }));
    // the parameter t moves the point again; x and y are each a formula in t
    const tP = r("parameter");
    out.push(...head("hp", tP, tP + 4.6, true));
    out.push(L("fx", "x = t²", 80, 990, r("x is"), d, { align: "left", size: 44, w: 480, color: C.cobalt }));
    out.push(L("fy", "y = t³ − 3t", 80, 1065, r("y is"), d, { align: "left", size: 44, w: 480, color: C.cobalt }));
    out.push(L("ft", "(both formulas in t)", 80, 1140, r("y is") + 0.8, d, { align: "left", size: 34, w: 480, font: C.fBody }));
    // callback: Q7, a curve of two pieces joined end to end, a point moved by t
    const tQ = r("Like"), cx = 600, cy = 975, cw = 420, ch = 300;
    bb({ k: "box", n: "recall card", x: cx, y: cy, w: cw, h: ch, t0: tQ, t1: d });
    const bz = (a, b, c, e, u) => [0, 1].map((k) => (1 - u) ** 3 * a[k] + 3 * u * (1 - u) ** 2 * b[k] + 3 * u * u * (1 - u) * c[k] + u ** 3 * e[k]);
    const A = [[640, 1220], [680, 1080], [760, 1080], [800, 1150]], B = [[800, 1150], [840, 1220], [930, 1220], [980, 1080]];
    const p1 = Array.from({ length: 25 }, (_, k) => bz(...A, k / 24)), p2 = Array.from({ length: 25 }, (_, k) => bz(...B, k / 24));
    out.push(<Layer key="rc" at={tQ} dur={d} sfx="pop"><rect x={cx} y={cy} width={cw} height={ch} radius={14} fill={C.paper} strokeColor={C.navy} strokeWidth={4} />
      {line("a", p1, C.cobalt, 7)}{line("b", p2, C.navy, 7)}<rect x={792} y={1142} width={16} height={16} radius={8} fill={C.coral} /></Layer>);
    out.push(L("rt", "from Q7", cx + 24, cy + 14, tQ + 0.05, d, { align: "left", size: 34, w: 200, font: C.fBody, color: C.cobalt }));
    const all = [...p1, ...p2.slice(1)];
    for (let k = 0; k <= 30; k++) { const p = all[Math.round(k / 30 * (all.length - 1))]; out.push(fr(d, "rq" + k, tQ + 0.5 + k * 0.08, k === 30 ? d : 0.09,
      <rect x={p[0] - 12} y={p[1] - 12} width={24} height={24} radius={12} fill={C.coral} strokeColor={C.navy} strokeWidth={3} />)); }
    // loops and any direction
    const lp = r("loops");
    out.push(<Ring key="rl" x={P(3, 0)[0]} y={OY} r={40} at={lp} dur={d} />);
    out.push(L("lpl", "loop", P(3, 0)[0] + 90, OY - 70, lp + 0.1, d, { w: 100, size: 34, font: C.fBody, color: C.coral }));
    out.push(L("n2", "handles loops and any direction", 540, 1320, lp + 0.2, d, { size: 38, font: C.fBody }));
    return flat(out);
  }, still),

  // ===== 3 · one big formula wiggles; a spline: short cubic pieces joined smoothly =====
  S("To draw a smooth", (r, d) => {
    const P = SP, out = [...axesS(d), ...pts6(d, 0.1, 0.08)];
    const po = r("one big"), sp = r("Instead");
    const ppts = Array.from({ length: 201 }, (_, k) => { const t = 5 * k / 200; return P(2 * t, lag(Y, t)); });
    out.push(...drawOn(d, "poly", ppts, po, po + 1.6, sp + 0.6, C.coral, 8));
    out.push(L("pl", "one big formula: it wiggles", 540, 790, r("wiggle"), d, { size: 40, font: C.fBody, color: C.coral, out: sp + 0.6 }));
    const sl = r("spline"), sh = r("Short");
    for (let i = 0; i < 5; i++) out.push(...drawOn(d, "s" + i, spline(Y, MY, P, i, i + 1, 32), sh + i * 0.25, sh + i * 0.25 + 0.3, d, i % 2 ? C.navy : C.cobalt, 9));
    const jn = r("joined");
    [1, 2, 3, 4].forEach((i) => out.push(ring(d, "j" + i, ...P(2 * i, Y[i]), 24, C.coral, jn + i * 0.1)));
    out.push(L("sl", "spline: short pieces, joined smoothly", 540, 860, sl + 0.7, d, { size: 40, font: C.fBody }));
    const cu = r("Cubic");
    out.push(L("cu", "each piece is a cubic (degree 3):", 80, 960, cu, d, { align: "left", size: 38, w: 920, font: C.fBody }));
    out.push(L("cf", "a + b·t + c·t² + d·t³", 80, 1035, r("degree"), d, { align: "left", size: 46, w: 920, color: C.cobalt }));
    return flat(out);
  }, still),

  // ===== 4 · the count: 4n unknowns; 2n through the points; n − 1 slopes, n − 1 bends =====
  S("A natural cubic", (r, d) => {
    const P = SP, out = [...axesS(d)];
    out.push(fr(d, "cv", 0, d, line("c", spline(Y, MY, P), C.navy, 8), fade(0.2)));
    out.push(...pts6(d, 0.05, 0));
    const ev1 = r("every point");
    Y.forEach((y, i) => out.push(ring(d, "ev" + i, ...P(2 * i, y), 24, C.cobalt, ev1 + i * 0.1, ev1 + 1.4)));
    // n + 1 points, n pieces (here n = 5)
    const tW = r("With"), pc = r("pieces");
    for (let i = 0; i < 5; i++) out.push(fr(d, "fl" + i, pc + i * 0.25, 0.5, line("f", spline(Y, MY, P, i, i + 1, 30), C.coral, 13), fade(0.1)));
    out.push(...crow(d, "r1", 770, "n + 1 points → n pieces  (here n = 5)", null, tW));
    out.push(...crow(d, "r2", 835, "each cubic piece: 4 unknown numbers", null, r("each cubic")));
    out.push(<Box key="unk" x={540} y={935} w={640} h={80} label="4n unknowns" size={42} tone="b" at={r("four n")} dur={d} />);
    // equations
    const ep = r("Each piece"), ij = r("At each"), sm = r("slopes"), bd = r("bends"), c1 = r("c1"), tt = r("Two times"), th = r("That's");
    out.push(...crow(d, "r3", 1020, "each piece: through 2 end points", "2n", ep, r("two n equations")));
    out.push(...crow(d, "r4", 1090, "at each inner joint (n − 1 of them):", null, ij));
    out.push(...crow(d, "r5", 1155, "  slopes match  (C¹)", "n − 1", sm, tt));
    out.push(...crow(d, "r6", 1220, "  bends match   (C²)", "n − 1", bd, tt));
    bb({ k: "box", n: "from Q7", x: 560, y: 1180, w: 200, h: 60, t0: c1, t1: d });
    out.push(<Layer key="q7" at={c1} dur={d} sfx="pop"><rect x={560} y={1180} width={200} height={60} radius={30} fill={C.chip} strokeColor={C.cobalt} strokeWidth={4} />
      <text x={560} y={1191} width={200} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={34} color={C.cobalt}>from Q7</text></Layer>);
    out.push(fr(d, "rule", th, d, line("r", [[70, 1290], [1010, 1290]], C.navy, 4), fade(0.2)));
    out.push(...crow(d, "r7", 1310, "equations so far", "4n − 2", th));
    // on the figure: one piece and its two end points; slopes and bends at the inner joints
    out.push(fr(d, "pc2", ep, ij - ep, line("p", spline(Y, MY, P, 2, 3, 30), C.coral, 13), fade(0.2)));
    out.push(ring(d, "e2", ...P(4, Y[2]), 26, C.coral, ep + 0.4, ij), ring(d, "e3", ...P(6, Y[3]), 26, C.coral, ep + 0.5, ij));
    [1, 2, 3, 4].forEach((i) => { const [x, y] = P(2 * i, Y[i]); const vx = 2 * SU, vy = -dS(Y, MY, i) * SU, n = Math.hypot(vx, vy), k = 62 / n;
      out.push(fr(d, "tg" + i, sm + i * 0.12, d, line("t", [[x - vx * k, y - vy * k], [x + vx * k, y + vy * k]], C.cobalt, 7), fade(0.15)));
      out.push(ring(d, "bd" + i, x, y, 26, C.coral, bd + i * 0.12, d, 6)); });
    return flat(out);
  }, { ...still, n: 2 }),

  // ===== 5 · natural: the bend is zero at both ends; the count matches =====
  S("The last two", (r, d) => {
    const P = SP, out = [...axesS(d)];
    out.push(fr(d, "cv", 0, d, line("c", spline(Y, MY, P), C.navy, 8), fade(0.2)));
    out.push(...pts6(d, 0.05, 0));
    out.push(...crow(d, "r1", 790, "equations so far", "4n − 2", 0.1));
    const nt = r("natural"), bz = r("bend"), cm = r("Now the count");
    out.push(L("nat", "NATURAL", 540, 870, nt, d, { size: 64, font: C.fHead, color: C.coral }));
    out.push(...crow(d, "r2", 970, "bend = 0 at both ends", "+ 2", bz, r("zero")));
    out.push(<Box key="z0" x={300} y={648} w={190} h={56} label="bend = 0" size={32} tone="hot" at={bz + 0.2} dur={d} />);
    out.push(<Box key="z5" x={P(10, Y[5])[0] - 40} y={P(10, Y[5])[1] - 80} w={190} h={56} label="bend = 0" size={32} tone="hot" at={bz + 0.4} dur={d} />);
    out.push(fr(d, "rule", cm, d, line("r", [[70, 1045], [1010, 1045]], C.navy, 4), fade(0.2)));
    out.push(<Box key="eq" x={540} y={1130} w={900} h={96} label="4n conditions = 4n unknowns" size={42} tone="hot" at={cm} dur={d} />);
    out.push(<Check key="ck" x={540} y={1290} size={120} at={r("matches")} dur={d} />);
    return flat(out);
  }, still),

  // ===== 6 · solve once, draw in small steps; the catch: move one point, the whole curve changes =====
  S("Solve those", (r, d) => {
    const P = SP, out = [...axesS(d)];
    const mv = r("moving one"), wc = r("whole curve");
    out.push(fr(d, "gh", 0, mv, line("g", spline(Y, MY, P), C.navy, 6, { op: 0.3 }), fade(0.2)));
    Y.forEach((y, i) => out.push(dot(d, "p" + i, ...P(2 * i, y), 12, C.cobalt, 0.05, i === 2 ? mv : d)));
    out.push(L("s1", "1. solve the 4n equations once", 70, 790, 0.1, d, { align: "left", size: 36, w: 940 }));
    const dr = r("then draw"), st = r("small steps");
    out.push(L("s2", "2. draw each piece in small steps of t", 70, 855, dr, d, { align: "left", size: 36, w: 940 }));
    const smp = Array.from({ length: 21 }, (_, k) => P(2 * k * 0.25, evS(Y, MY, k * 0.25)));
    smp.forEach((p, k) => out.push(dot(d, "sm" + k, p[0], p[1], 8, C.navy, st + k * 0.03, mv, C.navy)));
    out.push(...drawOn(d, "pl", smp, st + 0.7, st + 1.3, mv, C.navy, 6));
    out.push(<Check key="ck" x={100} y={945} size={50} at={r("very smooth")} dur={d} />);
    out.push(L("s3", "very smooth", 150, 920, r("very smooth"), d, { align: "left", size: 38, w: 600, font: C.fBody }));
    // drag P2 from (4, 2) to (4, 4): the whole curve changes
    out.push(fr(d, "old", mv, d, line("o", spline(Y, MY, P), C.navy, 5, { dash: [14, 10] }), fade(0.2)));
    const K = 12, T = 1.2; const Yf = [...Y]; Yf[2] = 4; const Mf = natM(Yf);
    for (let k = 1; k <= K; k++) { const yk = [...Y]; yk[2] = 2 + 2 * k / K; const Mk = natM(yk); const last = k === K;
      out.push(fr(d, "rp" + k, mv + T * (k - 1) / K, last ? d : T / K + 0.01, [line("c", spline(yk, Mk, P), C.coral, 8),
        <rect key="d" x={P(4, yk[2])[0] - 15} y={P(4, yk[2])[1] - 15} width={30} height={30} radius={15} fill={C.coral} strokeColor={C.navy} strokeWidth={4} />])); }
    ev(mv, "move");
    out.push(<XMark key="xm" x={100} y={1012} size={44} at={r("changes")} dur={d} />);
    out.push(L("s4", "move ONE point → the WHOLE curve changes", 150, 990, r("changes"), d, { align: "left", size: 36, w: 880, color: C.coral }));
    // how far each piece moved
    const dl = [0, 1, 2, 3, 4].map((i) => { let m = 0; for (let k = 0; k <= 40; k++) { const t = i + k / 40; m = Math.max(m, Math.abs(evS(Yf, Mf, t) - evS(Y, MY, t))); } return m; });
    const base = 1330;
    dl.forEach((v, i) => { const x = P(2 * i + 1, 0)[0], h = Math.max(4, v * 100);
      bb({ k: "box", n: "bar" + i, x: x - 32, y: base - h - 44, w: 64, h: h + 44, t0: wc + i * 0.12, t1: d });
      out.push(fr(d, "bar" + i, wc + i * 0.12, d, <rect x={x - 32} y={base - h} width={64} height={h} fill={C.coral} strokeColor={C.navy} strokeWidth={3} />, fade(0.2)));
      out.push(L("bv" + i, v.toFixed(2), x, base - h - 44, wc + i * 0.12 + 0.1, d, { w: 110, size: 30, on: true })); });
    out.push(fr(d, "bl", wc, d, line("b", [[P(0, 0)[0], base], [P(10, 0)[0], base]], C.navy, 4), fade(0.2)));
    out.push(L("cap", "how far each piece moved", 540, base + 14, wc + 0.3, d, { size: 34, font: C.fBody }));
    return flat(out);
  }, still),

  // ===== answer cards: from "In your exam" to the end, split evenly =====
  S("In your exam", (r, d) => AnswerCard({ page: ANSWERS["cg-q12"][0], title: "WRITE THIS · 5 MARKS · 1/2", at: 0, dur: d, y: TOP + 24 }), { cam: [{ t: 0, x: 540, y: 960, z: 1 }] }),
  { ...S("In your exam", (r, d) => { globalThis.__T0 = tMid; return AnswerCard({ page: ANSWERS["cg-q12"][1], title: "WRITE THIS · 5 MARKS · 2/2", at: 0, dur: d, y: TOP + 24 }); }, { cam: [{ t: 0, x: 540, y: 960, z: 1 }] }), at: tMid },
  ];
};
