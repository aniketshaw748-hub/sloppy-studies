import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
const P = 3800; // pen speed
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "What is the purpose of code review? Explain any four benefits of code reviews.", n: 7, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "benefits", x: 540, y: 800, z: 1.04 }] }),
  // 2. from zero: you miss your own typos, a friend spots them
  S("when you write", (r, d) => [
    <Head dur={d} text="your own essay" y={170} size={120} at={0.3} />,
    ...Sketch({ dur: d, at: r("essay"), speed: P, items: [{ rect: [140, 420, 800, 300] }, { text: "teh cat sat down.", x: 540, y: 470, size: 66, w: 760 }] }),
    <Ico dur={d} ctx={ctx} name="brain" x={130} y={850} size={100} at={r("brain")} />,
    ...Sketch({ dur: d, at: r("brain"), speed: P, color: C.cobalt, items: [{ text: "brain reads: the cat", x: 600, y: 810, size: 50, w: 700, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("wrote"), speed: P, color: C.coral, items: [{ text: "page says: teh cat", x: 600, y: 915, size: 50, w: 700, color: C.coral }] }),
    <Ico dur={d} ctx={ctx} name="user-round" x={150} y={1110} size={120} color={C.cobalt} at={r("friend")} />,
    <Ico dur={d} ctx={ctx} name="search" x={290} y={1100} size={90} color={C.cobalt} at={r("friend") + 0.3} />,
    <Ring dur={d} x={300} y={520} r={75} at={r("spots")} />,
    ...Sketch({ dur: d, at: r("typos"), speed: P, color: C.coral, items: [{ text: "typo!", x: 300, y: 625, size: 46, w: 240, color: C.coral }, { text: "a friend sees it", x: 650, y: 1100, size: 54, w: 640, color: C.coral }] }),
  ], { hold: "a minute", holdY: 940, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "brain", x: 540, y: 930, z: 1.03 }, { t: "friend", x: 540, y: 960, z: 1.03 }] }),
  // 3. code review = that, for programs
  S("code review is exactly", (r, d) => [
    <Head dur={d} text="code review" y={170} size={130} at={0.3} />,
    ...Sketch({ dur: d, at: r("when") - 0.2, speed: P, items: [{ text: "author's code", x: 230, y: 360, size: 46, w: 340 }, { rect: [60, 440, 340, 260] }, { text: "total = a - b", x: 230, y: 480, size: 40, w: 300 }, { text: "return total", x: 230, y: 560, size: 40, w: 300 }] }),
    <Ico dur={d} ctx={ctx} name="bug" x={335} y={655} size={56} color={C.coral} at={r("when") + 1.0} on />,
    <Ico dur={d} ctx={ctx} name="user-round" x={480} y={440} size={90} color={C.cobalt} at={r("teammates")} />,
    <Ico dur={d} ctx={ctx} name="user-round" x={610} y={440} size={90} color={C.cobalt} at={r("teammates") + 0.3} />,
    <Ico dur={d} ctx={ctx} name="search" x={545} y={660} size={80} color={C.cobalt} at={r("read")} />,
    ...Sketch({ dur: d, at: r("before"), speed: P, items: [{ line: [400, 570, 680, 570], arrow: true, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("main"), speed: P, items: [{ rect: [680, 440, 340, 260], label: "main project", size: 46 }] }),
    ...Sketch({ dur: d, at: r("project") + 0.3, speed: P, color: C.coral, items: [{ text: "check it BEFORE it joins", x: 540, y: 880, size: 64, w: 980, color: C.coral }] }),
  ], { hold: "main project", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "teammates", x: 540, y: 910, z: 1.03 }] }),
  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: P, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  the purpose", x: 150, y: 720, size: 60, w: 860, align: "left", at: r("purpose") },
      { text: "2.  four benefits", x: 150, y: 880, size: 60, w: 840, align: "left", at: r("four") } ] }),
    <Check dur={d} x={95} y={755} size={80} at={r("purpose") + 0.9} />, <Check dur={d} x={95} y={915} size={80} at={r("four") + 0.9} />,
  ]),
  // 5. the purpose: find defects early
  S("the purpose is to find", (r, d) => [
    <Head dur={d} text="the purpose" y={170} size={120} at={0.3} />,
    ...Sketch({ dur: d, at: 0.3, speed: P, items: [{ rect: [50, 560, 200, 110], label: "write", size: 44 }, { line: [250, 615, 310, 615], arrow: true }, { rect: [310, 560, 200, 110], label: "review", size: 44, tone: "hot" }] }),
    <Ico dur={d} ctx={ctx} name="search" x={380} y={430} size={90} color={C.cobalt} at={r("defects")} />,
    <Ico dur={d} ctx={ctx} name="bug" x={470} y={440} size={80} color={C.coral} at={r("defects") + 0.3} />,
    ...Sketch({ dur: d, at: r("early"), speed: P, color: C.coral, items: [{ text: "EARLY", x: 410, y: 700, size: 56, w: 300, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("tested"), speed: P, items: [{ line: [510, 615, 570, 615], arrow: true }, { rect: [570, 560, 200, 110], label: "test", size: 44 }] }),
    ...Sketch({ dur: d, at: r("released"), speed: P, items: [{ line: [770, 615, 830, 615], arrow: true }, { rect: [830, 560, 200, 110], label: "release", size: 44 }] }),
    ...Sketch({ dur: d, at: r("improve"), speed: P, color: C.cobalt, items: [{ text: "find defects + better quality", x: 540, y: 810, size: 54, w: 980, color: C.cobalt }] }),
    <Ico dur={d} ctx={ctx} name="eye" x={440} y={1010} size={110} at={r("second")} />,
    <Ico dur={d} ctx={ctx} name="eye" x={640} y={1010} size={110} at={r("second") + 0.3} />,
    ...Sketch({ dur: d, at: r("pair"), speed: P, items: [{ text: "a second pair of eyes", x: 540, y: 1110, size: 60, w: 980 }] }),
  ], { hold: "it ships", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "defects", x: 540, y: 910, z: 1.03 }] }),
  // 6. benefit 1: early bug detection
  S("benefit 1", (r, d) => [
    <Head dur={d} text="1 · early bugs" y={170} size={110} at={0.3} />,
    ...Sketch({ dur: d, at: 0.3, speed: P, items: [{ line: [150, 1150, 930, 1150] }, { line: [150, 1150, 150, 470], arrow: true }, { text: "cost", x: 150, y: 400, size: 50, w: 200, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("review"), speed: P, items: [{ rect: [250, 1030, 200, 120], label: "$", size: 64 }, { text: "found in review", x: 350, y: 1180, size: 40, w: 360 }] }),
    ...Sketch({ dur: d, at: r("users"), speed: P, items: [{ rect: [650, 560, 200, 590], label: "$$$$$", size: 56 }, { text: "found by users", x: 750, y: 1180, size: 40, w: 360 }] }),
  ], { hold: "a lot", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "users", x: 540, y: 930, z: 1.03 }] }),
  // 7. benefit 2: better code quality
  S("benefit 2", (r, d) => [
    <Head dur={d} text="2 · quality" y={170} size={110} at={0.3} />,
    ...Sketch({ dur: d, at: 0.3, speed: P, items: [{ text: "messy", x: 270, y: 400, size: 54, w: 380, color: C.coral }, { rect: [60, 500, 420, 340] },
      { text: "x=a+b;y=x*2;", x: 270, y: 545, size: 36, w: 400 }, { text: "if(q)z=1;else z=0", x: 280, y: 630, size: 36, w: 400 }, { text: "foo(x,y,q,z)", x: 262, y: 715, size: 36, w: 400 }] }),
    <Ico dur={d} ctx={ctx} name="search" x={540} y={590} size={70} color={C.cobalt} at={r("reviewers")} />,
    ...Sketch({ dur: d, at: r("keep"), speed: P, items: [{ line: [480, 680, 600, 680], arrow: true, color: C.cobalt }, { text: "review", x: 540, y: 705, size: 34, w: 130, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("clean"), speed: P, items: [{ text: "clean", x: 810, y: 400, size: 54, w: 380, color: C.cobalt }, { rect: [600, 500, 420, 340] },
      { text: "total = a + b", x: 810, y: 545, size: 36, w: 400 }, { text: "if (paid) {", x: 810, y: 630, size: 36, w: 400 }, { text: "ship(order)", x: 810, y: 715, size: 36, w: 400 }] }),
    <Check dur={d} x={930} y={800} size={60} at={r("readable") + 0.5} />,
    ...Sketch({ dur: d, at: r("team's"), speed: P, color: C.cobalt, items: [{ text: "clean + readable + team standards", x: 540, y: 950, size: 52, w: 1000, color: C.cobalt }] }),
  ], { hold: "standards", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "clean", x: 540, y: 910, z: 1.03 }] }),
  // 8. benefit 3: knowledge sharing
  S("benefit 3", (r, d) => [
    <Head dur={d} text="3 · knowledge" y={170} size={110} at={0.3} />,
    ...Sketch({ dur: d, at: 0.3, speed: P, items: [{ rect: [400, 740, 280, 160], label: "code", size: 50 }] }),
    <Ico dur={d} ctx={ctx} name="user-round" x={170} y={820} size={120} at={r("author")} />,
    ...Sketch({ dur: d, at: r("author"), speed: P, items: [{ text: "author", x: 170, y: 905, size: 42, w: 240 }, { line: [250, 820, 395, 820], arrow: true }] }),
    <Ico dur={d} ctx={ctx} name="user-round" x={910} y={820} size={120} color={C.cobalt} at={r("reviewer")} />,
    ...Sketch({ dur: d, at: r("reviewer"), speed: P, color: C.cobalt, items: [{ text: "reviewer", x: 910, y: 905, size: 42, w: 240, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("learns"), speed: P, color: C.coral, items: [{ line: [840, 660, 250, 660], arrow: true, dashed: true, color: C.coral, label: "tips", size: 42 }] }),
    ...Sketch({ dur: d, at: r("learns the"), speed: P, color: C.cobalt, items: [{ line: [835, 820, 685, 820], arrow: true, dashed: true, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("nobody"), speed: P, color: C.coral, items: [{ text: "two people know it", x: 540, y: 1040, size: 62, w: 980, color: C.coral }] }),
  ], { hold: "understands it", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "learns", x: 540, y: 910, z: 1.03 }] }),
  // 9. benefit 4: team ownership
  S("benefit 4", (r, d) => [
    <Head dur={d} text="4 · ownership" y={170} size={110} at={0.3} />,
    ...Sketch({ dur: d, at: 0.3, speed: P, items: [{ rect: [390, 770, 300, 160], label: "code", size: 50 }] }),
    ...[[170, 570], [910, 570], [170, 1130], [910, 1130]].map(([x, y], i) => <Ico key={i} dur={d} ctx={ctx} name="user-round" x={x} y={y} size={110} color={C.cobalt} at={r("team") + 0.2 * i} />),
    ...Sketch({ dur: d, at: r("belongs"), speed: P, color: C.coral, items: [{ text: "OUR code", x: 540, y: 640, size: 60, w: 600, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("anyone"), speed: P, color: C.cobalt, items: [{ line: [235, 625, 385, 775], arrow: true, color: C.cobalt }, { line: [845, 625, 695, 775], arrow: true, color: C.cobalt }, { line: [235, 1075, 385, 925], arrow: true, color: C.cobalt }, { line: [845, 1075, 695, 925], arrow: true, color: C.cobalt }] }),
  ], { hold: "take it over", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "anyone", x: 540, y: 920, z: 1.03 }] }),
  // 10. recap of the four
  S("so cheaper bugs", (r, d) => [
    ...[["bug-off", "cheaper bugs", "cheaper", 560], ["sparkles", "cleaner code", "cleaner", 720], ["book-open", "shared knowledge", "shared knowledge", 880], ["users", "shared ownership", "shared ownership", 1040]].flatMap(([ic, t, cue, y]) => [
      <Ico key={ic} dur={d} ctx={ctx} name={ic} x={130} y={y + 40} size={100} color={C.cobalt} at={r(cue) - 0.1} />,
      ...Sketch({ dur: d, at: r(cue), speed: P, items: [{ text: t, x: 230, y, size: 64, w: 780, align: "left" }] }) ]),
  ]),
  // 11. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
      "Purpose: to find defects and improve code quality early, before testing or release.",
      "Benefit 1: early bug detection. Bugs are cheaper to fix in review.",
      "Benefit 2: better quality. Clean, readable code that follows team standards.",
      "Benefit 3: knowledge sharing. Author and reviewer both learn the code.",
      "Benefit 4: team ownership. Anyone can maintain the code." ],
      times: [r("purpose"), r("early bug"), r("better"), r("knowledge"), r("team")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 12. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: P, items: [
      { text: "bugs", x: 540, y: 470, size: 74, w: 900 }, { text: "quality", x: 540, y: 590, size: 74, w: 900, at: r("quality") },
      { text: "knowledge", x: 540, y: 710, size: 74, w: 900, at: r("knowledge") }, { text: "ownership", x: 540, y: 830, size: 74, w: 900, at: r("ownership") },
      { line: [140, 950, 940, 950], color: C.coral }, { text: "5 marks", x: 540, y: 1010, size: 150, w: 900, at: r("five") } ] }),
    <Check dur={d} x={540} y={1400} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 780, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.05 }] }),
];
