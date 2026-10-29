import { Box, Arrow, Ico, Table, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  // graph that builds itself: axes, then the curve reveals left to right, then labelled dots
  const Gr = ({ x, y, w, h, pts, xmax, ymax, at = 0, cAt, out, dur, drawDur = 1.0, color, width = 9, marks = [] }) => {
    const P = ([a, b]) => [x + w * a / xmax, y + h - h * b / ymax];
    const dd = pts.map((p, i) => (i ? "L " : "M ") + P(p).join(" ")).join(" ");
    const t = Math.min(at, dur - 0.7), c0 = Math.max(0.15, (cAt == null ? t + 0.15 : cAt) - t);
    return <Layer at={t} dur={dur} out={out}>
      <path d={`M ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h}`} x={0} y={0} width={1080} height={1920} stroke={{ width: 6, color: C.navy, cap: "round" }} />
      <frame at={c0} duration={Math.max(0.3, (out == null ? dur : out) - t - c0)} width={1080} height={1920} layout="none" reveal={{ from: "left", at: 0, duration: drawDur, easing: "ease-in-out" }}>
        <path d={dd} x={0} y={0} width={1080} height={1920} stroke={{ width, color: color || C.coral, cap: "round" }} />
      </frame>
      {marks.map((m, i) => { const [mx, my] = P([m.x, m.y]); return <Layer key={i} at={m.at - t} dur={(out == null ? dur : out) - t}>
        <rect x={mx - 16} y={my - 16} width={32} height={32} radius={16} fill={C.cobalt} strokeColor={C.navy} strokeWidth={4} />
        {m.label ? <text x={mx - 200 + (m.dx || 0)} y={my - 80 + (m.dy || 0)} width={400} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={34} color={C.navy}>{m.label}</text> : null}</Layer>; })}
    </Layer>;
  };
  const STEP = [[0, 0], [15, 0], [15, 1], [20, 1]], RAMP = [[0, 0], [5, 0], [15, 1], [20, 1]];
  return [
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "What is a crisp set? Differentiate between fuzzy sets and crisp sets.", n: 7, marks: 5, y: 500 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "fuzzy", x: 540, y: 780, z: 1.06 }] }),

    // from zero: a set of hot days; a step versus a ramp
    S("Let's start", (r, d) => [
      <Head dur={d} text="a set" y={170} size={130} at={0.1} />,
      <Box dur={d} x={540} y={540} w={880} h={260} r={130} label="" tone="ghost" at={r("collection")} />,
      ...[330, 540, 750].map((x, i) => <Ico key={i} dur={d} ctx={ctx} name="sun" x={x} y={540} size={110} color={C.coral} at={r("hot") + i * 0.2} />),
      <Label dur={d} text="the set of all hot days" x={540} y={700} w={980} size={50} at={r("days")} />,
      <Gr dur={d} x={70} y={880} w={420} h={240} pts={STEP} xmax={20} ymax={1} at={r("step") - 0.3} cAt={r("step")} drawDur={0.8} />,
      <Gr dur={d} x={590} y={880} w={420} h={240} pts={RAMP} xmax={20} ymax={1} at={r("ramp") - 0.5} cAt={r("ramp") - 0.3} drawDur={0.8} />,
      <Label dur={d} text="a step" x={280} y={1170} w={420} size={56} color={C.coral} at={r("step")} />,
      <Label dur={d} text="or a ramp" x={800} y={1170} w={420} size={56} color={C.cobalt} at={r("ramp")} />,
    ], { hold: "ramp" }),

    // a crisp set is the step
    S("A crisp set is the step", (r, d) => [
      <Head dur={d} text="crisp set" y={170} size={120} at={0.1} />,
      <Gr dur={d} x={120} y={430} w={800} h={560} pts={STEP} xmax={20} ymax={1} at={r("step") - 0.3} cAt={r("Say")} drawDur={1.0}
        marks={[{ x: 14.9, y: 0, label: "29.9° → 0", dx: -120, at: r("29") + 0.3 }, { x: 15, y: 1, label: "30° → 1", dx: 210, dy: 95, at: r("At 30") + 0.5 }]} />,
      <Label dur={d} text="membership" x={150} y={340} w={400} size={40} align="left" color={C.coral} at={r("Say")} />,
      <Label dur={d} text="temperature (°C)" x={540} y={1030} w={700} size={40} at={r("hot")} />,
      <Label dur={d} text="hot = 30° or more" x={540} y={1110} w={980} size={50} color={C.cobalt} at={r("degrees")} />,
      <Label dur={d} text="OUT = 0" x={300} y={900} w={300} size={46} at={r("out")} />,
      <Label dur={d} text="IN = 1" x={760} y={360} w={300} size={46} color={C.coral} at={r("either")} />,
      <Ring dur={d} x={720} y={710} r={80} at={r("sharp")} />,
      <Label dur={d} text="sharp edge = crisp set" x={540} y={1210} w={980} size={56} color={C.coral} at={r("sharp")} />,
    ], { hold: "That sharp" }),

    // a fuzzy set is the ramp
    S("A fuzzy set is", (r, d) => [
      <Head dur={d} text="fuzzy set" y={170} size={120} at={0.1} />,
      <Gr dur={d} x={120} y={430} w={800} h={560} pts={RAMP} xmax={20} ymax={1} at={r("ramp") - 0.5} cAt={r("ramp") - 0.3} drawDur={1.2}
        marks={[{ x: 5, y: 0, label: "20° → 0", dx: -110, at: r("At 20") + 0.3 }, { x: 10, y: 0.5, label: "25° → 0.5", dx: 210, dy: 95, at: r("At 25") + 0.3 }, { x: 15, y: 1, label: "30° → 1", at: r("At 30") + 0.3 }]} />,
      <Label dur={d} text="membership" x={150} y={340} w={400} size={40} align="left" color={C.coral} at={r("ramp")} />,
      <Label dur={d} text="temperature (°C)" x={540} y={1030} w={700} size={40} at={r("At 20")} />,
      <Label dur={d} text="any value from 0 to 1" x={540} y={1150} w={980} size={56} color={C.coral} at={r("any")} />,
    ], { hold: "Membership can" }),

    S("So the question", (r, d) => [
      <Label dur={d} text="the question wants:" x={540} y={470} w={960} size={74} at={0.15} />,
      <Label dur={d} text="1.  what a crisp set is" x={130} y={680} w={880} size={60} align="left" at={r("definition")} />,
      <Check dur={d} x={80} y={715} size={80} at={r("definition") + 0.9} />,
      <Label dur={d} text="2.  how fuzzy differs" x={130} y={860} w={880} size={60} align="left" at={r("differences")} />,
      <Check dur={d} x={80} y={895} size={80} at={r("differences") + 0.9} />,
    ]),

    // the four differences: table rows, each with its own picture below
    S("Compare them", (r, d) => {
      const tM = r("membership"), tB = r("boundary"), tL = r("logic"), tU = r("use");
      return [
        ...Table({ dur: d, x: 40, y: 280, w: 1000, cols: ["", "CRISP", "FUZZY"], rowH: 120, fs: 36, at: 0.1,
          rows: [["Membership", "0 or 1", "0 to 1"], ["Boundary", "sharp", "gradual"], ["Logic", "true or false", "partly both"], ["Use", "exact data", "vague words"]],
          cellAt: [[tM, r("Crisp"), r("Fuzzy")], [tB, r("Crisp is sharp"), r("Fuzzy is gradual")], [tL, r("Crisp follows"), r("In a fuzzy")], [tU, r("Crisp sets suit"), r("Fuzzy sets model")]] }),
        // membership picture
        ...[0, 1].map(i => <Box key={"cm" + i} dur={d} x={190 + i * 150} y={1190} w={120} h={110} label={String(i)} size={52} tone={i ? "hot" : "a"} at={r("zero")} out={tB - 0.15} />),
        ...[0, 0.25, 0.5, 0.75, 1].map((v, i) => <Box key={"fm" + i} dur={d} x={540 + i * 95} y={1190} w={84} h={110} label={String(v)} size={30} tone={["ghost", "a", "a", "b", "hot"][i]} at={r("anything") + i * 0.1} out={tB - 0.15} />),
        // boundary picture
        <Gr dur={d} x={80} y={1010} w={380} h={200} pts={STEP} xmax={20} ymax={1} at={r("sharp") - 0.2} cAt={r("sharp")} out={tL - 0.15} drawDur={0.7} />,
        <Gr dur={d} x={600} y={1010} w={380} h={200} pts={RAMP} xmax={20} ymax={1} at={r("gradual") - 0.3} cAt={r("gradual") - 0.2} out={tL - 0.15} drawDur={0.7} />,
        // logic picture: crisp never overlaps, fuzzy overlaps
        <Box dur={d} x={190} y={1200} w={220} h={220} r={110} label="A" size={56} tone="a" at={r("opposite")} out={tU - 0.15} />,
        <Box dur={d} x={420} y={1200} w={220} h={220} r={110} label="not A" size={44} tone="b" at={r("opposite") + 0.2} out={tU - 0.15} />,
        <Box dur={d} x={700} y={1200} w={220} h={220} r={110} label="A" size={56} tone="a" at={r("partly")} out={tU - 0.15} />,
        <Box dur={d} x={850} y={1200} w={220} h={220} r={110} label="" tone="ghost" on at={r("partly") + 0.3} out={tU - 0.15} />,
        <Label dur={d} text="not A" x={885} y={1175} w={160} size={36} on at={r("partly") + 0.5} out={tU - 0.15} />,
        // use picture
        <Ico dur={d} ctx={ctx} name="ruler" x={270} y={1150} size={150} color={C.cobalt} at={r("exact")} />,
        <Label dur={d} text="exact data" x={270} y={1270} w={460} size={46} color={C.cobalt} at={r("exact") + 0.2} />,
        <Ico dur={d} ctx={ctx} name="cloud-fog" x={810} y={1150} size={150} color={C.coral} at={r("vague")} />,
        <Label dur={d} text="vague words" x={810} y={1270} w={460} size={46} color={C.coral} at={r("vague") + 0.2} />,
      ];
    }, { hold: "young" }),

    S("So in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "Crisp set: a classical set where each element either belongs or does not.",
        "Its membership is only 0 or 1, with a sharp boundary.",
        "Fuzzy set: allows partial membership, any value from 0 to 1, with a gradual boundary.",
        "Differences: membership 0 or 1 vs 0 to 1; boundary sharp vs gradual; logic true/false vs partial truth; use exact data vs vague terms." ],
        times: [r("crisp"), r("membership"), r("fuzzy"), r("differences")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

    S("To remember", (r, d) => [
      <Gr dur={d} x={70} y={430} w={420} h={260} pts={STEP} xmax={20} ymax={1} at={0.1} cAt={r("step") - 0.2} drawDur={0.7} />,
      <Gr dur={d} x={590} y={430} w={420} h={260} pts={RAMP} xmax={20} ymax={1} at={0.2} cAt={r("ramp") - 0.2} drawDur={0.7} />,
      <Label dur={d} text="crisp = step" x={280} y={740} w={440} size={52} color={C.coral} at={r("step")} />,
      <Label dur={d} text="fuzzy = ramp" x={800} y={740} w={440} size={52} color={C.cobalt} at={r("ramp")} />,
      <Label dur={d} text="5 marks" x={540} y={1000} w={900} size={150} color={C.coral} at={r("Five")} />,
      <Check dur={d} x={540} y={1380} size={180} at={r("Secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 1000, z: 1.06 }] }),
  ];
};
