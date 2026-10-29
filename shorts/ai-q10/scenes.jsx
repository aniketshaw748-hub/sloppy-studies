import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer, Mover, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
const popA = (at = 0) => [{ property: "opacity", from: 0, to: 1, at, duration: 0.15 }, { property: "scale", from: 0.6, to: 1, at, duration: 0.3, easing: "bounce" }];
// box with mono text (math glyphs: α β ∞ ≥ ≤)
const MBox = ({ C, x, y, w = 260, h = 90, text, tone = "a", size = 44, at = 0, out, dur }) => {
  bb({ k: "box", n: text, x: x - w / 2, y: y - h / 2, w: w + 9, h: h + 9, t0: at, t1: out ?? dur });
  const f = tone === "hot" ? C.coral : tone === "b" ? C.cobalt : C.chip, tc = tone === "a" ? C.chipText : C.ink;
  return <Layer at={at} dur={dur} out={out} anim={popA(0)} sfx="pop">
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} radius={14} fill={f} strokeColor={C.navy} strokeWidth={4} />
    <text x={x - w / 2} y={y - size * 0.62} width={w} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={size} color={tc}>{text}</text>
  </Layer>; };
const Edge = ({ x1, y1, x2, y2, at, dur }) => <Arrow x1={x1} y1={y1} x2={x2} y2={y2} at={at} dur={dur} head={false} width={5} />;

// the nine-leaf game tree used for minimax and alpha-beta
const RX = 532, RY = 360, MX = [208, 532, 856], MY = 670, LX = i => 100 + i * 108, LY = 980;
const V = [3, 12, 8, 2, 4, 6, 14, 5, 2];
const Skel = ({ C, d, at = 0, k = "s", minOut, rootOut }) => [
  ...MX.map((x, g) => <Edge key={k + "re" + g} x1={RX} y1={RY + 58} x2={x} y2={MY - 58} at={at} dur={d} />),
  <Box key={k + "root"} dur={d} x={RX} y={RY} w={240} h={110} label="MAX" tone="hot" size={56} at={at} out={rootOut} />,
  ...MX.map((x, g) => (minOut && minOut[g] === -1) ? null : <Box key={k + "min" + g} dur={d} x={x} y={MY} w={210} h={110} label="MIN" tone="b" size={56} at={at + 0.15 + g * 0.1} out={minOut ? minOut[g] : undefined} />),
];
const Leaf = ({ d, i, at, out, val, tone = "a", k = "l" }) => [
  <Edge key={k + "e" + i} x1={MX[Math.floor(i / 3)]} y1={MY + 58} x2={LX(i)} y2={LY - 48} at={at} dur={d} />,
  <Box key={k + "b" + i} dur={d} x={LX(i)} y={LY} w={96} h={90} label={val == null ? "?" : String(val)} tone={val == null ? "ghost" : tone} size={48} at={at} out={out} />,
];

export const SCENES = ({ S, ctx, C }) => [
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Explain Alpha-Beta Pruning and show how it improves Minimax.", n: 10, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "minimax", x: 540, y: 780, z: 1.06 }] }),

  // from zero: a game tree, MAX and MIN
  S("let's start", (r, d) => [
    <Head dur={d} text="a game tree" y={170} size={120} sub="imagine the future" at={0.1} />,
    <Edge key="e1" x1={532} y1={528} x2={300} y2={712} at={r("tree")} dur={d} />, <Edge key="e2" x1={532} y1={528} x2={764} y2={712} at={r("tree")} dur={d} />,
    <Box key="n0" dur={d} x={532} y={470} w={200} h={100} label="now" size={48} at={r("tree") - 0.2} out={r("max")} />,
    <Box key="m0" dur={d} x={532} y={470} w={200} h={100} label="MAX" tone="hot" size={52} at={r("max")} />,
    <Box key="n1" dur={d} x={300} y={760} w={200} h={100} label="" at={r("moves")} out={r("min")} />, <Box key="n2" dur={d} x={764} y={760} w={200} h={100} label="" at={r("moves") + 0.15} out={r("min")} />,
    <Box key="m1" dur={d} x={300} y={760} w={200} h={100} label="MIN" tone="b" size={52} at={r("min")} />, <Box key="m2" dur={d} x={764} y={760} w={200} h={100} label="MIN" tone="b" size={52} at={r("min")} />,
    ...[[300, 170], [300, 430], [764, 634], [764, 894]].map(([px, lx], i) => <Edge key={"le" + i} x1={px} y1={810} x2={lx} y2={1005} at={r("leaf") + i * 0.15} dur={d} />),
    ...[8, 3, 5, 9].map((v, i) => <Box key={"lf" + i} dur={d} x={[170, 430, 634, 894][i]} y={1050} w={130} h={90} label={String(v)} size={52} at={r("leaf") + 0.15 + i * 0.15} />),
    <Ring dur={d} x={894} y={1050} r={85} at={r("high")} />,
    <Label dur={d} text="high = good for you" x={540} y={1170} w={900} size={48} color={C.coral} at={r("high")} out={r("low")} />,
    <Ring dur={d} x={430} y={1050} r={85} at={r("low")} />,
    <Label dur={d} text="low = good for your opponent" x={540} y={1170} w={960} size={48} at={r("low")} />,
    <Label dur={d} text="you pick the highest" x={540} y={1260} w={900} size={46} color={C.coral} at={r("highest")} />,
    <Label dur={d} text="opponent picks the lowest" x={540} y={1330} w={900} size={46} at={r("lowest")} />,
  ], { hold: "lowest", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "tree", x: 540, y: 880, z: 1.03 }, { t: "high", x: 540, y: 940, z: 1.04 }] }),

  // what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  what alpha-beta pruning is", x: 110, y: 720, size: 50, w: 900, align: "left", at: r("what") },
      { text: "2.  how it improves minimax", x: 110, y: 880, size: 50, w: 900, align: "left", at: r("how") }] }),
    <Check dur={d} x={70} y={758} size={70} at={r("what") + 1.6} />,
    <Check dur={d} x={70} y={918} size={70} at={r("how") + 1.6} />,
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "how", x: 540, y: 860, z: 1.05 }] }),

  // minimax: check every leaf, back the values up
  S("minimax first", (r, d) => {
    const vt = [r("three"), r("twelve"), r("eight"), r("two"), r("four"), r("six"), r("fourteen"), r("fourteen") + 0.8, r("fourteen") + 1.3];
    const mt = [r("min takes"), r("six") + 1.0, r("fourteen") + 2.2], mr = [3, 2, 2];
    return [
      <Head dur={d} text="minimax" y={150} size={100} at={0.1} />,
      ...MX.map((x, g) => <Edge key={"re" + g} x1={RX} y1={RY + 58} x2={x} y2={MY - 58} at={0.2} dur={d} />),
      <Box key="root" dur={d} x={RX} y={RY} w={240} h={110} label="MAX" tone="hot" size={56} at={0.2} out={r("picks") + 0.1} />,
      <Box key="rootv" dur={d} x={RX} y={RY} w={240} h={110} label="3" sub="MAX" tone="hot" size={64} at={r("picks") + 0.1} />,
      ...MX.map((x, g) => <Box key={"min" + g} dur={d} x={x} y={MY} w={210} h={110} label="MIN" tone="b" size={56} at={0.35 + g * 0.1} out={mt[g]} />),
      ...MX.map((x, g) => <Box key={"minv" + g} dur={d} x={x} y={MY} w={210} h={110} label={String(mr[g])} sub="MIN" tone="hot" size={64} at={mt[g]} />),
      ...V.flatMap((v, i) => [
        <Edge key={"le" + i} x1={MX[Math.floor(i / 3)]} y1={MY + 58} x2={LX(i)} y2={LY - 48} at={r("every") + i * 0.07} dur={d} />,
        <Box key={"ls" + i} dur={d} x={LX(i)} y={LY} w={96} h={90} label="?" tone="ghost" size={48} at={r("every") + i * 0.07} out={vt[i]} />,
        <Box key={"lv" + i} dur={d} x={LX(i)} y={LY} w={96} h={90} label={String(v)} size={52} at={vt[i]} />]),
      <Ring dur={d} x={MX[0]} y={MY} r={95} at={r("smallest")} />,
      <Ring dur={d} x={RX} y={RY} r={105} at={r("largest")} />,
      <Label dur={d} text="all 9 leaves checked" x={540} y={1160} w={900} size={56} color={C.coral} at={r("nine")} />,
    ];
  }, { hold: "right", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "every", x: 540, y: 920, z: 1.03 }, { t: "three", x: 540, y: 940, z: 1.04 }, { t: "fourteen", x: 540, y: 920, z: 1.04 }] }),

  // alpha-beta: same answer, skips branches; two numbers
  S("alpha beta pruning gives", (r, d) => [
    <Head dur={d} text="same answer" y={170} size={110} sub="skips useless branches" at={0.1} />,
    <Ico dur={d} ctx={ctx} name="scissors" x={540} y={640} size={230} color={C.coral} at={r("skips")} out={r("carries")} />,
    <Label dur={d} text="branches that cannot change it" x={540} y={790} w={900} size={46} at={r("branches")} out={r("carries")} />,
    <Label dur={d} text="it carries two numbers" x={540} y={420} w={960} size={56} color={C.coral} at={r("carries")} />,
    <MBox C={C} dur={d} x={300} y={560} w={300} h={140} text="α" tone="hot" size={96} at={r("alpha the best")} />,
    <Label dur={d} text={"MAX's floor\nbest score MAX\nis already guaranteed"} x={300} y={650} w={470} size={36} at={r("best")} />,
    <MBox C={C} dur={d} x={780} y={560} w={300} h={140} text="β" tone="b" size={96} at={r("beta the best")} />,
    <Label dur={d} text={"MIN's ceiling\nbest score MIN\nis already guaranteed"} x={780} y={650} w={470} size={36} at={r("beta the best") + 0.9} />,
    ...Sketch({ dur: d, at: r("start"), speed: 3600, items: [{ line: [60, 1010, 1020, 1010] }] }),
    <Label dur={d} text="−∞" x={130} y={1050} w={160} size={50} font={C.fMono} at={r("minus")} />,
    <Label dur={d} text="+∞" x={950} y={905} w={160} size={50} font={C.fMono} at={r("plus")} />,
    <MBox C={C} dur={d} x={130} y={940} w={110} h={80} text="α" tone="hot" size={46} at={r("minus") + 0.2} out={r("if") + 0.3} />,
    <MBox C={C} dur={d} x={950} y={1080} w={110} h={80} text="β" tone="b" size={46} at={r("plus") + 0.2} out={r("if") + 0.3} />,
    <Mover dur={d} cw={110} ch={80} at={r("if") + 0.3} pts={[{ t: r("if") + 0.3, x: 130, y: 940 }, { t: r("equal") + 0.2, x: 600, y: 940 }]}>
      <rect x={0} y={0} width={110} height={80} radius={14} fill={C.coral} strokeColor={C.navy} strokeWidth={4} />
      <text x={0} y={14} width={110} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={46} color={C.ink}>α</text>
    </Mover>,
    <Mover dur={d} cw={110} ch={80} at={r("if") + 0.3} pts={[{ t: r("if") + 0.3, x: 950, y: 1080 }, { t: r("equal") + 0.2, x: 440, y: 1080 }]}>
      <rect x={0} y={0} width={110} height={80} radius={14} fill={C.cobalt} strokeColor={C.navy} strokeWidth={4} />
      <text x={0} y={14} width={110} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={46} color={C.ink}>β</text>
    </Mover>,
    <Label dur={d} text="α ≥ β : prune" x={540} y={1230} w={900} size={64} font={C.fMono} color={C.coral} at={r("prune")} />,
  ], { hold: "prune", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "alpha", x: 540, y: 860, z: 1.03 }, { t: "minus", x: 540, y: 920, z: 1.04 }] }),

  // watch: the first two MIN nodes
  S("watch", (r, d) => [
    <Head dur={d} text="alpha-beta" y={150} size={100} at={0.1} />,
    ...Skel({ C, d, at: 0.2, k: "w", minOut: [r("gives"), r("less") - 0.3, undefined] }),
    <Box key="w1" dur={d} x={MX[0]} y={MY} w={210} h={110} label="3" sub="MIN" tone="hot" size={64} at={r("gives")} />,
    <MBox key="w2" C={C} dur={d} x={MX[1]} y={MY} w={210} h={110} text="≤2" tone="hot" size={60} at={r("less") - 0.3} />,
    ...V.flatMap((v, i) => Leaf({ d, i, at: 0.3 + i * 0.05, val: v, k: "w" })),
    <MBox C={C} dur={d} x={190} y={360} w={270} h={90} text="α = −∞" tone="hot" at={0.7} out={r("alpha")} />,
    <MBox C={C} dur={d} x={190} y={360} w={270} h={90} text="α = 3" tone="hot" at={r("alpha")} />,
    <MBox C={C} dur={d} x={880} y={360} w={270} h={90} text="β = +∞" tone="b" at={0.8} />,
    <Ring dur={d} x={LX(3)} y={LY} r={70} at={r("two")} />,
    <MBox C={C} dur={d} x={780} y={1140} w={290} h={90} text="β = 2" tone="b" at={r("can now")} />,
    <MBox C={C} dur={d} x={290} y={1140} w={290} h={90} text="α = 3" tone="hot" at={r("already")} />,
    <MBox C={C} dur={d} x={535} y={1140} w={110} h={90} text="≥" tone="a" size={56} at={r("never")} />,
    <Label dur={d} text="prune!" x={540} y={1260} w={700} size={76} color={C.coral} at={r("prune")} />,
    <XMark dur={d} x={LX(4)} y={LY} size={70} at={r("prune") + 0.15} />, <XMark dur={d} x={LX(5)} y={LY} size={70} at={r("prune") + 0.45} />,
  ], { hold: "six", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "gives", x: 540, y: 880, z: 1.03 }, { t: "second", x: 540, y: 920, z: 1.04 }, { t: "prune", x: 540, y: 940, z: 1.04 }] }),

  // the third node: searched fully, same answer
  S("the third node", (r, d) => [
    <Head dur={d} text="same answer" y={150} size={100} at={0.1} />,
    ...Skel({ C, d, at: 0.2, k: "t", minOut: [-1, -1, r("fully")], rootOut: r("same") + 0.3 }),
    <Box key="trv" dur={d} x={RX} y={RY} w={240} h={110} label="3" sub="MAX" tone="hot" size={64} at={r("same") + 0.3} />,
    <Box key="t1" dur={d} x={MX[0]} y={MY} w={210} h={110} label="3" sub="MIN" tone="hot" size={64} at={0.2 + 0.15} />,
    <MBox key="t2" C={C} dur={d} x={MX[1]} y={MY} w={210} h={110} text="≤2" tone="hot" size={60} at={0.2 + 0.25} />,
    <Box key="t3" dur={d} x={MX[2]} y={MY} w={210} h={110} label="2" sub="MIN" tone="hot" size={64} at={r("fully")} />,
    ...V.flatMap((v, i) => Leaf({ d, i, at: 0.3 + i * 0.05, val: v, k: "t" })),
    <XMark dur={d} x={LX(4)} y={LY} size={70} at={0.9} />, <XMark dur={d} x={LX(5)} y={LY} size={70} at={0.9} />,
    <Ring dur={d} x={MX[2]} y={LY} r={175} at={r("searched")} />,
    <Label dur={d} text="answer: 3 (same as minimax)" x={540} y={1160} w={960} size={50} color={C.coral} at={r("answer")} />,
    <Label dur={d} text="2 of 9 leaves skipped" x={540} y={1250} w={900} size={52} at={r("skipped") - 0.3} />,
  ], { hold: "skipped", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "searched", x: 540, y: 930, z: 1.04 }] }),

  // improvement: less work, about twice as deep
  S("so same best", (r, d) => [
    <Head dur={d} text="less work" y={170} size={130} sub="same best move" at={0.1} />,
    <Label dur={d} text="minimax checks 9 leaves" x={60} y={425} w={900} size={40} align="left" at={r("best")} />,
    ...Array.from({ length: 9 }, (_, i) => <Box key={"m" + i} dur={d} x={100 + i * 80} y={525} w={64} h={64} label="" tone="a" at={r("best") + 0.2 + i * 0.05} />),
    <Label dur={d} text="alpha-beta checks 7" x={60} y={610} w={900} size={40} align="left" color={C.coral} at={r("less")} />,
    ...Array.from({ length: 9 }, (_, i) => (i === 4 || i === 5) ? <Box key={"a" + i} dur={d} x={100 + i * 80} y={705} w={64} h={64} label="" tone="ghost" at={r("less") + 0.2 + i * 0.05} /> : <Box key={"a" + i} dur={d} x={100 + i * 80} y={705} w={64} h={64} label="" tone="hot" at={r("less") + 0.2 + i * 0.05} />),
    <XMark dur={d} x={100 + 4 * 80} y={705} size={44} at={r("work")} />, <XMark dur={d} x={100 + 5 * 80} y={705} size={44} at={r("work") + 0.2} />,
    <Label dur={d} text="depth searched in the same time" x={540} y={810} w={960} size={42} at={r("ordering")} />,
    <Box dur={d} x={210} y={930} w={300} h={110} label="minimax" tone="a" size={46} at={r("searches")} />,
    <Box dur={d} x={510} y={1090} w={900} h={110} label="alpha-beta" tone="hot" size={54} at={r("twice")} />,
    <Label dur={d} text="about twice as deep" x={540} y={1200} w={900} size={60} color={C.coral} at={r("twice") + 0.3} />,
    <Label dur={d} text="with good move ordering" x={540} y={1290} w={900} size={44} at={r("time") - 0.6} />,
  ], { hold: "time", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "best", x: 540, y: 880, z: 1.03 }, { t: "twice", x: 540, y: 920, z: 1.03 }] }),

  // exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
      "Alpha is MAX's best so far, beta is MIN's best so far.",
      "Prune when alpha is greater than or equal to beta.",
      "Same result as minimax, fewer nodes."],
      times: [r("alpha"), r("prune"), r("same")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  S("to remember", (r, d) => [
    <Head dur={d} text="remember" y={170} size={120} at={0.05} />,
    ...Sketch({ dur: d, at: 0.4, items: [
      { text: "alpha = MAX's floor", x: 540, y: 480, size: 78, w: 940, at: r("alpha") },
      { text: "beta = MIN's ceiling", x: 540, y: 620, size: 78, w: 940, at: r("beta") },
      { text: "5 marks", x: 540, y: 860, size: 140, w: 900, color: C.coral, at: r("five") }] }),
    <Check dur={d} x={540} y={1250} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.02 }, { t: "five", x: 540, y: 900, z: 1.06 }] }),
];
