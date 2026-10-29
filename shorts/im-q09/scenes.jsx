import { Box, Arrow, Ico, Table, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  // BOM tree geometry: [x, y, w]
  const N = { chair: [585, 560, 260], seat: [375, 930, 240], back: [795, 930, 240], board: [270, 1300, 190], foam: [480, 1300, 190], slat: [690, 1300, 190], screw: [900, 1300, 190] };
  const NM = { chair: "Chair", seat: "Seat", back: "Back", board: "Board", foam: "Foam", slat: "Slats", screw: "Screws" };
  const KIDS = [["chair", "seat", "x1", -1], ["chair", "back", "x1", 1], ["seat", "board", "x1", -1], ["seat", "foam", "x1", 1], ["back", "slat", "x3", -1], ["back", "screw", "x4", 1]];
  const edge = (p, c, d, at) => { const [px, py] = N[p], [cx, cy] = N[c];
    return <Arrow key={"e" + c} x1={px} y1={py + 66} x2={cx} y2={cy - 68} at={at} dur={d} head={false} width={5} />; };
  const qty = (p, c, q, side, d, at) => { const [px, py] = N[p], [cx, cy] = N[c];
    return <Label key={"q" + c} text={q} x={(px + cx) / 2 + side * 62} y={(py + 66 + cy - 68) / 2 - 24} w={120} size={40} font={C.fMono} color={C.coral} at={at} dur={d} />; };
  const node = (id, d, at, tone) => { const [x, y, w] = N[id]; return <Box key={id} x={x} y={y} w={w} h={130} label={NM[id]} tone={tone || "a"} at={at} dur={d} />; };
  return [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "What is a BOM (Bill of Materials)?", n: 9, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "bill", x: 540, y: 780, z: 1.06 }] }),

  // 2. from zero: a recipe lists every ingredient and how much
  S("let's start", (r, d) => [
    <Head dur={d} text="from zero" y={170} size={150} sub="first, a cake" at={0.1} />,
    <Ico dur={d} ctx={ctx} name="cake" x={540} y={560} size={200} at={r("cake")} />,
    ...Table({ dur: d, x: 140, y: 720, w: 800, cols: ["Ingredient", "How much"], rows: [["Eggs", "2"], ["Flour", "200 g"], ["Sugar", "100 g"]], rowH: 90, fs: 40, at: r("recipe") + 0.2,
      cellAt: [0, 1, 2].map(i => [r("ingredient") + i * 0.3, r("how") + i * 0.3]) }),
    <Label dur={d} text="a recipe = what + how much" x={540} y={1180} w={900} size={56} color={C.coral} at={r("how") + 1.4} />,
  ], { hold: "of each", cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "ingredient", x: 540, y: 860, z: 1.05 }] }),

  // 3. a factory needs the same: wood, foam, screws in exact numbers = the Bill of Materials
  S("a factory", (r, d) => [
    <Ico dur={d} ctx={ctx} name="factory" x={300} y={400} size={230} at={0.1} />,
    <Arrow dur={d} x1={430} y1={400} x2={640} y2={400} at={r("build")} width={9} />,
    <Ico dur={d} ctx={ctx} name="armchair" x={790} y={400} size={230} at={r("chair")} />,
    <Box dur={d} x={190} y={800} w={240} h={130} label="wood" at={r("wood")} />,
    <Box dur={d} x={540} y={800} w={240} h={130} label="foam" at={r("foam")} />,
    <Box dur={d} x={890} y={800} w={240} h={130} label="screws" at={r("screws")} />,
    <Arrow dur={d} x1={790} y1={525} x2={230} y2={730} at={r("wood")} width={6} />,
    <Arrow dur={d} x1={790} y1={525} x2={540} y2={730} at={r("foam")} width={6} />,
    <Arrow dur={d} x1={790} y1={525} x2={870} y2={730} at={r("screws")} width={6} />,
    <Label dur={d} text="× 4" x={190} y={895} w={200} size={54} font={C.fMono} color={C.coral} at={r("exact")} />,
    <Label dur={d} text="× 1" x={540} y={895} w={200} size={54} font={C.fMono} color={C.coral} at={r("exact") + 0.25} />,
    <Label dur={d} text="× 4" x={890} y={895} w={200} size={54} font={C.fMono} color={C.coral} at={r("exact") + 0.5} />,
    <Arrow dur={d} x1={190} y1={975} x2={330} y2={1060} at={r("list")} width={6} />,
    <Arrow dur={d} x1={540} y1={975} x2={540} y2={1060} at={r("list")} width={6} />,
    <Arrow dur={d} x1={890} y1={975} x2={750} y2={1060} at={r("list")} width={6} />,
    <Box dur={d} x={540} y={1150} w={800} h={150} label="BILL OF MATERIALS" tone="hot" at={r("bill")} />,
    <Label dur={d} text="the list + exact numbers" x={540} y={1300} w={900} size={52} at={r("materials") + 0.5} color={C.coral} />,
  ], { hold: "materials", cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "wood", x: 540, y: 850, z: 1.02 }, { t: "list", x: 540, y: 950, z: 1.03 }] }),

  // 4. what the question wants: two things
  S("so the question", (r, d) => [
    <Head dur={d} text="2 THINGS" y={200} size={200} sub="the question wants" at={0.1} />,
    <Box dur={d} x={540} y={700} w={800} h={130} label="1 · what a BOM is" at={r("what")} />,
    <Box dur={d} x={540} y={900} w={800} h={130} label="2 · how it is organised" at={r("how")} />,
    <Check dur={d} x={985} y={700} size={80} at={r("is") + 0.6} />,
    <Check dur={d} x={985} y={900} size={80} at={r("organised") + 0.5} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "how", x: 540, y: 800, z: 1.04 }] }),

  // 5. definition: complete list of raw materials, components, sub-assemblies + quantity, for ONE unit
  S("first what it", (r, d) => {
    const rows = [["Board", "raw material", "1"], ["Foam", "raw material", "1"], ["Slats", "raw material", "3"], ["Screws", "component", "4"], ["Seat", "sub-assembly", "1"], ["Back", "sub-assembly", "1"]];
    const kind = [r("raw"), r("raw") + 0.25, r("raw") + 0.5, r("components"), r("sub"), r("sub") + 0.25];
    return [
      <Head dur={d} text="BOM" y={170} size={200} at={0.1} />,
      ...Table({ dur: d, x: 60, y: 520, w: 960, cols: ["Item", "Kind", "Qty / chair"], rows, rowH: 90, fs: 38, at: r("complete") - 0.2,
        cellAt: rows.map((_, i) => [r("complete") + i * 0.2, kind[i], r("quantity") + i * 0.15]) }),
      <Box dur={d} x={370} y={1330} w={560} h={130} label="for ONE chair" tone="hot" at={r("make")} />,
      <Mascot dur={d} size={170} tag="1" at={r("make")} pts={[{ t: r("make"), x: 850, y: 1330, mood: "idle", look: [-1, 0] }, { t: r("unit") + 0.1, x: 850, y: 1330, mood: "idle", look: [-1, 0] }, { t: r("recipe"), x: 850, y: 1330, mood: "happy", look: [-1, 0] }]} />,
    ]; }, { hold: "recipe for one", cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "raw", x: 540, y: 860, z: 1.03 }, { t: "make", x: 540, y: 950, z: 1.04 }] }),

  // 6a. how it is organised: not straight from raw, but via sub-assemblies
  S("second how", (r, d) => [
    <Box dur={d} x={540} y={420} w={300} h={130} label="Chair" tone="hot" at={0.1} />,
    <Box dur={d} x={540} y={1130} w={820} h={130} label="raw wood, foam, screws" at={r("built")} />,
    <Arrow dur={d} x1={540} y1={1060} x2={540} y2={495} at={r("straight")} width={7} />,
    <XMark dur={d} x={540} y={780} size={140} at={r("wood") + 0.1} />,
    <Box dur={d} x={240} y={800} w={300} h={170} label="Seat" at={r("seat")} />,
    <Box dur={d} x={840} y={800} w={300} h={170} label="Back" at={r("back")} />,
    <Arrow dur={d} x1={260} y1={712} x2={440} y2={495} at={r("seat") + 0.3} width={6} />,
    <Arrow dur={d} x1={820} y1={712} x2={640} y2={495} at={r("back") + 0.3} width={6} />,
    <Arrow dur={d} x1={420} y1={1062} x2={290} y2={890} at={r("seat") + 0.5} width={6} />,
    <Arrow dur={d} x1={660} y1={1062} x2={790} y2={890} at={r("back") + 0.5} width={6} />,
    <Box dur={d} x={240} y={800} w={300} h={170} label="Seat" sub="sub-assembly" size={62} tone="hot" at={r("sub")} on={true} />,
    <Box dur={d} x={840} y={800} w={300} h={170} label="Back" sub="sub-assembly" size={62} tone="hot" at={r("sub") + 0.15} on={true} />,
  ], { hold: "assemblies", cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "first", x: 540, y: 820, z: 1.03 }] }),

  // 6b. the BOM tree, levels, quantities
  S("so we draw", (r, d) => [
    <Head dur={d} text="BOM TREE" y={170} size={170} at={0.1} />,
    node("chair", d, r("top"), "hot"),
    <Label dur={d} text="END ITEM" x={585} y={432} w={300} size={40} at={r("end")} color={C.coral} />,
    <Label dur={d} text={"LEVEL\n0"} x={118} y={505} w={120} size={42} at={r("zero")} color={C.coral} />,
    edge("chair", "seat", d, r("level") + 4.2), edge("chair", "back", d, r("level") + 4.3),
    node("seat", d, r("one") + 0.1, "a"), node("back", d, r("one") + 0.25, "a"),
    <Label dur={d} text={"LEVEL\n1"} x={118} y={875} w={120} size={42} at={r("seat") + 0.4} color={C.coral} />,
    <Label dur={d} text={"SUB-\nASSEMBLIES"} x={585} y={745} w={300} size={34} at={r("seat") + 0.8} color={C.coral} />,
    edge("seat", "board", d, r("two")), edge("seat", "foam", d, r("two") + 0.1), edge("back", "slat", d, r("two") + 0.2), edge("back", "screw", d, r("two") + 0.3),
    node("board", d, r("board") - 0.1), node("foam", d, r("foam") - 0.1), node("slat", d, r("slats") - 0.1), node("screw", d, r("screws") - 0.1),
    <Label dur={d} text={"LEVEL\n2"} x={118} y={1245} w={120} size={42} at={r("raw") + 0.2} color={C.coral} />,
    <Label dur={d} text="PARTS" x={585} y={1405} w={300} size={44} at={r("raw") + 0.5} color={C.coral} />,
    ...KIDS.map(([p, c, q, s], i) => qty(p, c, q, s, d, r("branch") + i * 0.12)),
    <Ring dur={d} x={N.slat[0] + 4} y={(N.back[1] + 66 + N.slat[1] - 68) / 2 - 24 + 20} r={52} at={r("three")} />,
    <Ring dur={d} x={N.screw[0] - 62 + 4 + 62} y={(N.back[1] + 66 + N.screw[1] - 68) / 2 - 24 + 20} r={52} at={r("four")} />,
  ], { hold: "what goes", cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "level", x: 540, y: 900, z: 1.03 }, { t: "two", x: 540, y: 960, z: 1.04 }] }),

  // 7. why it matters: key input to MRP
  S("why does", (r, d) => [
    <Box dur={d} x={270} y={420} w={300} h={130} label="BOM" at={0.1} />,
    <Box dur={d} x={810} y={420} w={340} h={130} label="100 chairs" tone="a" at={r("chairs")} />,
    <Arrow dur={d} x1={270} y1={490} x2={270} y2={620} at={r("input")} width={8} />,
    <Arrow dur={d} x1={810} y1={490} x2={810} y2={620} at={r("chairs") + 0.4} width={8} />,
    <Box dur={d} x={540} y={730} w={840} h={210} label="MRP" sub="Material Requirements Planning" size={70} tone="hot" at={r("mrp")} />,
    <Arrow dur={d} x1={540} y1={845} x2={540} y2={940} at={r("works")} width={8} />,
    <Box dur={d} x={540} y={1030} w={560} h={130} label="WHAT TO BUY" at={r("exactly")} />,
    <Arrow dur={d} x1={540} y1={1100} x2={540} y2={1190} at={r("what") + 0.2} width={7} />,
    ...[["board", "100"], ["foam", "100"], ["slats", "300"], ["screws", "400"]].map(([l, q], i) => <Box key={l} dur={d} x={165 + i * 250} y={1300} w={220} h={170} label={l} sub={q} size={60} at={r("buy") - 0.1 + i * 0.12} />),
  ], { hold: "what to buy", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "mrp", x: 540, y: 780, z: 1.04 }, { t: "buy", x: 540, y: 960, z: 1.04 }] }),

  // 8. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
      "BOM: the complete list of raw materials, components and sub-assemblies, with quantities, to make ONE unit.",
      "Drawn as a product structure tree.",
      "Level 0 = end item; lower levels = sub-assemblies, then parts.",
      "Key input to MRP, which plans what to buy." ],
      times: [r("complete"), r("drawn"), r("level"), r("key")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 9. memory trick + payoff
  S("to remember", (r, d) => [
    <Box dur={d} x={260} y={480} w={380} h={170} label="BOM" at={0.1} />,
    <Label dur={d} text="=" x={540} y={425} w={140} size={120} at={r("is")} color={C.coral} />,
    <Box dur={d} x={820} y={480} w={380} h={170} label="RECIPE CARD" tone="hot" size={52} at={r("recipe")} />,
    <Head dur={d} text="5 MARKS" y={760} size={230} at={r("five")} />,
    <Check dur={d} x={540} y={1250} size={300} at={r("secured")} color={C.coral} />,
    <Mascot dur={d} size={190} tag="5" pts={[{ t: 0.2, x: 880, y: 1180, mood: "idle", look: [-1, 0] }, { t: r("secured"), x: 880, y: 1180, mood: "happy", look: [-1, 0] }]} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "five", x: 540, y: 900, z: 1.05 }], cut: "punch" }),
  ];
};
