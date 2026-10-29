import { Box, Arrow, Ico, Table, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => [
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Differentiate between A* and AO* algorithms.", n: 6, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "algorithms", x: 540, y: 780, z: 1.06 }] }),

  // from zero: both are heuristic searches; they differ in the KIND of problem
  S("Let's start", (r, d) => [
    <Head dur={d} text="smart search" y={170} size={110} at={0.1} />,
    <Box dur={d} x={300} y={470} w={340} h={140} label="A*" size={80} tone="a" at={r("smart")} />,
    <Box dur={d} x={780} y={470} w={340} h={140} label="AO*" size={80} tone="b" at={r("smart") + 0.3} />,
    <Mascot dur={d} size={130} at={r("guess")} pts={[{ t: r("guess"), x: 170, y: 900, look: [1, 0], mood: "think" }, { t: r("wander"), x: 170, y: 900, look: [1, 0], mood: "think" }, { t: r("difference"), x: 170, y: 900, look: [1, 0], mood: "idle" }]} />,
    <Ico dur={d} ctx={ctx} name="flag" x={900} y={900} size={120} color={C.coral} at={r("guess")} />,
    <Arrow dur={d} x1={270} y1={900} x2={810} y2={900} color={C.cobalt} width={8} at={r("heuristic") - 0.2} />,
    <Label dur={d} text="guess of the remaining cost = heuristic h" x={540} y={1010} w={980} size={44} color={C.coral} at={r("heuristic")} />,
    <Label dur={d} text="no blind wandering" x={540} y={1100} w={980} size={50} at={r("wander")} />,
    <Label dur={d} text={"the difference:\nthe KIND of problem"} x={540} y={1230} w={980} size={50} color={C.cobalt} at={r("difference")} />,
  ], { hold: "The difference" }),

  // an OR graph: one road at each junction, answer = a single path
  S("First", (r, d) => [
    <Head dur={d} text="a route" y={170} size={120} at={0.1} />,
    <Box dur={d} x={540} y={450} w={170} h={110} label="S" size={60} tone="a" at={r("route")} />,
    <Arrow dur={d} x1={500} y1={505} x2={310} y2={660} head={false} width={6} at={r("junction")} />,
    <Arrow dur={d} x1={580} y1={505} x2={770} y2={660} head={false} width={6} at={r("junction") + 0.15} />,
    <Box dur={d} x={290} y={720} w={170} h={110} label="A" size={60} tone="a" at={r("junction") + 0.3} />,
    <Box dur={d} x={790} y={720} w={170} h={110} label="B" size={60} tone="a" at={r("junction") + 0.45} />,
    <Arrow dur={d} x1={320} y1={775} x2={510} y2={940} head={false} width={6} at={r("road")} />,
    <Arrow dur={d} x1={760} y1={775} x2={570} y2={940} head={false} width={6} at={r("road") + 0.15} />,
    <Box dur={d} x={540} y={1000} w={170} h={110} label="G" size={60} tone="a" at={r("road") + 0.3} />,
    <Label dur={d} text="OR" x={540} y={625} w={200} size={64} color={C.coral} at={r("or")} />,
    <Arrow dur={d} x1={500} y1={505} x2={310} y2={660} head={false} color={C.coral} width={14} at={r("single")} />,
    <Arrow dur={d} x1={320} y1={775} x2={510} y2={940} head={false} color={C.coral} width={14} at={r("single") + 0.2} />,
    <Label dur={d} text="one single path" x={540} y={1110} w={900} size={56} color={C.coral} at={r("path")} />,
    <Box dur={d} x={540} y={1250} w={300} h={120} label="A*" size={72} tone="hot" at={r("This")} />,
  ], { hold: "This is" }),

  // an AND-OR world: dinner = (food AND table), food = (cook OR pizza)
  S("Now think", (r, d) => [
    <Head dur={d} text="host dinner" y={170} size={110} at={0.1} />,
    <Box dur={d} x={540} y={450} w={230} h={110} label="DINNER" size={48} tone="a" at={r("dinner")} />,
    <Arrow dur={d} x1={500} y1={505} x2={340} y2={650} head={false} width={6} at={r("cook")} />,
    <Arrow dur={d} x1={580} y1={505} x2={740} y2={650} head={false} width={6} at={r("table") - 0.3} />,
    <Box dur={d} x={320} y={710} w={210} h={110} label="food" size={50} tone="a" at={r("cook") + 0.15} />,
    <Box dur={d} x={760} y={710} w={250} h={110} label="table" size={50} tone="a" at={r("table") - 0.15} />,
    <Arrow dur={d} x1={470} y1={585} x2={610} y2={585} head={false} color={C.coral} width={8} at={r("Both")} />,
    <Label dur={d} text="AND" x={540} y={615} w={200} size={52} color={C.coral} at={r("Both") + 0.1} />,
    <Arrow dur={d} x1={290} y1={765} x2={190} y2={900} head={false} width={6} at={r("can cook") - 0.2} />,
    <Arrow dur={d} x1={350} y1={765} x2={450} y2={900} head={false} width={6} at={r("pizza") - 0.4} />,
    <Box dur={d} x={170} y={960} w={200} h={110} label="cook" size={48} tone="b" at={r("can cook")} />,
    <Box dur={d} x={470} y={960} w={250} h={110} label="pizza" size={48} tone="b" at={r("pizza") - 0.2} />,
    <Label dur={d} text="OR" x={320} y={845} w={160} size={52} color={C.cobalt} at={r("or")} />,
    <Box dur={d} x={540} y={1200} w={340} h={130} label="AO*" size={76} tone="hot" at={r("world")} />,
    <Label dur={d} text="a mix of AND and OR" x={540} y={1320} w={900} size={52} color={C.coral} at={r("mix")} />,
  ], { hold: "That mix" }),

  S("So the question", (r, d) => [
    <Label dur={d} text="the question wants:" x={540} y={470} w={960} size={74} at={0.15} />,
    <Label dur={d} text="the differences" x={540} y={650} w={960} size={74} color={C.coral} at={r("differences")} />,
    <Box dur={d} x={270} y={900} w={300} h={140} label="A*" size={76} tone="a" at={r("side")} />,
    <Label dur={d} text="vs" x={540} y={910} w={160} size={60} at={r("side") + 0.2} />,
    <Box dur={d} x={810} y={900} w={300} h={140} label="AO*" size={76} tone="b" at={r("side") + 0.3} />,
  ]),

  // A*: OR graph, one path, f = g + h
  S("A star works", (r, d) => [
    <Head dur={d} text="A*" y={170} size={140} sub="OR graph" at={0.1} />,
    <Box dur={d} x={150} y={700} w={170} h={120} label="S" size={60} tone="a" at={r("answer")} />,
    <Arrow dur={d} x1={240} y1={700} x2={450} y2={700} color={C.cobalt} width={8} at={r("path")} />,
    <Box dur={d} x={540} y={700} w={170} h={120} label="n" size={60} tone="a" at={r("path") + 0.2} />,
    <Arrow dur={d} x1={630} y1={700} x2={840} y2={700} color={C.cobalt} width={8} at={r("path") + 0.4} />,
    <Box dur={d} x={930} y={700} w={170} h={120} label="G" size={60} tone="hot" at={r("goal")} />,
    <Label dur={d} text="one path" x={540} y={850} w={600} size={50} color={C.coral} at={r("goal") + 0.2} />,
    <Box dur={d} x={540} y={1010} w={760} h={130} label="f = g + h" size={72} tone="a" at={r("equals")} />,
    <Label dur={d} text="g = cost so far" x={345} y={590} w={400} size={40} color={C.cobalt} at={r("cost")} />,
    <Label dur={d} text="h = guess to go" x={735} y={590} w={400} size={40} color={C.coral} at={r("estimated")} />,
  ], { hold: "to go" }),

  // AO*: AND-OR graph, solution graph, AND cost = sum, back-up
  S("A o star works", (r, d) => [
    <Head dur={d} text="AO*" y={170} size={140} sub="AND-OR graph" at={0.1} />,
    <Box dur={d} x={540} y={450} w={190} h={120} label="P" sub="cost ?" size={56} tone="a" at={r("works")} out={r("revises") + 1.2} />,
    <Box dur={d} x={540} y={450} w={190} h={120} label="P" sub="cost 7" size={56} tone="hot" at={r("revises") + 1.2} />,
    <Arrow dur={d} x1={500} y1={510} x2={200} y2={650} head={false} width={6} at={r("graph")} />,
    <Arrow dur={d} x1={540} y1={510} x2={560} y2={650} head={false} width={6} at={r("graph") + 0.15} />,
    <Arrow dur={d} x1={590} y1={510} x2={880} y2={650} head={false} width={6} at={r("graph") + 0.3} />,
    <Box dur={d} x={180} y={710} w={170} h={110} label="X" sub="9" size={54} tone="a" at={r("graph") + 0.4} />,
    <Box dur={d} x={560} y={710} w={170} h={110} label="Y" sub="3" size={54} tone="a" at={r("graph") + 0.55} />,
    <Box dur={d} x={900} y={710} w={170} h={110} label="Z" sub="4" size={54} tone="a" at={r("graph") + 0.7} />,
    <Arrow dur={d} x1={548} y1={580} x2={740} y2={580} head={false} color={C.coral} width={8} at={r("graph") + 0.9} />,
    <Label dur={d} text="AND" x={740} y={600} w={140} size={44} color={C.coral} at={r("graph") + 1.0} />,
    <Label dur={d} text="OR" x={330} y={580} w={140} size={44} color={C.cobalt} at={r("graph") + 1.0} />,
    <Arrow dur={d} x1={540} y1={510} x2={560} y2={650} head={false} color={C.coral} width={14} at={r("solution")} />,
    <Arrow dur={d} x1={590} y1={510} x2={880} y2={650} head={false} color={C.coral} width={14} at={r("solution") + 0.2} />,
    <Label dur={d} text="solution graph: every branch of the AND" x={540} y={900} w={980} size={44} color={C.coral} at={r("includes")} />,
    <Label dur={d} text="3 + 4 = 7" x={540} y={1010} w={900} size={80} color={C.coral} at={r("sum")} />,
    <Label dur={d} text="cost of an AND = sum of its children" x={540} y={1110} w={980} size={42} at={r("children")} />,
    <Label dur={d} text="revise the costs back up" x={540} y={1210} w={980} size={50} color={C.cobalt} at={r("revises")} />,
  ], { hold: "up to its parents" }),

  S("Both are optimal", (r, d) => [
    <Box dur={d} x={300} y={640} w={320} h={140} label="A*" size={76} tone="a" at={0.15} />,
    <Box dur={d} x={780} y={640} w={320} h={140} label="AO*" size={76} tone="b" at={0.3} />,
    <Check dur={d} x={300} y={800} size={110} at={r("optimal")} />,
    <Check dur={d} x={780} y={800} size={110} at={r("optimal") + 0.2} />,
    <Label dur={d} text="optimal if h never over-estimates" x={540} y={960} w={980} size={50} color={C.coral} at={r("heuristic")} />,
  ]),

  // the exam answer as a table
  S("So in your exam", (r, d) => {
    const t = [r("Graph"), r("Solution"), r("Cost"), r("Update"), r("Use")];
    return [
      ...Table({ dur: d, x: 40, y: 290, w: 1000, cols: ["", "A*", "AO*"], rowH: 150, fs: 36, at: 0.1,
        rows: [["Graph", "OR graph", "AND-OR graph"], ["Solution", "a path", "solution graph"], ["Cost", "f = g + h", "AND = sum"], ["Update", "none", "back revision"], ["Use", "pathfinding", "decomposition"]],
        cellAt: t.map(x => [x, x + 0.5, x + 1.3]) }),
    ];
  }, { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  S("To remember", (r, d) => [
    <Ico dur={d} ctx={ctx} name="route" x={170} y={500} size={130} color={C.cobalt} at={r("walks") - 0.2} />,
    <Label dur={d} text="A* walks a path" x={640} y={475} w={800} size={64} color={C.cobalt} at={r("walks")} />,
    <Ico dur={d} ctx={ctx} name="network" x={170} y={720} size={130} color={C.coral} at={r("builds") - 0.2} />,
    <Label dur={d} text="AO* builds a plan" x={640} y={695} w={800} size={64} color={C.coral} at={r("builds")} />,
    <Label dur={d} text="5 marks" x={540} y={1000} w={900} size={150} color={C.coral} at={r("Five")} />,
    <Check dur={d} x={540} y={1380} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 1000, z: 1.06 }] }),
];
