import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer, bb, ev } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  // graph that builds itself: axes first, then the curve reveals left to right, then dots
  const Gr = ({ x, y, w, h, pts, xmax, ymax, at = 0, cAt, dur, drawDur = 1.1, color, width = 9, marks = [] }) => {
    const P = ([a, b]) => [x + w * a / xmax, y + h - h * b / ymax];
    const dd = pts.map((p, i) => (i ? "L " : "M ") + P(p).join(" ")).join(" ");
    const t = Math.min(at, dur - 0.7);
    bb({ k: "plot", n: "graph", x: x - 10, y: y - 10, w: w + 20, h: h + 20, t0: t, t1: dur });
    ev(t, "draw");
    return <Layer at={t} dur={dur}>
      <path d={`M ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h}`} x={0} y={0} width={1080} height={1920} stroke={{ width: 6, color: C.navy, cap: "round" }} />
      <frame at={Math.max(0.15, (cAt == null ? t + 0.15 : cAt) - t)} duration={Math.max(0.3, dur - Math.max(t + 0.15, cAt == null ? 0 : cAt))} width={1080} height={1920} layout="none" reveal={{ from: "left", at: 0, duration: drawDur, easing: "ease-in-out" }}>
        <path d={dd} x={0} y={0} width={1080} height={1920} stroke={{ width, color: color || C.coral, cap: "round" }} />
      </frame>
      {marks.map((m, i) => { const [mx, my] = P([m.x, m.y]); return <Layer key={i} at={m.at - t} dur={dur - t}>
        <rect x={mx - 16} y={my - 16} width={32} height={32} radius={16} fill={C.cobalt} strokeColor={C.navy} strokeWidth={4} />
        {m.label ? <text x={mx - 200 + (m.dx || 0)} y={my - 80 + (m.dy || 0)} width={400} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={34} color={C.navy}>{m.label}</text> : null}</Layer>; })}
    </Layer>;
  };
  const gauss = Array.from({ length: 21 }, (_, i) => [i * 0.5, Math.exp(-Math.pow(i * 0.5 - 5, 2) / (2 * 1.5 * 1.5))]);
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "What is a membership function in fuzzy logic?", n: 1, marks: 5, y: 560 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "fuzzy", x: 540, y: 780, z: 1.06 }] }),

    // 2. from zero: normal logic is a light switch
    S("Let's start", (r, d) => [
      <Head dur={d} text="ON or OFF" y={190} size={110} at={0.1} />,
      <Ico dur={d} ctx={ctx} name="toggle-left" x={300} y={700} size={300} at={r("light")} />,
      <Ico dur={d} ctx={ctx} name="toggle-right" x={780} y={700} size={300} color={C.coral} at={r("light") + 0.4} />,
      <Label dur={d} text="TRUE · 1" x={780} y={890} w={400} size={62} color={C.coral} at={r("true")} />,
      <Label dur={d} text="FALSE · 0" x={300} y={890} w={400} size={62} at={r("false")} />,
      <XMark dur={d} x={540} y={700} size={120} at={r("Nothing")} />,
      <Label dur={d} text="nothing in between" x={540} y={1060} w={900} size={64} color={C.coral} at={r("between")} />,
    ], { hold: "Nothing in", cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "light", x: 540, y: 760, z: 1.05 }] }),

    // 3. real life is not like that: is 170 cm tall?
    S("But real life", (r, d) => [
      <Head dur={d} text="tall?" y={190} size={160} at={0.1} />,
      <Ico dur={d} ctx={ctx} name="user-round" x={400} y={740} size={340} at={r("person")} />,
      <Arrow dur={d} x1={650} y1={915} x2={650} y2={565} color={C.cobalt} width={9} at={r("170")} />,
      <Label dur={d} text="170 cm" x={860} y={700} w={320} size={66} at={r("170")} />,
      <Label dur={d} text="sort of..." x={540} y={1080} w={800} size={80} color={C.coral} at={r("Sort")} />,
    ], { hold: "Sort of" }),

    // 4. fuzzy logic = a dimmer: any value 0..1
    S("So fuzzy", (r, d) => {
      const xs = [150, 335, 520, 705, 890], vals = ["0", "0.25", "0.5", "0.75", "1"], tones = ["ghost", "a", "a", "b", "hot"];
      return [
        <Head dur={d} text="dimmer" y={180} size={150} sub="any value from 0 to 1" at={0.1} />,
        <Box dur={d} x={xs[0]} y={760} w={160} h={170} label={vals[0]} size={52} tone={tones[0]} at={r("zero")} />,
        <Box dur={d} x={xs[4]} y={760} w={160} h={170} label={vals[4]} size={60} tone={tones[4]} at={r("one")} />,
        ...[1, 2, 3].map(i => <Box key={i} dur={d} x={xs[i]} y={760} w={160} h={170} label={vals[i]} size={52} tone={tones[i]} at={r("allowed") + (i - 1) * 0.15} />),
        <Label dur={d} text="not at all" x={xs[0]} y={890} w={240} size={34} at={r("not")} />,
        <Label dur={d} text="completely" x={xs[4]} y={890} w={240} size={34} color={C.coral} at={r("completely")} />,
        <Label dur={d} text="halfway" x={xs[2]} y={890} w={240} size={34} color={C.cobalt} at={r("halfway")} />,
        <Mascot dur={d} size={150} pts={[{ t: 0, x: xs[0], y: 1130, look: [1, -1], mood: "idle" }, { t: r("Any"), x: xs[0], y: 1130, look: [1, -1], mood: "think" }, { t: r("allowed"), x: xs[4], y: 1130, look: [0, -1], mood: "happy" }, { t: r("Half"), x: xs[2], y: 1130, look: [0, -1], mood: "happy" }]} />,
      ];
    }, { hold: "Half" }),

    // 5. what the question wants
    S("So the question", (r, d) => [
      <Label dur={d} text="the question wants:" x={540} y={470} w={960} size={74} at={0.15} />,
      <Label dur={d} text="1.  what it IS" x={150} y={680} w={820} size={62} align="left" at={r("What")} />,
      <Check dur={d} x={95} y={715} size={80} at={r("What") + 0.9} />,
      <Label dur={d} text="2.  what it LOOKS like" x={150} y={860} w={860} size={62} align="left" at={r("how")} />,
      <Check dur={d} x={95} y={895} size={80} at={r("how") + 0.9} />,
    ]),

    // 6. the example: tall, three heights, three scores
    S("Take the fuzzy", (r, d) => {
      const xs = [200, 540, 880], sz = [170, 220, 270], base = 900;
      const hts = ["150 cm", "170 cm", "190 cm"], sc = ["0", "0.5", "1"], tone = ["ghost", "a", "hot"];
      const tH = [r("150"), r("170"), r("190")], tS = [r("zero"), r("0"), r("one")];
      return [
        <Head dur={d} text="tall" y={180} size={150} sub="a fuzzy set" at={0.1} />,
        ...xs.map((x, i) => <Ico key={"p" + i} dur={d} ctx={ctx} name="user-round" x={x} y={base - sz[i] / 2} size={sz[i]} at={r("Every") + i * 0.25} />),
        ...xs.map((x, i) => <Label key={"h" + i} dur={d} text={hts[i]} x={x} y={925} w={300} size={46} at={tH[i]} />),
        ...xs.map((x, i) => <Arrow key={"a" + i} dur={d} x1={x} y1={995} x2={x} y2={1075} color={C.cobalt} width={7} at={tS[i] - 0.15} />),
        ...xs.map((x, i) => <Box key={"s" + i} dur={d} x={x} y={1170} w={250} h={160} label={sc[i]} sub="score" size={64} tone={tone[i]} at={tS[i]} />),
        <Label dur={d} text="= degree of membership" x={540} y={1350} w={960} size={60} color={C.coral} at={r("That")} />,
      ];
    }, { hold: "That score" }),

    // 7. the rule that hands out the scores
    S("The rule that", (r, d) => [
      <Head dur={d} text="the rule" y={170} size={120} at={0.1} />,
      <Box dur={d} x={540} y={650} w={240} h={200} tone="b" at={r("rule")} />,
      <Label dur={d} text="μ" x={540} y={570} w={240} size={130} font={C.fMono} color={C.ink} on at={r("rule") + 0.1} />,
      <Label dur={d} text="membership function" x={540} y={470} w={700} size={46} color={C.coral} at={r("membership")} />,
      <Arrow dur={d} x1={670} y1={650} x2={765} y2={650} color={C.cobalt} width={8} at={r("scores") - 0.1} />,
      <Box dur={d} x={900} y={650} w={200} h={170} label="score" size={46} tone="hot" at={r("scores")} />,
      <Box dur={d} x={160} y={650} w={200} h={170} label="x" sub="170 cm" size={70} tone="a" at={r("takes")} />,
      <Arrow dur={d} x1={270} y1={650} x2={400} y2={650} color={C.cobalt} width={8} at={r("takes") + 0.3} />,
      <Label dur={d} text="μA(x)" x={540} y={900} w={800} size={130} font={C.fMono} at={r("write")} />,
      <Label dur={d} text="x comes from the universe X" x={540} y={1110} w={960} size={46} at={r("universe")} />,
      <Label dur={d} text="all possible values" x={540} y={1180} w={960} size={40} color={C.cobalt} at={r("possible")} />,
      <Label dur={d} text="output: one number from 0 to 1" x={540} y={770} w={900} size={40} color={C.coral} at={r("returns")} />,
      <Label dur={d} text="μA : X → [0, 1]" x={540} y={1330} w={960} size={92} font={C.fMono} color={C.coral} at={r("maps")} />,
    ], { hold: "So it maps" }),

    // 8. the graph
    S("Draw it", (r, d) => [
      <Gr dur={d} x={140} y={420} w={800} h={640} pts={[[0, 0], [20, 0], [60, 1], [90, 1]]} xmax={90} ymax={1} at={r("input")} cAt={r("curve")} drawDur={1.6}
        marks={[{ x: 20, y: 0, label: "150 → 0", dx: 0, dy: 100, at: r("curve") + 0.1 }, { x: 40, y: 0.5, label: "170 → 0.5", dx: 200, dy: 90, at: r("curve") + 0.8 }, { x: 60, y: 1, label: "190 → 1", at: r("curve") + 1.5 }]} />,
      <Label dur={d} text="height (cm)" x={540} y={1100} w={500} size={42} at={r("input")} />,
      <Label dur={d} text="membership" x={150} y={300} w={400} size={42} align="left" color={C.coral} at={r("membership")} />,
    ], { hold: "from zero" }),

    // 9. common shapes
    S("Common shapes", (r, d) => {
      const ys = [330, 700, 1070], nm = ["triangular", "trapezoidal", "Gaussian"];
      const ps = [[[0, 0], [5, 1], [10, 0]], [[0, 0], [3, 1], [7, 1], [10, 0]], gauss];
      const tt = [r("triangle"), r("trapezoid"), r("Gaussian")];
      return [
        <Head dur={d} text="3 shapes" y={170} size={110} at={0.1} />,
        ...ys.flatMap((y, i) => [
          <Gr key={"g" + i} dur={d} x={120} y={y} w={520} h={240} pts={ps[i]} xmax={10} ymax={1} at={tt[i] - 0.5} drawDur={0.9} />,
          <Label key={"n" + i} dur={d} text={nm[i]} x={690} y={y + 95} w={340} size={46} align="left" color={C.coral} at={tt[i]} />,
        ]),
      ];
    }, { hold: "bell" }),

    // 10. the exam answer
    S("So in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "Fuzzy logic allows partial truth: values from 0 to 1, not just true or false.",
        "A membership function gives each element its degree of membership, a value from 0 to 1.",
        "Written mu_A(x): it maps the universe X into the interval 0 to 1.",
        "Example, tall: 150 cm gives 0, 170 cm gives 0.5, 190 cm gives 1.",
        "Common shapes: triangular, trapezoidal, Gaussian." ],
        times: [r("Fuzzy"), r("membership"), r("written"), r("Example"), r("Shapes")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

    // 11. memory trick + payoff
    S("To remember", (r, d) => [
      <Ico dur={d} ctx={ctx} name="sun-dim" x={540} y={430} size={200} color={C.coral} at={0.1} />,
      <Label dur={d} text="a dimmer dial" x={540} y={620} w={960} size={86} at={r("dimmer")} />,
      <Label dur={d} text="for belonging" x={540} y={740} w={960} size={86} color={C.cobalt} at={r("belonging")} />,
      <Label dur={d} text="5 marks" x={540} y={960} w={900} size={150} color={C.coral} at={r("Five")} />,
      <Check dur={d} x={540} y={1330} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 960, z: 1.06 }] }),
  ];
};
