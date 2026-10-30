import { Label, Layer, Mover, Check, Box, ev, bb } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
// CG-Q2 · Reflect A(2,2) B(3,3) C(6,5) about y = x + 1: move down 1, swap x and y, move back up 1.
const W = 1080, H = 1920;
const clamp = (u) => Math.max(0, Math.min(1, u));
const ease = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
const fr = (key, at, len, kids) => <frame key={key} at={at} duration={Math.max(0.05, len)} width={W} height={H} layout="none">{kids}</frame>;
const pth = (key, d, o) => <path key={key} d={d} x={0} y={0} width={W} height={H} fill={o.fill} stroke={o.c ? { width: o.w, color: o.c, cap: "round" } : undefined} dash={o.dash} />;
const seg = (a, b) => `M ${a[0].toFixed(1)} ${a[1].toFixed(1)} L ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
const polyD = (pts) => pts.map((p, i) => (i ? "L " : "M ") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ") + " Z";
const dotN = (key, p, color, C, r = 12) => <rect key={key} x={p[0] - r} y={p[1] - r} width={r * 2} height={r * 2} radius={r} fill={color} strokeColor={C.navy} strokeWidth={4} />;
// stroke that draws itself in chunks from t0, visible until `until`
function drawOn(key, pts, t0, until, color, width, speed = 2400, dash) {
  const out = []; let t = t0;
  for (let s = 0; s + 1 < pts.length; s++) {
    const [x1, y1] = pts[s], [x2, y2] = pts[s + 1]; const L = Math.hypot(x2 - x1, y2 - y1); const n = Math.max(1, Math.ceil(L / 48)); const dt = L / speed;
    for (let i = 0; i < n; i++) { const a = i / n, b = Math.min(1, (i + 1) / n + (dash ? 0 : 0.02)); const ta = t + dt * a;
      if (dash && i % 2) continue;
      out.push(fr(key + s + "_" + i, ta, until - ta, <path d={`M ${x1 + (x2 - x1) * a} ${y1 + (y2 - y1) * a} L ${x1 + (x2 - x1) * b} ${y1 + (y2 - y1) * b}`} x={0} y={0} width={W} height={H} stroke={{ width, color, cap: "round" }} />)); }
    t += dt;
  }
  return out;
}
const arrowHead = (C, key, x, y, dir, at, dur) => { const s = 16; const d = dir === "up" ? `M ${x} ${y - s} L ${x - s * 0.7} ${y + s * 0.4} L ${x + s * 0.7} ${y + s * 0.4} Z` : `M ${x + s} ${y} L ${x - s * 0.4} ${y - s * 0.7} L ${x - s * 0.4} ${y + s * 0.7} Z`;
  return <Layer key={key} at={at} dur={dur}><path d={d} x={0} y={0} width={W} height={H} fill={C.navy} /></Layer>; };
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
const fadeKF = (len, a = 1) => [{ property: "opacity", from: 0, to: a, at: 0, duration: Math.min(0.3, len) }];

export const SCENES = ({ S, cue, C, TOP }) => [
  // One figure on real axes for the whole explanation; the working builds downward underneath it.
  S(null, (r, d) => {
    const U = 95, OX = 120, OY = 1050; const P = (x, y) => [OX + x * U, OY - y * U];
    const out = [];
    out.push(...Axes(C, P, d, { xmax: 7.6, ymax: 8.4, xs: [1, 2, 3, 4, 5, 6, 7], ys: [1, 2, 3, 4, 5, 6, 7, 8] }));
    out.push(<Label key="lx" text="x" x={P(7.6, 0)[0] + 34} y={OY - 22} w={50} size={36} font={C.fMono} dur={d} at={0.3} />);
    out.push(<Label key="ly" text="y" x={OX + 36} y={P(0, 8.4)[1] - 8} w={50} size={36} font={C.fMono} dur={d} at={0.3} />);
    const T = [[2, 2], [3, 3], [6, 5]], NM = ["A", "B", "C"];
    // timing
    const tTri = r("triangle"), tA = r("A22B33C65"), tB = tA + 1.5, tC = tA + 3.0, tL = r("line");
    const md0 = r("down"), md1 = md0 + 1.0, sw0 = cue("Swap", 2), sw1 = sw0 + 1.0, up0 = r("back up") + 0.3, up1 = up0 + 0.9;
    const mv0 = r("Move everything");
    // the mirror line y = x + 1 (coral), fixed copy until the move, then it rides with everything
    const L1 = (dy) => [P(0, 1 + dy), P(7.3, 8.3 + dy)];
    out.push(...drawOn("m1", L1(0), tL, md0, C.coral, 6, 2600));
    out.push(<Label key="m1l" text="y = x + 1" x={630} y={P(0, 8.55)[1]} w={200} size={36} align="left" color={C.coral} at={tL + 0.4} out={md0} dur={d} />);
    out.push(<Label key="m1l2" text="y = x + 1" x={630} y={P(0, 8.55)[1]} w={200} size={36} align="left" color={C.coral} at={up1} dur={d} />);
    // the triangle ABC (fixed): solid until everything moves, then a faded ghost
    out.push(<Layer key="tri" at={tTri} out={md0} dur={d} anim={fadeKF(0.3)}>{pth("f", polyD(T.map((p) => P(...p))), { fill: C.chip, w: 5, c: C.navy })}</Layer>);
    out.push(<Layer key="trig" at={md0} dur={d} anim={fadeKF(0.3, 0.55)}>{pth("f", polyD(T.map((p) => P(...p))), { fill: "#00000000", w: 4, c: C.navy, dash: [10, 8] })}</Layer>);
    const tl = [tA, tB, tC];
    T.forEach((p, i) => out.push(<Layer key={"v" + i} at={tl[i]} dur={d} sfx="pop" anim={fadeKF(0.2)}>{dotN("d", P(...p), C.navy, C, 11)}</Layer>));
    const lpos = [[P(2, 2)[0] - 46, P(2, 2)[1] - 22], [P(3, 3)[0] - 44, P(3, 3)[1] - 48], [P(6, 5)[0] + 18, P(6, 5)[1] - 4]];
    T.forEach((p, i) => out.push(<Label key={"vl" + i} text={NM[i]} x={lpos[i][0]} y={lpos[i][1]} w={40} size={36} align="left" color={C.navy} at={tl[i]} dur={d} />));
    // working row 0: the given points
    const R = [1125, 1190, 1255, 1320, 1400, 1478, 1540];
    out.push(<Label key="g0" text="A(2, 2)" x={60} y={R[0]} w={220} size={40} font={C.fMono} align="left" at={tA} dur={d} />);
    out.push(<Label key="g1" text="B(3, 3)" x={360} y={R[0]} w={220} size={40} font={C.fMono} align="left" at={tB} dur={d} />);
    out.push(<Label key="g2" text="C(6, 5)" x={660} y={R[0]} w={220} size={40} font={C.fMono} align="left" at={tC} dur={d} />);

    // FROM ZERO: one point jumps straight across the mirror, same distance on each side
    const tE = r("Each point"), tJ = r("jumps"), tS = r("same distance"), tR = r("Reflecting in");
    const Q = P(5, 2), F = P(3, 4), Q2 = P(1, 6);
    out.push(<Mover key="jq" at={tE} out={tR} dur={d} cw={30} ch={30} on={true} pts={[{ t: tE, x: Q[0], y: Q[1] }, { t: tJ, x: Q[0], y: Q[1] }, { t: tJ + 1.1, x: Q2[0], y: Q2[1] }]}>
      <rect x={2} y={2} width={26} height={26} radius={13} fill={C.cobalt} strokeColor={C.navy} strokeWidth={3} /></Mover>);
    out.push(<Layer key="jg" at={tE} out={tR} dur={d} anim={fadeKF(0.3, 0.5)}>{dotN("g", Q, C.cobalt, C, 13)}</Layer>);
    out.push(...drawOn("jp", [Q, Q2], tJ, tR, C.cobalt, 4, 520, true));
    out.push(<Label key="jq1" text="(5, 2)" x={Q[0] + 22} y={Q[1] - 18} w={130} size={32} font={C.fMono} align="left" color={C.cobalt} at={tE} out={tR} dur={d} />);
    out.push(<Label key="jq2" text="(1, 6)" x={Q2[0] - 8} y={Q2[1] - 62} w={130} size={32} font={C.fMono} align="left" color={C.cobalt} at={tJ + 1.1} out={tR} dur={d} />);
    const rr = 16, u = [Math.SQRT1_2, -Math.SQRT1_2], v = [Math.SQRT1_2, Math.SQRT1_2]; // along the line (screen) and across it
    const ra = [F[0] + u[0] * rr, F[1] + u[1] * rr], rb = [ra[0] + v[0] * rr, ra[1] + v[1] * rr], rc = [F[0] + v[0] * rr, F[1] + v[1] * rr];
    out.push(<Layer key="ra" at={tS} out={tR} dur={d} sfx="tick">{pth("r", `M ${ra[0]} ${ra[1]} L ${rb[0]} ${rb[1]} L ${rc[0]} ${rc[1]}`, { w: 4, c: C.navy })}
      {pth("h1", seg(Q, F), { w: 8, c: C.cobalt })}{pth("h2", seg(F, Q2), { w: 8, c: C.cobalt })}</Layer>);
    out.push(<Label key="dd1" text="d" x={(Q[0] + F[0]) / 2 + 18} y={(Q[1] + F[1]) / 2 - 56} w={40} size={42} font={C.fMono} align="left" color={C.cobalt} at={tS} out={tR} dur={d} />);
    out.push(<Label key="dd2" text="d" x={(F[0] + Q2[0]) / 2 + 18} y={(F[1] + Q2[1]) / 2 - 56} w={40} size={42} font={C.fMono} align="left" color={C.cobalt} at={tS + 0.3} out={tR} dur={d} />);

    // THE IDEA: mirror y = x just swaps; our line is y = x moved up by 1
    const L0 = [P(0, 0), P(7.6, 7.6)];
    out.push(...drawOn("m0", L0, tR, d, C.cobalt, 5, 2600, true));
    out.push(<Label key="m0l" text="y = x" x={P(1, 0)[0] - 10} y={P(0, 0.75)[1]} w={140} size={36} align="left" color={C.cobalt} at={tR + 0.6} dur={d} />);
    const tW = r("swap"), sQ = P(2, 5), tO = r("So we");
    out.push(<Mover key="sq" at={tW} out={tO} dur={d} cw={30} ch={30} on={true} pts={[{ t: tW, x: Q[0], y: Q[1] }, { t: tW + 0.3, x: Q[0], y: Q[1] }, { t: tW + 1.2, x: sQ[0], y: sQ[1] }]}>
      <rect x={2} y={2} width={26} height={26} radius={13} fill={C.cobalt} strokeColor={C.navy} strokeWidth={3} /></Mover>);
    out.push(<Layer key="sqg" at={tW} out={tO} dur={d} anim={fadeKF(0.3, 0.5)}>{dotN("g", Q, C.cobalt, C, 13)}</Layer>);
    out.push(<Label key="sq1" text="(5, 2)" x={Q[0] + 22} y={Q[1] - 18} w={130} size={32} font={C.fMono} align="left" color={C.cobalt} at={tW} out={tO} dur={d} />);
    out.push(<Label key="sq2" text="(2, 5)" x={sQ[0] - 128} y={sQ[1] - 20} w={130} size={32} font={C.fMono} align="left" color={C.cobalt} at={tW + 1.2} out={tO} dur={d} />);
    const tU = r("moved"), a0 = P(6, 6), a1 = P(6, 7);
    out.push(<Layer key="up1" at={tU} out={tO} dur={d} sfx="swish">{pth("a", seg(a0, [a1[0], a1[1] + 10]), { w: 7, c: C.coral })}{pth("h", `M ${a1[0]} ${a1[1]} L ${a1[0] - 13} ${a1[1] + 22} L ${a1[0] + 13} ${a1[1] + 22} Z`, { fill: C.coral })}</Layer>);
    out.push(<Label key="up1l" text="up 1" x={800} y={450} w={120} size={36} align="left" color={C.coral} at={tU + 0.2} out={tO} dur={d} />);

    // RECALL (from Q1): slide first, then the problem is easy
    const RX = 640, RY = 1580, ru = 15; const Pq = (x, y) => [RX + x * ru, RY - y * ru];
    const rs0 = r("Slide first"), rs1 = rs0 + 1.0;
    out.push(<Layer key="rc" at={tO} out={mv0} dur={d} anim={fadeKF(0.3)}>
      <rect x={RX - 40} y={1392} width={390} height={196} radius={14} fill={C.paper} strokeColor={C.navy} strokeWidth={3} opacity={0.95} />
      {pth("ax", `M ${RX - 10} ${RY} L ${RX + 340} ${RY} M ${RX} ${RY + 6} L ${RX} ${1404}`, { w: 3, c: C.navy })}
      {pth("gw", polyD([Pq(2, 2), Pq(6, 2), Pq(6, 10), Pq(2, 10)]), { fill: "#00000000", w: 3, c: C.navy, dash: [8, 6] })}</Layer>);
    bb({ k: "box", n: "recall mini", x: RX - 40, y: 1392, w: 390, h: 196, t0: tO, t1: mv0 });
    const rect = (s) => polyD([Pq(2 - s, 2 - s), Pq(6 - s, 2 - s), Pq(6 - s, 10 - s), Pq(2 - s, 10 - s)]);
    for (let k = 0; k < 12; k++) { const a = rs0 + k / 12 * (rs1 - rs0); out.push(fr("rcm" + k, a, (rs1 - rs0) / 12, pth("w", rect(2 * ease((k + 1) / 12)), { fill: C.chip, w: 4, c: C.navy }))); }
    out.push(<Layer key="rcw0" at={tO} out={rs0} dur={d}>{pth("w", rect(0), { fill: C.chip, w: 4, c: C.navy })}</Layer>);
    out.push(<Layer key="rcw1" at={rs1} out={mv0} dur={d}>{pth("w", rect(2), { fill: C.chip, w: 4, c: C.navy })}</Layer>);
    out.push(<Layer key="rca" at={rs0} out={mv0} dur={d}>{pth("a", seg(Pq(2, 2), Pq(0.4, 0.4)), { w: 4, c: C.coral })}</Layer>);
    out.push(<Box key="rct" x={170} y={1440} w={200} h={64} label="from Q1" tone="b" size={34} at={tO} out={mv0} dur={d} />);
    out.push(<Label key="rcs" text="slide first" x={70} y={1500} w={400} size={40} align="left" color={C.coral} at={rs0} out={mv0} dur={d} />);

    // THE PLAN: everything moves down 1, swaps, moves back up 1 (moving copy in blue; mirror rides along)
    const st = (t) => { const e1 = ease((t - md0) / (md1 - md0)), e2 = ease((t - sw0) / (sw1 - sw0)), e3 = ease((t - up0) / (up1 - up0));
      return { dy: -e1 + e3, V: T.map(([x, y]) => { const a = [x, y - e1], b = [y - 1, x]; const s = [a[0] + (b[0] - a[0]) * e2, a[1] + (b[1] - a[1]) * e2]; return [s[0], s[1] + e3]; }) }; };
    const draw = (s, k) => [pth(k + "m", seg(...L1(s.dy)), { w: 6, c: C.coral }),
      pth(k + "t", polyD(s.V.map((p) => P(...p))), { fill: C.cobalt + "33", w: 5, c: C.cobalt }), ...s.V.map((p, i) => dotN(k + "d" + i, P(...p), C.cobalt, C, 11))];
    ev(md0, "move"); ev(sw0, "swish"); ev(up0, "move");
    const cuts = [md0, md1, sw0, sw1, up0, up1, d]; const anim = new Set([0, 2, 4]);
    for (let i = 0; i + 1 < cuts.length; i++) { const a = cuts[i], b = cuts[i + 1];
      if (anim.has(i)) { const n = Math.ceil((b - a) * 15), dt = (b - a) / n; for (let k = 0; k < n; k++) out.push(fr("p" + i + "_" + k, a + k * dt, dt, draw(st(a + (k + 1) * dt), "p" + i + "_" + k))); }
      else out.push(fr("q" + i, a, b - a, draw(st(b - 0.001), "q" + i))); }
    out.push(<Label key="pl1" text="1 · down 1" x={60} y={R[1]} w={300} size={40} align="left" color={C.coral} at={r("down")} dur={d} />);
    out.push(<Label key="pl2" text="2 · swap" x={60} y={R[2]} w={300} size={40} align="left" color={C.coral} at={sw0} dur={d} />);
    out.push(<Label key="pl3" text="3 · up 1" x={60} y={R[3]} w={300} size={40} align="left" color={C.coral} at={r("back up")} dur={d} />);

    // THE RULE: follow one point through
    const c1 = r("X, Y"), c2 = r("Y minus"), c3 = cue("X plus", 3);
    out.push(<Label key="c1" text="(x, y) → (x, y − 1)" x={330} y={R[1]} w={560} size={40} font={C.fMono} align="left" at={c1} dur={d} />);
    out.push(<Label key="c2" text="→ (y − 1, x)" x={436} y={R[2]} w={460} size={40} font={C.fMono} align="left" at={c2} dur={d} />);
    out.push(<Label key="c3" text="→ (y − 1, x + 1)" x={436} y={R[3]} w={560} size={40} font={C.fMono} align="left" at={c3} dur={d} />);
    const tWr = r("whole rule");
    out.push(<Layer key="rb" at={tWr} dur={d} sfx="ping"><rect x={100} y={R[4] - 10} width={880} height={72} radius={14} fill="#00000000" strokeColor={C.coral} strokeWidth={5} /></Layer>);
    out.push(<Label key="rl" text="(x, y) → (y − 1, x + 1)" x={540} y={R[4]} w={860} size={46} font={C.fMono} color={C.coral} at={tWr} dur={d} />);

    // THE ANSWER: the images, labelled on the figure and listed
    const T2 = [[1, 3], [2, 4], [4, 7]], tg = [r("A goes"), r("B goes"), r("C goes")];
    const lp2 = [[P(1, 3)[0] - 70, P(1, 3)[1] - 22], [P(2, 4)[0] - 72, P(2, 4)[1] - 30], [P(4, 7)[0] - 72, P(4, 7)[1] - 30]];
    T2.forEach((p, i) => { out.push(<Label key={"il" + i} text={NM[i] + "′"} x={lp2[i][0]} y={lp2[i][1]} w={56} size={36} align="left" color={C.cobalt} at={tg[i]} dur={d} />);
      out.push(<Layer key={"ir" + i} at={tg[i]} dur={d} sfx="ping"><rect x={P(...p)[0] - 22} y={P(...p)[1] - 22} width={44} height={44} radius={22} fill="#00000000" strokeColor={C.coral} strokeWidth={5} /></Layer>); });
    const ans = ["A′(1, 3)", "B′(2, 4)", "C′(4, 7)"];
    ans.forEach((s, i) => out.push(<Label key={"an" + i} text={s} x={60 + i * 330} y={R[5]} w={300} size={42} font={C.fMono} align="left" color={C.cobalt} at={tg[i] + 0.3} dur={d} />));

    // THE CHECK: midpoint of C and C′ lies on the mirror
    const tH = r("Halfway"), Cp = P(6, 5), Cq = P(4, 7), M = P(5, 6);
    out.push(...drawOn("cc", [Cp, Cq], tH, d, C.navy, 4, 500, true));
    out.push(<Layer key="mid" at={r("is 5")} dur={d} sfx="pop" anim={fadeKF(0.2)}>{dotN("m", M, C.coral, C, 13)}</Layer>);
    out.push(<Label key="midl" text="(5, 6)" x={M[0] + 44} y={M[1] - 22} w={130} size={32} font={C.fMono} align="left" color={C.coral} at={r("is 5")} dur={d} />);
    out.push(<Label key="ck" text="(5, 6):  6 = 5 + 1" x={60} y={R[6]} w={600} size={40} font={C.fMono} align="left" color={C.navy} at={r("lies")} dur={d} />);
    out.push(<Check key="ckm" x={640} y={R[6] + 24} size={56} at={r("lies") + 0.4} dur={d} />);
    return out;
  }, { hold: "That's the whole", holdX: 540, holdY: 960, holdZ: 1, cam: [{ t: 0, x: 540, y: 960, z: 1 }] }),

  // Exam: the answer card (shared content).
  ...ANSWERS["cg-q02"].map((pg, k, all) => S(k === 0 ? "In your exam" : null, (r, d) => [
    ...AnswerCard({ page: pg, title: "WRITE THIS · 5 MARKS · " + (k + 1) + "/" + all.length, at: 0, dur: d, y: TOP + 24 }),
    ...(k === 0 ? [<Label key="tr" text="move down → swap → move back" x={540} y={1420} w={980} size={50} font={C.fHead} color={C.navy} at={r("Remember")} dur={d} />] : []),
  ], { cam: [{ t: 0, x: 540, y: 960, z: 1 }] })),
];
