import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  // graph that builds itself; fill = solid ground under the curve
  const Gr = ({ x, y, w, h, pts, xmax, ymax, at = 0, cAt, dur, drawDur = 1.1, color, width = 9, axes = false, fill = true }) => {
    const P = ([a, b]) => [x + w * a / xmax, y + h - h * b / ymax];
    const dd = pts.map((p, i) => (i ? "L " : "M ") + P(p).join(" ")).join(" ");
    const t = Math.min(at, dur - 0.7), c0 = Math.max(0.15, (cAt == null ? t + 0.15 : cAt) - t);
    const last = P(pts[pts.length - 1]), first = P(pts[0]);
    return <Layer at={t} dur={dur}>
      {axes ? <path d={`M ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h}`} x={0} y={0} width={1080} height={1920} stroke={{ width: 6, color: C.navy, cap: "round" }} /> : null}
      <frame at={c0} duration={Math.max(0.3, dur - t - c0)} width={1080} height={1920} layout="none" reveal={{ from: "left", at: 0, duration: drawDur, easing: "ease-in-out" }}>
        {fill ? <path d={dd + ` L ${last[0]} ${y + h} L ${first[0]} ${y + h} Z`} x={0} y={0} width={1080} height={1920} fill={C.chip} /> : null}
        <path d={dd} x={0} y={0} width={1080} height={1920} stroke={{ width, color: color || C.coral, cap: "round" }} />
      </frame>
    </Layer>;
  };
  // the landscape: a small peak A (local) and a big peak B (global)
  const F = t => 0.4 + 5 * Math.exp(-Math.pow(t - 2.2, 2) / 1.28) + 9 * Math.exp(-Math.pow(t - 7, 2) / 2);
  const LAND = Array.from({ length: 101 }, (_, i) => [i / 10, F(i / 10)]);
  const PX = t => 100 + 88 * t, PY = t => 1130 - 68 * F(t), BX = t => PX(t), BY = t => PY(t) - 78;
  const LS = { x: 100, y: 450, w: 880, h: 680, pts: LAND, xmax: 10, ymax: 10 };
  return [
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Explain the hill climbing algorithm and discuss its limitations.", n: 4, marks: 5, y: 520 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "limitations", x: 540, y: 780, z: 1.06 }] }),

    // from zero: a climber in thick fog steps uphill
    S("Let's start", (r, d) => [
      <Head dur={d} text="in the fog" y={170} size={120} at={0.1} />,
      <Gr dur={d} {...LS} at={r("standing") - 0.3} cAt={r("standing")} drawDur={1.2} />,
      <Ico dur={d} ctx={ctx} name="cloud-fog" x={PX(7)} y={460} size={200} color={C.cobalt} at={r("top")} />,
      <Label dur={d} text="can't see the top" x={PX(7)} y={297} w={460} size={40} color={C.cobalt} at={r("top") + 0.2} />,
      <Mascot dur={d} size={120} at={r("standing") + 0.8} pts={[{ t: r("standing") + 0.8, x: BX(0.6), y: BY(0.6), look: [1, -1], mood: "idle" }, { t: r("step"), x: BX(0.6), y: BY(0.6), look: [1, -1], mood: "think" }, { t: r("goes"), x: BX(1.2), y: BY(1.2), look: [1, -1], mood: "idle" }, { t: r("keep"), x: BX(1.8), y: BY(1.8), look: [1, -1], mood: "happy" }]} />,
      <Label dur={d} text="feel the ground around your feet" x={540} y={1190} w={980} size={48} at={r("feel")} />,
      <Label dur={d} text="always step UP" x={540} y={1290} w={900} size={72} color={C.coral} at={r("step")} />,
    ], { hold: "keep doing" }),

    // the definition: one state, look at neighbours, move to a better one, repeat, stop
    S("That is hill", (r, d) => [
      <Head dur={d} text="hill climbing" y={170} size={110} at={0.1} />,
      <Gr dur={d} {...LS} at={0.2} cAt={0.3} drawDur={0.8} />,
      <Ring dur={d} x={PX(0.4)} y={PY(0.4)} r={34} color={C.cobalt} at={r("neighbors")} />,
      <Ring dur={d} x={PX(1.0)} y={PY(1.0)} r={34} color={C.cobalt} at={r("neighbors") + 0.15} />,
      <Mascot dur={d} size={120} tag="now" at={r("starts") - 0.3} pts={[{ t: r("starts") - 0.3, x: BX(0.7), y: BY(0.7), look: [1, -1], mood: "idle" }, { t: r("looks"), x: BX(0.7), y: BY(0.7), look: [-1, 0], mood: "think" }, { t: r("moves"), x: BX(0.7), y: BY(0.7), look: [1, -1], mood: "idle" }, { t: r("moves") + 0.8, x: BX(1.3), y: BY(1.3), look: [1, -1], mood: "idle" }, { t: r("repeats") + 0.7, x: BX(1.8), y: BY(1.8), look: [1, -1], mood: "idle" }, { t: r("until") + 0.7, x: BX(2.2), y: BY(2.2), look: [1, -1], mood: "think" }, { t: r("peak"), x: BX(2.2), y: BY(2.2), look: [0, -1], mood: "happy" }]} />,
      <Label dur={d} text="“this must be the top!”" x={540} y={1190} w={980} size={52} color={C.cobalt} at={r("peak")} />,
      <Label dur={d} text="remembers only the current state" x={540} y={1290} w={980} size={46} at={r("remembers")} />,
      <Label dur={d} text="= almost no memory" x={540} y={1380} w={900} size={60} color={C.coral} at={r("memory")} />,
    ], { hold: "It only remembers" }),

    S("So the question", (r, d) => [
      <Label dur={d} text="the question wants:" x={540} y={470} w={960} size={74} at={0.15} />,
      <Label dur={d} text="1.  how it works" x={150} y={680} w={820} size={62} align="left" at={r("How")} />,
      <Check dur={d} x={95} y={715} size={80} at={r("How") + 0.9} />,
      <Label dur={d} text="2.  where it fails" x={150} y={860} w={860} size={62} align="left" at={r("where")} />,
      <Check dur={d} x={95} y={895} size={80} at={r("where") + 0.9} />,
    ]),

    // the algorithm as four steps with a loop
    S("Here is the algorithm", (r, d) => {
      const bx = 500, bw = 760, ys = [430, 640, 850, 1060];
      return [
        <Head dur={d} text="algorithm" y={170} size={110} at={0.1} />,
        <Box dur={d} x={bx} y={ys[0]} w={bw} h={120} label="1  start: initial state" size={42} tone="a" at={r("One")} />,
        <Arrow dur={d} x1={bx} y1={ys[0] + 62} x2={bx} y2={ys[1] - 62} color={C.cobalt} width={8} at={r("Two") - 0.2} />,
        <Box dur={d} x={bx} y={ys[1]} w={bw} h={120} label="2  look at the neighbours" size={42} tone="a" at={r("Two")} />,
        <Arrow dur={d} x1={bx} y1={ys[1] + 62} x2={bx} y2={ys[2] - 62} color={C.cobalt} width={8} at={r("Three") - 0.2} />,
        <Box dur={d} x={bx} y={ys[2]} w={bw} h={120} label="3  best one higher? move" size={42} tone="b" at={r("Three")} />,
        <Arrow dur={d} x1={bx + bw / 2 + 5} y1={ys[2]} x2={965} y2={ys[2]} head={false} color={C.coral} width={8} at={r("repeat")} />,
        <Arrow dur={d} x1={965} y1={ys[2]} x2={965} y2={ys[1]} head={false} color={C.coral} width={8} at={r("repeat") + 0.15} />,
        <Arrow dur={d} x1={965} y1={ys[1]} x2={bx + bw / 2 + 12} y2={ys[1]} color={C.coral} width={8} at={r("repeat") + 0.3} />,
        <Arrow dur={d} x1={bx} y1={ys[2] + 62} x2={bx} y2={ys[3] - 62} color={C.cobalt} width={8} at={r("Four") - 0.2} />,
        <Box dur={d} x={bx} y={ys[3]} w={bw} h={120} label="4  none higher? STOP" size={42} tone="hot" at={r("Four")} />,
      ];
    }, { hold: "stop" }),

    // limitation 1: local maximum
    S("Now the limitations", (r, d) => [
      <Head dur={d} text="3 traps" y={170} size={120} at={0.1} />,
      <Gr dur={d} {...LS} at={r("First") - 0.3} cAt={r("First")} drawDur={1.0} />,
      <Ring dur={d} x={PX(2.2)} y={PY(2.2)} r={60} at={r("maximum")} />,
      <Label dur={d} text="local maximum" x={PX(2.2)} y={520} w={420} size={44} color={C.coral} at={r("maximum")} />,
      <Ring dur={d} x={PX(7)} y={PY(7)} r={70} color={C.cobalt} at={r("best")} />,
      <Label dur={d} text="global maximum" x={PX(7)} y={330} w={440} size={44} color={C.cobalt} at={r("best") + 0.2} />,
      <Mascot dur={d} size={120} at={r("climber")} pts={[{ t: r("climber"), x: BX(2.2), y: BY(2.2), look: [1, -1], mood: "think" }, { t: r("never"), x: BX(2.2), y: BY(2.2), look: [1, -1], mood: "sad" }]} />,
      <Arrow dur={d} x1={380} y1={640} x2={640} y2={520} color={C.cobalt} width={7} at={r("never")} />,
      <XMark dur={d} x={510} y={582} size={80} at={r("never") + 0.3} />,
      <Label dur={d} text="a peak higher than its neighbours" x={540} y={1190} w={980} size={46} at={r("higher")} />,
      <Label dur={d} text="but lower than the best peak" x={540} y={1270} w={980} size={46} at={r("lower")} />,
      <Label dur={d} text="never finds the global maximum" x={540} y={1360} w={980} size={50} color={C.coral} at={r("never")} />,
    ], { hold: "never finds" }),

    // limitation 2: plateau
    S("Second", (r, d) => {
      const pl = [[0, 0.5], [1, 1.5], [2, 4], [3, 4], [7, 4], [8, 4], [9, 5.5], [10, 7]];
      const Y0 = 1130 - 68 * 4, cx = 540;
      return [
        <Head dur={d} text="plateau" y={170} size={130} at={0.1} />,
        <Gr dur={d} x={100} y={450} w={880} h={680} pts={pl} xmax={10} ymax={10} at={r("plateau") - 0.2} cAt={r("plateau")} drawDur={0.9} />,
        <Label dur={d} text="flat area" x={cx} y={Y0 + 40} w={500} size={42} color={C.chipText} at={r("flat")} />,
        <Box dur={d} x={cx - 270} y={Y0 - 110} w={110} h={100} label="4" size={50} tone="ghost" at={r("every")} />,
        <Box dur={d} x={cx + 270} y={Y0 - 110} w={110} h={100} label="4" size={50} tone="ghost" at={r("every") + 0.2} />,
        <Arrow dur={d} x1={cx - 70} y1={Y0 - 110} x2={cx - 205} y2={Y0 - 110} color={C.cobalt} width={7} at={r("every") + 0.3} />,
        <Arrow dur={d} x1={cx + 70} y1={Y0 - 110} x2={cx + 205} y2={Y0 - 110} color={C.cobalt} width={7} at={r("every") + 0.5} />,
        <Mascot dur={d} size={120} tag="4" at={0.3} pts={[{ t: 0.3, x: cx, y: Y0 - 110, look: [0, 0], mood: "idle" }, { t: r("uphill"), x: cx, y: Y0 - 110, look: [0, -1], mood: "think" }, { t: r("stuck"), x: cx, y: Y0 - 110, look: [0, 1], mood: "sad" }]} />,
        <Label dur={d} text="every neighbour: the same value" x={540} y={1190} w={980} size={46} at={r("same")} />,
        <Label dur={d} text="no uphill direction: stuck" x={540} y={1280} w={980} size={54} color={C.coral} at={r("uphill")} />,
      ];
    }, { hold: "stuck" }),

    // limitation 3: ridge
    S("Third", (r, d) => [
      <Head dur={d} text="ridge" y={170} size={140} at={0.1} />,
      <Arrow dur={d} x1={220} y1={1050} x2={860} y2={480} head={false} color={C.cobalt} width={58} at={r("ridge")} />,
      <Ico dur={d} ctx={ctx} name="flag" x={880} y={440} size={110} color={C.coral} at={r("ridge") + 0.8} />,
      <Label dur={d} text="narrow, slanted path up" x={330} y={520} w={560} size={42} at={r("narrow")} />,
      <Mascot dur={d} size={120} at={r("step") - 0.6} pts={[{ t: r("step") - 0.6, x: 330, y: 952, look: [1, -1], mood: "idle" }, { t: r("downhill"), x: 330, y: 952, look: [0, -1], mood: "think" }, { t: r("cannot"), x: 330, y: 952, look: [1, -1], mood: "sad" }]} />,
      <Arrow dur={d} x1={330} y1={870} x2={330} y2={780} color={C.coral} width={8} at={r("step")} />,
      <XMark dur={d} x={330} y={745} size={60} at={r("downhill")} />,
      <Arrow dur={d} x1={405} y1={952} x2={510} y2={952} color={C.coral} width={8} at={r("step") + 0.3} />,
      <XMark dur={d} x={545} y={952} size={60} at={r("downhill") + 0.2} />,
      <Label dur={d} text="every single step looks downhill" x={540} y={1250} w={980} size={46} at={r("step")} />,
      <Label dur={d} text="can't follow the ridge to the top" x={540} y={1340} w={980} size={50} color={C.coral} at={r("cannot")} />,
    ], { hold: "to the top" }),

    // the fix: random restart
    S("The usual fix", (r, d) => [
      <Head dur={d} text="random restart" y={170} size={110} at={0.1} />,
      <Gr dur={d} {...LS} at={0.2} cAt={0.3} drawDur={0.8} />,
      <Mascot dur={d} size={120} at={0.5} out={r("Climb") + 0.1} pts={[{ t: 0.5, x: BX(0.6), y: BY(0.6), look: [1, -1], mood: "idle" }, { t: 1.7, x: BX(2.2), y: BY(2.2), look: [1, -1], mood: "think" }, { t: r("Climb"), x: BX(2.2), y: BY(2.2), look: [1, -1], mood: "sad" }]} />,
      <Mascot dur={d} size={120} at={r("Climb") + 0.1} pts={[{ t: r("Climb") + 0.1, x: BX(5), y: BY(5), look: [1, -1], mood: "idle" }, { t: r("Climb") + 0.4, x: BX(5), y: BY(5), look: [1, -1], mood: "think" }, { t: d - 0.8, x: BX(7), y: BY(7), look: [0, -1], mood: "happy" }]} />,
      <Label dur={d} text="start again from a new point" x={540} y={1200} w={980} size={48} color={C.cobalt} at={r("Climb")} />,
    ], { hold: "starting points" }),

    S("So in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "Hill climbing: a greedy local search that always moves to a better neighbour.",
        "It stops when no neighbour is better, and keeps only the current state.",
        "Limitations: local maximum (peak lower than the global best), plateau (flat area), ridge (narrow slanted path).",
        "Fix: random restart or simulated annealing." ],
        times: [r("Hill"), r("stops"), r("limitations"), r("fix")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

    S("To remember", (r, d) => [
      <Ico dur={d} ctx={ctx} name="cloud-fog" x={540} y={420} size={200} color={C.cobalt} at={0.1} />,
      <Label dur={d} text="a climber in the fog" x={540} y={600} w={980} size={76} at={r("climber")} />,
      <Label dur={d} text="3 traps" x={540} y={730} w={900} size={80} color={C.coral} at={r("three")} />,
      <Label dur={d} text="peak" x={200} y={870} w={300} size={64} color={C.cobalt} at={r("Peak")} />,
      <Label dur={d} text="flat" x={540} y={870} w={300} size={64} color={C.cobalt} at={r("flat")} />,
      <Label dur={d} text="ridge" x={880} y={870} w={300} size={64} color={C.cobalt} at={r("ridge")} />,
      <Label dur={d} text="5 marks" x={540} y={1060} w={900} size={150} color={C.coral} at={r("Five")} />,
      <Check dur={d} x={540} y={1420} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 1000, z: 1.06 }] }),
  ];
};
