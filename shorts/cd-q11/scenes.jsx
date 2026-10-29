import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Layer, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
import { C } from "./theme.jsx";
const CWM = 0.602;
const FADE = [{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.18 }];
function Itx({ dur, x, y, fs = 40, line, at = 0, out, reg = true, on, col }) {
  const cw = fs * CWM;
  if (reg) bb({ k: "label", n: line, x, y, w: line.length * cw, h: fs * 1.25, t0: at, t1: out ?? dur, on });
  return <Layer at={at} dur={dur} out={out} anim={FADE}>
    <text x={x} y={y} width={line.length * cw + 14} fontFamily={C.fMono} fontWeight={700} fontSize={fs} color={col || C.navy}>{line}</text>
  </Layer>;
}
// the .y file: a page with three zones separated by %%
const PX = 60, PY = 330, PW = 700;
const page = (d, at, speed) => Sketch({ dur: d, at, speed, items: [
  { rect: [PX, PY, PW, 1100] },
  { line: [PX, 640, PX + PW, 640] }, { text: "%%", x: 410, y: 655, size: 50, w: 200, color: C.coral }, { line: [PX, 730, PX + PW, 730] },
  { line: [PX, 1090, PX + PW, 1090] }, { text: "%%", x: 410, y: 1105, size: 50, w: 200, color: C.coral }, { line: [PX, 1180, PX + PW, 1180] } ] });
const z1 = (d, t) => [
  <Itx key="a1" dur={d} x={90} y={380} line="%token NUM" at={t[0]} />,
  <Itx key="a2" dur={d} x={90} y={450} line="%{ #include <stdio.h> %}" at={t[1]} />,
];
const z2 = (d, t) => [
  <Itx key="b1" dur={d} x={90} y={780} line="expr : expr '+' term" at={t[0]} />,
  <Itx key="b2" dur={d} x={90} y={850} line="  { $$ = $1 + $3; }" col={C.coral} at={t[1]} />,
  <Itx key="b3" dur={d} x={90} y={920} line="     | term ;" at={t[2]} />,
];
const z3 = (d, t) => [<Itx key="c1" dur={d} x={90} y={1230} line="int main() { yyparse(); }" at={t[0]} />];
const tag = (d, key, text, y, at) => <Label key={key} dur={d} text={text} x={775} y={y} w={270} size={34} align="left" color={C.coral} at={at} />;
// a pipeline box
const PB = (d, key, label, x, y, at, o = {}) => <Box key={key} dur={d} x={x} y={y} w={o.w || 300} h={o.h || 110} size={o.size || 52} label={label} sub={o.sub} tone={o.tone || "a"} at={at} />;
const down = (d, key, x, y1, y2, at, col) => <Arrow key={key} dur={d} x1={x} y1={y1} x2={x} y2={y2} color={col || C.cobalt} width={7} at={at} />;
const LX = 270, RX = 810, R1 = 440, R2 = 660, R3 = 880;
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Discuss how YACC can be used to generate a parser.", n: 11, marks: 5, y: 540 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "generate", x: 540, y: 780, z: 1.05 }] }),

  // 2. from zero: YACC prints the parser from your grammar (a 3D printer)
  S("let's start", (r, d) => [
    <Head key="h" dur={d} text="YACC" y={165} size={130} sub="writes the parser for you" at={0.1} />,
    <Box key="p" dur={d} x={720} y={500} w={380} h={120} size={60} label="parser" tone="b" at={r("parser")} out={r("parser in")} />,
    <Box key="ph" dur={d} x={720} y={500} w={380} h={120} size={60} label="parser" tone="hot" at={r("parser in")} />,
    <Label key="pl" dur={d} text={"checks the grammar\nof a program"} x={60} y={460} w={440} size={36} align="left" at={r("parser") + 0.5} />,
    <Label key="sl" dur={d} text="by hand = slow" x={60} y={640} w={440} size={40} align="left" color={C.coral} at={r("slow")} />,
    PB(d, "y", "YACC", 720, 900, r("wac"), { w: 380, h: 120, tone: "hot", size: 60 }),
    down(d, "a1", 720, 835, 570, r("writes"), C.cobalt),
    <Label key="al" dur={d} text="prints the machine" x={60} y={760} w={440} size={36} align="left" color={C.coral} at={r("machine")} />,
    <Label key="pr" dur={d} text="a 3D printer" x={60} y={880} w={440} size={36} align="left" color={C.coral} at={r("printer")} />,
    <Box key="g" dur={d} x={720} y={1250} w={380} h={120} size={60} label="grammar" tone="a" at={r("design")} out={r("your grammar")} />,
    <Box key="gh" dur={d} x={720} y={1250} w={380} h={120} size={60} label="grammar" tone="hot" at={r("your grammar")} />,
    down(d, "a2", 720, 1185, 970, r("design"), C.cobalt),
    <Label key="dl" dur={d} text="the design" x={60} y={1075} w={440} size={36} align="left" color={C.coral} at={r("design")} />,
  ], { hold: "machine is", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: 1, x: 540, y: 880, z: 1.0 }] }),

  // 3. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 480, size: 74, w: 960 },
      { text: "1.  what goes in", x: 190, y: 680, size: 60, w: 840, align: "left", at: r("what you") },
      { text: "2.  the steps", x: 190, y: 860, size: 60, w: 840, align: "left", at: r("steps") } ] }),
    <Check key="k1" dur={d} x={130} y={708} size={70} at={r("what you") + 1.4} />,
    <Check key="k2" dur={d} x={130} y={888} size={70} at={r("steps") + 1.6} />,
  ]),

  // 4. the .y file: one file, three parts separated by %%
  S("you give wac one", (r, d) => [
    <Head key="h" dur={d} text="calc.y" y={165} size={85} sub="one file, three parts" at={0.1} />,
    ...page(d, r("one file"), 2600),
    <Label key="t" dur={d} text="three parts" x={775} y={560} w={270} size={34} align="left" color={C.coral} at={r("three parts")} />,
  ], { hold: "percent", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: 1, x: 540, y: 880, z: 1.0 }] }),

  // 5. part 1: declarations
  S("first declarations", (r, d) => [
    ...page(d, 0.05, 99999),
    tag(d, "t1", "declarations", 380, r("declarations")),
    ...z1(d, [r("tokens"), r("c header")]),
  ], { hold: "code", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: 1, x: 540, y: 880, z: 1.0 }] }),

  // 6. part 2: rules with actions
  S("second rules", (r, d) => [
    ...page(d, 0.05, 99999),
    ...z1(d, [0.1, 0.1]),
    tag(d, "t2", "rules", 780, r("rules")),
    ...z2(d, [r("grammar"), r("action"), r("each rule")]),
    tag(d, "t3", "action", 850, r("action")),
  ], { hold: "each rule", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: 1, x: 540, y: 880, z: 1.0 }] }),

  // 7. part 3: supporting C routines
  S("third supporting", (r, d) => [
    ...page(d, 0.05, 99999),
    ...z1(d, [0.1, 0.1]),
    ...z2(d, [0.1, 0.1, 0.1]),
    tag(d, "t4", "C routines", 1230, r("supporting")),
    ...z3(d, [r("main")]),
  ], { hold: "main", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: 1, x: 540, y: 880, z: 1.0 }] }),

  // 8a. an action is C code that runs when the rule is used
  S("an action is", (r, d) => [
    <Head key="h" dur={d} text="action" y={165} size={130} sub="C code run with the rule" at={0.1} />,
    <Itx key="r" dur={d} x={179} y={480} fs={60} line="expr : expr '+' term" at={0.3} />,
    <Itx key="ac" dur={d} x={233} y={590} fs={60} line="{ $$ = $1 + $3; }" col={C.coral} at={r("action")} />,
    PB(d, "u", "rule is used", 300, 900, r("when"), { w: 420, h: 120, tone: "a", size: 48 }),
    <Arrow key="ar" dur={d} x1={520} y1={900} x2={590} y2={900} color={C.cobalt} width={7} at={r("runs")} />,
    PB(d, "ru", "action runs", 800, 900, r("runs"), { w: 380, h: 120, tone: "hot", size: 48 }),
  ], { hold: "used", holdY: 760 }),

  // 8b. $$ and $1 $3
  S("dollar dollar is", (r, d) => [
    <Head key="h" dur={d} text="$ names" y={165} size={130} sub="positions in the rule" at={0.1} />,
    <Itx key="r" dur={d} x={179} y={480} fs={60} line="expr : expr '+' term" at={0.3} />,
    <Label key="d0" dur={d} text="$$" x={251} y={590} w={140} size={52} color={C.coral} at={r("dollar dollar")} />,
    <Label key="d1" dur={d} text="$1" x={504} y={590} w={140} size={52} color={C.coral} at={r("dollar one")} />,
    <Label key="d2" dur={d} text="$2" x={666} y={590} w={140} size={52} color={C.coral} at={r("dollar one") + 0.5} />,
    <Label key="d3" dur={d} text="$3" x={829} y={590} w={140} size={52} color={C.coral} at={r("dollar three")} />,
    <Label key="l1" dur={d} text="$$ = value of the left side" x={540} y={800} w={980} size={42} at={r("left side")} />,
    <Label key="l2" dur={d} text="$1 $3 = values of the right side" x={540} y={900} w={980} size={42} at={r("right side")} />,
  ], { hold: "right side", holdY: 760 }),

  // 8c. worked: 3 + 4 = 7
  S("xper goes to", (r, d) => [
    <Head key="h" dur={d} text="3 + 4" y={165} size={130} sub="the action adds the values" at={0.1} />,
    <Box key="p0" dur={d} x={540} y={520} w={300} h={140} size={60} label="expr" sub="$$ = ?" tone="a" at={0.3} out={r("adds") + 0.4} />,
    <Box key="p1" dur={d} x={540} y={520} w={300} h={140} size={60} label="expr" sub="$$ = 7" tone="hot" at={r("adds") + 0.4} />,
    <Arrow key="e1" dur={d} x1={490} y1={595} x2={220} y2={745} head={false} width={5} at={r("goes")} />,
    <Arrow key="e2" dur={d} x1={540} y1={595} x2={540} y2={745} head={false} width={5} at={r("goes") + 0.1} />,
    <Arrow key="e3" dur={d} x1={590} y1={595} x2={860} y2={745} head={false} width={5} at={r("goes") + 0.2} />,
    <Box key="c1" dur={d} x={200} y={830} w={300} h={140} size={60} label="expr" sub="$1 = 3" tone="a" at={r("goes")} />,
    <Box key="c2" dur={d} x={540} y={830} w={160} h={140} size={64} label="+" tone="b" at={r("goes") + 0.1} />,
    <Box key="c3" dur={d} x={880} y={830} w={300} h={140} size={60} label="term" sub="$3 = 4" tone="a" at={r("goes") + 0.2} />,
    <Label key="f1" dur={d} text="$$ = $1 + $3" x={540} y={1090} w={900} size={56} color={C.coral} at={r("equals")} />,
    <Label key="f2" dur={d} text="= 3 + 4 = 7" x={540} y={1190} w={900} size={56} at={r("adds")} />,
  ], { hold: "values", holdY: 800, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: 1, x: 540, y: 800, z: 1.0 }] }),

  // 9a. step 1: run YACC on the file
  S("now the steps", (r, d) => [
    <Head key="h" dur={d} text="step 1" y={165} size={120} sub="run YACC on the file" at={0.1} />,
    PB(d, "f", "calc.y", LX, R1, 0.3),
    down(d, "a1", LX, R1 + 60, R2 - 62, r("wac") - 0.3),
    PB(d, "y", "YACC", LX, R2, r("wac"), { tone: "hot" }),
    down(d, "a2", LX, R2 + 60, R3 - 62, r("produces")),
    PB(d, "o", "y.tab.c", LX, R3, r("produces") + 0.2, { tone: "b", sub: "the parser" }),
    <Label key="t" dur={d} text="built on LALR tables" x={LX} y={965} w={440} size={34} color={C.coral} at={r("lalr")} />,
  ], { hold: "tables", holdY: 760, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 1, x: 540, y: 760, z: 1.0 }] }),

  // 9b. step 2: Lex makes yylex
  S("two lex makes", (r, d) => [
    <Head key="h" dur={d} text="step 2" y={165} size={120} sub="Lex makes yylex" at={0.1} />,
    PB(d, "f", "calc.y", LX, R1, 0.05),
    down(d, "a1", LX, R1 + 60, R2 - 62, 0.05),
    PB(d, "y", "YACC", LX, R2, 0.05, { tone: "hot" }),
    down(d, "a2", LX, R2 + 60, R3 - 62, 0.05),
    PB(d, "o", "y.tab.c", LX, R3, 0.05, { tone: "b", sub: "the parser" }),
    PB(d, "g", "calc.l", RX, R1, 0.5),
    down(d, "b1", RX, R1 + 60, R2 - 62, r("lex makes") + 0.2),
    PB(d, "l", "Lex", RX, R2, r("lex makes") + 0.3, { tone: "hot" }),
    down(d, "b2", RX, R2 + 60, R3 - 62, r("lex dot")),
    PB(d, "q", "lex.yy.c", RX, R3, r("lex dot") + 0.3, { tone: "b", sub: "yylex()" }),
    <Arrow key="tk" dur={d} x1={655} y1={R3} x2={436} y2={R3} color={C.coral} width={8} at={r("hands")} />,
    <Label key="tl" dur={d} text="tokens" x={545} y={R3 - 70} w={220} size={38} color={C.coral} at={r("hands")} />,
  ], { hold: "parser", holdY: 760, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 1, x: 540, y: 760, z: 1.0 }] }),

  // 9c. step 3: compile both
  S("three compile", (r, d) => [
    <Head key="h" dur={d} text="step 3" y={165} size={120} sub="compile both C files" at={0.1} />,
    PB(d, "f", "calc.y", LX, R1, 0.05),
    down(d, "a1", LX, R1 + 60, R2 - 62, 0.05),
    PB(d, "y", "YACC", LX, R2, 0.05, { tone: "hot" }),
    down(d, "a2", LX, R2 + 60, R3 - 62, 0.05),
    PB(d, "o", "y.tab.c", LX, R3, 0.05, { tone: "b", sub: "the parser" }),
    PB(d, "g", "calc.l", RX, R1, 0.05),
    down(d, "b1", RX, R1 + 60, R2 - 62, 0.05),
    PB(d, "l", "Lex", RX, R2, 0.05, { tone: "hot" }),
    down(d, "b2", RX, R2 + 60, R3 - 62, 0.05),
    PB(d, "q", "lex.yy.c", RX, R3, 0.05, { tone: "b", sub: "yylex()" }),
    <Arrow key="d1" dur={d} x1={LX + 40} y1={R3 + 62} x2={450} y2={1065} color={C.cobalt} width={7} at={r("both")} />,
    <Arrow key="d2" dur={d} x1={RX - 40} y1={R3 + 62} x2={630} y2={1065} color={C.cobalt} width={7} at={r("both")} />,
    PB(d, "cc", "C compiler", 540, 1130, r("compile"), { w: 380, h: 120, tone: "a", size: 50 }),
    down(d, "a3", 540, 1190, 1280, r("result"), C.coral),
    PB(d, "pa", "your parser", 540, 1350, r("result"), { w: 460, h: 130, tone: "hot", size: 56, sub: "a.out" }),
  ], { hold: "your parser", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 10. at run time: yyparse asks yylex for tokens
  S("when it runs", (r, d) => [
    <Head key="h" dur={d} text="at run time" y={165} size={120} sub="yyparse calls yylex" at={0.1} />,
    PB(d, "p", "yyparse()", 270, 620, 0.3, { w: 380, h: 130, tone: "hot", size: 50 }),
    PB(d, "l", "yylex()", 810, 620, 0.5, { w: 300, h: 130, tone: "a", size: 50 }),
    <Arrow key="ak" dur={d} x1={475} y1={590} x2={655} y2={590} color={C.cobalt} width={7} at={r("asks")} />,
    <Label key="al" dur={d} text="next token?" x={565} y={470} w={300} size={34} color={C.coral} at={r("asks")} />,
    <Mascot key="tk" dur={d} at={r("token")} out={r("token") + 1.5} size={150} tag="id" pts={[{ t: r("token"), x: 810, y: 800, look: [-1, 0] }, { t: r("token") + 1.4, x: 300, y: 800, look: [-1, 0], mood: "happy" }]} />,
    down(d, "a1", 270, 690, 895, r("shifts"), C.cobalt),
    PB(d, "s", "shift / reduce", 270, 960, r("shifts"), { w: 400, h: 120, tone: "a", size: 44, sub: "using the tables" }),
    down(d, "a2", 270, 1025, 1135, r("runs your"), C.cobalt),
    PB(d, "ac", "your action", 270, 1200, r("runs your"), { w: 400, h: 120, tone: "hot", size: 48, sub: "at every reduce" }),
  ], { hold: "every reduce", holdY: 800, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: 1, x: 540, y: 800, z: 1.0 }] }),

  // 11. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 170, fs: 36, title: "WRITE THIS · 5 MARKS", points: [
      "Write a .y file in 3 parts: declarations %% rules (grammar + C actions) %% C routines.",
      "Run YACC: yacc calc.y gives y.tab.c (LALR parser, yyparse).",
      "Run Lex: lex calc.l gives lex.yy.c (yylex returns tokens).",
      "Compile both: cc y.tab.c lex.yy.c gives the parser. yyparse calls yylex, shifts, reduces, runs actions." ],
      times: [r("the three"), r("wac makes"), r("lex makes"), r("compile both")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 12. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: ".y goes in", x: 540, y: 540, size: 110, w: 960 },
      { text: "parser comes out", x: 540, y: 690, size: 90, w: 960, color: C.coral },
      { line: [140, 850, 940, 850], color: C.cobalt },
      { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("five marks") } ] }),
    <Check key="ck" dur={d} x={540} y={1330} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "marks", x: 540, y: 1000, z: 1.06 }] }),
];
