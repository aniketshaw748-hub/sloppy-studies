import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "What is the full form of GOLF? (inventory classification: Government, Ordinary, Local, Foreign)", n: 3, marks: 5, y: 520 }),
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "foreign", x: 540, y: 760, z: 1.05 }] }),
  // 2. from zero: inventory = the stock a company keeps, from many places
  S("let's start", (r, d) => [
    <Head dur={d} text="INVENTORY" y={170} size={130} sub="the stock a company keeps" />,
    ...Sketch({ dur: d, at: 0.4, speed: 3200, items: [
      { line: [150, 880, 930, 880] }, { line: [150, 1100, 930, 1100] }, { line: [170, 640, 170, 1100] }, { line: [910, 640, 910, 1100] } ] }),
    ...[270, 450, 630, 810].map((x, i) => <Ico key={"a" + i} dur={d} ctx={ctx} name="package" x={x} y={805} size={130} at={r("stock") + i * 0.2} />),
    ...[270, 450, 630, 810].map((x, i) => <Ico key={"b" + i} dur={d} ctx={ctx} name="package" x={x} y={1025} size={130} at={r("stock") + 0.8 + i * 0.2} />),
    <Label dur={d} text="many items, many places" x={540} y={1180} w={960} size={64} color={C.coral} at={r("different")} />,
  ], { hold: "same place", holdY: 850, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "stock", x: 540, y: 860, z: 1.03 }] }),
  // 3. analogy: a kitchen, four supply routes
  S("think of a kitchen", (r, d) => [
    <Head dur={d} text="A KITCHEN" y={170} size={120} />,
    <Ico dur={d} ctx={ctx} name="flame" x={150} y={540} size={120} color={C.coral} at={r("cooking")} />,
    <Box dur={d} x={640} y={540} w={740} h={140} label="COOKING GAS" sub="government-controlled supply" size={54} at={r("cooking")} />,
    <Ico dur={d} ctx={ctx} name="wheat" x={150} y={730} size={120} at={r("rice")} />,
    <Box dur={d} x={640} y={730} w={740} h={140} label="RICE AND SALT" sub="open market" size={54} at={r("rice")} />,
    <Ico dur={d} ctx={ctx} name="carrot" x={150} y={920} size={120} color={C.coral} at={r("vegetables")} />,
    <Box dur={d} x={640} y={920} w={740} h={140} label="VEGETABLES" sub="corner shop" size={54} at={r("vegetables")} />,
    <Ico dur={d} ctx={ctx} name="globe" x={150} y={1110} size={120} at={r("special")} />,
    <Box dur={d} x={640} y={1110} w={740} h={140} label="SPECIAL SPICE" sub="imported" size={54} at={r("special")} />,
  ], { hold: "another country", holdY: 850, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "special", x: 540, y: 860, z: 1.03 }] }),
  // 4. classification = sorting; GOLF sorts by source of supply
  S("classification means", (r, d) => [
    ...[170, 410, 650, 890].map((x, i) => <Ico key={"i" + i} dur={d} ctx={ctx} name="package" x={x} y={640} size={120} at={0.15 + i * 0.15} />),
    ...["G", "O", "L", "F"].map((l, i) => <Box key={"b" + l} dur={d} x={[170, 410, 650, 890][i]} y={1000} w={200} h={190} label={l} size={110} tone={i % 2 ? "a" : "hot"} at={r("sorting") + i * 0.2} />),
    ...[170, 410, 650, 890].map((x, i) => <Arrow key={"a" + i} dur={d} x1={x} y1={715} x2={x} y2={895} at={r("groups") + i * 0.2} />),
    <Label dur={d} text="where it comes from" x={540} y={1190} w={960} size={56} at={r("where")} />,
    <Label dur={d} text="SOURCE OF SUPPLY" x={540} y={1290} w={960} size={86} color={C.coral} at={r("source")} />,
  ], { hold: "source of supply", holdY: 850, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "sorting", x: 540, y: 860, z: 1.03 }] }),
  // 5. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  the full form", x: 190, y: 720, size: 56, w: 860, align: "left", at: r("full form") },
      { text: "2.  what each letter means", x: 190, y: 880, size: 56, w: 860, align: "left", at: r("what each") } ] }),
    <Check dur={d} x={125} y={755} size={80} at={r("full form") + 0.8} />,
    <Check dur={d} x={125} y={915} size={80} at={r("what each") + 0.9} />,
  ]),
  // 6. G = Government: slow, rules and gates
  S("g is for government", (r, d) => [
    <Head dur={d} text="G · GOVERNMENT" y={170} size={110} />,
    <Ico dur={d} ctx={ctx} name="landmark" x={170} y={760} size={150} at={0.3} />,
    <Ico dur={d} ctx={ctx} name="factory" x={910} y={760} size={150} at={0.5} />,
    <Arrow dur={d} x1={270} y1={760} x2={810} y2={760} head={false} at={0.7} />,
    <Box dur={d} x={360} y={760} w={150} h={90} label="FORM" size={36} at={r("supplied")} />,
    <Box dur={d} x={540} y={760} w={150} h={90} label="PERMIT" size={36} at={r("supplied") + 0.15} />,
    <Box dur={d} x={720} y={760} w={150} h={90} label="RULES" size={36} at={r("supplied") + 0.3} />,
    <Mascot dur={d} on size={100} tag="G" at={r("supplied") - 0.1} pts={[
      { t: r("supplied") - 0.1, x: 290, y: 630, look: [1, 0] }, { t: 3.4, x: 360, y: 630, look: [1, 0] }, { t: 4.0, x: 360, y: 630, look: [1, 1], mood: "think" },
      { t: 4.6, x: 540, y: 630, look: [1, 0] }, { t: 5.2, x: 540, y: 630, look: [1, 1], mood: "think" }, { t: 5.8, x: 720, y: 630, look: [1, 0] },
      { t: 6.3, x: 720, y: 630, look: [1, 1], mood: "sad" }, { t: 7.2, x: 860, y: 630, look: [1, 0], mood: "sad" }] } />,
    <Label dur={d} text="SLOW" x={540} y={920} w={600} size={120} color={C.coral} at={r("slow")} />,
  ], { hold: "that is slow", holdY: 850, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "orders", x: 540, y: 820, z: 1.03 }] }),
  // 7. O = Ordinary: many shops, easy
  S("o is for", (r, d) => [
    <Head dur={d} text="O · ORDINARY" y={170} size={110} />,
    <Ico dur={d} ctx={ctx} name="factory" x={540} y={1000} size={150} at={0.3} />,
    ...[200, 540, 880].map((x, i) => <Ico key={"s" + i} dur={d} ctx={ctx} name="store" x={x} y={640} size={120} at={r("standard") + i * 0.2} />),
    <Arrow dur={d} x1={270} y1={730} x2={470} y2={930} at={r("easily")} />,
    <Arrow dur={d} x1={540} y1={730} x2={540} y2={915} at={r("easily") + 0.15} />,
    <Arrow dur={d} x1={810} y1={730} x2={610} y2={930} at={r("easily") + 0.3} />,
    <Mascot dur={d} on size={90} tag="O" at={r("bought")} pts={[
      { t: r("bought"), x: 330, y: 790, look: [1, 1] }, { t: r("market"), x: 470, y: 930, look: [1, 1], mood: "happy" }] } />,
    <Label dur={d} text="MANY SUPPLIERS" x={540} y={1180} w={960} size={86} color={C.coral} at={r("many")} />,
  ], { hold: "many", holdY: 850, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "easily", x: 540, y: 860, z: 1.03 }] }),
  // 8. L = Local: next door, quick, small and often
  S("l is for", (r, d) => [
    <Head dur={d} text="L · LOCAL" y={170} size={120} />,
    <Ico dur={d} ctx={ctx} name="store" x={340} y={760} size={150} at={0.3} />,
    <Ico dur={d} ctx={ctx} name="factory" x={740} y={760} size={150} at={0.5} />,
    <Arrow dur={d} x1={440} y1={760} x2={640} y2={760} at={r("nearby")} />,
    <Label dur={d} text="nearby" x={340} y={870} w={400} size={46} at={r("nearby")} />,
    <Mascot dur={d} on size={80} tag="1" at={r("delivery")} pts={[{ t: r("delivery"), x: 420, y: 670, look: [1, 0] }, { t: r("delivery") + 0.7, x: 660, y: 670, look: [1, 0], mood: "happy" }]} />,
    <Mascot dur={d} on size={80} tag="2" at={r("delivery") + 0.9} pts={[{ t: r("delivery") + 0.9, x: 420, y: 670, look: [1, 0] }, { t: r("delivery") + 1.6, x: 660, y: 670, look: [1, 0], mood: "happy" }]} />,
    <Mascot dur={d} on size={80} tag="3" at={r("delivery") + 1.8} pts={[{ t: r("delivery") + 1.8, x: 420, y: 670, look: [1, 0] }, { t: r("delivery") + 2.5, x: 660, y: 670, look: [1, 0], mood: "happy" }]} />,
    <Label dur={d} text="QUICK" x={540} y={990} w={600} size={100} color={C.coral} at={r("quick")} />,
    <Label dur={d} text="small orders, often" x={540} y={1150} w={960} size={64} at={r("small")} />,
  ], { hold: "often", holdY: 850, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "quick", x: 540, y: 850, z: 1.03 }] }),
  // 9. F = Foreign: far, slow, customs, currency -> order early, extra safety stock
  S("f is for", (r, d) => [
    <Head dur={d} text="F · FOREIGN" y={170} size={120} />,
    <Ico dur={d} ctx={ctx} name="ship" x={170} y={760} size={150} at={0.3} />,
    <Ico dur={d} ctx={ctx} name="factory" x={910} y={760} size={150} at={0.5} />,
    <Arrow dur={d} x1={270} y1={760} x2={810} y2={760} head={false} at={r("imported")} />,
    <Box dur={d} x={470} y={760} w={200} h={100} label="CUSTOMS" size={38} at={r("customs")} />,
    <Ico dur={d} ctx={ctx} name="circle-dollar-sign" x={690} y={760} size={110} color={C.coral} at={r("currency")} />,
    <Mascot dur={d} on size={100} tag="F" at={r("long") - 0.1} pts={[
      { t: r("long") - 0.1, x: 290, y: 640, look: [1, 0] }, { t: r("customs"), x: 470, y: 640, look: [1, 1], mood: "think" },
      { t: r("currency"), x: 690, y: 640, look: [1, 1], mood: "think" }, { t: r("order"), x: 860, y: 640, look: [1, 0], mood: "sad" }] } />,
    <Label dur={d} text="LONG LEAD TIME" x={540} y={890} w={900} size={64} color={C.coral} at={r("long")} />,
    <Label dur={d} text="ORDER EARLY" x={540} y={1010} w={900} size={86} at={r("order")} />,
    <Label dur={d} text="+ EXTRA SAFETY STOCK" x={540} y={1130} w={980} size={78} color={C.coral} at={r("extra")} />,
  ], { hold: "safety stock", holdY: 850, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "customs", x: 540, y: 850, z: 1.03 }] }),
  // 10. recap: the farther the source, the more stock
  S("so the farther", (r, d) => [
    <Box dur={d} x={270} y={1100} w={380} h={110} label="LOCAL · near" size={48} at={0.1} />,
    <Box dur={d} x={810} y={1100} w={380} h={110} label="FOREIGN · far" size={48} at={0.25} />,
    <Arrow dur={d} x1={270} y1={1250} x2={810} y2={1250} at={r("farther")} label="FARTHER" color={C.coral} />,
    <Ico dur={d} ctx={ctx} name="package" x={270} y={930} size={130} at={r("more")} />,
    <Label dur={d} text="stock kept" x={520} y={880} w={260} size={44} color={C.coral} at={r("more")} />,
    ...[[740, 940], [880, 940], [740, 800], [880, 800]].map(([x, y], i) => <Ico key={"p" + i} dur={d} ctx={ctx} name="package" x={x} y={y} size={130} at={r("more") + i * 0.12} />),
  ], { hold: "more stock", holdY: 900, cam: [{ t: 0, x: 540, y: 950, z: 1.0 }, { t: "more", x: 540, y: 980, z: 1.03 }] }),
  // 11. the exam answer
  S("in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
      "GOLF = Government, Ordinary, Local, Foreign.",
      "It classifies inventory by its source of supply.",
      "G: items controlled by the government.",
      "O: ordinary items from the open market.",
      "L: local items from nearby suppliers.",
      "F: foreign items, which are imported." ],
      times: [r("golf"), r("it classifies"), r("government items"), r("ordinary items"), r("local items"), r("foreign items")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 12. memory trick + payoff
  S("and to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "GOLF = a game of distance", x: 540, y: 540, size: 76, w: 980 },
      { text: "farther source = more stock", x: 540, y: 680, size: 72, w: 980, color: C.coral, at: r("the farther") },
      { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("five") } ] }),
    <Check dur={d} x={540} y={1360} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.06 }] }),
];
