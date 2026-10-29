import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question, read out
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "What are concurrent activities?", n: 1, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "activities", x: 540, y: 780, z: 1.06 }] }),
  // 2. from zero: a project = one big job, activities = its small jobs (a house)
  S("let's start", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: 3000, items: [
      { rect: [330, 430, 420, 300] }, { line: [300, 430, 540, 250] }, { line: [540, 250, 780, 430] }, { rect: [490, 570, 100, 160] } ] }),
    ...Sketch({ dur: d, at: r("one big job"), items: [{ text: "PROJECT = one big job", x: 540, y: 790, size: 62, w: 960, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("many small"), speed: 3000, items: [{ line: [470, 430, 470, 570], dashed: true }, { line: [610, 430, 610, 570], dashed: true }] }),
    <Arrow dur={d} x1={440} y1={880} x2={210} y2={975} at={r("dig")} />,
    <Box dur={d} x={210} y={1050} w={280} h={150} label="DIG" size={60} at={r("dig")} />,
    <Arrow dur={d} x1={540} y1={880} x2={540} y2={975} at={r("order")} />,
    <Box dur={d} x={540} y={1050} w={280} h={150} label="ORDER BRICKS" size={44} at={r("order")} />,
    <Arrow dur={d} x1={640} y1={880} x2={870} y2={975} at={r("paint")} />,
    <Box dur={d} x={870} y={1050} w={280} h={150} label="PAINT" size={60} at={r("paint")} />,
    ...Sketch({ dur: d, at: r("each one"), items: [{ text: "each small job = an ACTIVITY", x: 540, y: 1220, size: 62, w: 960, color: C.coral }] }),
  ], { hold: "each one", holdY: 800, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "dig", x: 540, y: 900, z: 1.03 }] }),
  // 3a. some activities depend on each other
  S("now some", (r, d) => [
    <Box dur={d} x={250} y={760} w={380} h={150} label="FOUNDATION" size={54} at={0.15} />,
    <Box dur={d} x={830} y={760} w={380} h={150} label="WALLS" size={60} at={0.3} />,
    <Arrow dur={d} x1={450} y1={760} x2={630} y2={760} at={r("depend")} />,
    <Label dur={d} text="DEPENDENT" x={540} y={900} w={800} size={90} color={C.coral} at={r("depend")} />,
    <Label dur={d} text="walls must wait for the foundation" x={540} y={1030} w={900} size={52} at={r("cannot")} />,
    <XMark dur={d} x={540} y={640} size={90} at={r("before")} />,
  ], { cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "cannot", x: 540, y: 880, z: 1.04 }] }),
  // 3b. but these two are independent: they run at the same time
  S("look at these two", (r, d) => [
    <Box dur={d} x={200} y={620} w={300} h={130} label="DIG" size={60} at={0.15} />,
    <Box dur={d} x={200} y={920} w={300} h={130} label="ORDER BRICKS" size={44} at={0.3} />,
    <Arrow dur={d} x1={380} y1={620} x2={960} y2={620} at={r("digging")} />,
    <Arrow dur={d} x1={380} y1={920} x2={960} y2={920} at={r("ordering")} />,
    <Arrow dur={d} x1={560} y1={700} x2={560} y2={840} head={false} color={C.coral} at={r("does")} />,
    <XMark dur={d} x={560} y={770} size={90} at={r("no")} />,
    <Mascot dur={d} on size={120} tag="DIG" at={0.4} pts={[{ t: 0.4, x: 470, y: 620, look: [1, 1] }, { t: r("does"), x: 470, y: 620, look: [0, 1], mood: "think" }, { t: r("crew"), x: 470, y: 620, look: [1, 0] }, { t: r("same") + 0.3, x: 880, y: 620, look: [1, 0], mood: "happy" }]} />,
    <Mascot dur={d} on size={120} tag="BUY" at={0.4} pts={[{ t: 0.4, x: 470, y: 920, look: [1, -1] }, { t: r("does"), x: 470, y: 920, look: [0, -1], mood: "think" }, { t: r("crew"), x: 470, y: 920, look: [1, 0] }, { t: r("same") + 0.3, x: 880, y: 920, look: [1, 0], mood: "happy" }]} />,
    <Label dur={d} text="SAME TIME" x={540} y={1130} w={900} size={120} color={C.coral} at={r("same")} />,
  ], { hold: "at the same", cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "crew", x: 540, y: 820, z: 1.04 }] }),
  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  what it means", x: 190, y: 720, size: 56, w: 860, align: "left", at: r("what concurrent") },
      { text: "2.  how it looks in a network", x: 190, y: 880, size: 56, w: 860, align: "left", at: r("how it") },
      { text: "3.  why it matters", x: 190, y: 1040, size: 56, w: 860, align: "left", at: r("why it") } ] }),
    <Check dur={d} x={125} y={755} size={80} at={r("what concurrent") + 0.8} />,
    <Check dur={d} x={125} y={915} size={80} at={r("how it") + 0.9} />,
    <Check dur={d} x={125} y={1075} size={80} at={r("why it") + 0.9} />,
  ]),
  // 5. the meaning
  S("first the meaning", (r, d) => [
    <Head dur={d} text="CONCURRENT" y={180} size={118} sub="same time, no dependency" />,
    <Box dur={d} x={135} y={660} w={150} h={120} label="A" size={70} at={0.3} />,
    <Box dur={d} x={135} y={900} w={150} h={120} label="B" size={70} at={0.45} />,
    <Arrow dur={d} x1={225} y1={660} x2={980} y2={660} at={r("carried")} />,
    <Arrow dur={d} x1={225} y1={900} x2={980} y2={900} at={r("carried") + 0.15} />,
    <Mascot dur={d} on size={110} tag="A" at={r("carried")} pts={[{ t: r("carried"), x: 330, y: 660, look: [1, 0] }, { t: r("same time"), x: 330, y: 660, look: [1, 0] }, { t: r("depends"), x: 700, y: 660, look: [1, 0] }, { t: r("parallel") + 0.3, x: 880, y: 660, look: [1, 0], mood: "happy" }]} />,
    <Mascot dur={d} on size={110} tag="B" at={r("carried")} pts={[{ t: r("carried"), x: 330, y: 900, look: [1, 0] }, { t: r("same time"), x: 330, y: 900, look: [1, 0] }, { t: r("depends"), x: 700, y: 900, look: [1, 0] }, { t: r("parallel") + 0.3, x: 880, y: 900, look: [1, 0], mood: "happy" }]} />,
    <Arrow dur={d} x1={540} y1={730} x2={540} y2={830} head={false} color={C.coral} at={r("neither")} />,
    <XMark dur={d} x={540} y={780} size={80} at={r("depends")} />,
    <Label dur={d} text="side by side = in parallel" x={540} y={1060} w={940} size={60} at={r("side by")} />,
    <Label dur={d} text="SAME TIME · NO DEPENDENCY" x={540} y={1220} w={980} size={80} color={C.coral} at={r("means same")} />,
  ], { hold: "means same", cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "neither", x: 540, y: 830, z: 1.04 }] }),
  // 6. in a network: parallel paths between two events
  S("second the network", (r, d) => [
    <Head dur={d} text="IN A NETWORK" y={180} size={118} />,
    <Box dur={d} x={190} y={860} w={210} h={160} label="EVENT" sub="1" size={44} at={0.2} />,
    <Box dur={d} x={540} y={600} w={320} h={120} label="DIG" size={60} at={r("start from") + 0.1} />,
    <Box dur={d} x={540} y={1120} w={320} h={120} label="ORDER" size={60} at={r("start from") + 0.3} />,
    <Arrow dur={d} x1={260} y1={800} x2={380} y2={640} at={r("start from")} />,
    <Arrow dur={d} x1={260} y1={920} x2={380} y2={1080} at={r("start from") + 0.2} />,
    <Box dur={d} x={890} y={860} w={210} h={160} label="EVENT" sub="2" size={44} at={r("meet")} />,
    <Arrow dur={d} x1={700} y1={640} x2={830} y2={800} at={r("meet")} />,
    <Arrow dur={d} x1={700} y1={1080} x2={830} y2={920} at={r("meet") + 0.15} />,
    <Mascot dur={d} on size={100} tag="1" at={r("run")} pts={[{ t: r("run"), x: 170, y: 760, look: [1, -1] }, { t: r("parallel"), x: 170, y: 760, look: [1, -1] }, { t: r("meet"), x: 540, y: 500, look: [1, 0] }, { t: r("later") + 0.4, x: 910, y: 740, look: [1, 0], mood: "happy" }]} />,
    <Mascot dur={d} on size={100} tag="2" at={r("run")} pts={[{ t: r("run"), x: 170, y: 980, look: [1, 1] }, { t: r("parallel"), x: 170, y: 980, look: [1, 1] }, { t: r("meet"), x: 540, y: 1220, look: [1, 0] }, { t: r("later") + 0.4, x: 910, y: 980, look: [1, 0], mood: "happy" }]} />,
    <Ico dur={d} ctx={ctx} name="waves" x={540} y={860} size={130} color={C.coral} at={r("river")} />,
    <Label dur={d} text="a river that splits, then joins again" x={540} y={1330} w={960} size={52} at={r("splits")} />,
  ], { hold: "joins", cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "parallel", x: 540, y: 860, z: 1.04 }] }),
  // 7. why it matters: overlap saves time, longest path decides
  S("third why", (r, d) => [
    <Head dur={d} text="WHY IT MATTERS" y={180} size={108} />,
    <Box dur={d} x={440} y={560} w={600} h={120} label="DIG · 10 days" size={50} at={r("overlap")} />,
    <Box dur={d} x={260} y={740} w={240} h={120} label="ORDER · 4" size={44} at={r("overlap") + 0.15} />,
    <Arrow dur={d} x1={120} y1={1150} x2={980} y2={1150} at={r("overlap")} label="TIME" />,
    <Label dur={d} text="10 + 4 = 14 days" x={540} y={900} w={800} size={70} at={r("sum")} />,
    <XMark dur={d} x={880} y={935} size={100} at={r("not take") + 0.4} />,
    ...Sketch({ dur: d, at: r("longest"), speed: 3200, color: C.coral, items: [{ rect: [115, 480, 650, 160] }] }),
    <Label dur={d} text="PROJECT = 10 DAYS" x={540} y={1260} w={960} size={90} color={C.coral} at={r("just ten") } />,
  ], { hold: "you wait", holdY: 800, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "longest", x: 540, y: 850, z: 1.04 }] }),
  // 8. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
      "Concurrent activities: activities that can be performed simultaneously (at the same time).",
      "They do not depend on each other.",
      "In a network they run along parallel paths.",
      "Doing them together shortens the project; the longest path decides the duration." ],
      times: [r("concurrent"), r("do not"), r("in a network"), r("doing them")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 9. memory trick + payoff
  S("and to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "concurrent =", x: 540, y: 540, size: 80, w: 960 },
      { text: "SAME time, no waiting", x: 540, y: 680, size: 76, w: 980, color: C.coral, at: r("same") },
      { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("five") } ] }),
    <Check dur={d} x={540} y={1360} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.06 }] }),
];
