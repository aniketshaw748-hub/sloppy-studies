import { Label, Layer, Mover, Ring, Check, Arrow, bb } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
// cg-q05 v3 · Two scalings multiply: (1, 1) → S(2, 3) → (2, 3) → S(4, 5) → (8, 15) = S(8, 15)(1, 1); diag × diag.
const W = 1080, H = 1920;
// ONE mapping for the figure: x 0..9.6, y 0..15.5, 56 px per unit.
const U = 56, OX = 120, OY = 1180; const P = (x, y) => [OX + x * U, OY - y * U];
const fr = (key, at, len, kids) => <frame key={key} at={at} duration={Math.max(0.05, len)} width={W} height={H} layout="none">{kids}</frame>;
const pth = (key, d, stroke, extra = {}) => <path key={key} d={d} x={0} y={0} width={W} height={H} stroke={stroke} {...extra} />;
function drawOn(key, pts, t0, until, color, width, speed = 3000) {
  const out = []; let t = t0;
  for (let s = 0; s + 1 < pts.length; s++) {
    const [x1, y1] = pts[s], [x2, y2] = pts[s + 1]; const L = Math.hypot(x2 - x1, y2 - y1); const n = Math.max(1, Math.ceil(L / 48)); const dt = L / speed;
    for (let i = 0; i < n; i++) { const a = i / n, b = Math.min(1, (i + 1) / n + 0.02); const ta = t + dt * a;
      out.push(fr(key + s + "_" + i, ta, until - ta, pth("p", `M ${x1 + (x2 - x1) * a} ${y1 + (y2 - y1) * a} L ${x1 + (x2 - x1) * b} ${y1 + (y2 - y1) * b}`, { width, color, cap: "round" }))); }
    t += dt;
  }
  return out;
}
// axes with every tick labelled
function Axes(C, d, anim) {
  const out = []; const [ox, oy] = P(0, 0), xe = P(9.6, 0)[0], ye = P(0, 15.6)[1]; const t2 = anim ? 0.25 : 0;
  if (anim) out.push(...drawOn("ax", [[ox - 14, oy], [xe, oy]], 0, d, C.navy, 5), ...drawOn("ay", [[ox, oy + 14], [ox, ye]], 0, d, C.navy, 5));
  else out.push(<Layer key="axs" at={0} dur={d}>{pth("a1", `M ${ox - 14} ${oy} L ${xe} ${oy}`, { width: 5, color: C.navy, cap: "round" })}{pth("a2", `M ${ox} ${oy + 14} L ${ox} ${ye}`, { width: 5, color: C.navy, cap: "round" })}</Layer>);
  const tk = []; for (let i = 1; i <= 9; i++) { const x = P(i, 0)[0]; tk.push(`M ${x} ${oy - 8} L ${x} ${oy + 8}`); }
  for (let j = 1; j <= 15; j++) { const y = P(0, j)[1]; tk.push(`M ${ox - 8} ${y} L ${ox + 8} ${y}`); }
  out.push(<Layer key="tk" at={t2} dur={d}>{pth("t", tk.join(" "), { width: 4, color: C.navy, cap: "round" })}
    {pth("hx", `M ${xe + 14} ${oy} L ${xe - 8} ${oy - 12} L ${xe - 8} ${oy + 12} Z`, { width: 1, color: C.navy }, { fill: C.navy })}
    {pth("hy", `M ${ox} ${ye - 14} L ${ox - 12} ${ye + 8} L ${ox + 12} ${ye + 8} Z`, { width: 1, color: C.navy }, { fill: C.navy })}</Layer>);
  for (let i = 1; i <= 9; i++) out.push(<Label key={"tx" + i} text={String(i)} x={P(i, 0)[0]} y={oy + 12} w={40} size={30} font={C.fMono} at={t2} dur={d} />);
  for (let j = 1; j <= 15; j++) out.push(<Label key={"ty" + j} text={String(j)} x={ox - 40} y={P(0, j)[1] - 19} w={50} size={30} font={C.fMono} at={t2} dur={d} />);
  out.push(<Label key="xn" text="x" x={xe + 4} y={oy - 58} w={40} size={34} font={C.fMono} at={t2} dur={d} />);
  out.push(<Label key="yn" text="y" x={ox + 36} y={ye - 24} w={40} size={34} font={C.fMono} at={t2} dur={d} />);
  return out;
}
const rectOut = (C, key, w, h, at, dur, col, fillOp) => { const [x, y] = P(0, h); return <Layer key={key} at={at} dur={dur} sfx="pop" anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.25 }]}>
  <rect x={x} y={y} width={w * U} height={h * U} fill={col} opacity={fillOp} />{pth("o", `M ${x} ${y} L ${x + w * U} ${y} L ${x + w * U} ${OY}`, { width: 5, color: col, cap: "round" })}</Layer>; };
const DOT = (C) => <rect x={0} y={0} width={28} height={28} radius={14} fill={C.coral} strokeColor={C.navy} strokeWidth={4} />;
const ptLabel = (C, key, text, cx, y, at, dur, color) => <Label key={key} text={text} x={cx} y={y} w={text.length * 18.6 + 6} size={30} font={C.fMono} color={color || C.navy} at={at} dur={dur} />;
// quadratic curve as a polyline
const quad = (a, c, b, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]]; });
// matrix brackets + entries
function Mat(C, key, x, y, rows, fs, colW, at, dur, opt = {}) {
  const rh = Math.round(fs * 1.35), h = rows.length * rh + 20, w = rows[0].length * colW + 40;
  bb({ k: "box", n: "matrix " + key, x, y, w, h, t0: at, t1: dur });
  const br = `M ${x + 16} ${y} L ${x} ${y} L ${x} ${y + h} L ${x + 16} ${y + h} M ${x + w - 16} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x + w - 16} ${y + h}`;
  const cell = (i, j, col) => <text key={i + "_" + j} x={x + 20 + j * colW} y={y + 10 + i * rh + (rh - fs * 1.2) / 2} width={colW} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={fs} color={col || C.navy}>{rows[i][j]}</text>;
  const anim = [{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.2 }, { property: "offsetY", from: 20, to: 0, at: 0, duration: 0.35, easing: [0.22, 1, 0.36, 1] }];
  const out = [<Layer key={key + "br"} at={at} dur={dur} sfx="pop" anim={anim}>{pth("b", br, { width: 5, color: C.navy, cap: "round" })}
    {opt.cellAt ? null : rows.flatMap((r, i) => r.map((c, j) => cell(i, j)))}</Layer>];
  if (opt.cellAt) rows.forEach((r, i) => r.forEach((c, j) => out.push(<Layer key={key + "c" + i + j} at={opt.cellAt[i][j]} dur={dur} sfx="tick"
    anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.1 }, { property: "offsetY", from: 16, to: 0, at: 0, duration: 0.25, easing: [0.22, 1, 0.36, 1] }]}>{cell(i, j)}</Layer>)));
  const geo = { cx: (j) => x + 20 + j * colW + colW / 2, cy: (i) => y + 10 + i * rh + rh / 2, rh, colW, x, y, w, h };
  return { nodes: out, geo };
}
const Hi = (C, key, x, y, w, h, at, out, dur, color, sfx) => <Layer key={key} at={at} out={out} dur={dur} sfx={sfx}
  anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.08 }]}><rect x={x} y={y} width={w} height={h} radius={12} fill="#00000000" strokeColor={color || C.coral} strokeWidth={6} /></Layer>;
const RC = 860;   // right column centre (x 715..1035)

export const SCENES = ({ S, ctx, C, TOP }) => [
  // Question: the axes and the point (1, 1).
  S(null, (r, d) => {
    const out = [...Axes(C, d, true)];
    out.push(rectOut(C, "us", 1, 1, 0.5, d, C.navy, 0.12));
    out.push(<Layer key="pt" at={0.5} dur={d} sfx="pop"><rect x={P(1, 1)[0] - 14} y={P(1, 1)[1] - 14} width={28} height={28} radius={14} fill={C.coral} strokeColor={C.navy} strokeWidth={4} /></Layer>);
    out.push(ptLabel(C, "p11", "(1, 1)", 300, 1105, 0.7, d));
    return out;
  }, { cam: [{ t: 0, x: 540, y: 960, z: 1.0 }] }),

  // Meaning: recall scaling (Q3); two scalings in a row; (1, 1) → (2, 3) → (8, 15); one S(8, 15) lands there too.
  S("Scaling remember", (r, d) => {
    const out = [...Axes(C, d, false)];
    const t23 = r("goes to"), a23 = t23 + 0.7, t815 = r("then 8"), a815 = t815 + 0.8, tOne = r("single"), tSame = r("same");
    out.push(rectOut(C, "us", 1, 1, 0, d, C.navy, 0.12));
    out.push(rectOut(C, "r23", 2, 3, a23, d, C.cobalt, 0.1));
    out.push(rectOut(C, "r815", 8, 15, a815, d, C.cobalt, 0.08));
    out.push(<Arrow key="ar1" x1={P(1, 1)[0]} y1={P(1, 1)[1]} x2={P(2, 3)[0]} y2={P(2, 3)[1]} color={C.cobalt} width={5} at={t23} dur={d} />);
    out.push(<Arrow key="ar2" x1={P(2, 3)[0]} y1={P(2, 3)[1]} x2={P(8, 15)[0]} y2={P(8, 15)[1]} color={C.cobalt} width={5} at={t815} dur={d} />);
    // one scaling S(8, 15): a single jump straight from (1, 1)
    const cv = quad(P(1, 1), [640, 1060], P(8, 15));
    out.push(...drawOn("one", cv, tOne, d, C.coral, 6, 1300));
    out.push(<Mover key="pt" at={0} dur={d} cw={28} ch={28} pts={[{ t: 0, x: P(1, 1)[0], y: P(1, 1)[1] }, { t: t23, x: P(1, 1)[0], y: P(1, 1)[1] }, { t: a23, x: P(2, 3)[0], y: P(2, 3)[1] },
      { t: t815, x: P(2, 3)[0], y: P(2, 3)[1] }, { t: a815, x: P(8, 15)[0], y: P(8, 15)[1] }]}>{DOT(C)}</Mover>);
    out.push(ptLabel(C, "p11", "(1, 1)", 300, 1105, 0, d));
    out.push(ptLabel(C, "p23", "(2, 3)", 300, 990, a23, d));
    out.push(ptLabel(C, "p815", "(8, 15)", 705, 322, a815, d));
    out.push(<Ring key="rg" x={P(8, 15)[0]} y={P(8, 15)[1]} r={40} at={tSame} dur={d} />);
    // right column: the rule (recall), then the two scalings and the products
    const tS = r("Scale the");
    out.push(<Label key="rx" text="x′ = sx · x" x={RC} y={420} w={320} size={44} font={C.fMono} at={r("multiplies")} out={tS} dur={d} />);
    out.push(<Label key="ry" text="y′ = sy · y" x={RC} y={490} w={320} size={44} font={C.fMono} at={r("y by")} out={tS} dur={d} />);
    out.push(<Label key="s1" text="S(2, 3)" x={RC} y={420} w={320} size={48} font={C.fMono} color={C.cobalt} at={r("by 2")} dur={d} />);
    out.push(<Label key="s2" text="then S(4, 5)" x={RC} y={495} w={330} size={44} font={C.fMono} color={C.cobalt} at={r("by 4")} dur={d} />);
    out.push(<Label key="s3" text="one S(8, 15)" x={RC} y={590} w={330} size={44} font={C.fMono} color={C.coral} at={tOne} dur={d} />);
    out.push(<Label key="m1" text="2 × 4 = 8" x={RC} y={720} w={320} size={46} font={C.fMono} at={r("2 times")} dur={d} />);
    out.push(<Label key="m2" text="3 × 5 = 15" x={RC} y={795} w={320} size={46} font={C.fMono} at={r("3 times")} dur={d} />);
    // recall card (Q3), then the working below the figure
    const tM = r("Multiplicative"); bb({ k: "box", n: "recall Q3", x: 90, y: 1250, w: 900, h: 280, t0: 0, t1: tM });
    out.push(<Layer key="rc" at={0} out={tM} dur={d}><rect x={90} y={1250} width={900} height={280} radius={12} fill={C.paper} strokeColor={C.navy} strokeWidth={4} /></Layer>);
    out.push(<Label key="rq" text="from Q3" x={200} y={1268} w={200} size={36} color={C.coral} at={0.1} out={tM} dur={d} />);
    out.push(<Label key="rs" text="scaling by (2, 1)" x={600} y={1268} w={560} size={40} at={0.2} out={tM} dur={d} />);
    out.push(<Label key="rp" text="(−50, 20) → (−100, 20)" x={540} y={1360} w={700} size={46} font={C.fMono} at={0.4} out={tM} dur={d} />);
    out.push(<Label key="rr" text="x × 2,  y × 1" x={540} y={1440} w={600} size={42} font={C.fMono} color={C.cobalt} at={0.6} out={tM} dur={d} />);
    out.push(<Label key="def" text={"two scalings in a row =\none scaling by the products"} x={540} y={1250} w={960} size={44} color={C.coral} at={tM} dur={d} />);
    out.push(<Label key="w1" text="S(2, 3):  (1, 1) → (2, 3)" x={170} y={1380} w={700} size={40} font={C.fMono} align="left" color={C.cobalt} at={t23} dur={d} />);
    out.push(<Label key="w2" text="S(4, 5):  (2, 3) → (8, 15)" x={170} y={1440} w={700} size={40} font={C.fMono} align="left" color={C.cobalt} at={t815} dur={d} />);
    out.push(<Label key="w3" text="S(8, 15): (1, 1) → (8, 15)" x={170} y={1500} w={700} size={40} font={C.fMono} align="left" color={C.coral} at={tOne} dur={d} />);
    out.push(<Check key="ck" x={930} y={1522} size={56} at={tSame + 0.2} dur={d} />);
    return out;
  }, { cam: [{ t: 0, x: 540, y: 960, z: 1.0 }], hold: "since", holdY: 960 }),

  // Proof: diagonal matrices multiply into a diagonal matrix.
  S("To prove", (r, d) => {
    const out = [];
    const tw = r("write"), tdg = r("diagonal"), tm = r("Multiply"), tdn = r("diagonal numbers"), tz = r("everything"), tres = r("another");
    const A = Mat(C, "S2", 100, 350, [["sx2", "0", "0"], ["0", "sy2", "0"], ["0", "0", "1"]], 52, 120, tw, d);
    const B = Mat(C, "S1", 580, 350, [["sx1", "0", "0"], ["0", "sy1", "0"], ["0", "0", "1"]], 52, 120, tw + 0.3, d);
    out.push(...A.nodes, ...B.nodes);
    out.push(<Label key="n2" text="S2" x={300} y={276} w={120} size={44} font={C.fMono} color={C.coral} at={tw + 0.2} dur={d} />);
    out.push(<Label key="n1" text="S1" x={780} y={276} w={120} size={44} font={C.fMono} color={C.coral} at={tw + 0.5} dur={d} />);
    out.push(<Label key="dot" text="·" x={540} y={430} w={40} size={56} font={C.fMono} at={tw + 0.5} dur={d} />);
    // the diagonal of each
    [0, 1, 2].forEach((i) => { out.push(Hi(C, "da" + i, A.geo.cx(i) - 56, A.geo.cy(i) - 33, 112, 66, tdg + i * 0.1, tm, d, C.coral, i ? undefined : "ping"));
      out.push(Hi(C, "db" + i, B.geo.cx(i) - 56, B.geo.cy(i) - 33, 112, 66, tdg + i * 0.1, tm, d, C.coral)); });
    out.push(<Label key="dl" text="numbers only on the diagonal" x={540} y={610} w={900} size={38} color={C.coral} at={tdg} dur={d} />);
    // product S2 · S1, row by column
    const cellAt = [0, 1, 2].map((i) => [0, 1, 2].map((j) => tm + 0.3 + (i * 3 + j) * 0.2));
    const PR = [["sx1·sx2", "0", "0"], ["0", "sy1·sy2", "0"], ["0", "0", "1"]];
    out.push(<Label key="eq" text="=" x={180} y={760} w={60} size={56} font={C.fMono} at={tm} dur={d} />);
    const M = Mat(C, "P", 228, 680, PR, 50, 240, tm + 0.1, d, { cellAt });
    out.push(...M.nodes);
    cellAt.forEach((row, i) => row.forEach((t, j) => {
      out.push(Hi(C, "hr" + i + j, A.geo.x + 10, A.geo.cy(i) - A.geo.rh / 2, A.geo.w - 20, A.geo.rh, t - 0.1, t + 0.1, d, C.coral));
      out.push(Hi(C, "hc" + i + j, B.geo.cx(j) - B.geo.colW / 2, B.geo.y + 6, B.geo.colW, B.geo.h - 12, t - 0.1, t + 0.1, d, C.cobalt)); }));
    [0, 1].forEach((i) => out.push(Hi(C, "pd" + i, M.geo.cx(i) - 118, M.geo.cy(i) - 33, 236, 66, tdn + i * 0.4, undefined, d, C.coral, i ? undefined : "ping")));
    [[0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]].forEach(([i, j], k) => out.push(Hi(C, "z" + k, M.geo.cx(j) - 36, M.geo.cy(i) - 33, 72, 66, tz + k * 0.06, undefined, d, C.cobalt, k ? undefined : "ping")));
    out.push(<Label key="r2" text="= S(sx1·sx2, sy1·sy2)" x={540} y={970} w={960} size={52} font={C.fMono} color={C.coral} at={tres} dur={d} />);
    out.push(<Label key="r3" text="another scaling" x={540} y={1050} w={600} size={40} color={C.cobalt} at={tres + 0.3} dur={d} />);
    out.push(<Label key="c1" text="sx1·sx2 = sx2·sx1" x={540} y={1170} w={960} size={48} font={C.fMono} at={r("order")} dur={d} />);
    out.push(<Label key="c2" text="S1 · S2 = S2 · S1" x={540} y={1260} w={960} size={56} font={C.fMono} color={C.coral} at={r("neither")} dur={d} />);
    out.push(<Label key="c3" text="the order doesn't matter" x={540} y={1350} w={900} size={40} color={C.cobalt} at={r("of the scalings")} dur={d} />);
    return out;
  }, { cam: [{ t: 0, x: 540, y: 960, z: 1.0 }], hold: "The result", holdY: 960 }),

  // Answer card.
  S("In your exam", (r, d) => [...AnswerCard({ page: ANSWERS["cg-q05"][0], title: "WRITE THIS · 5 MARKS · 1/1", at: 0, dur: d, y: TOP + 24 })],
    { cam: [{ t: 0, x: 540, y: 960, z: 1.0 }] }),
];
