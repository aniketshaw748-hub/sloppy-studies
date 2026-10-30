import { Label, Layer, Check, Box, Arrow, ev, bb } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
// CG-Q3 · (20, 30): rotate 90° anticlockwise -> (−30, 20); translate (−20, 0) -> (−50, 20); scale (2, 1) -> (−100, 20).
const W = 1080, H = 1920;
const clamp = (u) => Math.max(0, Math.min(1, u));
const ease = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
const fr = (key, at, len, kids) => <frame key={key} at={at} duration={Math.max(0.05, len)} width={W} height={H} layout="none">{kids}</frame>;
const pth = (key, d, o) => <path key={key} d={d} x={0} y={0} width={W} height={H} fill={o.fill} stroke={o.c ? { width: o.w, color: o.c, cap: "round" } : undefined} dash={o.dash} />;
const seg = (a, b) => `M ${a[0].toFixed(1)} ${a[1].toFixed(1)} L ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
const polyD = (pts) => pts.map((p, i) => (i ? "L " : "M ") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ") + " Z";
const dotN = (key, p, color, C, r = 13) => <rect key={key} x={p[0] - r} y={p[1] - r} width={r * 2} height={r * 2} radius={r} fill={color} strokeColor={C.navy} strokeWidth={4} />;
const fadeKF = (len, a = 1) => [{ property: "opacity", from: 0, to: a, at: 0, duration: Math.min(0.3, len) }];
const arrowHead = (C, key, x, y, dir, at, dur) => { const s = 16; const d = dir === "up" ? `M ${x} ${y - s} L ${x - s * 0.7} ${y + s * 0.4} L ${x + s * 0.7} ${y + s * 0.4} Z` : `M ${x + s} ${y} L ${x - s * 0.4} ${y - s * 0.7} L ${x - s * 0.4} ${y + s * 0.7} Z`;
  return <Layer key={key} at={at} dur={dur}><path d={d} x={0} y={0} width={W} height={H} fill={C.navy} /></Layer>; };
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
// recall mini (from Q1): the window (2,2)-(6,10) sliding to the origin, or resizing to 1 x 1
function Recall(C, key, mode, t0, t1, tm, dur) {
  const RX = 640, RY = 1400, ru = 15; const Pq = (x, y) => [RX + x * ru, RY - y * ru]; const out = [];
  const rect = (x0, y0, x1, y1) => polyD([Pq(x0, y0), Pq(x1, y0), Pq(x1, y1), Pq(x0, y1)]);
  const at = (e) => mode === "slide" ? rect(2 - 2 * e, 2 - 2 * e, 6 - 2 * e, 10 - 2 * e) : rect(0, 0, 4 - 3 * e, 8 - 7 * e);
  out.push(<Layer key={key + "b"} at={t0} out={t1} dur={dur} anim={fadeKF(0.3)}>
    <rect x={RX - 40} y={RY - 188} width={390} height={196} radius={14} fill={C.paper} strokeColor={C.navy} strokeWidth={3} opacity={0.95} />
    {pth("ax", `M ${RX - 10} ${RY} L ${RX + 340} ${RY} M ${RX} ${RY + 6} L ${RX} ${RY - 176}`, { w: 3, c: C.navy })}
    {pth("g", mode === "slide" ? at(0) : rect(0, 0, 1, 1), { fill: "#00000000", w: 3, c: mode === "slide" ? C.navy : C.cobalt, dash: [8, 6] })}</Layer>);
  bb({ k: "box", n: "recall " + mode, x: RX - 40, y: RY - 188, w: 390, h: 196, t0, t1 });
  out.push(<Layer key={key + "w0"} at={t0} out={tm} dur={dur}>{pth("w", at(0), { fill: C.chip, w: 4, c: C.navy })}</Layer>);
  for (let k = 0; k < 12; k++) out.push(fr(key + "m" + k, tm + k * 0.08, 0.08, pth("w", at(ease((k + 1) / 12)), { fill: C.chip, w: 4, c: C.navy })));
  out.push(<Layer key={key + "w1"} at={tm + 0.96} out={t1} dur={dur}>{pth("w", at(1), { fill: C.chip, w: 4, c: C.navy })}</Layer>);
  out.push(<Box key={key + "t"} x={170} y={RY - 140} w={200} h={64} label="from Q1" tone="b" size={34} at={t0} out={t1} dur={dur} />);
  out.push(<Label key={key + "s"} text={mode} x={70} y={RY - 80} w={300} size={44} align="left" color={C.coral} at={t0 + 0.2} out={t1} dur={dur} />);
  return out;
}

export const SCENES = ({ S, cue, C, TOP }) => [
  // The point on real axes; the three steps build downward underneath as a chain.
  S(null, (r, d) => {
    const U = 6.8, OX = 774, OY = TOP + 400; const P = (x, y) => [OX + x * U, OY - y * U];
    const out = [];
    // axes (tick every 10)
    out.push(<Layer key="ax" at={0} dur={d} anim={fadeKF(0.3)}>
      {pth("x", seg(P(-106, 0), P(29, 0)), { w: 5, c: C.navy })}{pth("y", seg(P(0, -4), P(0, 42)), { w: 5, c: C.navy })}
      {pth("t", [-100, -90, -80, -70, -60, -50, -40, -30, -20, -10, 10, 20].map((i) => `M ${P(i, 0)[0]} ${OY - 9} L ${P(i, 0)[0]} ${OY + 9}`).concat([10, 20, 30].map((j) => `M ${OX - 9} ${P(0, j)[1]} L ${OX + 9} ${P(0, j)[1]}`)).join(" "), { w: 4, c: C.navy })}</Layer>);
    out.push(arrowHead(C, "hx", P(29, 0)[0], OY, "right", 0.1, d), arrowHead(C, "hy", OX, P(0, 42)[1], "up", 0.1, d));
    [-100, -80, -60, -40, -20, 20].forEach((i) => out.push(<Label key={"tx" + i} text={String(i).replace("-", "−")} x={P(i, 0)[0]} y={OY + 14} w={90} size={30} font={C.fMono} at={0.3} dur={d} />));
    [10, 20, 30].forEach((j) => out.push(<Label key={"ty" + j} text={String(j)} x={OX - 40} y={P(0, j)[1] - 19} w={60} size={30} font={C.fMono} at={0.3} dur={d} />));
    out.push(<Label key="lx" text="x" x={P(29, 0)[0] + 34} y={OY - 22} w={50} size={36} font={C.fMono} at={0.3} dur={d} />);
    out.push(<Label key="ly" text="y" x={OX + 36} y={P(0, 42)[1] - 10} w={50} size={36} font={C.fMono} at={0.3} dur={d} />);
    const Pp = P(20, 30), Rp = P(-30, 20), Tp = P(-50, 20), Sp = P(-100, 20), O = P(0, 0);
    // timings
    const t0 = r("point"), tAr = r("around"), tRm = r("becomes"), tRv = r("minus 30") + 0.3, tAdd = r("Add"), tTv = r("50"), tMul = r("Multiply"), tSv = cue("gives", 2) + 0.3;
    const rm0 = tRm + 0.1, rm1 = rm0 + 1.3, tm0 = tAdd + 0.3, tm1 = tm0 + 1.0, sm0 = r("x by 2") , sm1 = sm0 + 1.3;
    // the moving point: snapshots (arc for the rotation, straight slides after)
    const R0 = Math.hypot(20, 30), a0 = Math.atan2(30, 20);
    const pos = (t) => { if (t < rm1) { const a = a0 + Math.PI / 2 * ease((t - rm0) / (rm1 - rm0)); return P(R0 * Math.cos(a), R0 * Math.sin(a)); }
      if (t < tm1 + 0.5) { const e = ease((t - tm0) / (tm1 - tm0)); return P(-30 - 20 * e, 20); }
      const e = ease((t - sm0) / (sm1 - sm0)); return P(-50 - 50 * e, 20); };
    ev(rm0, "move"); ev(tm0, "move"); ev(sm0, "move");
    const cuts = [t0, rm0, rm1, tm0, tm1, sm0, sm1, d]; const anim = new Set([1, 3, 5]);
    for (let i = 0; i + 1 < cuts.length; i++) { const a = cuts[i], b = cuts[i + 1];
      if (anim.has(i)) { const n = Math.ceil((b - a) * 15), dt = (b - a) / n; for (let k = 0; k < n; k++) out.push(fr("pt" + i + "_" + k, a + k * dt, dt, dotN("d", pos(a + (k + 1) * dt), C.coral, C))); }
      else out.push(fr("ps" + i, a, b - a, dotN("d", pos(b - 0.001), C.coral, C))); }
    // ghosts of where it has been
    out.push(<Layer key="gP" at={rm0} dur={d} anim={fadeKF(0.3, 0.45)}>{dotN("g", Pp, C.coral, C, 11)}</Layer>);
    out.push(<Layer key="gR" at={tm0} dur={d} anim={fadeKF(0.3, 0.45)}>{dotN("g", Rp, C.coral, C, 11)}</Layer>);
    out.push(<Layer key="gT" at={sm0} dur={d} anim={fadeKF(0.3, 0.45)}>{dotN("g", Tp, C.coral, C, 11)}</Layer>);
    out.push(<Label key="lP" text="(20, 30)" x={Pp[0] - 17} y={Pp[1] + 29} w={150} size={30} font={C.fMono} align="left" at={r("2030")} dur={d} />);
    // rotate: radius lines from the origin, the arc, the 90° mark
    const arcPts = []; for (let k = 0; k <= 24; k++) { const a = a0 + Math.PI / 2 * k / 24; arcPts.push(P(R0 * Math.cos(a), R0 * Math.sin(a))); }
    out.push(<Layer key="rad" at={tAr} dur={d} anim={fadeKF(0.3)}>{pth("r1", seg(O, Pp), { w: 4, c: C.cobalt, dash: [10, 8] })}</Layer>);
    out.push(<Layer key="arc" at={rm0} dur={d} anim={fadeKF(0.3)}>{pth("a", arcPts.map((p, i) => (i ? "L " : "M ") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" "), { w: 4, c: C.cobalt, dash: [10, 8] })}</Layer>);
    const sm = []; for (let k = 0; k <= 12; k++) { const a = a0 + Math.PI / 2 * k / 12; sm.push(P(9 * Math.cos(a), 9 * Math.sin(a))); }
    out.push(<Layer key="rad2" at={rm1} dur={d} anim={fadeKF(0.3)}>{pth("r2", seg(O, Rp), { w: 4, c: C.cobalt, dash: [10, 8] })}
      {pth("s", sm.map((p, i) => (i ? "L " : "M ") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" "), { w: 5, c: C.coral })}</Layer>);
    out.push(<Label key="l90" text="90°" x={OX - 56} y={OY - 294} w={90} size={34} align="left" color={C.coral} at={rm1} dur={d} />);
    out.push(<Label key="lR" text="(−30, 20)" x={Rp[0] - 80} y={Rp[1] - 64} w={210} size={32} font={C.fMono} at={tRv} dur={d} />);
    // translate: the slide arrow; scale: the stretch arrow
    out.push(<Arrow key="aT" x1={Rp[0] - 16} y1={Rp[1]} x2={Tp[0] + 18} y2={Tp[1]} color={C.coral} width={6} at={tm0} dur={d} />);
    out.push(<Label key="lT" text="(−50, 20)" x={Tp[0]} y={Tp[1] + 22} w={210} size={32} font={C.fMono} at={tTv} dur={d} />);
    out.push(<Arrow key="aS" x1={Tp[0] - 16} y1={Tp[1]} x2={Sp[0] + 18} y2={Sp[1]} color={C.coral} width={6} at={sm0} dur={d} />);
    out.push(<Label key="lS" text="(−100, 20)" x={Sp[0] + 54} y={Sp[1] - 58} w={230} size={32} font={C.fMono} color={C.coral} at={tSv} dur={d} />);

    // the chain: start, then one row per step, each fed by the one above
    const RY = [OY + 120, OY + 255, OY + 390, OY + 525], BX = 840;
    const box = (key, s, y, at, outT, tone) => <Box key={key} x={BX} y={y} w={300} h={88} label={s} tone={tone || "a"} size={40} at={at} out={outT} dur={d} />;
    const tWe = r("We do"), tEach = r("each on");
    out.push(<Label key="s0" text="start" x={60} y={RY[0] - 26} w={400} size={40} align="left" color={C.navy} at={tWe} dur={d} />);
    out.push(box("b0", "(20, 30)", RY[0], tWe));
    const steps = [["1 · rotate 90°", "(x, y) → (−y, x)", r("turns")], ["2 · translate (−20, 0)", "x → x − 20", tAdd], ["3 · scale (2, 1)", "x × 2,  y × 1", tMul]];
    steps.forEach(([nm, rule, tr], i) => {
      out.push(<Label key={"n" + i} text={nm} x={60} y={RY[i + 1] - 50} w={560} size={40} align="left" color={C.coral} at={tWe + 0.4 + i * 0.35} dur={d} />);
      out.push(<Label key={"rl" + i} text={rule} x={60} y={RY[i + 1] + 4} w={560} size={36} font={C.fMono} align="left" color={C.navy} at={tr} dur={d} />);
      out.push(<Arrow key={"fa" + i} x1={BX} y1={RY[i] + 46} x2={BX} y2={RY[i + 1] - 48} color={C.navy} width={5} at={tEach + i * 0.35} dur={d} />);
    });
    const vals = [["(−30, 20)", tRv], ["(−50, 20)", tTv], ["(−100, 20)", tSv]];
    vals.forEach(([s, tv], i) => { out.push(box("q" + i, "?", RY[i + 1], tEach + i * 0.35 + 0.1, tv, "ghost")); out.push(box("v" + i, s, RY[i + 1], tv, undefined, i === 2 ? "hot" : "a")); });
    // recalls from Q1: translating is the slide, scaling is the resize
    out.push(...Recall(C, "rcS", "slide", r("slide"), r("Scaling"), r("already"), d));
    out.push(...Recall(C, "rcR", "resize", r("resize"), d, r("Multiply"), d));
    return out;
  }, { hold: "That gives minus 120", holdX: 540, holdY: 960, holdZ: 1, cam: [{ t: 0, x: 540, y: 960, z: 1 }] }),

  // As matrices: multiply in reverse order, S · T · R. Same answer.
  S("As matrices", (r, d) => {
    const out = [];
    const y0 = TOP + 60;
    out.push(<Label key="eq" text="P′ = S · T · R · P" x={540} y={y0} w={960} size={60} font={C.fMono} color={C.navy} at={0.1} dur={d} />);
    const tRev = r("reverse");
    out.push(<Arrow key="ord" x1={850} y1={y0 + 110} x2={300} y2={y0 + 110} color={C.coral} width={6} at={tRev} dur={d} />);
    out.push(<Label key="ordl" text="applied right to left" x={540} y={y0 + 130} w={700} size={36} color={C.coral} at={tRev + 0.2} dur={d} />);
    const my = y0 + 250, fs = 36;
    const tSc = r("Scale"), tTr = r("translate"), tRo = r("rotate");
    out.push(Mat(C, "S", 60, my, [["2", "0", "0"], ["0", "1", "0"], ["0", "0", "1"]], fs, 56, tSc, d));
    out.push(Mat(C, "T", 296, my, [["1", "0", "−20"], ["0", "1", "0"], ["0", "0", "1"]], fs, 80, tTr, d));
    out.push(Mat(C, "R", 604, my, [["0", "−1", "0"], ["1", "0", "0"], ["0", "0", "1"]], fs, 70, tRo, d));
    out.push(Mat(C, "P", 882, my, [["20"], ["30"], ["1"]], fs, 76, tRo + 0.3, d));
    const mh = 3 * Math.round(fs * 1.35) + 20, ly = my + mh + 16;
    [["scale", 164, tSc, "3rd"], ["translate", 436, tTr, "2nd"], ["rotate", 729, tRo, "1st"]].forEach(([s, cx, t, o], i) => {
      out.push(<Label key={"ml" + i} text={s} x={cx} y={ly} w={260} size={34} color={C.navy} at={t + 0.2} dur={d} />);
      out.push(<Label key={"mo" + i} text={o} x={cx} y={ly + 46} w={200} size={34} color={C.coral} at={t + 0.3} dur={d} />); });
    const tSame = r("Same");
    out.push(<Label key="meq" text="S · T · R =" x={60} y={ly + 180} w={360} size={42} font={C.fMono} align="left" at={tRo + 0.5} dur={d} />);
    out.push(Mat(C, "M", 380, ly + 140, [["0", "−2", "−40"], ["1", "0", "0"], ["0", "0", "1"]], 40, 96, tRo + 0.6, d));
    out.push(<Label key="res" text="M · (20, 30, 1) = (−100, 20, 1)" x={520} y={ly + 400} w={960} size={40} font={C.fMono} color={C.coral} at={tSame} dur={d} />);
    out.push(<Label key="same" text="same answer" x={540} y={ly + 470} w={500} size={44} color={C.navy} at={tSame + 0.2} dur={d} />);
    out.push(<Check key="ck" x={820} y={ly + 496} size={60} at={tSame + 0.3} dur={d} />);
    return out;
  }, { hold: "Same", holdX: 540, holdY: 960, holdZ: 1, cam: [{ t: 0, x: 540, y: 960, z: 1 }] }),

  // Exam: the answer card (shared content).
  ...ANSWERS["cg-q03"].map((pg, k, all) => S(k === 0 ? "In your exam" : null, (r, d) => [
    ...AnswerCard({ page: pg, title: "WRITE THIS · 5 MARKS · " + (k + 1) + "/" + all.length, at: 0, dur: d, y: TOP + 24 }),
    ...(k === 0 ? [<Label key="tr" text="each step works on the last result" x={540} y={1430} w={980} size={44} font={C.fHead} color={C.navy} at={r("Remember")} dur={d} />] : []),
  ], { cam: [{ t: 0, x: 540, y: 960, z: 1 }] })),
];
