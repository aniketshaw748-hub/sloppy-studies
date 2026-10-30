// cg-q08 v3 · Composite: square O(0,0) B(4,0) C(4,4) D(0,4); T1 = scale ½, T2 = rotate 90° clockwise, T3 = reflect about the origin.
import { Label, Layer, Box, Ring, bb, ev } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
const W = 1080, H = 1920;
// one mapping for every figure: origin (432, 756), 1 unit = 108 px
const U = 108, OX = 432, OY = 756;
const P = (x, y) => [OX + x * U, OY - y * U];
const S0 = [[0, 0], [4, 0], [4, 4], [0, 4]];
const S1 = [[0, 0], [2, 0], [2, 2], [0, 2]];
const S2 = [[0, 0], [0, -2], [2, -2], [2, 0]];
const S3 = [[0, 0], [0, 2], [-2, 2], [-2, 0]];
const smooth = (u) => u * u * (3 - 2 * u);
const rot = (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];
const fScale = (p, u) => [p[0] * (1 - 0.5 * u), p[1] * (1 - 0.5 * u)];
const fRotCW = (p, u) => rot(p, -Math.PI / 2 * u);
const fFlip = (p, u) => [p[0] * (1 - 2 * u), p[1] * (1 - 2 * u)];
const fNet = (p, u) => { const q = rot(p, Math.PI / 2 * u); return [q[0] * (1 - 0.5 * u), q[1] * (1 - 0.5 * u)]; };
const STILL = [{ t: 0, x: 540, y: 960, z: 1 }];
const MW = 0.62;

export const SCENES = ({ S, ctx, C, TOP }) => {
  const poly = (pts, close) => "M " + pts.map((p) => P(p[0], p[1]).join(" ")).join(" L ") + (close ? " Z" : "");
  const F = (k, at, len, kids) => <frame key={k} at={at} duration={Math.max(0.04, len)} width={W} height={H} layout="none">{kids}</frame>;
  const fadeIn = [{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.3 }];
  const pth = (d, stroke, extra = {}) => <path d={d} x={0} y={0} width={W} height={H} stroke={stroke} {...extra} />;
  const dot = (p, col, r = 11) => { const [x, y] = P(p[0], p[1]); return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} radius={r} fill={col} strokeColor={C.navy} strokeWidth={4} />; };
  const square = (pts) => [<path d={poly(pts, true)} x={0} y={0} width={W} height={H} fill={C.cobalt + "2A"} stroke={{ width: 6, color: C.cobalt, cap: "round" }} />, ...pts.map((p) => dot(p, C.cobalt))];
  const ghost = (pts, a = "77") => <path d={poly(pts, true)} x={0} y={0} width={W} height={H} stroke={{ width: 4, color: C.navy + a }} dash={[14, 12]} />;
  const overlay = (pts) => [<path d={poly(pts, true)} x={0} y={0} width={W} height={H} stroke={{ width: 7, color: C.coral, cap: "round" }} dash={[18, 12]} />, ...pts.map((p) => dot(p, C.coral, 9))];
  const trails = (src, f, u) => src.slice(1).map((p) => { const m = 24, q = []; for (let j = 0; j <= m; j++) q.push(f(p, u * j / m));
    return <path d={poly(q, false)} x={0} y={0} width={W} height={H} stroke={{ width: 4, color: C.coral, cap: "round" }} dash={[12, 10]} />; });
  const morph = (k, src, f, t0, len, look = square, trail = true) => { const n = Math.max(2, Math.round(len * 30)), out = [];
    for (let i = 0; i < n; i++) { const u = smooth(i / (n - 1)); out.push(F(k + i, t0 + i * len / n, len / n + 0.002, [...(trail ? trails(src, f, u) : []), ...look(src.map((p) => f(p, u)))])); }
    ev(t0, "move"); return out; };
  const axes = (k, d) => {
    const [xa, xb] = [P(-2.6, 0)[0], P(4.65, 0)[0]], [ya, yb] = [P(0, -2.5)[1], P(0, 4.55)[1]];
    const tick = [];
    for (let i = -2; i <= 4; i++) if (i) { tick.push(`M ${P(i, 0)[0]} ${OY - 9} L ${P(i, 0)[0]} ${OY + 9}`); tick.push(`M ${OX - 9} ${P(0, i)[1]} L ${OX + 9} ${P(0, i)[1]}`); }
    return [<Layer key={k} at={0} dur={d} anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.2 }]}>
      <path d={`M ${xa} ${OY} L ${xb} ${OY} M ${OX} ${ya} L ${OX} ${yb}`} x={0} y={0} width={W} height={H} stroke={{ width: 5, color: C.navy, cap: "round" }} />
      <path d={`M ${xb + 14} ${OY} L ${xb - 12} ${OY - 12} L ${xb - 12} ${OY + 12} Z M ${OX} ${yb - 14} L ${OX - 12} ${yb + 12} L ${OX + 12} ${yb + 12} Z`} x={0} y={0} width={W} height={H} fill={C.navy} />
      <path d={tick.join(" ")} x={0} y={0} width={W} height={H} stroke={{ width: 4, color: C.navy }} />
    </Layer>,
    <Label key={k + "x"} text="x" x={xb - 30} y={OY + 16} w={40} size={34} font={C.fMono} at={0} dur={d} />,
    <Label key={k + "y"} text="y" x={OX + 34} y={yb - 4} w={40} size={34} font={C.fMono} at={0} dur={d} />];
  };
  // coordinate label (mono 34): side "l" ends at x, "r" starts at x, "c" centred on x
  const Lb = (k, text, side, x, y, at, out, d) => { const w = text.length * 34 * MW; const lx = side === "l" ? x - w : side === "c" ? x - w / 2 : x;
    return <Label key={k} text={text} x={lx} y={y} w={w + 4} size={34} align="left" font={C.fMono} at={at} out={out} dur={d} />; };
  const oLabel = (k, at, d) => Lb(k, "O(0, 0)", "l", OX - 14, OY + 16, at, undefined, d);
  // the three steps as chips; lit = index of the current step (-1 none)
  const chips = (k, d, lit, ats = [0, 0, 0]) => [["T1", "scale 0.5", 210], ["T2", "rotate 90° cw", 540], ["T3", "reflect in O", 870]].map(([l, s, x], i) =>
    <Box key={k + i} x={x} y={1110} w={316} h={120} label={l} sub={s} size={62} tone={i === lit ? "hot" : "a"} at={ats[i]} dur={d} />);
  // working rows under the chips
  const rule = (k, s, at, d) => <Label key={k} text={s} x={60} y={1200} w={960} size={50} align="left" font={C.fMono} at={at} dur={d} />;
  const row = (k, s, i, at, d, col) => <Label key={k} text={s} x={60} y={1290 + i * 62} w={960} size={42} align="left" font={C.fMono} color={col} at={at} dur={d} />;
  // one transformation step: previous square ghosted, morph on cue, labels + working
  const step = (r, d, { k, lit, src, dst, f, t0, len, labels0, labels1, rl, rlAt, rows }) => {
    const n = [...axes(k + "ax", d), oLabel(k + "lO", 0, d), ...chips(k + "ch", d, lit)];
    n.push(<Layer key={k + "g"} at={0} dur={d} anim={fadeIn}>{ghost(src)}</Layer>);
    n.push(F(k + "s0", 0, t0, square(src)));
    labels0.forEach(([t, side, x, y], i) => n.push(Lb(k + "a" + i, t, side, x, y, 0, t0, d)));
    n.push(...morph(k + "m", src, f, t0, len));
    n.push(F(k + "tr", t0 + len, d - t0 - len, trails(src, f, 1)), F(k + "s1", t0 + len, d - t0 - len, square(dst)));
    labels1.forEach(([t, side, x, y, at], i) => n.push(Lb(k + "b" + i, t, side, x, y, Math.max(at, t0 + len), undefined, d)));
    n.push(rule(k + "r", rl, rlAt, d));
    rows.forEach(([s, at], i) => n.push(row(k + "w" + i, s, i, at, d)));
    return n;
  };
  // small recall panel with a tag
  const panel = (k, x, at, d, tag) => { bb({ k: "srect", n: "recall " + tag, x, y: 1260, w: 300, h: 250, t0: at, t1: d });
    return [<Layer key={k} at={at} dur={d} sfx="pop" anim={fadeIn}><rect x={x} y={1260} width={300} height={250} radius={14} fill={C.paper} strokeColor={C.cobalt} strokeWidth={4} dash={[14, 10]} /></Layer>,
      <Label key={k + "t"} text={tag} x={x + 18} y={1272} w={264} size={34} align="left" color={C.cobalt} at={at + 0.1} dur={d} />]; };

  return [
    // ── Question + recall: the square, the three steps, quick callbacks ──
    S(null, (r, d) => {
      const n = [...axes("ax", d)];
      [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(([a, b], i) => n.push(<Layer key={"e" + i} at={0.15 + i * 0.15} dur={d} sfx={i ? undefined : "swish"} anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.12 }]}>
        {pth(poly([S0[a], S0[b]], false), { width: 6, color: C.cobalt, cap: "round" })}</Layer>));
      n.push(<Layer key="s0" at={0.8} dur={d} anim={fadeIn}>{square(S0)}</Layer>);
      n.push(oLabel("lO", r("O00"), d), Lb("lB", "B(4, 0)", "r", 888, 700, r("B40"), undefined, d), Lb("lC", "C(4, 4)", "r", 888, 300, r("C44"), undefined, d), Lb("lD", "D(0, 4)", "l", 408, 300, r("D04"), undefined, d));
      n.push(...chips("c", d, -1, [r("scaled"), r("rotated"), r("reflected")]));
      n.push(<Label key="comp" text="composite = several transformations in a row" x={540} y={1196} w={980} size={36} color={C.coral} at={r("Composite")} dur={d} />);
      // recalls: scaling and rotation (Q3), reflection (Q2)
      const tS = r("scaling"), tR = r("rotation"), tF = r("reflection");
      n.push(...panel("p1", 60, tS, d, "from Q3"), ...panel("p2", 390, tR, d, "from Q3"), ...panel("p3", 720, tF, d, "from Q2"));
      n.push(<Layer key="m1" at={tS + 0.2} dur={d} sfx="pop" anim={fadeIn}>
        {pth("M 110 1480 L 250 1480 L 250 1340 L 110 1340 Z", { width: 4, color: C.navy }, { dash: [12, 10] })}
        {pth("M 110 1480 L 190 1480 L 190 1405 L 110 1405 Z", { width: 6, color: C.cobalt }, { fill: C.cobalt + "2A" })}
        {pth("M 244 1346 L 196 1398", { width: 5, color: C.coral, cap: "round" })}
        {pth("M 196 1400 L 198 1380 M 196 1400 L 216 1398", { width: 5, color: C.coral, cap: "round" })}</Layer>);
      n.push(<Label key="m1l" text="× ½" x={305} y={1420} w={80} size={34} font={C.fMono} color={C.coral} at={tS + 0.4} dur={d} />);
      n.push(<Layer key="m2" at={tR + 0.2} dur={d} sfx="pop" anim={fadeIn}>
        {pth("M 480 1320 L 560 1320 L 560 1400 L 480 1400 Z", { width: 4, color: C.navy }, { dash: [12, 10] })}
        {pth("M 480 1400 L 560 1400 L 560 1480 L 480 1480 Z", { width: 6, color: C.cobalt }, { fill: C.cobalt + "2A" })}
        <rect x={472} y={1392} width={16} height={16} radius={8} fill={C.navy} />
        {pth("M 590 1340 Q 640 1400 590 1460", { width: 5, color: C.coral, cap: "round" })}
        {pth("M 590 1460 L 593 1438 M 590 1460 L 610 1452", { width: 5, color: C.coral, cap: "round" })}</Layer>);
      n.push(<Layer key="m3" at={tF + 0.2} dur={d} sfx="pop" anim={fadeIn}>
        {pth("M 870 1330 L 870 1495", { width: 4, color: C.navy }, { dash: [12, 10] })}
        {pth("M 780 1480 L 845 1480 L 830 1360 Z", { width: 6, color: C.cobalt }, { fill: C.cobalt + "2A" })}
        {pth("M 960 1480 L 895 1480 L 910 1360 Z", { width: 6, color: C.coral }, { fill: C.coral + "22" })}</Layer>);
      return n;
    }, { cam: STILL }),

    // ── Step 1: scale by half ──
    S("Step 1", (r, d) => step(r, d, { k: "a", lit: 0, src: S0, dst: S1, f: fScale, t0: r("Every"), len: 1.2,
      labels0: [["B(4, 0)", "r", 888, 700], ["C(4, 4)", "r", 888, 300], ["D(0, 4)", "l", 408, 300]],
      labels1: [["B(2, 0)", "c", 648, 772, r("B becomes")], ["C(2, 2)", "r", 672, 516, r("C22")], ["D(0, 2)", "l", 408, 516, r("D02")]],
      rl: "(x, y) → (x/2, y/2)", rlAt: r("halves"),
      rows: [["B(4, 0) → (2, 0)", r("B becomes")], ["C(4, 4) → (2, 2)", r("C22")], ["D(0, 4) → (0, 2)", r("D02")]] }), { cam: STILL }),

    // ── Step 2: rotate 90° clockwise ──
    S("Step 2", (r, d) => step(r, d, { k: "b", lit: 1, src: S1, dst: S2, f: fRotCW, t0: r("clockwise"), len: 1.4,
      labels0: [["B(2, 0)", "c", 648, 772], ["C(2, 2)", "r", 672, 516], ["D(0, 2)", "l", 408, 516]],
      labels1: [["B(0, −2)", "l", 408, 950, r("B becomes")], ["C(2, −2)", "r", 672, 950, r("C2")], ["D(2, 0)", "c", 648, 690, r("D20")]],
      rl: "(x, y) → (y, −x)", rlAt: r("X Y becomes"),
      rows: [["B(2, 0) → (0, −2)", r("B becomes")], ["C(2, 2) → (2, −2)", r("C2")], ["D(0, 2) → (2, 0)", r("D20")]] }), { cam: STILL }),

    // ── Step 3: reflect about the origin (both signs flip; the square hops through O) ──
    S("Step 3", (r, d) => { const tF = r("Flip");
      const n = step(r, d, { k: "c", lit: 2, src: S2, dst: S3, f: fFlip, t0: tF, len: 1.2,
        labels0: [["B(0, −2)", "l", 408, 950], ["C(2, −2)", "r", 672, 950], ["D(2, 0)", "c", 648, 690]],
        labels1: [["B(0, 2)", "r", 456, 516, r("B becomes")], ["C(−2, 2)", "c", 216, 466, r("C minus")], ["D(−2, 0)", "l", 262, 776, r("D minus")]],
        rl: "(x, y) → (−x, −y)", rlAt: r("both signs"),
        rows: [["B(0, −2) → (0, 2)", r("B becomes")], ["C(2, −2) → (−2, 2)", r("C minus")], ["D(2, 0) → (−2, 0)", r("D minus")]] });
      n.push(<Layer key="hop" at={tF} out={tF + 2.4} dur={d} sfx="swish" anim={fadeIn}>{pth(poly([[2, -2], [-2, 2]], false), { width: 5, color: C.coral, cap: "round" }, { dash: [12, 10] })}</Layer>);
      n.push(<Ring key="ro" x={OX} y={OY} r={34} at={r("O stays")} dur={d} />);
      n.push(row("cO", "O(0, 0) stays at (0, 0)", 3, r("O stays") + 0.2, d, C.coral));
      return n; }, { cam: STILL }),

    // ── Combined: one matrix, multiplied in reverse; net = half size + 90° anticlockwise ──
    S("As one matrix", (r, d) => {
      const tT = r("T 3 times"), tOv = r("Overall"), tHalf = r("half turn"), tAcw = r("anti"), tSq = r("So the square");
      const n = [...axes("x", d), oLabel("lO", 0, d)];
      n.push(<Layer key="g0" at={0} dur={d} anim={fadeIn}>{ghost(S0, "55")}</Layer>);
      n.push(F("s3", 0, d, square(S3)));
      n.push(Lb("l3B", "B(0, 2)", "r", 456, 516, 0, undefined, d), Lb("l3C", "C(−2, 2)", "c", 216, 466, 0, undefined, d), Lb("l3D", "D(−2, 0)", "l", 262, 776, 0, undefined, d));
      // recall: reverse order (Q3)
      bb({ k: "srect", n: "recall Q3", x: 60, y: 1040, w: 960, h: 76, t0: r("multiply"), t1: d });
      n.push(<Layer key="rq" at={r("multiply")} dur={d} sfx="pop" anim={fadeIn}><rect x={60} y={1040} width={960} height={76} radius={12} fill={C.paper} strokeColor={C.cobalt} strokeWidth={4} dash={[14, 10]} /></Layer>);
      n.push(<Label key="rqt" text="from Q3 · apply in order, multiply in reverse" x={540} y={1056} w={920} size={34} color={C.cobalt} at={r("multiply") + 0.1} dur={d} />);
      n.push(<Label key="M0" text="M = T3 · T2 · T1" x={60} y={1170} w={520} size={48} align="left" font={C.fMono} at={tT} dur={d} />);
      // M (3×3)
      const mx = 600, my = 1140, rows3 = [["0", "−0.5", "0"], ["0.5", "0", "0"], ["0", "0", "1"]], cw = 128, rh = 54, mh = rows3.length * rh + 10;
      bb({ k: "box", n: "matrix M", x: mx, y: my, w: cw * 3 + 24, h: mh, t0: r("T1"), t1: d });
      n.push(<Layer key="mb" at={r("T1")} dur={d} sfx="pop" anim={fadeIn}>{pth(`M ${mx + 18} ${my} L ${mx} ${my} L ${mx} ${my + mh} L ${mx + 18} ${my + mh} M ${mx + cw * 3 + 6} ${my} L ${mx + cw * 3 + 24} ${my} L ${mx + cw * 3 + 24} ${my + mh} L ${mx + cw * 3 + 6} ${my + mh}`, { width: 5, color: C.navy, cap: "round" })}</Layer>);
      rows3.forEach((rw, i) => rw.forEach((v, j) => n.push(<Label key={"mc" + i + j} text={v} x={mx + 12 + cw * (j + 0.5)} y={my + 10 + i * rh} w={cw - 8} size={40} font={C.fMono} at={r("T1") + 0.05 * (i * 3 + j)} dur={d} />)));
      n.push(<Label key="Meq" text="=" x={560} y={1176} w={40} size={44} font={C.fMono} at={r("T1")} dur={d} />);
      // turns: clockwise quarter + half turn = anticlockwise quarter
      const dial = (k, cx, at, a0, a1, col) => { const R = 58, N = 24, pts = []; for (let i = 0; i <= N; i++) { const a = a0 + (a1 - a0) * i / N; pts.push([cx + R * Math.cos(a), 1400 - R * Math.sin(a)]); }
        const e = pts[N], p = pts[N - 2], ang = Math.atan2(e[1] - p[1], e[0] - p[0]), L = 18;
        bb({ k: "box", n: "dial " + k, x: cx - 70, y: 1333, w: 140, h: 134, t0: at, t1: d });
        return <Layer key={k} at={at} dur={d} sfx="swish" anim={fadeIn}>
          <rect x={cx - R} y={1400 - R} width={2 * R} height={2 * R} radius={R} fill="#00000000" strokeColor={C.navy + "33"} strokeWidth={3} />
          <rect x={cx - 6} y={1394} width={12} height={12} radius={6} fill={C.navy} />
          {pth(`M ${cx} 1400 L ${cx + R} 1400`, { width: 3, color: C.navy }, { dash: [6, 6] })}
          {pth("M " + pts.map((q) => q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" L "), { width: 7, color: col, cap: "round" })}
          {pth(`M ${e[0] - L * Math.cos(ang - 0.5)} ${e[1] - L * Math.sin(ang - 0.5)} L ${e[0]} ${e[1]} L ${e[0] - L * Math.cos(ang + 0.5)} ${e[1] - L * Math.sin(ang + 0.5)}`, { width: 7, color: col, cap: "round" })}
        </Layer>; };
      n.push(dial("d1", 180, tOv + 0.8, 0, -Math.PI / 2, C.cobalt), <Label key="d1l" text="90° cw" x={180} y={1470} w={150} size={38} font={C.fMono} at={tOv + 0.9} dur={d} />);
      n.push(<Label key="pl" text="+" x={360} y={1372} w={40} size={44} font={C.fMono} at={tHalf} dur={d} />);
      n.push(dial("d2", 540, tHalf, 0, Math.PI * 0.97, C.cobalt), <Label key="d2l" text="180°" x={540} y={1470} w={110} size={38} font={C.fMono} at={tHalf + 0.1} dur={d} />);
      n.push(<Label key="eq" text="=" x={720} y={1372} w={40} size={44} font={C.fMono} at={tAcw} dur={d} />);
      n.push(dial("d3", 900, tAcw, 0, Math.PI / 2, C.coral), <Label key="d3l" text="90° acw" x={900} y={1470} w={170} size={38} font={C.fMono} color={C.coral} at={tAcw + 0.1} dur={d} />);
      // the original square goes straight there: half size + quarter turn anticlockwise
      n.push(...morph("mn", S0, fNet, tSq, 1.5, overlay, false));
      n.push(F("ov", tSq + 1.5, d - tSq - 1.5, overlay(S3)));
      n.push(<Label key="res" text="half size + 90° anticlockwise" x={540} y={1530} w={980} size={42} color={C.coral} at={r("half size")} dur={d} />);
      return n;
    }, { cam: STILL }),

    // ── Answer card ──
    S("In your exam", (r, d) => [
      ...AnswerCard({ page: ANSWERS["cg-q08"][0], title: "WRITE THIS · 5 MARKS · 1/1", at: 0, dur: d, y: TOP + 24 }),
    ], { cam: STILL }),
  ];
};
