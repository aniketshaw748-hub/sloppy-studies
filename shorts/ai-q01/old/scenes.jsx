import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { C } from "./kit.jsx";
const popA = (at = 0) => [{ property: "opacity", from: 0, to: 1, at, duration: 0.18 }, { property: "scale", from: 0.6, to: 1, at, duration: 0.32, easing: "bounce" }];
// PlotR: Plot with working left->right reveal (frame.reveal); optional dashed-free axes, marks
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
  const gauss = Array.from({ length: 21 }, (_, i) => { const x = i * 0.2; return [x, Math.exp(-((x - 2) ** 2) / 0.6)]; });
  return [
    S(null, (r, d) => [
      <Head dur={d} text={"60% HOT?"} y={200} size={190} />,
      <Ico dur={d} ctx={ctx} name="thermometer" x={300} y={980} size={420} color={C.navy} at={0.2} />,
      <Box dur={d} x={760} y={980} w={150} h={520} label="" tone="ghost" at={0.2} />,
      <Box dur={d} x={760} y={1100} w={130} h={300} label="" tone="hot" at={r("60")} />,
      <Label dur={d} text="60%" x={760} y={610} w={300} size={80} at={r("60")} />,
      <Label dur={d} text="not yes / no" x={540} y={1380} w={800} size={64} at={r("%")} color={C.coral} />,
    ]),
    S("A membership function", (r, d) => [
      <Head dur={d} text={"MEMBERSHIP\nFUNCTION"} y={190} size={130} />,
      <Box dur={d} x={190} y={950} w={280} h={230} label="x" sub="element" size={110} at={r("every")} />,
      <Arrow dur={d} x1={340} y1={950} x2={400} y2={950} at={r("maps")} />,
      <Box dur={d} x={540} y={950} w={240} h={230} label="mu A" tone="b" size={70} sub="function" at={r("maps")} />,
      <Arrow dur={d} x1={670} y1={950} x2={730} y2={950} at={r("degree")} />,
      <Box dur={d} x={880} y={950} w={280} h={230} label="0 to 1" tone="hot" size={70} sub="degree" at={r("degree")} />,
      <Label dur={d} text="universe of discourse  to  [0, 1]" x={540} y={1200} w={980} size={44} font={C.fMono} at={r("universe")} />,
    ]),
    S("0 means", (r, d) => [
      <Head dur={d} text="DEGREE" y={200} size={170} sub="how much it belongs" />,
      <Box dur={d} x={180} y={1000} w={260} h={220} label="0" sub="NOT IN" size={80} at={r("0")} />,
      <XMark dur={d} x={180} y={760} size={140} at={r("0") + 0.3} />,
      <Box dur={d} x={540} y={1000} w={260} h={220} label="0.5" sub="PARTIAL" tone="b" size={80} at={r("partial")} />,
      <Ring dur={d} x={540} y={1000} r={160} at={r("partial") + 0.2} />,
      <Box dur={d} x={900} y={1000} w={260} h={220} label="1" sub="FULLY IN" tone="hot" size={80} at={r("fully")} />,
      <Check dur={d} x={900} y={760} size={140} at={r("fully") + 0.3} />,
      <Arrow dur={d} x1={180} y1={1250} x2={900} y2={1250} at={0.3} label="more membership" />,
    ]),
    S("Common shapes", (r, d) => [
      <Label dur={d} text="TRIANGULAR" x={540} y={250} w={900} size={56} at={r("triangular")} />,
      <PlotR dur={d} x={250} y={330} w={580} h={240} pts={[[0, 0], [2, 1], [4, 0]]} xmax={4} ymax={1} at={r("triangular")} drawDur={0.7} />,
      <Label dur={d} text="TRAPEZOIDAL" x={540} y={680} w={900} size={56} at={r("trapezoidal")} />,
      <PlotR dur={d} x={250} y={760} w={580} h={240} pts={[[0, 0], [1, 1], [3, 1], [4, 0]]} xmax={4} ymax={1} at={r("trapezoidal")} drawDur={0.7} color={C.cobalt} />,
      <Label dur={d} text="GAUSSIAN" x={540} y={1110} w={900} size={56} at={r("Gaussian")} />,
      <PlotR dur={d} x={250} y={1190} w={580} h={240} pts={gauss} xmax={4} ymax={1} at={r("Gaussian")} drawDur={0.8} />,
    ]),
    S("Example", (r, d) => [
      <Head dur={d} text="HOT(30) = 0.5" y={190} size={130} at={r("30")} />,
      <PlotR dur={d} x={150} y={620} w={820} h={620} pts={[[0, 0], [20, 0], [40, 1], [50, 1]]} xmax={50} ymax={1} at={0.1} drawDur={1.0} ylabel="mu HOT"
        marks={[{ x: 30, y: 0.5, label: "30°C = 0.5", at: r("30") }]} />,
      <Label dur={d} text="temperature °C" x={540} y={1340} w={700} size={42} font={C.fMono} at={0.5} />,
      <Label dur={d} text="20" x={477} y={1262} w={120} size={40} at={0.6} />,
      <Label dur={d} text="30" x={642} y={1262} w={120} size={40} at={r("30")} color={C.coral} />,
      <Label dur={d} text="40" x={806} y={1262} w={120} size={40} at={0.8} />,
      <Label dur={d} text="1" x={100} y={600} w={80} size={40} at={0.6} />,
      <Label dur={d} text="0.5" x={90} y={910} w={100} size={40} at={r("hot")} color={C.coral} />,
      <Ring dur={d} x={642} y={930} r={60} at={r("30") + 0.3} />,
    ]),
    S("Memory trick", (r, d) => [
      <Ico dur={d} ctx={ctx} name="gauge" x={540} y={700} size={440} at={0.1} />,
      <Label dur={d} text="0" x={370} y={880} w={120} size={90} at={0.4} />,
      <Label dur={d} text="1" x={710} y={880} w={120} size={90} at={0.5} />,
      <Box dur={d} x={540} y={1180} w={920} h={200} label="MU = MEMBERSHIP METER" size={58} tone="b" at={r("membership")} />,
    ]),
    S("Write that", (r, d) => [
      <Ico dur={d} ctx={ctx} name="pen-line" x={540} y={650} size={300} at={0} />,
      <Head dur={d} text="5 MARKS" y={950} size={230} at={r("five")} />,
      <Check dur={d} x={540} y={1380} size={240} at={r("secured")} />,
    ], { zoom: 1.08 }),
  ];
};
