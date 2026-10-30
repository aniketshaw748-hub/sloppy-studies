import { Label, Layer, Mover, Check, ev, bb } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
// CG-Q1 · Window to viewport: window (2,2)-(6,10) -> viewport (0,0)-(1,1). Moves: slide, resize, slide.
const W = 1080, H = 1920;
const clamp = (u) => Math.max(0, Math.min(1, u));
const ease = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
const poly = (pts, close = true) => pts.map((p, i) => (i ? "L " : "M ") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ") + (close ? " Z" : "");
const fr = (key, at, len, kids, anim) => <frame key={key} at={at} duration={Math.max(0.05, len)} width={W} height={H} layout="none" animate={anim || []}>{kids}</frame>;
const pth = (key, d, o) => <path key={key} d={d} x={0} y={0} width={W} height={H} fill={o.fill} stroke={o.c ? { width: o.w, color: o.c, cap: "round" } : undefined} dash={o.dash} />;

// the picture inside the window (world coords): house + sun. M maps world (x,y) -> screen px.
function Pic(C, M, k, sw = 4) {
  const R = (x0, y0, x1, y1) => [M(x0, y0), M(x1, y0), M(x1, y1), M(x0, y1)];
  const sun = []; for (let i = 0; i < 32; i++) { const a = i / 32 * 6.2832; sun.push(M(4.9 + 0.65 * Math.cos(a), 8.7 + 0.65 * Math.sin(a))); }
  return [
    pth(k + "b", poly(R(2.8, 2.8, 5.2, 5.4)), { fill: C.cobalt, w: sw, c: C.navy }),
    pth(k + "d", poly(R(3.7, 2.8, 4.3, 4.0)), { fill: C.chip, w: Math.max(2, sw - 1), c: C.navy }),
    pth(k + "r", poly([M(2.5, 5.4), M(5.5, 5.4), M(4.0, 7.2)]), { fill: C.coral, w: sw, c: C.navy }),
    pth(k + "s", poly(sun), { fill: C.chip, w: sw + 1, c: C.coral }),
  ];
}
// the window itself: light fill + picture + outline
function Win(C, M, k, sw = 4, ow = 7) {
  const [x0, y0] = M(2, 10), [x1, y1] = M(6, 2);
  return [<rect key={k + "f"} x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={C.chip} opacity={0.55} />, ...Pic(C, M, k, sw),
    pth(k + "o", poly([M(2, 2), M(6, 2), M(6, 10), M(2, 10)]), { fill: "#00000000", w: ow, c: C.navy })];
}
// part of the picture outside the window: a tree
function Tree(C, M, k) {
  const cr = []; for (let i = 0; i < 28; i++) { const a = i / 28 * 6.2832; cr.push(M(1.0 + 0.75 * Math.cos(a), 5.0 + 0.75 * Math.sin(a))); }
  return [pth(k + "t", poly([M(0.88, 3.0), M(1.12, 3.0), M(1.12, 4.4), M(0.88, 4.4)]), { fill: C.navy, w: 3, c: C.navy }),
    pth(k + "c", poly(cr), { fill: C.cobalt, w: 4, c: C.navy })];
}
// stroke that draws itself in chunks from t0 (scene s), visible until `until`
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
const arrowHead = (C, key, x, y, dir, at, dur) => { const s = 16; const d = dir === "up" ? `M ${x} ${y - s} L ${x - s * 0.7} ${y + s * 0.4} L ${x + s * 0.7} ${y + s * 0.4} Z` : `M ${x + s} ${y} L ${x - s * 0.4} ${y - s * 0.7} L ${x - s * 0.4} ${y + s * 0.7} Z`;
  return <Layer key={key} at={at} dur={dur}><path d={d} x={0} y={0} width={W} height={H} fill={C.navy} /></Layer>; };
// true axes with integer ticks through mapping P; xs / ys = tick values that get numbers
function Axes(C, P, d, { xmax, ymax, xs, ys, at = 0, fs = 30 }) {
  const [ox, oy] = P(0, 0); const out = [];
  out.push(...drawOn("ax", [[ox - 20, oy], [P(xmax, 0)[0], oy]], at, d, C.navy, 5, 3200));
  out.push(...drawOn("ay", [[ox, oy + 20], [ox, P(0, ymax)[1]]], at, d, C.navy, 5, 3200));
  out.push(arrowHead(C, "hx", P(xmax, 0)[0], oy, "right", at + 0.25, d), arrowHead(C, "hy", ox, P(0, ymax)[1], "up", at + 0.3, d));
  const tk = []; for (let i = 1; i <= Math.floor(xmax); i++) { const x = P(i, 0)[0]; tk.push(`M ${x} ${oy - 9} L ${x} ${oy + 9}`); }
  for (let j = 1; j <= Math.floor(ymax); j++) { const y = P(0, j)[1]; tk.push(`M ${ox - 9} ${y} L ${ox + 9} ${y}`); }
  out.push(<Layer key="tk" at={at + 0.2} dur={d}><path d={tk.join(" ")} x={0} y={0} width={W} height={H} stroke={{ width: 4, color: C.navy, cap: "round" }} /></Layer>);
  xs.forEach((i) => out.push(<Label key={"tx" + i} text={String(i)} x={P(i, 0)[0]} y={oy + 12} w={60} size={fs} font={C.fMono} at={at + 0.3} dur={d} />));
  ys.forEach((j) => out.push(<Label key={"ty" + j} text={String(j)} x={ox - 34} y={P(0, j)[1] - fs * 0.62} w={60} size={fs} font={C.fMono} at={at + 0.3} dur={d} />));
  return out;
}
// brackets: horizontal (width) and vertical (height)
const hBr = (x0, x1, y) => `M ${x0} ${y - 12} L ${x0} ${y + 12} M ${x0} ${y} L ${x1} ${y} M ${x1} ${y - 12} L ${x1} ${y + 12}`;
const vBr = (x, y0, y1) => `M ${x - 12} ${y0} L ${x + 12} ${y0} M ${x} ${y0} L ${x} ${y1} M ${x - 12} ${y1} L ${x + 12} ${y1}`;
const brText = (C, key, s, cx, y) => <text key={key} x={cx - 50} y={y} width={100} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={40} color={C.coral}>{s}</text>;
// matrix: rows of strings, top-left (x,y)
function Mat(C, key, x, y, rows, fs, colW, at, dur, color) {
  const rh = Math.round(fs * 1.35), h = rows.length * rh + 20, w = rows[0].length * colW + 40;
  bb({ k: "box", n: "matrix " + key, x, y, w, h, t0: at, t1: dur });
  const br = `M ${x + 14} ${y} L ${x} ${y} L ${x} ${y + h} L ${x + 14} ${y + h} M ${x + w - 14} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x + w - 14} ${y + h}`;
  return <Layer key={key} at={at} dur={dur} sfx="pop" anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.2 }, { property: "offsetY", from: 24, to: 0, at: 0, duration: 0.35, easing: [0.22, 1, 0.36, 1] }]}>
    <path d={br} x={0} y={0} width={W} height={H} stroke={{ width: 5, color: C.navy, cap: "round" }} />
    {rows.flatMap((r, i) => r.map((c, j) => <text key={i + "_" + j} x={x + 20 + j * colW} y={y + 10 + i * rh + (rh - fs * 1.2) / 2} width={colW} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={fs} color={color || C.navy}>{c}</text>))}
  </Layer>;
}
// mono label pieces written left to right: [[text, at, color], ...]
function Pieces(C, key, x0, y, fs, parts, dur) {
  const cw = 0.62 * fs; let x = x0; const out = [];
  parts.forEach(([s, at, color], i) => { out.push(<Label key={key + i} text={s} x={x} y={y} w={s.length * cw + 4} size={fs} font={C.fMono} align="left" color={color} at={at} dur={dur} />); x += s.length * cw; });
  return out;
}
// a ring that can end
const RingO = (C, key, x, y, r, at, out, dur, color) => <Layer key={key} at={at} out={out} dur={dur} sfx="ping" anim={[{ property: "opacity", keyframes: [{ at: 0, value: 0 }, { at: 0.15, value: 1 }, { at: 0.5, value: 1 }] }, { property: "scale", keyframes: [{ at: 0, value: 0.6 }, { at: 0.3, value: 1.05 }, { at: 0.6, value: 1 }] }]}>
  <rect x={x - r} y={y - r} width={r * 2} height={r * 2} radius={r} fill="#00000000" strokeColor={color || C.coral} strokeWidth={8} /></Layer>;
// viewport: the unit square (blue, dashed)
const VP = (C, P, key, at, dur, sw = 6) => <Layer key={key} at={at} dur={dur} sfx="pop" anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.3 }]}>
  <rect x={P(0, 1)[0]} y={P(0, 1)[1]} width={P(1, 0)[0] - P(0, 0)[0]} height={P(0, 0)[1] - P(0, 1)[1]} fill={C.cobalt} opacity={0.22} />
  {pth("o", poly([P(0, 0), P(1, 0), P(1, 1), P(0, 1)]), { fill: "#00000000", w: sw, c: C.cobalt, dash: [14, 10] })}</Layer>;

export const SCENES = ({ S, ctx, C, TOP }) => [
  // Question + from zero + the three moves: one picture on real axes.
  S(null, (r, d) => {
    const U = 84, OX = 170, OY = 1210; const P = (x, y) => [OX + x * U, OY - y * U];
    const out = [];
    out.push(...Axes(C, P, d, { xmax: 6.5, ymax: 10.4, xs: [1, 2, 3, 4, 5, 6], ys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }));
    out.push(<Label key="lx" text="x" x={P(6.5, 0)[0] + 34} y={OY - 22} w={50} size={36} font={C.fMono} dur={d} at={0.3} />);
    out.push(<Label key="ly" text="y" x={OX + 36} y={P(0, 10.4)[1] - 8} w={50} size={36} font={C.fMono} dur={d} at={0.3} />);
    const sl0 = r("slide"), sl1 = sl0 + 1.6, s2 = r("Second"), sx0 = r("divide") + 0.2, sx1 = sx0 + 0.9, sy0 = r("and y by") + 0.3, sy1 = sy0 + 0.9;
    const st = (T) => ({ t: 2 * ease((T - sl0) / (sl1 - sl0)), sx: 1 - 0.75 * ease((T - sx0) / (sx1 - sx0)), sy: 1 - 0.875 * ease((T - sy0) / (sy1 - sy0)) });
    const Ms = (s) => (x, y) => P(2 - s.t + (x - 2) * s.sx, 2 - s.t + (y - 2) * s.sy);
    // the picture (on screen during the question)
    const pt = r("part");
    out.push(<Layer key="tree" at={0.2} out={sl0} dur={d} anim={[{ property: "opacity", keyframes: [{ at: 0, value: 0 }, { at: 0.3, value: 1 }, { at: Math.max(0.4, pt - 0.2), value: 1 }, { at: pt + 0.3, value: 0.25 }] }]}>{Tree(C, P, "tr")}</Layer>);
    out.push(<Layer key="pic" at={0.2} out={r("window is") + 0.4} dur={d} anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.3 }]}>{Pic(C, P, "p0")}</Layer>);
    bb({ k: "srect", n: "picture", id: "pic", x: P(0.25, 0)[0], y: P(0, 9.4)[1], w: P(5.6, 0)[0] - P(0.25, 0)[0], h: P(0, 2.8)[1] - P(0, 9.4)[1], t0: 0.2, t1: r("window is") });
    // window: the outline draws itself around the part we want
    const w0 = r("window is");
    out.push(<Layer key="wf" at={w0} out={sl0} dur={d} anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.4 }]}><rect x={P(2, 10)[0]} y={P(2, 10)[1]} width={4 * U} height={8 * U} fill={C.chip} opacity={0.55} />{Pic(C, P, "p1")}</Layer>);
    out.push(...drawOn("win", [P(2, 2), P(6, 2), P(6, 10), P(2, 10), P(2, 2)], w0, sl0, C.navy, 7, 2600));
    bb({ k: "srect", n: "window", id: "winA", x: P(2, 2)[0], y: P(2, 10)[1], w: 4 * U, h: 8 * U, t0: w0, t1: sl0 });
    out.push(<Label key="wl" text="window" x={P(6, 0)[0] + 24} y={P(0, 10)[1] + 50} w={220} size={40} align="left" color={C.navy} at={w0 + 0.6} out={sl0} dur={d} />);
    out.push(<Label key="c22" text="(2, 2)" x={P(2, 0)[0] + 10} y={P(0, 2)[1] - 44} w={140} size={32} font={C.fMono} align="left" at={r("2")} out={sl0} dur={d} />);
    out.push(<Label key="c610" text="(6, 10)" x={P(6, 0)[0] + 24} y={P(0, 10)[1] - 18} w={160} size={32} font={C.fMono} align="left" at={r("6")} out={sl0} dur={d} />);
    // viewport: the unit square at the origin, with a leader to its label
    const vp = r("viewport is");
    out.push(VP(C, P, "vp", vp, d));
    out.push(<Layer key="vpld" at={vp + 0.2} dur={d}>{pth("l", `M 690 1112 L ${P(1, 0)[0] + 8} ${P(0, 0.5)[1]}`, { w: 4, c: C.cobalt, dash: [10, 8] })}</Layer>);
    out.push(<Label key="vpl" text="viewport" x={700} y={1070} w={300} size={40} align="left" color={C.cobalt} at={vp + 0.2} dur={d} />);
    out.push(<Label key="vp11" text="1 × 1" x={700} y={1124} w={300} size={36} font={C.fMono} align="left" color={C.coral} at={r("1 by")} dur={d} />);
    const f1 = r("First, slide");
    out.push(<Label key="c00" text="(0, 0)" x={OX - 40} y={OY + 50} w={140} size={32} font={C.fMono} at={r("0")} out={f1} dur={d} />);
    out.push(<Label key="c11" text="(1, 1)" x={P(1, 0)[0] + 10} y={P(0, 1)[1] - 44} w={140} size={32} font={C.fMono} align="left" at={r("to 1")} out={f1} dur={d} />);
    // "one matrix" line, then the three-move strip, building downward under the figure
    const m0 = r("We need");
    out.push(<Label key="om" text="one matrix:  window → viewport" x={540} y={1320} w={960} size={44} color={C.navy} at={m0} out={f1} dur={d} />);
    const rowY = [1312, 1402, 1492];
    out.push(<Label key="st1" text="1 · SLIDE" x={70} y={rowY[0]} w={330} size={44} align="left" color={C.coral} at={f1} dur={d} />);
    out.push(<Label key="st1a" text="x − 2" x={420} y={rowY[0]} w={240} size={44} font={C.fMono} align="left" color={C.cobalt} at={r("Subtract")} dur={d} />);
    out.push(<Label key="st1b" text="y − 2" x={700} y={rowY[0]} w={240} size={44} font={C.fMono} align="left" color={C.cobalt} at={r("2 from y")} dur={d} />);
    out.push(<Label key="st2" text="2 · RESIZE" x={70} y={rowY[1]} w={330} size={44} align="left" color={C.coral} at={s2} dur={d} />);
    out.push(<Label key="st2a" text="x ÷ 4" x={420} y={rowY[1]} w={240} size={44} font={C.fMono} align="left" color={C.cobalt} at={r("divide")} dur={d} />);
    out.push(<Label key="st2b" text="y ÷ 8" x={700} y={rowY[1]} w={240} size={44} font={C.fMono} align="left" color={C.cobalt} at={r("and y by")} dur={d} />);
    const t3 = r("Third");
    out.push(<Label key="st3" text="3 · SLIDE" x={70} y={rowY[2]} w={330} size={44} align="left" color={C.coral} at={t3} dur={d} />);
    out.push(<Label key="st3a" text="x + 0" x={420} y={rowY[2]} w={240} size={44} font={C.fMono} align="left" color={C.cobalt} at={r("already")} dur={d} />);
    out.push(<Label key="st3b" text="y + 0" x={700} y={rowY[2]} w={240} size={44} font={C.fMono} align="left" color={C.cobalt} at={r("already") + 0.4} dur={d} />);
    // sizes: window 4 x 8 (brackets on the window before it moves are not needed: the window has slid by then)
    // step 1: the slide (ghost of the old place + arrow from its corner to the origin)
    out.push(<Layer key="gh" at={sl0} out={s2} dur={d}>{pth("g", poly([P(2, 2), P(6, 2), P(6, 10), P(2, 10)]), { fill: "#00000000", w: 4, c: C.navy, dash: [12, 10] })}</Layer>);
    // the moving window: snapshots (slide, then squash x, then squash y); brackets ride on it from "4 wide"
    const b4 = r("4 wide"), b8 = r("8 tall");
    const brk = (s, k, T) => { const M = Ms(s); const [x0, yt] = M(2, 10), [x1, yb] = M(6, 2); const out2 = [];
      if (T >= b4) { out2.push(pth(k + "bw", hBr(x0, x1, yt - 30), { w: 5, c: C.coral }), brText(C, k + "lw", s.sx < 0.2501 ? "1" : "4", (x0 + x1) / 2, yt - 86)); }
      if (T >= b8) { out2.push(pth(k + "bh", vBr(x1 + 30, yt, yb), { w: 5, c: C.coral }), brText(C, k + "lh", s.sy < 0.1251 ? "1" : "8", x1 + 76, (yt + yb) / 2 - 24)); }
      return out2; };
    ev(sl0, "move"); ev(sx0, "swish"); ev(sy0, "swish");
    const cuts = [sl0, sl1, b4, b8, sx0, sx1, sy0, sy1, d]; const anim = new Set([0, 4, 6]);
    for (let i = 0; i + 1 < cuts.length; i++) { const a = cuts[i], b = cuts[i + 1];
      if (anim.has(i)) { const n = Math.ceil((b - a) * 15), dt = (b - a) / n; for (let k = 0; k < n; k++) { const T = a + (k + 1) * dt; const s = st(T);
          out.push(fr("m" + i + "_" + k, a + k * dt, dt, [...Win(C, Ms(s), "m" + i + "_" + k, 4, 7), ...brk(s, "k" + i + "_" + k, T)])); } }
      else { const s = st(b - 0.001); out.push(fr("s" + i, a, b - a, [...Win(C, Ms(s), "s" + i, 4, 7), ...brk(s, "kf" + i, a + 0.001)])); } }
    out.push(<Layer key="sla" at={sl0} out={s2} dur={d} sfx="swish">{pth("a", `M ${P(2, 2)[0]} ${P(2, 2)[1]} L ${P(0, 0)[0] + 10} ${P(0, 0)[1] - 10}`, { w: 7, c: C.coral })}
      {pth("h", `M ${P(0, 0)[0] + 4} ${P(0, 0)[1] - 4} L ${P(0, 0)[0] + 32} ${P(0, 0)[1] - 6} L ${P(0, 0)[0] + 6} ${P(0, 0)[1] - 32} Z`, { fill: C.coral })}</Layer>);
    out.push(RingO(C, "rg0", OX, OY, 34, r("sits"), s2, d));
    bb({ k: "srect", n: "window slid", id: "winB", x: OX, y: OY - 8 * U, w: 4 * U, h: 8 * U, t0: sl1, t1: sx0 });
    bb({ k: "label", n: "4", x: OX + 2 * U - 14, y: OY - 8 * U - 86, w: 28, h: 50, t0: b4, t1: sx0 });
    bb({ k: "label", n: "8", x: OX + 4 * U + 62, y: OY - 4 * U - 24, w: 28, h: 50, t0: b8, t1: sx0 });
    bb({ k: "srect", n: "window resized", id: "winC", x: OX, y: OY - U, w: U, h: U, t0: sy1, t1: d, on: true });
    // the result, magnified: the whole window now fills the viewport
    const zi = sy1 + 0.3, IX = 680, IY = 610, IS = 320; const Mi = (x, y) => [IX + (x - 2) / 4 * IS, IY + IS - (y - 2) / 8 * IS];
    out.push(<Layer key="zl" at={zi} dur={d} sfx="swish">{pth("z", `M ${P(1, 1)[0] + 6} ${P(1, 1)[1] - 6} L ${IX} ${IY + IS}`, { w: 4, c: C.cobalt, dash: [12, 10] })}</Layer>);
    out.push(<Layer key="zi" at={zi + 0.15} dur={d} sfx="pop" anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.15 }, { property: "scale", from: 0.6, to: 1, at: 0, duration: 0.4, easing: [0.34, 1.56, 0.64, 1] }]}>
      <rect x={IX} y={IY} width={IS} height={IS} fill={C.paper} />{Win(C, Mi, "zi", 4, 6)}
      {pth("zo", poly([[IX, IY], [IX + IS, IY], [IX + IS, IY + IS], [IX, IY + IS]]), { fill: "#00000000", w: 6, c: C.cobalt, dash: [14, 10] })}</Layer>);
    bb({ k: "box", n: "zoom inset", x: IX, y: IY, w: IS, h: IS, t0: zi, t1: d });
    out.push(<Label key="zlt" text="zoomed in" x={IX + IS / 2} y={IY - 56} w={300} size={34} color={C.cobalt} at={zi + 0.3} dur={d} />);
    // step 3: the viewport corner is already at the origin
    out.push(RingO(C, "rg1", OX, OY, 34, r("already"), d, d));
    return out;
  }, { hold: "That corner", holdX: 540, holdY: 960, holdZ: 1, cam: [{ t: 0, x: 540, y: 960, z: 1 }] }),

  // Result: the two rules, then the matrix whose rows they are.
  S("So the new x", (r, d) => {
    const out = [];
    const y1 = TOP + 70, y2 = TOP + 250;
    out.push(...Pieces(C, "e1", 110, y1, 58, [["x′ = ", 0.15, C.navy], ["(x − 2)", r("minus"), C.cobalt], [" / 4", r("over"), C.coral]], d));
    out.push(<Label key="u1a" text="slide" x={110 + 5 * 36 + 3.5 * 36} y={y1 + 84} w={220} size={34} color={C.cobalt} at={r("minus") + 0.2} dur={d} />);
    out.push(<Label key="u1b" text="resize" x={110 + 12 * 36 + 2 * 36} y={y1 + 84} w={220} size={34} color={C.coral} at={r("over") + 0.2} dur={d} />);
    out.push(...Pieces(C, "e2", 110, y2, 58, [["y′ = ", r("new y"), C.navy], ["(y − 2)", r("y minus"), C.cobalt], [" / 8", r("over 8"), C.coral]], d));
    out.push(<Label key="u2a" text="slide" x={110 + 5 * 36 + 3.5 * 36} y={y2 + 84} w={220} size={34} color={C.cobalt} at={r("y minus") + 0.2} dur={d} />);
    out.push(<Label key="u2b" text="resize" x={110 + 12 * 36 + 2 * 36} y={y2 + 84} w={220} size={34} color={C.coral} at={r("over 8") + 0.2} dur={d} />);
    const th = r("Those"), rw = r("rows");
    out.push(<Label key="x1" text="= x/4 − 1/2" x={720} y={y1 + 10} w={330} size={44} font={C.fMono} align="left" color={C.navy} at={th} dur={d} />);
    out.push(<Label key="x2" text="= y/8 − 1/4" x={720} y={y2 + 10} w={330} size={44} font={C.fMono} align="left" color={C.navy} at={th + 0.3} dur={d} />);
    const my = TOP + 480, fs = 48, rh = Math.round(fs * 1.35);
    out.push(Mat(C, "L", 90, my, [["x′"], ["y′"], ["1"]], fs, 70, th + 0.6, d));
    out.push(<Label key="eq" text="=" x={232} y={my + rh + 6} w={60} size={52} font={C.fMono} at={th + 0.6} dur={d} />);
    out.push(Mat(C, "N", 280, my, [["1/4", "0", "−1/2"], ["0", "1/8", "−1/4"], ["0", "0", "1"]], fs, 140, th + 0.8, d));
    out.push(Mat(C, "P", 770, my, [["x"], ["y"], ["1"]], fs, 70, th + 1.0, d));
    out.push(<Label key="nl" text="N" x={280 + 230} y={my + 3 * rh + 40} w={80} size={44} font={C.fMono} color={C.coral} at={th + 0.8} dur={d} />);
    out.push(<Layer key="r1h" at={rw} dur={d} sfx="ping"><rect x={288} y={my + 6} width={444} height={rh + 8} radius={12} fill="#00000000" strokeColor={C.coral} strokeWidth={5} /></Layer>);
    out.push(<Layer key="r2h" at={rw + 0.5} dur={d} sfx="ping"><rect x={288} y={my + 6 + rh} width={444} height={rh + 8} radius={12} fill="#00000000" strokeColor={C.cobalt} strokeWidth={5} /></Layer>);
    out.push(<Label key="r1" text="row 1 → x′ = x/4 + 0 − 1/2" x={540} y={my + 3 * rh + 120} w={960} size={40} font={C.fMono} color={C.coral} at={rw + 0.1} dur={d} />);
    out.push(<Label key="r2" text="row 2 → y′ = 0 + y/8 − 1/4" x={540} y={my + 3 * rh + 190} w={960} size={40} font={C.fMono} color={C.cobalt} at={rw + 0.6} dur={d} />);
    return out;
  }, { hold: "Those", holdX: 540, holdY: 960, holdZ: 1, cam: [{ t: 0, x: 540, y: 960, z: 1 }] }),

  // Check: the corner (6, 10) lands on (1, 1).
  S("Check", (r, d) => {
    const U = 64, OX = 200, OY = TOP + 790; const P = (x, y) => [OX + x * U, OY - y * U];
    const out = [];
    out.push(...Axes(C, P, d, { xmax: 6.6, ymax: 10.6, xs: [1, 2, 3, 4, 5, 6], ys: [2, 4, 6, 8, 10], at: 0 }));
    out.push(VP(C, P, "vp", 0, d, 5));
    out.push(<Layer key="win" at={0} dur={d} anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.2 }]}>{Win(C, P, "w", 3, 6)}</Layer>);
    bb({ k: "srect", n: "window", id: "w", x: P(2, 2)[0], y: P(2, 10)[1], w: 4 * U, h: 8 * U, t0: 0, t1: d });
    const ml = r("lands"), [a, b] = P(6, 10), [c, e] = P(1, 1);
    out.push(<Mover key="mv" at={0.1} dur={d} cw={34} ch={34} on={true} pts={[{ t: 0.1, x: a, y: b }, { t: ml, x: a, y: b }, { t: ml + 0.7, x: c, y: e }]}>
      <rect x={2} y={2} width={30} height={30} radius={15} fill={C.coral} strokeColor={C.navy} strokeWidth={3} /></Mover>);
    out.push(<Label key="l610" text="(6, 10)" x={a + 24} y={b - 20} w={160} size={32} font={C.fMono} align="left" color={C.coral} at={r("corner")} dur={d} />);
    out.push(<Label key="l11" text="(1, 1)" x={c + 20} y={e - 52} w={140} size={32} font={C.fMono} align="left" color={C.coral} at={ml + 0.7} dur={d} />);
    const wy = OY + 80;
    out.push(<Label key="k1" text="x′ = (6 − 2)/4 = 1" x={540} y={wy} w={900} size={46} font={C.fMono} at={r("6")} dur={d} />);
    out.push(<Label key="k2" text="y′ = (10 − 2)/8 = 1" x={540} y={wy + 76} w={900} size={46} font={C.fMono} at={r("10")} dur={d} />);
    out.push(<Label key="k3" text="(6, 10) → (1, 1)" x={480} y={wy + 170} w={600} size={46} font={C.fMono} color={C.coral} at={r("on 1")} dur={d} />);
    out.push(<Check key="ck" x={820} y={wy + 196} size={70} at={r("on 1") + 0.2} dur={d} />);
    return out;
  }, { cam: [{ t: 0, x: 540, y: 960, z: 1 }] }),

  // Exam: the answer card (shared content), one page from "In your exam" to the end.
  ...ANSWERS["cg-q01"].map((pg, k, all) => S(k === 0 ? "In your exam" : null, (r, d) => [
    ...AnswerCard({ page: pg, title: "WRITE THIS · 5 MARKS · " + (k + 1) + "/" + all.length, at: 0, dur: d, y: TOP + 24 }),
    ...(k === 0 ? [<Label key="tr" text="slide → resize → slide" x={540} y={1400} w={960} size={60} font={C.fHead} color={C.navy} at={r("Remember")} dur={d} />] : []),
  ], { cam: [{ t: 0, x: 540, y: 960, z: 1 }] })),
];
