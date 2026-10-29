# Sloppy Studies: builder brief (v3: the teaching format)

You make **one vertical explainer short per exam question** for *Sloppy Studies*, a Reels-style study platform. It must **teach someone who has never studied the subject**, well enough that they can write the exam answer, while staying visually gripping. Every frame is drawn by code in the **Higgsfield cloud sandbox** (Higgsedit). Never generate images or video. The only paid step is the ElevenLabs voiceover, and it is pre-approved.

## The format (from the user: it must take its time and actually explain)
Length: **80–115 s for 5-mark questions, 40–65 s for 2-mark questions.** The take is about 230–290 words (5 marks) or 110–160 words (2 marks).
1. **The question:** a `QuestionCard` shows it while the narrator reads it ("Today's question. …").
2. **The topic from zero:** what this thing is, in plain words, plus ONE everyday analogy that the visuals then use (a car's parts = modules, a restaurant order = a queue, a library card catalogue = an index…). Assume the viewer knows nothing.
3. **What the question is asking:** "So the question wants two things: …", drawn as a short checklist.
4. **Teach it step by step.** One idea per scene. The visual for each idea is BUILT on the words that explain it, then **HELD**: the scene's `hold: "phrase"` pulls the camera back to the whole picture and the music resolves, while the narrator recaps it in one sentence ("So: …"). Put a `[pause]` tag in the take after each idea. Never rush to the next idea before the current one is complete on screen.
5. **The exam answer:** an `AnswerSheet` fills in the exact points to write, one per sentence of "So in your exam, write this…".
6. **Memory trick + payoff:** one line, then "<N> marks. Secured."
Voice direction: open the take with `[warm, clear teacher, friendly and patient]`. Never write "slow" in a tag. Keep it lively through word choice and analogies, not speed. Humour comes from the analogies and the mascot's reactions; it never replaces the explanation.
**All old voice.mp3 files are from the obsolete fast format. Move any existing one to `<dir>/old/` and voice a NEW take.** (Exception: se-q01 is the finished exemplar. Don't touch it.)

## The user's rules (non-negotiable)
1. **Everything on screen has a purpose, including the style.** No decoration, no filler props, no characters for their own sake. Each visual must SHOW the concept: a process animating, data moving, a tree, table or curve building, a cause → effect, a before/after.
2. **Visual, not text.** Text cards are not explanations. Most scenes are diagrams or processes in motion. Headlines are optional.
3. **Immersive and attention-grabbing:** a hook in the first second, the camera moves on every line, cuts land on the spoken cue, and there's a payoff at the end.
4. **No unintentional overlaps, anywhere.** The overlap checker (`overlaps.txt`) must report `OVERLAPS=0` before a short is done. Intentional overlap is allowed: a label inside its own box, anything fully inside a container, annotations (rings, X marks, checks, arrows), the marker drawing, things passing by while moving, and anything you mark with the `on` prop because it deliberately sits on something (a token on the stack, a crate on the shelf, a bug inside a program box). Fix the layout for every other flag; never silence a real collision with `on`.
5. **Correctness:** exact textbook definitions and terms, and fully worked results for grammar, algorithm and numerical questions. Work the solution out completely before scripting, and double-check every set, table entry and number.

## Build order (from the user)
- **Draw the object first, then label it.** Never label a part that isn't drawn yet. In a scene, `Sketch` calls run strictly one after another (the kit enforces it), so put the object's Sketch first and its labels in later Sketch calls. Use `together: true` only when the concept itself is simultaneous (big bang = everything at once).
- **Build top to bottom.** Headline → the main object → its parts/labels below → the definition or recap at the bottom. Arrows point from the object to its label and must not cut through other drawings.
- Non-Sketch prims (Box, Ico, Table…) must also appear only after what they refer to exists. Set their `at` accordingly.
- Start the object's drawing on the sentence that introduces it (e.g. "Think of a car"), so it's complete by the time its parts are named.

## Each subject's world (its style and protagonist have a reason; use them that way)
| subject | theme | why this look | mascot (`<Mascot>`) and what it IS | voice | voice_id | stab. |
|---|---|---|---|---|---|---|
| se | `whiteboard` | UML is drawn on whiteboards; the exam asks you to DRAW | **no mascot** (the user removed the pencil). Use `Sketch`: diagrams draw themselves stroke by stroke in exam order; dashed = fake/optional | Kevin | f1373f24-3b96-433f-9a68-e595810ef608 | 0.45 |
| cd | `terminal` | a compiler lives in the terminal | **Tok**, a token-cursor. It IS the input symbol: it gets scanned, shifted onto the stack, reduced, and travels down parse trees. Its `tag` = the token (id, +, a…) | Gideon | 1ad38ba4-9cc4-4f2f-9fde-b0fefdf67ae5 | 0.40 |
| oop | `blueprint` | a class is a blueprint; objects are built from it | **Obj**, an object instance (`tag` = class name). It's instantiated from the blueprint, holds fields, throws exceptions up the call stack, and runs as a thread | Kiki | 2d51d9d0-b2a4-5e8b-9c63-f310adafd5f7 | 0.45 |
| im | `warehouse` | inventory, production and flow on a shop floor | **Crate**, a unit of inventory (`tag` = qty/label). It rides through the project network, piles up and depletes (the EOQ sawtooth), gets ordered or purchased | Desmond | 563f728c-e249-5a85-97ab-8461e8c09da6 | 0.45 |
| ai | `night` | AI = an agent searching a state space | **Bot**, the agent. It moves node to node, and what it looks at (`look`) is what it's evaluating. Its `tag` = its current value or belief | Zoe | d0374db1-44b9-4f05-939e-0a9ae9dbbe6a | 0.40 |

The mascot appears only when it is acting out the concept (moving, being transformed, reacting to a result). Its `look` points at whatever matters at that moment. Moods: `idle`, `happy` (a correct result), `shock` (an error, a boom), `think`, `sad`. Not every scene needs it.
header_left: SOFTWARE ENGG / COMPILER DESIGN / OOP · JAVA / INDUSTRIAL MGMT / ARTIFICIAL INTEL, then " · Q<n>". header_right: "CA2 · <m> MARKS" (OOP Q1–10 = 2 marks; everything else = 5).

## Tools (Higgsfield connector)
Use the Higgsfield connector's `sandbox_exec`, `generate_audio` and `jobs_wait` tools. The sandbox is SHARED with other builders working at the same time: touch only `/home/user/what-if/<id>/`, never pass `restart:true` or `size:"xl"`, use foreground commands only (timeout ≤120), and never `pip install`. If the connector says it isn't responding, wait ~20 s and retry; the command usually completed.

## Per short
`<id>` = `<subject>-q<NN>` (NN = the 1-based index in `C:\Claude\exam-reels\questions.json`).
1. **Voice.** Move any old `voice.mp3`/`words.json` into `<dir>/old/`. Write the take in the format above, then call `generate_audio` with `{"params":{"model":"elevenlabs_v4","prompt":TAKE,"stability":S,"batch_size":1,"dialogue":[{"text":TAKE,"voice_id":V,"voice_type":"preset"}]}}`. One opening [bracket direction], CAPS on at most one word per sentence, numbers and symbols spelled out. `jobs_wait` until it completes (never resubmit a job that has an id), then `curl -sSfL -o /home/user/what-if/<id>/voice.mp3 '<url>'`.
2. Write `spec.json`: `{"slug":"<id>","theme":"<theme>","header_left":"…","header_right":"…"}`.
3. **Plan the beats**: for every spoken sentence, what moves and what the camera does. Then write `scenes.jsx`.
4. Build: `FRAMES="0.06 0.3 0.55 0.8" bash /home/user/what-if/_kit2/make.sh /home/user/what-if/<id>`. It prints the overlap report and `PREVIEW_OK`, and writes JPEGs to `<dir>/prev/`. Inspect them with `image_paths`, and run with several FRAMES sets so you see EVERY scene. Fix overlaps, empty frames, unreadable or tiny text, wrong facts, and dead moments. `cue not found` means whisper heard different words: read `words.json` and cue on a word that is there.
5. Repeat until `OVERLAPS=0` and every scene looks right. **Do not render.** Renders happen centrally after the user approves stills.
6. Save locally (Write tool) to `C:\Claude\exam-reels\shorts\<id>\`: `scenes.jsx`, `meta.json` = `{"id","subject","qno","question","title" (≤5 words, catchy),"hook","answer":[3–6 exam-ready bullets, the real content to write],"voice","marks"}`.

## Reference code (read these first)
- Exemplar (the approved format): `/home/user/what-if/se-q01/scenes.jsx` with its take in `/home/user/what-if/se-q01/words.json`. Study how it goes question → zero-knowledge analogy → "the question wants" → build + hold per idea → answer sheet → trick.
- Kit: `/home/user/what-if/_kit2/prims.jsx`, `mascot.jsx`, `sketch.jsx`, `theme.jsx`.

## scenes.jsx API
```jsx
import { Box, Arrow, Mover, Ico, Tree, Table, Plot, Lanes, Stack, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
// ...QuestionCard({dur:d, text, n, marks, y}) (first scene)   ...AnswerSheet({dur:d, y:160, fs:40, title:"WRITE THIS · 5 MARKS", points:[...], times:[r("..."),...]})
export const SCENES = ({ S, ctx, C }) => [
  S(null, (r, d) => [ ...nodes ], { cam: [{ t: 0, x: 540, y: 900, z: 1 }, { t: "word", x: 600, y: 1000, z: 1.12 }] }),
  S("phrase in the take", (r, d) => [ ... ], { cut: "whip" | "punch" }),
];
```
- `S(phrase, draw, opts)` starts a scene when the phrase is spoken (`{n:2}` for the 2nd occurrence). `r("word")` gives scene-relative seconds to that word's next occurrence. `d` = scene length. Pass `dur={d}` to every prim. Every `at` is scene-relative.
- **Hold** `hold: "phrase"` (opts) at the recap sentence: the camera eases back to the whole picture (`holdX/holdY/holdZ` to aim it) and the score plays a resolve. Use one in every teaching scene.
- Cuts default to a calm slide. Use `cut: "whip"` or `"punch"` only for a genuine surprise beat (the "catch", a BOOM).
- **Camera** `cam: [{t, x, y, z}]` keeps focus point (x,y) centred at zoom z. Keep zoom ≤ 1.06 when content spans the width. Move it on the words that matter. Without `cam`, a gentle auto push/pull is applied. Zoom ≤ ~1.15 when a headline is on screen. The overlap checker applies the camera, so anything the zoom pushes out of the safe area gets flagged.
- Cuts alternate whip and punch automatically. A whoosh sound is added at every cut.
- **Sound is automatic.** Every prim logs its own cue (pop, swish, hit, tick, wrong, right, ping, marker, move), and the central mixer turns those into themed sound effects plus a music bed. So build things on the word that names them, and the sound lands right.
- Prims (absolute 1080×1920 coordinates; x,y = centre unless noted):
  `Box{x,y,w,h,label,sub,tone:"a"|"b"|"hot"|"ghost",size,at,out,on}` · `Arrow{x1,y1,x2,y2,label,color,width,head,at}` · `Mover{pts:[{t,x,y}],cw,ch,at,on}` (children drawn in a cw×ch box) · `Ico{ctx,name,x,y,size,color,at,on}` (lucide; `higgsedit icons <q>` in the sandbox) · `Tree{nodes:[{id,label,parent,tone,sub,at}],bx,by,bw,bh,nodeW,edgeLabels}` · `Table{x,y,w,cols,rows,rowH,fs,cellAt,hot,at}` · `Plot{x,y,w,h,pts,xmax,ymax,at,drawDur,xlabel,ylabel,color,marks}` · `Lanes{actors,msgs:[{from,to,label,at,reply}],y,h}` · `Stack{x,y,w,items:[{label,tone,at}],pops}` · `Head{text,y,size,sub,at}` (rises in, auto-fits) · `Label{text,x,y,w,size,at,align,font,on}` · `XMark/Check{x,y,size,at}` · `Ring{x,y,r,at}` · `Layer{at,out,dur}` for raw JSX. Tree, Table, Lanes, Stack and Sketch return arrays: spread them.
  `Mascot{pts:[{t,x,y,look:[dx,dy],mood}],size,tag,at,out,on}` (t = scene-relative seconds; it glides between points).
  `Sketch{items:[{rect:[x,y,w,h],label,lines,divider:[dy]}|{line:[x1,y1,x2,y2],arrow,dashed,label}|{oval:[cx,cy,rx,ry],label}|{text,x,y,size,w,color,align}], at, speed, together}`: strokes draw themselves in order (no pen on screen). An item's `at` waits for that time. Mainly for SE, where the whole diagram should be drawn the way the student will draw it.
- Colours come only from `C` (`C.navy` main ink, `C.coral` accent, `C.cobalt` second accent, `C.chip` panel, `C.chipText`, `C.ink`, `C.paper`). Fonts: `C.fHead`, `C.fBody`, `C.fMono` (has → ε α ∅), `C.fSerif`. Never hardcode a colour or font.
- Layout: the header band is y<118 and the caption chip is y≥1600, so keep both clear. Use y 150–1590 and x 40–1040. Labels ≥ 34 px. A scene's first visual appears within 0.3 s of the scene start.
- Gotchas: a `<group>` needs x, y, width and height. `<text>` must contain words. Keyframe times must strictly increase.

Return a one-line note per short: what's in it, plus anything doubtful.
