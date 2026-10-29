import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const ROOMS = [[365, 765], [545, 765], [725, 765], [455, 935], [635, 935]];
  const house = (d, at) => Sketch({ dur: d, at, speed: 4200, items: [{ line: [240, 660, 540, 460] }, { line: [540, 460, 840, 660] }, { rect: [260, 660, 560, 400] }] });
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Should a class be declared abstract if it does not define every method inherited from an interface?", n: 8, marks: 2, y: 460 }),
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "interface", x: 540, y: 780, z: 1.05 }] }),
    // 2a. an interface is a contract: a list of methods the class promises to write
    S("let's start", (r, d) => [
      <Head dur={d} text="interface" y={190} size={170} sub="a contract" />,
      ...Sketch({ dur: d, at: r("contract"), speed: 3400, items: [{ rect: [160, 500, 760, 480], divider: [90], label: "interface House", size: 42 }] }),
      ...Sketch({ dur: d, at: r("list"), speed: 3000, items: [
        { text: "void kitchen();", x: 210, y: 610, size: 42, w: 600, align: "left" }, { text: "void bedroom();", x: 210, y: 690, size: 42, w: 600, align: "left" },
        { text: "void bath();", x: 210, y: 770, size: 42, w: 600, align: "left" }, { text: "void hall();", x: 210, y: 850, size: 42, w: 600, align: "left" },
        { text: "void roof();", x: 210, y: 930 - 10, size: 42, w: 600, align: "left" } ] }),
      <Box dur={d} x={540} y={1190} w={420} h={120} label="class Home" tone="b" at={r("class")} />,
      <Arrow dur={d} x1={540} y1={1125} x2={540} y2={995} color={C.coral} width={9} at={r("promises")} />,
    ], { hold: "write", holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "list", x: 540, y: 840, z: 1.03 }] }),
    // 2b. analogy: a builder signs to build a house with five rooms
    S("think of a builder", (r, d) => [
      <Head dur={d} text="builder" y={190} size={170} />,
      ...house(d, r("builder") + 0.2),
      ...Sketch({ dur: d, at: r("five") - 0.2, speed: 4200, items: ROOMS.map(([x, y], i) => ({ rect: [x - 75, y - 65, 150, 130], label: String(i + 1), size: 44 })) }),
    ], { hold: "rooms", holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "house", x: 540, y: 840, z: 1.03 }] }),
    // 2c. only three rooms: the house is incomplete
    S("if the builder", (r, d) => [
      <Head dur={d} text="unfinished" y={190} size={170} />,
      ...house(d, 0.2),
      <Box dur={d} x={365} y={765} w={150} h={130} label="1" at={r("finishes")} />,
      <Box dur={d} x={545} y={765} w={150} h={130} label="2" at={r("only")} />,
      <Box dur={d} x={725} y={765} w={150} h={130} label="3" at={r("three")} />,
      <Label dur={d} text="?" x={455} y={900} w={150} size={80} color={C.coral} at={r("rooms")} />,
      <Label dur={d} text="?" x={635} y={900} w={150} size={80} color={C.coral} at={r("rooms") + 0.2} />,
      ...Sketch({ dur: d, at: r("incomplete") - 0.6, items: [{ text: "house is incomplete", x: 540, y: 1200, size: 56, w: 980, color: C.coral }] }),
    ], { hold: "incomplete", holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "three", x: 540, y: 880, z: 1.03 }] }),
    // 3. what the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 520, size: 72, w: 960 },
        { text: "1.  yes or no", x: 150, y: 720, size: 60, w: 800, align: "left", at: r("yes") },
        { text: "2.  why", x: 150, y: 880, size: 60, w: 800, align: "left", at: r("why") } ] }),
      <Check dur={d} x={95} y={755} size={80} at={r("yes") + 1.0} />,
      <Check dur={d} x={95} y={915} size={80} at={r("why") + 0.5} />,
    ]),
    // 4a. YES: an unfinished class cannot make objects, so mark it abstract
    S("the answer is", (r, d) => [
      <Head dur={d} text="YES" y={190} size={260} />,
      <Box dur={d} x={540} y={720} w={560} h={130} label="class Home" tone="b" at={r("unfinished")} />,
      <Label dur={d} text="new Home();" x={540} y={900} w={800} size={56} font={C.fMono} at={r("make")} />,
      <XMark dur={d} x={540} y={935} size={110} at={r("objects")} />,
      <Arrow dur={d} x1={540} y1={1010} x2={540} y2={1115} color={C.coral} width={9} at={r("java")} />,
      <Box dur={d} x={540} y={1200} w={780} h={140} label="abstract class Home" tone="hot" at={r("abstract") - 0.3} />,
    ], { hold: "abstract", holdY: 900, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "make", x: 540, y: 900, z: 1.03 }] }),
    // 4b. an abstract class may leave methods undefined, but gets no objects; a child finishes the job
    S("an abstract class may", (r, d) => [
      <Head dur={d} text="abstract" y={190} size={170} />,
      ...Sketch({ dur: d, at: 0.3, speed: 3400, items: [{ rect: [160, 500, 760, 330], divider: [90], label: "abstract class Home", size: 40 }] }),
      ...Sketch({ dur: d, at: r("leave"), items: [{ text: "void hall() { }", x: 210, y: 610, size: 42, w: 600, align: "left" }, { text: "void roof();", x: 210, y: 700, size: 42, w: 600, align: "left", color: C.coral }] }),
      <Label dur={d} text="new Home();" x={790} y={910} w={400} size={52} font={C.fMono} at={r("but")} />,
      <XMark dur={d} x={790} y={940} size={100} at={r("objects")} />,
      <Box dur={d} x={540} y={1260} w={460} h={120} label="class Villa" tone="b" at={r("child")} />,
      <Arrow dur={d} x1={540} y1={1195} x2={540} y2={845} color={C.coral} width={9} at={r("must")} />,
      ...Sketch({ dur: d, at: r("finish"), items: [{ text: "finishes roof()", x: 540, y: 1390, size: 52, w: 900, color: C.coral }] }),
    ], { hold: "job", holdY: 900, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "child", x: 540, y: 960, z: 1.03 }] }),
    // 5. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 200, fs: 36, title: "WRITE THIS · 2 MARKS", points: [
        "Yes. A class that does not implement all the interface methods must be declared abstract.",
        "It cannot be instantiated, and a subclass must implement the rest." ],
        times: [r("yes"), r("cannot")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 6. memory trick + payoff
    S("remember", (r, d) => [
      <Head dur={d} text="unfinished = abstract" y={190} size={120} />,
      <Ico dur={d} ctx={ctx} name="hard-hat" x={540} y={700} size={280} color={C.coral} at={r("unfinished") - 0.4} />,
      <Mascot dur={d} size={200} tag="Home" pts={[{ t: 0, x: 540, y: 1060, look: [0, -1] }, { t: r("two"), x: 540, y: 1060, look: [0, 0], mood: "happy" }]} />,
      ...Sketch({ dur: d, at: r("two"), items: [{ text: "2 marks", x: 540, y: 1200, size: 120, w: 900 }] }),
      <Check dur={d} x={540} y={1400} size={110} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "abstract", x: 540, y: 880, z: 1.02 }] }),
  ];
};
