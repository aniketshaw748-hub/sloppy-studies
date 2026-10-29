import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Why do we crash critical activities?", n: 2, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "critical", x: 540, y: 780, z: 1.06 }] }),
  // 2. from zero: a project = chains of activities; the longest chain = critical path
  S("let's start", (r, d) => [
    <Box dur={d} x={170} y={700} w={190} h={130} label="4 days" size={46} at={0.15} />,
    <Arrow dur={d} x1={270} y1={700} x2={320} y2={700} at={0.4} />,
    <Box dur={d} x={420} y={700} w={190} h={130} label="6 days" size={46} at={0.5} />,
    <Arrow dur={d} x1={520} y1={700} x2={570} y2={700} at={0.75} />,
    <Box dur={d} x={670} y={700} w={190} h={130} label="3 days" size={46} at={0.85} />,
    <Box dur={d} x={170} y={1000} w={190} h={130} label="3 days" size={46} at={1.2} />,
    <Arrow dur={d} x1={270} y1={1000} x2={320} y2={1000} at={1.45} />,
    <Box dur={d} x={420} y={1000} w={190} h={130} label="5 days" size={46} at={1.55} />,
    <Label dur={d} text="= 13 days" x={925} y={672} w={240} size={44} color={C.coral} at={r("whole")} />,
    <Label dur={d} text="= 8 days" x={925} y={972} w={240} size={44} at={r("whole") + 0.4} />,
    ...Sketch({ dur: d, at: r("that longest"), speed: 3200, color: C.coral, items: [{ rect: [50, 600, 980, 200] }] }),
    <Label dur={d} text="CRITICAL PATH" x={540} y={465} w={900} size={84} color={C.coral} at={r("called")} />,
    <Label dur={d} text="the longest chain" x={540} y={1180} w={900} size={56} at={r("that longest") + 0.5} />,
  ], { hold: "critical path", holdY: 850, cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "whole", x: 540, y: 850, z: 1.03 }] }),
  // 3. analogy: friends, different roads, same wedding
  S("think of friends", (r, d) => [
    <Box dur={d} x={140} y={820} w={170} h={520} label="HOME" size={40} at={0.15} />,
    <Box dur={d} x={940} y={820} w={170} h={520} label="WEDDING" size={32} at={0.3} />,
    <Arrow dur={d} x1={235} y1={660} x2={845} y2={660} at={r("friends")} />,
    <Arrow dur={d} x1={235} y1={820} x2={845} y2={820} at={r("friends") + 0.15} />,
    <Arrow dur={d} x1={235} y1={980} x2={845} y2={980} at={r("friends") + 0.3} />,
    <Mascot dur={d} on size={100} tag="1" at={0.5} pts={[{ t: 0.5, x: 320, y: 660, look: [1, 0] }, { t: r("each"), x: 320, y: 660, look: [1, 0] }, { t: r("each") + 1.9, x: 770, y: 660, look: [1, 0], mood: "happy" }, { t: r("only"), x: 770, y: 660, look: [1, 1], mood: "think" }]} />,
    <Mascot dur={d} on size={100} tag="2" at={0.5} pts={[{ t: 0.5, x: 320, y: 820, look: [1, 0] }, { t: r("each"), x: 320, y: 820, look: [1, 0] }, { t: r("each") + 3.1, x: 770, y: 820, look: [1, 0], mood: "happy" }, { t: r("only"), x: 770, y: 820, look: [1, 0], mood: "think" }]} />,
    <Mascot dur={d} on size={100} tag="3" at={0.5} pts={[{ t: 0.5, x: 320, y: 980, look: [1, 0] }, { t: r("each"), x: 320, y: 980, look: [1, 0] }, { t: r("arrives") + 0.2, x: 770, y: 980, look: [1, 0], mood: "happy" }]} />,
    <Check dur={d} x={940} y={500} size={90} at={r("arrives") + 0.4} />,
    <Label dur={d} text="the SLOWEST road decides" x={540} y={1160} w={940} size={60} color={C.coral} at={r("slowest")} />,
  ], { hold: "slowest road", holdY: 850, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "arrives", x: 540, y: 850, z: 1.03 }] }),
  // 4. critical activities have no spare time (float = 0)
  S("activities on that", (r, d) => [
    <Box dur={d} x={510} y={640} w={780} h={120} label="CRITICAL · 13 days" size={52} tone="hot" at={0.15} />,
    <Box dur={d} x={360} y={900} w={480} h={120} label="OTHER · 8 days" size={48} at={0.4} />,
    ...Sketch({ dur: d, at: 0.7, speed: 3000, items: [
      { line: [610, 850, 900, 850], dashed: true }, { line: [900, 850, 900, 950], dashed: true }, { line: [900, 950, 610, 950], dashed: true }, { line: [610, 950, 610, 850], dashed: true } ] }),
    <Arrow dur={d} x1={940} y1={560} x2={940} y2={1000} head={false} color={C.coral} width={8} at={r("critical")} />,
    <Label dur={d} text="PROJECT END" x={860} y={490} w={260} size={38} at={r("critical")} />,
    <Label dur={d} text="spare time: ZERO" x={420} y={735} w={720} size={52} color={C.coral} at={r("have")} />,
    <Label dur={d} text="spare = float" x={755} y={1000} w={380} size={44} color={C.coral} at={r("no float")} />,
  ], { hold: "no spare", holdY: 760, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "have", x: 540, y: 800, z: 1.03 }] }),
  // 5. crashing = shorter, by paying extra
  S("now crashing", (r, d) => [
    <Head dur={d} text="CRASHING" y={180} size={130} sub="shorter, by paying extra" />,
    <Box dur={d} x={480} y={640} w={720} h={110} label="NORMAL · 12 days" size={48} at={0.4} />,
    <Box dur={d} x={360} y={890} w={480} h={110} label="CRASHED · 8 days" size={46} tone="hot" at={r("shorter")} />,
    <Arrow dur={d} x1={780} y1={705} x2={660} y2={825} at={r("paying")} color={C.coral} />,
    <Label dur={d} text="pay more" x={900} y={745} w={300} size={42} color={C.coral} at={r("paying")} />,
    <Ico dur={d} ctx={ctx} name="users" x={200} y={1130} size={110} at={r("workers")} />,
    <Label dur={d} text="more workers" x={200} y={1200} w={330} size={40} at={r("workers")} />,
    <Ico dur={d} ctx={ctx} name="cog" x={540} y={1130} size={110} at={r("machines")} />,
    <Label dur={d} text="more machines" x={540} y={1200} w={330} size={40} at={r("machines")} />,
    <Ico dur={d} ctx={ctx} name="clock" x={880} y={1130} size={110} at={r("overtime")} />,
    <Label dur={d} text="overtime" x={880} y={1200} w={330} size={40} at={r("overtime")} />,
  ], { hold: "overtime", holdY: 850, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "workers", x: 540, y: 860, z: 1.03 }] }),
  // 6. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  what crashing is", x: 190, y: 720, size: 56, w: 860, align: "left", at: r("what crashing") },
      { text: "2.  why only critical ones", x: 190, y: 880, size: 56, w: 860, align: "left", at: r("why") } ] }),
    <Check dur={d} x={125} y={755} size={80} at={r("what crashing") + 0.9} />,
    <Check dur={d} x={125} y={915} size={80} at={r("why") + 1.0} />,
  ]),
  // 7a. crash a non-critical activity: wasted money
  S("here is the reason", (r, d) => [
    <Box dur={d} x={510} y={620} w={780} h={110} label="CRITICAL · 13 days" size={50} tone="hot" at={0.15} />,
    <Arrow dur={d} x1={940} y1={540} x2={940} y2={1060} head={false} color={C.coral} width={8} at={0.3} />,
    <Label dur={d} text="END" x={940} y={480} w={140} size={40} at={0.3} />,
    <Box dur={d} x={360} y={800} w={480} h={110} label="OTHER · 8 days" size={48} at={r("suppose")} />,
    <Arrow dur={d} x1={360} y1={865} x2={320} y2={920} at={r("speed")} color={C.coral} />,
    <Box dur={d} x={300} y={990} w={360} h={110} label="FASTER · 6" size={46} tone="hot" at={r("speed") + 0.2} />,
    <Label dur={d} text="project still ends on day 13" x={540} y={1130} w={960} size={52} at={r("not finish")} />,
    <XMark dur={d} x={570} y={990} size={70} at={r("only wasted")} />,
    <Label dur={d} text="money wasted" x={540} y={1230} w={800} size={84} color={C.coral} at={r("only wasted")} />,
  ], { hold: "only wasted", holdY: 850, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "speed", x: 540, y: 850, z: 1.03 }] }),
  // 7b. crash a critical activity: the whole project ends sooner
  S("but speed up", (r, d) => [
    <Box dur={d} x={510} y={620} w={780} h={110} label="was 13 days" size={50} tone="ghost" at={0.15} />,
    ...Sketch({ dur: d, at: 0.3, speed: 3200, items: [{ line: [940, 540, 940, 1060], dashed: true }] }),
    <Box dur={d} x={390} y={820} w={540} h={110} label="CRASHED · 9 days" size={50} tone="hot" at={0.5} />,
    <Arrow dur={d} x1={700} y1={540} x2={700} y2={1060} head={false} color={C.cobalt} width={8} at={r("whole")} />,
    <Label dur={d} text="NEW END" x={700} y={480} w={240} size={40} at={r("whole")} />,
    <Arrow dur={d} x1={935} y1={1000} x2={705} y2={1000} at={r("every")} color={C.coral} />,
    <Label dur={d} text="4 days saved" x={835} y={1030} w={300} size={44} color={C.coral} at={r("every") + 0.2} />,
    <Label dur={d} text="OLD END" x={930} y={480} w={190} size={36} at={0.4} />,
    <Check dur={d} x={700} y={1180} size={100} at={r("overall")} />,
  ], { hold: "every day", holdY: 850, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "whole", x: 540, y: 850, z: 1.03 }] }),
  // 8. why we want a shorter project: four reasons
  S("so we crash", (r, d) => [
    <Head dur={d} text="SHORTER PROJECT" y={170} size={94} />,
    <Ico dur={d} ctx={ctx} name="calendar-check" x={170} y={500} size={110} at={r("deadline")} />,
    <Box dur={d} x={640} y={500} w={700} h={120} label="MEET THE DEADLINE" size={48} at={r("deadline")} />,
    <Ico dur={d} ctx={ctx} name="triangle-alert" x={170} y={690} size={110} color={C.coral} at={r("penalty")} />,
    <Box dur={d} x={640} y={690} w={700} h={120} label="AVOID A DELAY PENALTY" size={48} at={r("penalty")} />,
    <Ico dur={d} ctx={ctx} name="trophy" x={170} y={880} size={110} at={r("bonus")} />,
    <Box dur={d} x={640} y={880} w={700} h={120} label="EARN AN EARLY BONUS" size={48} at={r("bonus")} />,
    <Ico dur={d} ctx={ctx} name="building-2" x={170} y={1070} size={110} at={r("overhead")} />,
    <Box dur={d} x={640} y={1070} w={700} h={120} label="CUT DAILY OVERHEADS" size={48} at={r("overhead")} />,
  ], { hold: "every single", holdY: 800, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "overhead", x: 540, y: 820, z: 1.03 }] }),
  // 9. cheapest day first; stop when cost beats saving
  S("one more point", (r, d) => [
    <Head dur={d} text="CHEAPEST FIRST" y={170} size={110} sub="each day saved earns Rs 400" />,
    <Box dur={d} x={400} y={640} w={560} h={130} label="A" sub="Rs 200 per day" size={60} at={0.4} />,
    <Box dur={d} x={400} y={840} w={560} h={130} label="B" sub="Rs 500 per day" size={60} at={0.55} />,
    <Box dur={d} x={400} y={1040} w={560} h={130} label="C" sub="Rs 800 per day" size={60} at={0.7} />,
    <Check dur={d} x={800} y={640} size={90} at={r("lowest") + 0.8} />,
    <XMark dur={d} x={800} y={840} size={80} at={r("stop") + 0.1} />,
    <XMark dur={d} x={800} y={1040} size={80} at={r("stop") + 0.4} />,
    <Label dur={d} text="STOP: cost beats saving" x={540} y={1190} w={960} size={60} color={C.coral} at={r("bigger")} />,
  ], { hold: "saving", holdY: 850, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "stop", x: 540, y: 850, z: 1.03 }] }),
  // 10. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
      "Crashing: shortening an activity's time by adding resources at extra cost.",
      "Only critical activities decide the project duration, so only crashing them shortens the project.",
      "Aim: meet deadlines, avoid penalties, save overheads." ],
      times: [r("crashing"), r("only critical"), r("the aim")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 11. memory trick + payoff
  S("and to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "crash the CRITICAL", x: 540, y: 540, size: 80, w: 960 },
      { text: "never the spare", x: 540, y: 680, size: 76, w: 980, color: C.coral, at: r("never") },
      { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("five") } ] }),
    <Check dur={d} x={540} y={1360} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.06 }] }),
];
