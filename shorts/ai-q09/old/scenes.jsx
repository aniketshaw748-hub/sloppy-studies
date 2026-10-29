import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { C } from "./kit.jsx";
const popA = (at = 0) => [{ property: "opacity", from: 0, to: 1, at, duration: 0.18 }, { property: "scale", from: 0.6, to: 1, at, duration: 0.32, easing: "bounce" }];
// PlotR: Plot with working left->right reveal (frame.reveal); the kit's Plot mask is broken
function PlotR({ x = 120, y = 460, w = 860, h = 760, pts, xmax, ymax, at = 0, drawDur = 1.2, dur, color, xlabel, ylabel, width = 9, marks = [], axes = true }) {
  const P = ([a, b]) => [x + w * a / xmax, y + h - h * b / ymax];
  const dd = pts.map((p, i) => (i ? "L " : "M ") + P(p).join(" ")).join(" ");
  const a0 = Math.min(at, dur - 0.5);
  return <Layer at={0} dur={dur}>
    {axes ? <path d={`M ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h}`} x={0} y={0} width={1080} height={1920} stroke={{ width: 6, color: C.navy, cap: "round" }} /> : null}
    {xlabel ? <text x={x + w - 500} y={y + h + 16} width={500} align="right" fontFamily={C.fMono} fontWeight={700} fontSize={34} color={C.navy}>{xlabel}</text> : null}
    {ylabel ? <text x={x + 16} y={y - 50} width={700} fontFamily={C.fMono} fontWeight={700} fontSize={34} color={C.navy}>{ylabel}</text> : null}
    <frame at={a0} duration={Math.max(0.3, dur - a0)} width={1080} height={1920} layout="none" reveal={{ from: "left", at: 0, duration: drawDur, easing: "ease-in-out" }}>
      <path d={dd} x={0} y={0} width={1080} height={1920} stroke={{ width, color: color || C.coral, cap: "round" }} />
    </frame>
    {marks.map((m, i) => { const [mx, my] = P([m.x, m.y]); return <Layer key={i} at={m.at || at + drawDur} dur={dur} anim={popA(0)}>
      <rect x={mx - 16} y={my - 16} width={32} height={32} radius={16} fill={C.cobalt} strokeColor={C.navy} strokeWidth={4} />
      {m.label ? <text x={mx - 220} y={my - 84} width={440} align="center" fontFamily={C.fBody} fontSize={38} color={C.navy}>{m.label}</text> : null}</Layer>; })}
  </Layer>;
}
export const SCENES = ({ S, ctx, C }) => {
  const ball = (C) => <rect x={0} y={0} width={70} height={70} radius={35} fill={C.coral} strokeColor={C.navy} strokeWidth={4} />;
  const P = (a, b) => [120 + 52.5 * a, 1220 - 70 * b];
  return [
    // 1 hook: ball climbs, hits flat ground
    S(null, (r, d) => [
      <PlotR dur={d} x={120} y={520} w={840} h={700} xmax={16} ymax={10} pts={[[0,0.5],[3,3],[5,5],[11,5],[12,5.6],[14,8],[16,9.5]]} at={0.2} drawDur={1.0} xlabel="state" ylabel="height = evaluation" />,
      <Mover dur={d} cw={70} ch={70} at={0.3} pts={[{ t: 0.3, x: P(0.5, 1)[0], y: P(0.5, 1)[1] - 50 }, { t: r("goes") + 0.2, x: P(5, 5)[0], y: P(5, 5)[1] - 50 }, { t: r("flat") + 0.6, x: P(8, 5)[0], y: P(8, 5)[1] - 50 }]}>{ball(C)}</Mover>,
      <Head dur={d} text="FLAT?!" y={200} size={210} at={r("flat")} />,
      <XMark dur={d} x={P(9.5, 5)[0]} y={P(9.5, 5)[1] - 50} size={110} at={r("flat") + 0.7} />,
    ]),
    // 2 definition: neighbouring states all equal
    S("A plateau is", (r, d) => [
      <Head dur={d} text="PLATEAU" y={190} size={170} />,
      <PlotR dur={d} x={120} y={470} w={840} h={560} xmax={16} ymax={10} pts={[[0,0.5],[3,3],[5,5],[11,5],[12,5.6],[14,8],[16,9.5]]} at={0} drawDur={0.5} marks={[{ x: 8, y: 5, label: "FLAT AREA", at: r("flat") }]} />,
      ...[0, 1, 2, 3, 4].map(i => <Box key={i} dur={d} x={170 + i * 185} y={1300} w={165} h={165} label="5" size={90} tone={i === 2 ? "b" : "a"} at={r("neighboring") + i * 0.12} />),
      <Label dur={d} text="current state" x={540} y={1410} w={500} size={40} at={r("neighboring") + 0.6} />,
      <Arrow dur={d} x1={460} y1={1300} x2={400} y2={1300} at={r("same")} label="=" />,
      <Arrow dur={d} x1={620} y1={1300} x2={680} y2={1300} at={r("same")} label="=" />,
      <Label dur={d} text="all neighbours have the SAME value" x={540} y={1500} w={980} size={44} at={r("evaluation")} />,
    ]),
    // 3 no uphill move
    S("The algorithm", (r, d) => [
      <Box dur={d} x={540} y={760} w={260} h={190} label="5" sub="YOU" size={100} tone="b" />,
      <Box dur={d} x={190} y={760} w={190} h={190} label="5" size={90} at={0.2} />,
      <Box dur={d} x={890} y={760} w={190} h={190} label="5" size={90} at={0.3} />,
      <Arrow dur={d} x1={540} y1={650} x2={540} y2={440} at={r("uphill")} color={C.coral} width={12} />,
      <XMark dur={d} x={540} y={520} size={170} at={r("uphill") + 0.3} />,
      <Label dur={d} text="no uphill move" x={540} y={290} w={800} size={60} at={r("uphill")} />,
      <Label dur={d} text="random wandering" x={540} y={1180} w={900} size={52} at={r("wanders")} />,
      <Mover dur={d} cw={70} ch={70} at={r("wanders")} pts={[{ t: r("wanders"), x: 540, y: 1350 }, { t: r("wanders") + 0.5, x: 330, y: 1350 }, { t: r("wanders") + 1.0, x: 720, y: 1350 }, { t: r("wanders") + 1.5, x: 250, y: 1350 }, { t: r("stops") - 0.1, x: 600, y: 1350 }]}>{ball(C)}</Mover>,
      <Label dur={d} text="or STOPS" x={540} y={1470} w={700} size={60} at={r("stops")} color={C.coral} />,
    ]),
    // 4 one of three problems
    S("Plateau is one", (r, d) => {
      const pl = (x, pts, at, col, key) => <PlotR key={key} dur={d} x={x} y={560} w={300} h={380} xmax={8} ymax={10} pts={pts} at={at} drawDur={0.8} width={8} color={col} />;
      return [
        <Head dur={d} text="3 PROBLEMS" y={190} size={150} />,
        pl(50, [[0,1],[2,6],[3,7.5],[4.5,4],[6,3],[7,6],[8,9.5]], r("hill"), C.cobalt, "a"),
        pl(390, [[0,1],[1,3.5],[1.5,2.5],[3,5.5],[3.5,4.5],[5,7.5],[5.5,6.5],[8,9.5]], r("ridge"), C.cobalt, "b"),
        pl(730, [[0,1],[2,5],[6,5],[8,9.5]], 0.3, C.coral, "c"),
        <Label dur={d} text="LOCAL MAX" x={200} y={1010} w={320} size={44} at={r("local")} />,
        <Label dur={d} text="RIDGE" x={540} y={1010} w={320} size={44} at={r("ridge")} />,
        <Box dur={d} x={880} y={1040} w={290} h={100} label="PLATEAU" tone="hot" size={48} at={0.3} />,
        <Label dur={d} text="stuck in all three" x={540} y={1300} w={900} size={56} at={r("problems")} />,
      ];
    }),
    // 5 fixes
    S("Fixes", (r, d) => [
      <Head dur={d} text="FIXES" y={190} size={170} />,
      <Ico dur={d} ctx={ctx} name="arrow-left-right" x={160} y={640} size={190} at={r("sideways")} />,
      <Box dur={d} x={650} y={640} w={720} h={220} label="SIDEWAYS MOVES" sub="but with a LIMIT" size={54} tone="a" at={r("sideways")} />,
      <Ico dur={d} ctx={ctx} name="dices" x={160} y={980} size={190} at={r("jumps")} color={C.coral} />,
      <Box dur={d} x={650} y={980} w={720} h={220} label="BIG RANDOM JUMPS" sub="escape the flat" size={54} tone="b" at={r("jumps")} />,
      <Ico dur={d} ctx={ctx} name="refresh-cw" x={160} y={1320} size={190} at={r("restart")} color={C.cobalt} />,
      <Box dur={d} x={650} y={1320} w={720} h={220} label="RANDOM RESTART" sub="start from a new state" size={54} tone="hot" at={r("restart")} />,
    ]),
    // 6 memory trick
    S("Memory trick", (r, d) => [
      <Ico dur={d} ctx={ctx} name="eye-off" x={540} y={650} size={320} at={0.1} />,
      <Head dur={d} text={"FLAT\n= BLIND"} y={900} size={230} at={r("Flat")} />,
    ]),
    S("Write that", (r, d) => [
      <Ico dur={d} ctx={ctx} name="pen-line" x={540} y={650} size={300} at={0} />,
      <Head dur={d} text="5 MARKS" y={950} size={230} at={r("Five")} />,
      <Check dur={d} x={540} y={1380} size={240} at={r("Secured")} />,
    ], { zoom: 1.08 }),
  ];
};
