import { Label, Layer, Arrow, Check, ev, bb } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
// cg-q10 · reflect the square PQRS about 2x − 8y + 4 = 0 (move, rotate flat, flip, rotate back, move back)
const W = 1080, H = 1920;
const clamp = (u) => Math.max(0, Math.min(1, u));
const ease = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
const fr = (key, at, len, kids) => <frame key={key} at={Math.max(0, at)} duration={Math.max(0.05, len)} width={W} height={H} layout="none">{kids}</frame>;
const pth = (key, d, stroke, extra = {}) => <path key={key} d={d} x={0} y={0} width={W} height={H} stroke={stroke} {...extra} />;
const fade = (d = 0.15) => [{ property: "opacity", from: 0, to: 1, at: 0, duration: d }];
const poly = (pts, close) => pts.map((p, i) => (i ? "L " : "M ") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ") + (close ? " Z" : "");
const disc = (key, x, y, r, fill, stroke, sw = 4) => <rect key={key} x={x - r} y={y - r} width={2 * r} height={2 * r} radius={r} fill={fill} strokeColor={stroke} strokeWidth={sw} />;

// ---- geometry: ONE mapping for every figure scene ----
const U = 72, OX = 288, OY = 648;
const P = (x, y) => [OX + x * U, OY - y * U];
const PP = (p) => P(p[0], p[1]);
const CN = { P: [2, 2], Q: [5, 2], R: [2, 5], S: [5, 5] };
const ORD = ["P", "Q", "S", "R"];                       // outline order P → Q → S → R → P
const dv = ([x, y]) => 2 * x - 8 * y + 4;
const foot = (p) => { const k = dv(p) / 68; return [p[0] - 2 * k, p[1] + 8 * k]; };
const img = (p) => { const k = 2 * dv(p) / 68; return [p[0] - 2 * k, p[1] + 8 * k]; };
const LN = [[-0.5, 0.375], [7.6, 2.4]];                 // the mirror y = x/4 + 1/2
const TH = Math.atan(0.25);
const UX = [4 / Math.sqrt(17), -1 / Math.sqrt(17)], NX = [1 / Math.sqrt(17), 4 / Math.sqrt(17)]; // px: along mirror, across it (towards P′ side)
const CL = { P: { t: "P(2,2)", x: 300, y: 486 }, Q: { t: "Q(5,2)", x: 668, y: 440 }, R: { t: "R(2,5)", x: 300, y: 296 }, S: { t: "S(5,5)", x: 668, y: 270 } };
const IL = { P: [-62, -46], Q: [18, -13], R: [-57, 0], S: [18, -29] };   // P′ label offset from its point (px)
const DRIFT = [{ t: 0, x: 540, y: 960, z: 1 }, { t: 99, x: 540, y: 960, z: 1.02 }];
const STILL = [{ t: 0, x: 540, y: 960, z: 1 }];

function drawOn(key, pts, t0, until, color, width, o = {}) {
  const out = []; let t = t0;
  for (let s = 0; s + 1 < pts.length; s++) {
    const [x1, y1] = pts[s], [x2, y2] = pts[s + 1]; const L = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(1, Math.ceil(L / (o.dashed ? 18 : 40))); const dt = o.segDur != null ? o.segDur : L / (o.speed || 1200);
    for (let i = 0; i < n; i++) { if (o.dashed && i % 2) continue; const a = i / n, b = Math.min(1, (i + 1) / n + (o.dashed ? 0 : 0.02)); const ta = t + dt * a;
      out.push(fr(key + s + "_" + i, ta, until - ta, pth("p", `M ${x1 + (x2 - x1) * a} ${y1 + (y2 - y1) * a} L ${x1 + (x2 - x1) * b} ${y1 + (y2 - y1) * b}`, { width, color, cap: "round" }))); }
    t += dt;
  }
  if (o.sfx !== false) ev(t0, "draw");
  return out;
}
const Pulse = (C, key, x, y, r, at, d, len = 1.0, color) => <Layer key={key} at={at} dur={d} out={Math.min(d, at + len)} sfx="ping"
  anim={[{ property: "opacity", keyframes: [{ at: 0, value: 0 }, { at: 0.1, value: 1 }, { at: len * 0.7, value: 1 }, { at: len - 0.03, value: 0 }] }]}>
  <rect x={x - r} y={y - r} width={2 * r} height={2 * r} radius={r} fill="#00000000" strokeColor={color || C.coral} strokeWidth={7} /></Layer>;
const rightMark = (F, a = 18) => { const [fx, fy] = PP(F); const A = [fx + a * UX[0], fy + a * UX[1]], B = [A[0] - a * NX[0], A[1] - a * NX[1]], Cc = [fx - a * NX[0], fy - a * NX[1]]; return poly([A, B, Cc]); };

function Axes(C, d) {
  const out = []; const x0 = P(-0.5, 0)[0], x1 = P(7.75, 0)[0], yb = P(0, -4)[1], yt = P(0, 5.5)[1];
  const tk = []; for (let i = 1; i <= 7; i++) { const x = P(i, 0)[0]; tk.push(`M ${x} ${OY - 8} L ${x} ${OY + 8}`); }
  for (let j = -3; j <= 5; j++) if (j) { const y = P(0, j)[1]; tk.push(`M ${OX - 8} ${y} L ${OX + 8} ${y}`); }
  out.push(<Layer key="ax" at={0} dur={d} anim={fade(0.2)}>
    {pth("x", `M ${x0} ${OY} L ${x1} ${OY}`, { width: 4, color: C.navy, cap: "round" })}
    {pth("y", `M ${OX} ${yb} L ${OX} ${yt}`, { width: 4, color: C.navy, cap: "round" })}
    {pth("hx", `M ${x1 + 14} ${OY} L ${x1 - 8} ${OY - 12} L ${x1 - 8} ${OY + 12} Z`, { width: 1, color: C.navy }, { fill: C.navy })}
    {pth("hy", `M ${OX} ${yt - 14} L ${OX - 12} ${yt + 8} L ${OX + 12} ${yt + 8} Z`, { width: 1, color: C.navy }, { fill: C.navy })}
    {pth("t", tk.join(" "), { width: 3, color: C.navy, cap: "round" })}
  </Layer>);
  for (let i = 1; i <= 7; i++) out.push(<Label key={"tx" + i} text={String(i)} x={P(i, 0)[0]} y={OY + 12} w={40} size={30} font={C.fMono} at={0} dur={d} />);
  for (let j = -3; j <= 5; j++) if (j) out.push(<Label key={"ty" + j} text={j < 0 ? "−" + (-j) : String(j)} x={OX - 34} y={P(0, j)[1] - 19} w={56} size={30} font={C.fMono} at={0} dur={d} />);
  out.push(<Label key="xn" text="x" x={x1 + 6} y={OY + 14} w={40} size={34} font={C.fMono} at={0} dur={d} />);
  out.push(<Label key="yn" text="y" x={OX + 40} y={yt - 16} w={40} size={34} font={C.fMono} at={0} dur={d} />);
  return out;
}
const Mirror = (C, d, at = 0, lbl = true, lblAt, lblOut) => [<Layer key="mir" at={at} dur={d} anim={fade()}>{pth("m", poly(LN.map(PP)), { width: 7, color: C.coral, cap: "round" })}</Layer>,
  lbl ? <Label key="mirL" text="2x − 8y + 4 = 0" x={715} y={392} w={330} size={34} align="left" font={C.fMono} color={C.coral} at={lblAt ?? at} out={lblOut} dur={d} /> : null].filter(Boolean);
// the original square: fill + outline + corner dots + labels
function Square(C, d, o = {}) {
  const pts = ORD.map(k => PP(CN[k])); const out = [];
  out.push(<Layer key="sq" at={o.at || 0} dur={d} anim={fade()}>
    {pth("f", poly(pts, true), { width: 1, color: C.cobalt + "00" }, { fill: C.cobalt + "1F" })}
    {pth("o", poly(pts, true), { width: 6, color: C.cobalt, cap: "round" })}</Layer>);
  if (o.dots !== false) out.push(...Dots(C, d, o.at || 0, 0));
  return out;
}
function Dots(C, d, at, stagger, lblDelay = 0) {
  const out = [];
  ["P", "Q", "R", "S"].forEach((k, i) => { const [x, y] = PP(CN[k]); const t = at + i * stagger;
    bb({ k: "icon", n: "dot " + k, x: x - 12, y: y - 12, w: 24, h: 24, t0: t, t1: d });
    out.push(<Layer key={"d" + k} at={t} dur={d} anim={fade(0.1)} sfx={stagger ? "pop" : undefined}>{disc("c", x, y, 12, C.cobalt, C.navy)}</Layer>);
    out.push(<Label key={"dl" + k} text={CL[k].t} x={CL[k].x} y={CL[k].y} w={130} size={30} align="left" font={C.fMono} at={t + lblDelay} dur={d} />); });
  return out;
}
// reflected corners: hollow ghosts (prediction) or solid image dots, with P′ labels
function Images(C, d, o = {}) {
  const out = [];
  (o.only || ["P", "Q", "R", "S"]).forEach((k, i) => { const [x, y] = PP(img(CN[k])); const t = o.times ? o.times[i] : (o.at || 0);
    bb({ k: "icon", n: (o.solid ? "image " : "ghost ") + k, x: x - 13, y: y - 13, w: 26, h: 26, t0: t, t1: d, on: o.on });
    out.push(<Layer key={(o.solid ? "id" : "gd") + k} at={t} dur={d} anim={fade(0.12)} sfx="pop">{o.solid ? disc("c", x, y, 12, C.navy, C.navy) : disc("c", x, y, 13, C.paper, C.navy, 4)}</Layer>);
    if (o.labels !== false) out.push(<Label key={(o.solid ? "il" : "gl") + k} text={k + "′"} x={x + IL[k][0]} y={y + IL[k][1]} w={60} size={34} align="left" font={C.fMono} at={t + 0.1} dur={d} />); });
  return out;
}
const ImageSquare = (C, d, at, key = "isq") => { const pts = ORD.map(k => PP(img(CN[k]))); return <Layer key={key} at={at} dur={d} anim={fade(0.3)}>
  {pth("f", poly(pts, true), { width: 1, color: C.chip + "00" }, { fill: C.chip + "B0" })}
  {pth("o", poly(pts, true), { width: 6, color: C.navy, cap: "round" })}</Layer>; };

// the travelling copy for steps 1–5: shift s1, rotate a1, flip f, rotate back a2, shift back s2
const xf = (p, s) => { let [x, y] = p; y -= 0.5 * s.s1; let c = Math.cos(-TH * s.a1), sn = Math.sin(-TH * s.a1); [x, y] = [x * c - y * sn, x * sn + y * c]; y *= s.f;
  c = Math.cos(TH * s.a2); sn = Math.sin(TH * s.a2); [x, y] = [x * c - y * sn, x * sn + y * c]; y += 0.5 * s.s2; return [x, y]; };
function Travel(C, d, st) {
  const out = [];
  const draw = (s, k) => { const sq = ORD.map(n => PP(xf(CN[n], s))); const ln = LN.map(p => PP(xf(p, s))); const kids = [];
    kids.push(pth(k + "f", poly(sq, true), { width: 1, color: C.chip + "00" }, { fill: C.chip + "B0" }));
    kids.push(pth(k + "l", poly(ln), { width: 7, color: C.coral, cap: "round" }));
    kids.push(pth(k + "o", poly(sq, true), { width: 6, color: C.navy, cap: "round" }));
    ["P", "Q", "R", "S"].forEach(n => { const [x, y] = PP(xf(CN[n], s)); kids.push(disc(k + n, x, y, 11, C.navy, C.navy));
      kids.push(<text key={k + "t" + n} x={s.f < 0 ? x + IL[n][0] : (n === "P" || n === "R" ? x - 58 : x + 16)} y={s.f < 0 ? y + IL[n][1] : y - 52} width={60} fontFamily={C.fMono} fontWeight={700} fontSize={34} color={C.navy}>{n + (s.f < 0 ? "′" : "")}</text>); });
    return kids; };
  const kOf = s => [s.s1, s.a1, s.f, s.a2, s.s2].map(v => v.toFixed(3)).join("|");
  const step = 1 / 15; let segA = 0, segS = st(0), segK = kOf(segS), n = 0;
  for (let T = step; ; T += step) { const TT = Math.min(T, d); const s = st(TT); const k = kOf(s);
    if (k !== segK || TT >= d) { const end = (TT >= d && k === segK) ? d : TT; out.push(fr("mv" + n, segA, end - segA, draw(segS, "mv" + n))); n++; segA = TT; segK = k; segS = s; if (TT >= d) break; } }
  if (segA < d - 0.01) out.push(fr("mv" + n, segA, d - segA, draw(segS, "mv" + n)));
  return out;
}
const Ghost = (C, d) => <Layer key="ghost" at={0} dur={d} anim={fade()}>
  {pth("gs", poly(ORD.map(k => PP(CN[k])), true), { width: 5, color: C.cobalt + "99", cap: "round" }, { dash: [16, 12] })}
  {pth("gl", poly(LN.map(PP)), { width: 5, color: C.coral + "88", cap: "round" }, { dash: [16, 12] })}</Layer>;
const STEPS = ["1 · move down ½ · T(0, −½)", "2 · rotate flat · R(−θ)", "3 · flip across x axis · Rfx", "4 · rotate back · R(θ)", "5 · move back up ½ · T(0, ½)"];
const StepL = (C, i, at, d) => <Label key={"st" + i} text={STEPS[i]} x={80} y={985 + i * 84} w={920} size={38} align="left" font={C.fMono} color={i === 2 ? C.coral : C.navy} at={at} dur={d} />;

// matrix: brackets + entries; cellAt optional
function Mat(C, key, x, y, rows, fs, colW, at, dur, opt = {}) {
  const rh = Math.round(fs * 1.35), h = rows.length * rh + 20, w = rows[0].length * colW + 40;
  bb({ k: "box", n: "matrix " + key, x, y, w, h, t0: opt.cellAt ? Math.min(at, ...opt.cellAt.flat()) : at, t1: opt.out ?? dur });
  const br = `M ${x + 16} ${y} L ${x} ${y} L ${x} ${y + h} L ${x + 16} ${y + h} M ${x + w - 16} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x + w - 16} ${y + h}`;
  const col = (i, j) => (opt.color ? opt.color(i, j) : null) || C.navy;
  const cell = (i, j) => <text key={i + "_" + j} x={x + 20 + j * colW} y={y + 10 + i * rh + (rh - fs * 1.2) / 2} width={colW} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={fs} color={col(i, j)}>{rows[i][j]}</text>;
  const out = [<Layer key={key + "br"} at={at} out={opt.out} dur={dur} sfx="pop" anim={fade(0.2)}>{pth("b", br, { width: 5, color: C.navy, cap: "round" })}
    {opt.cellAt ? null : rows.flatMap((r, i) => r.map((c, j) => cell(i, j)))}</Layer>];
  if (opt.cellAt) rows.forEach((r, i) => r.forEach((c, j) => out.push(<Layer key={key + "c" + i + j} at={opt.cellAt[i][j]} out={opt.out} dur={dur} sfx="tick" anim={fade(0.15)}>{cell(i, j)}</Layer>)));
  return out;
}
const L = (C, key, text, x, y, at, d, o = {}) => <Label key={key} text={text} x={x} y={y} w={o.w || 960} size={o.size || 36} align={o.align || "left"} font={o.font || C.fMono} color={o.color} at={at} out={o.out} dur={d} />;
const ez = (u) => { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); };

export const SCENES = ({ S, cue, D, ctx, C, TOP }) => {
  const tExam = cue("In your exam"), tMid = tExam + (D - tExam) / 2;
  return [
  // 1 · the question: the square, corner by corner, then the mirror line
  S(null, (r, d) => {
    const out = [...Axes(C, d)];
    // whisper heard the corners as one token "P22Q52R25S55" (2.6 s – 10.2 s): spread them over it
    const tSq = r("square");
    out.push(...Dots(C, d, tSq + 0.4, 1.8));
    const tO = tSq + 7.3;
    out.push(...drawOn("sqo", [...ORD, "P"].map(k => PP(CN[k])), tO, d, C.cobalt, 6, { speed: 1400 }));
    out.push(<Layer key="fill" at={tO + 0.8} dur={d} anim={fade(0.4)}>{pth("f", poly(ORD.map(k => PP(CN[k])), true), { width: 1, color: C.cobalt + "00" }, { fill: C.cobalt + "1F" })}</Layer>);
    const tL = r("line");
    out.push(...drawOn("mir", LN.map(PP), tL, d, C.coral, 7, { speed: 420 }));
    out.push(<Label key="mirL" text="2x − 8y + 4 = 0" x={715} y={392} w={330} size={34} align="left" font={C.fMono} color={C.coral} at={tL + 1.5} dur={d} />);
    return out;
  }, { cam: DRIFT }),

  // 2 · the line in slope form: crosses at ½, slope ¼
  S("Rearranged", (r, d) => {
    const tY = r("y equals");
    const out = [...Axes(C, d), ...Mirror(C, d, 0, true, 0, tY), ...Square(C, d)];
    out.push(<Label key="mirL2" text="y = x/4 + ½" x={715} y={392} w={330} size={34} align="left" font={C.fMono} color={C.coral} at={tY} dur={d} />);
    out.push(L(C, "w1", "2x − 8y + 4 = 0  →  8y = 2x + 4", 80, 990, 0.15, d, { size: 38 }));
    out.push(L(C, "w2", "y = x/4 + ½", 80, 1070, tY, d, { size: 54, color: C.coral }));
    const tI = r("crosses"), tH = r("at a half"), tS = r("slope"), tQ = r("quarter");
    const [ix, iy] = P(0, 0.5);
    bb({ k: "icon", n: "intercept", x: ix - 11, y: iy - 11, w: 22, h: 22, t0: tI, t1: d });
    out.push(<Layer key="int" at={tI} dur={d} anim={fade(0.1)} sfx="pop">{disc("c", ix, iy, 11, C.coral, C.navy)}</Layer>);
    out.push(Pulse(C, "puI", ix, iy, 30, tH, d, 1.2));
    out.push(L(C, "intL", "(0, ½)", 150, 596, tH, d, { size: 30, w: 120 }));
    out.push(L(C, "w3", "crosses the y axis at ½", 80, 1180, tH, d));
    // slope triangle: run 4, rise 1
    out.push(...drawOn("run", [P(0, 0.5), P(4, 0.5)], tS, d, C.navy, 5, { segDur: 0.5 }));
    out.push(...drawOn("rise", [P(4, 0.5), P(4, 1.5)], tS + 0.5, d, C.cobalt, 6, { segDur: 0.3, sfx: false }));
    out.push(L(C, "run4", "4", P(1.5, 0)[0], 614, tS + 0.5, d, { size: 30, w: 40, align: "center" }));
    out.push(L(C, "rise1", "1", P(4, 0)[0] + 10, 558, tS + 0.8, d, { size: 30, w: 40 }));
    out.push(L(C, "w4", "slope = 1/4  (up 1 for every 4 across)", 80, 1260, tQ, d));
    return out;
  }, { cam: DRIFT }),

  // 3 · recall Q2's plan, then the five steps: move, rotate flat, flip, rotate back, move back
  S("This is question", (r, d) => {
    const tMv = r("move everything"), tO = r("origin"), tRo = r("Rotate everything"), tFl = r("Flip across"), tRb = r("rotate back"), tMb = r("move back");
    const out = [...Axes(C, d), Ghost(C, d)];
    // callback card from Q2: y = x + 1 moves down to y = x, a point swaps, then everything moves back up
    const cx = 540, cy = 985, cw = 480, ch = 395, u = 40, ox = 600, oy = 1320, g = (x, y) => [ox + x * u, oy - y * u];
    bb({ k: "box", n: "recall card", x: cx, y: cy, w: cw, h: ch, t0: 0.05, t1: tMv - 0.1 });
    out.push(<Layer key="rc" at={0.05} out={tMv - 0.1} dur={d} sfx="pop"><rect x={cx} y={cy} width={cw} height={ch} radius={14} fill={C.paper} strokeColor={C.navy} strokeWidth={4} />
      {pth("ax", `M ${ox - 20} ${oy} L ${ox + 5.2 * u} ${oy} M ${ox} ${oy + 20} L ${ox} ${oy - 5.6 * u}`, { width: 3, color: C.navy, cap: "round" })}
      {disc("b0", ...g(3, 3), 9, C.paper, C.navy, 3)}</Layer>);
    out.push(<Label key="rt" text="from Q2" x={cx + 24} y={cy + 14} w={200} size={34} align="left" font={C.fBody} color={C.cobalt} at={0.1} out={tMv - 0.1} dur={d} />);
    const k1 = [0.6, 1.4], k2 = [1.8, 2.6], k3 = [3.0, 3.8];
    const ms = (T) => { const a = ez((T - k1[0]) / (k1[1] - k1[0])), b = ez((T - k2[0]) / (k2[1] - k2[0])), c = ez((T - k3[0]) / (k3[1] - k3[0]));
      const off = 1 - a + c;                                  // line y = x + off
      let px = 3, py = 3 - a; if (b > 0) { px = 3 - b; py = 2 + b; } py += c; return { off, px, py }; };
    const NF = Math.round(4.0 * 15);
    for (let i = 0; i <= NF; i++) { const a = i / 15, e = i === NF ? tMv - 0.1 : (i + 1) / 15; const s = ms(a);
      out.push(fr("rq" + i, a, e - a, [pth("l", poly([g(-0.5, -0.5 + s.off), g(4.4 - s.off, 4.4)]), { width: 5, color: C.coral, cap: "round" }), disc("p", ...g(s.px, s.py), 10, C.cobalt, C.navy, 3)])); }
    [["move down", k1[0]], ["swap", k2[0]], ["move back", k3[0]]].forEach(([s, t], i) => out.push(<Label key={"rs" + i} text={s} x={815} y={1120 + i * 60} w={200} size={34} align="left" font={C.fBody} at={t} out={tMv - 0.1} dur={d} />));
    // the plan on the left: easy mirror, flip, undo
    [["easy mirror", r("easy")], ["flip", r("flip")], ["undo", r("undo")]].forEach(([s, t], i) => { const y = 1000 + i * 110;
      bb({ k: "box", n: "plan " + s, x: 60, y, w: 420, h: 86, t0: t, t1: tMv - 0.1 });
      out.push(<Layer key={"pc" + i} at={t} out={tMv - 0.1} dur={d} sfx="pop"><rect x={60} y={y} width={420} height={86} radius={12} fill={i === 1 ? C.coral : C.chip} strokeColor={C.navy} strokeWidth={4} />
        <text x={60} y={y + 20} width={420} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={42} color={C.navy}>{s}</text></Layer>); });
    // the easiest mirror: the x axis
    const tE = r("easiest");
    out.push(<Layer key="xax" at={tE} out={tRo} dur={d} sfx="ping" anim={fade(0.2)}>{pth("h", `M ${P(-0.5, 0)[0]} ${OY} L ${P(7.6, 0)[0]} ${OY}`, { width: 18, color: C.cobalt + "66", cap: "round" })}</Layer>);
    out.push(<Label key="xaxL" text="easiest mirror: x axis" x={P(4.4, 0)[0]} y={OY + 52} w={420} size={34} align="center" font={C.fBody} color={C.cobalt} at={tE + 0.2} out={tRo} dur={d} />);
    // the five steps, each moving the square and its mirror
    [tMv, tRo, tFl, tRb, tMb].forEach((t, i) => out.push(StepL(C, i, t, d)));
    ev(tMv + 0.3, "move"); ev(tRo + 0.4, "move"); ev(tFl + 0.2, "move"); ev(tRb + 0.1, "move"); ev(tMb + 0.1, "move");
    out.push(...Travel(C, d, T => ({ s1: ez((T - tMv - 0.3) / 1.4), a1: ez((T - tRo - 0.4) / 1.6), f: 1 - 2 * ez((T - tFl - 0.2) / 1.0), a2: ez((T - tRb - 0.1) / 0.9), s2: ez((T - tMb - 0.1) / 0.8) })));
    out.push(Pulse(C, "pO", OX, OY, 30, tO, d, 1.2));
    return out;
  }, { cam: DRIFT }),

  // 4 · the line's angle: tan θ = 1/4
  S("The line's", (r, d) => {
    const out = [...Axes(C, d), ...Mirror(C, d), ...Square(C, d)];
    const tA = r("angle"), tT = r("tan");
    const [ix, iy] = P(0, 0.5);
    out.push(<Layer key="run" at={0} dur={d} anim={fade(0.2)}>{pth("r", poly([P(0, 0.5), P(4, 0.5)]), { width: 5, color: C.navy, cap: "round" })}{pth("u", poly([P(4, 0.5), P(4, 1.5)]), { width: 6, color: C.cobalt, cap: "round" })}</Layer>);
    out.push(L(C, "run4", "4", P(1.5, 0)[0], 614, 0, d, { size: 30, w: 40, align: "center" }));
    out.push(L(C, "rise1", "1", P(4, 0)[0] + 10, 558, 0, d, { size: 30, w: 40 }));
    const arc = []; for (let i = 0; i <= 12; i++) { const a = TH * i / 12; arc.push([OX + 2.4 * U * Math.cos(a), iy - 2.4 * U * Math.sin(a)]); }
    out.push(<Layer key="arc" at={tA} dur={d} anim={fade(0.2)} sfx="swish">{pth("a", poly(arc), { width: 5, color: C.coral, cap: "round" })}</Layer>);
    out.push(L(C, "thL", "θ", P(2.65, 0)[0], 572, tA + 0.2, d, { size: 34, w: 40, color: C.coral }));
    out.push(L(C, "w5", "tan θ = 1/4", 80, 990, tT, d, { size: 54, color: C.coral }));
    out.push(L(C, "hyp", "√17", 372, 528, tT + 0.8, d, { size: 30, w: 80 }));
    out.push(L(C, "w6", "cos θ = 4/√17,  sin θ = 1/√17", 80, 1100, tT + 1.0, d, { size: 38 }));
    return out;
  }, { cam: DRIFT }),

  // 5 · the middle three steps become one block built from cos 2θ and sin 2θ
  S("The middle three", (r, d) => {
    const out = [];
    const t1 = [0.1, 0.35, 0.6];
    out.push(...Mat(C, "Rt", 100, 350, [["cos θ", "−sin θ"], ["sin θ", "cos θ"]], 32, 130, t1[0], d));
    out.push(...Mat(C, "Rx", 450, 350, [["1", "0"], ["0", "−1"]], 32, 70, t1[1], d));
    out.push(...Mat(C, "Rm", 680, 350, [["cos θ", "sin θ"], ["−sin θ", "cos θ"]], 32, 130, t1[2], d));
    out.push(L(C, "n1", "R(θ)", 250, 296, t1[0] + 0.1, d, { size: 34, w: 300, align: "center" }));
    out.push(L(C, "n2", "Rfx", 540, 296, t1[1] + 0.1, d, { size: 34, w: 180, align: "center" }));
    out.push(L(C, "n3", "R(−θ)", 830, 296, t1[2] + 0.1, d, { size: 34, w: 300, align: "center" }));
    out.push(L(C, "d1", "·", 425, 378, t1[1], d, { size: 44, w: 40, align: "center" }));
    out.push(L(C, "d2", "·", 655, 378, t1[2], d, { size: 44, w: 40, align: "center" }));
    const tc = r("combine");
    out.push(<Arrow key="a1" x1={250} y1={472} x2={440} y2={562} at={tc} dur={d} width={6} />);
    out.push(<Arrow key="a2" x1={540} y1={472} x2={540} y2={562} at={tc + 0.1} dur={d} width={6} />);
    out.push(<Arrow key="a3" x1={830} y1={472} x2={640} y2={562} at={tc + 0.2} dur={d} width={6} />);
    out.push(...Mat(C, "B", 355, 580, [["cos 2θ", "sin 2θ"], ["sin 2θ", "−cos 2θ"]], 36, 165, r("matrix"), d));
    const tC = r("cos 2"), t15 = r("15"), tS = r("sin 2"), t8 = r("8");
    out.push(L(C, "c1", "cos 2θ = cos²θ − sin²θ = 16/17 − 1/17", 70, 760, tC, d, { size: 34 }));
    out.push(L(C, "c2", "= 15/17", 260, 816, t15, d, { size: 34, color: C.coral }));
    out.push(L(C, "s1", "sin 2θ = 2 sin θ cos θ = 2·(1/√17)·(4/√17)", 70, 900, tS, d, { size: 34 }));
    out.push(L(C, "s2", "= 8/17", 260, 956, t8, d, { size: 34, color: C.coral }));
    out.push(L(C, "eqN", "=", 270, 1100, t15, d, { size: 50, w: 50, align: "center" }));
    out.push(...Mat(C, "N", 320, 1060, [["15/17", "8/17"], ["8/17", "−15/17"]], 50, 200, t15, d, { cellAt: [[t15, t8], [t8, t15]], color: () => C.coral }));
    return out;
  }, { cam: STILL }),

  // 6 · add the two moves: the full matrix, everything over 17
  S("Adding the two", (r, d) => {
    const out = [];
    const tT = r("two moves");
    out.push(L(C, "f", "M = T(0, ½) · R(θ)·Rfx·R(−θ) · T(0, −½)", 540, 290, 0.1, d, { size: 34, w: 1000, align: "center" }));
    out.push(...Mat(C, "B3", 320, 372, [["15/17", "8/17", "0"], ["8/17", "−15/17", "0"], ["0", "0", "1"]], 32, 130, 0.1, d,
      { cellAt: [[0.1, 0.1, 0.45], [0.1, 0.1, 0.45], [0.45, 0.45, 0.45]], color: (i, j) => (i < 2 && j < 2 ? C.coral : null) }));
    out.push(...Mat(C, "T1", 80, 372, [["1", "0", "0"], ["0", "1", "½"], ["0", "0", "1"]], 32, 54, tT, d));
    out.push(...Mat(C, "T2", 792, 372, [["1", "0", "0"], ["0", "1", "−½"], ["0", "0", "1"]], 32, 54, tT + 0.3, d));
    out.push(L(C, "d1", "·", 301, 420, tT, d, { size: 40, w: 30, align: "center" }));
    out.push(L(C, "d2", "·", 771, 420, tT + 0.3, d, { size: 40, w: 30, align: "center" }));
    const tF = r("full");
    out.push(<Arrow key="dn" x1={540} y1={556} x2={540} y2={650} at={tF} dur={d} width={7} />);
    const tM = r("matrix");
    out.push(...Mat(C, "M", 500, 680, [["15", "8", "−4"], ["8", "−15", "16"], ["0", "0", "17"]], 60, 140, tM, d));
    out.push(L(C, "Mi", "M = (1/17) ·", 60, 772, tM + 0.15, d, { size: 54, w: 420 }));
    out.push(L(C, "x1", "x′ = (15x + 8y − 4) / 17", 120, 1040, tM + 0.6, d, { size: 42 }));
    out.push(L(C, "y1", "y′ = (8x − 15y + 16) / 17", 120, 1120, tM + 0.9, d, { size: 42 }));
    return out;
  }, { cam: STILL }),

  // 7 · multiply each corner: P′, Q′, R′, S′
  S("Multiply each", (r, d) => {
    const out = [...Axes(C, d), ...Mirror(C, d), ...Square(C, d)];
    const times = [r("P goes"), r("Q to"), r("R to"), r("S to")];
    ["P", "Q", "R", "S"].forEach((k, i) => out.push(<Layer key={"hp" + k} at={times[i]} dur={d} anim={fade()}>{pth("h", poly([PP(CN[k]), PP(img(CN[k]))]), { width: 4, color: C.cobalt + "77", cap: "round" }, { dash: [12, 12] })}</Layer>));
    out.push(...Images(C, d, { solid: true, times, on: true }));
    ["P", "Q", "R", "S"].forEach((k, i) => { const [x, y] = PP(img(CN[k])); out.push(Pulse(C, "pl" + k, x, y, 30, times[i], d, 0.8, C.cobalt)); });
    const tX = times[3] + 1.2;
    out.push(...drawOn("io", [...ORD, "P"].map(k => PP(img(CN[k]))), tX, d, C.navy, 6, { speed: 900 }));
    out.push(ImageSquare(C, d, tX + 1.3, "isq"));
    // result table
    const X = [60, 200, 650], Wd = [134, 444, 370], rh = 80, y0 = 975;
    const rowsT = [["P′", "(42/17, 2/17)", "(2.47, 0.12)"], ["Q′", "(87/17, 26/17)", "(5.12, 1.53)"], ["R′", "(66/17, −43/17)", "(3.88, −2.53)"], ["S′", "(111/17, −19/17)", "(6.53, −1.12)"]];
    bb({ k: "row", n: "header", x: 60, y: y0, w: 960, h: 66, t0: 0.1, t1: d });
    out.push(<Layer key="th" at={0.1} dur={d} anim={fade()}>{["corner", "M × corner", "≈"].map((h, j) => [<rect key={"r" + j} x={X[j]} y={y0} width={Wd[j]} height={66} radius={6} fill={C.navy} />,
      <text key={"t" + j} x={X[j]} y={y0 + 12} width={Wd[j]} align="center" fontFamily={C.fBody} fontWeight={700} fontSize={34} color={C.paper}>{h}</text>])}</Layer>);
    rowsT.forEach((row, i) => { const y = y0 + 76 + i * (rh + 10); bb({ k: "row", n: "row" + i, x: 60, y, w: 960, h: rh, t0: times[i], t1: d });
      out.push(<Layer key={"tr" + i} at={times[i]} dur={d} anim={fade(0.15)} sfx="tick">{row.map((c, j) => [<rect key={"r" + j} x={X[j]} y={y} width={Wd[j]} height={rh} radius={6} fill={j === 2 ? C.coral : C.chip} strokeColor={C.navy} strokeWidth={3} />,
        <text key={"t" + j} x={X[j]} y={y + 18} width={Wd[j]} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={36} color={C.navy}>{c}</text>])}</Layer>); });
    return out;
  }, { cam: DRIFT }),

  // 8 · answer card 1/2 (the trick is said over it)
  S("In your exam", (r, d) => AnswerCard({ page: ANSWERS["cg-q10"][0], title: "WRITE THIS · 5 MARKS · 1/2", at: 0, dur: d, y: TOP + 24 }), { cam: STILL }),

  // 9 · answer card 2/2, from the midpoint of the remaining time
  { ...S("In your exam", (r, d) => { globalThis.__T0 = tMid; return AnswerCard({ page: ANSWERS["cg-q10"][1], title: "WRITE THIS · 5 MARKS · 2/2", at: 0, dur: d, y: TOP + 24 }); }, { cam: STILL }), at: tMid },
  ];
};
