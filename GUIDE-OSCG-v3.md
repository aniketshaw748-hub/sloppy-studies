# Sloppy Studies: builder brief for the OS + CG reels, v3 (new scripts)

You rebuild the **visuals** for the reels you're given, to match the NEW approved scripts and voiceovers. Everything is drawn in code in the Higgsfield cloud sandbox (Higgsedit). Never generate images, video or audio, and never call any paid generation tool.

## What changed and why
The user threw out the old scripts: they leaned on everyday analogies (shelves, permits, letters, bakeries, crossroads…) and rambled. The new scripts explain each idea **directly in subject terms**, for a total beginner, one idea at a time. The old `scenes.jsx` was built for the old scripts, so its analogy visuals must go. Its real-concept drawings (graphs, coordinate plots, matrices, banker's tables, memory bars, buffers) can be reused where the new script still needs them, but every scene, cue and beat now follows the NEW script.

## Inputs (already in place)
- **Script:** `C:\Claude\exam-reels\scripts\v3\Sloppy Studies - OS + CG scripts v3.md` (also in the sandbox at `/home/user/what-if/_v3/scripts_v3.md`). Find your reel's `## <id>` section. Each row is a beat: **On screen** = what to draw (build order); **Voice** = what the narrator says. Ignore the `[tags]` and CAPS in the voice text; they're voice directions.
- **Sandbox folder** `/home/user/what-if/<id>/`:
  - `voice.mp3`: new voice, with silence padded at the end for reading the answer cards.
  - `words.json`: Whisper word timings, already made.
  - `script.txt`: the plain script, used to fix captions.
  - `spec.json`: theme and exam question. Don't edit it.
  - `old_v2/scenes.jsx`: the old build, for reference and reuse.
- **Kit:** `/home/user/what-if/_kit2/` (`prims.jsx`, `sketch.jsx`, `cards.jsx`, `theme.jsx`, `edit.jsx`, `answers.jsx`, `make.sh`). Read `prims.jsx` and `cards.jsx` before you start.
- **API reference:** the "scenes.jsx API" section of `C:\Claude\exam-reels\GUIDE.md` (prims, `S()`, cues, holds, camera, layout rules). Everything there applies, with the differences below.

## Rules
1. **Visual first, beginner first.** Every term the voice defines gets drawn the moment it's said: draw the thing, then label it (e.g. a process window labelled "process"; a row of 5 slots labelled "buffer"; a moving dot with "u = 0 … 1"). A beat that explains a process shows the process moving. Nothing on screen without a purpose. **No analogy imagery at all**: no shelves, gates, letters, flats, bakeries, crossroads.
2. **Recalls.** When the voice recalls something from an earlier reel ("remember…", "like the window question…", "the race condition from the short answers"), show a small, quick callback of that earlier visual: a compact mini version of the earlier figure with a tag like "from Q2". Keep it brief and secondary; it's a reminder, not a re-teach.
3. **The question bar** is pinned at the top for the whole video. The kit draws it from `spec.json`; os-q01 switches per question on its cues. `SCENES` receives `TOP`, the first usable y below the bar. **All content lives between y = TOP and y = 1590** (x 40–1040), camera applied. Don't draw a question card. The "Question" beat in each script = the opening scene: show the starting figure or setting while the question is read; don't re-type the question.
4. **No mascot.** Worlds:
   - `machine` (OS): dark slate, chalk-white `C.navy`, amber `C.coral`, teal `C.cobalt`.
   - `graph` (CG): cream graph paper, ink `C.navy`, red `C.coral`, blue `C.cobalt`.

   Colours come only from `C`. Fonts: `C.fHead`, `C.fBody`, and `C.fMono` for matrices, code, coordinates and bit codes.
5. **CG = real coordinates.** Draw true axes and plot every point at its real coordinates through ONE mapping function per scene, e.g. `const P=(x,y)=>[OX+x*U, OY-y*U]`. Points move by animating between before and after positions (`Mover`). Working (rules, matrices) goes BELOW the figure, building downward, never on top of it.
6. **Answer cards.** These start on the words "In your exam, write this" and run to the end of the video. The voice says the short trick ("Remember: …") over the first card; then the padded silence gives reading time. Use the kit's `AnswerCard` with the shared content in `_kit2/answers.jsx`:
   ```jsx
   import { AnswerCard } from "./cards.jsx";
   import { ANSWERS } from "./answers.jsx";
   // one scene per page k, the pages splitting the time from "In your exam" to the end evenly:
   ...AnswerCard({ page: ANSWERS["<id>"][k], title: "WRITE THIS · 5 MARKS · " + (k+1) + "/" + ANSWERS["<id>"].length, at: 0, dur: d, y: TOP + 24 })
   ```
   - os-q01 shows "2 MARKS".
   - Don't edit `answers.jsx`; if a card doesn't fit or reads badly, report it.
   - Don't add pauses: the timing is already final.
7. **Correctness.** Every number, matrix and coordinate on screen must match the script exactly.
8. **Layout.**
   - No unintentional overlaps: `OVERLAPS=0` before you're done. Intentional ones (a label inside its box, a point on its line) go through containment or the `on` prop; never silence a real collision.
   - Labels ≥ 34 px; coordinates on the graph may go to 30 px.
   - Build top to bottom.
9. **Kit notes.**
   - **Movers:** use the stock `Mover`. A custom mover that logs absolute times needs `abs:true` in its `bb()` call.
   - **Raw `<group animate>`:** keyframes are timed from the group's first child's start. Prefer `Mover`, or add an empty child frame at t = 0.
   - **Fonts:** body and head fall back to DejaVu Sans Mono, so `→ ≤ ≥ ′ √ θ` render anywhere.
   - **Captions** are fixed against `script.txt` centrally, so cue on what `words.json` actually has (Whisper may write digits, e.g. "1, 6" for "one, six").

## Work loop
1. Read your script section, `prims.jsx`, `cards.jsx`, `sketch.jsx`, the GUIDE.md API section, and `old_v2/scenes.jsx`.
2. Plan one `S()` per beat (or per group of beats that share one picture), cued on the first words of that beat's voice as they appear in `words.json`.
3. Write `/home/user/what-if/<id>/scenes.jsx`, then build:
   ```bash
   FRAMES="0.03 0.2 0.4 0.6 0.8 0.97" bash /home/user/what-if/_kit2/make.sh /home/user/what-if/<id>
   ```
   It prints the overlap report and `PREVIEW_OK`, and writes JPEGs to `<dir>/prev/`.
4. Look at the previews with `image_paths` (up to 4 per call, ≤ 512 KiB total; the JPEGs are 540×960). Use more FRAMES sets until you have seen EVERY scene, including each answer card page. Fix:
   - overlaps;
   - empty or dead frames;
   - unreadable text;
   - wrong numbers;
   - labels appearing before their object;
   - anything under the bar;
   - any leftover analogy imagery.
5. Repeat until `OVERLAPS=0` and every scene is right. **Do not render.**
6. Save locally with the Write tool to `C:\Claude\exam-reels\shorts\<id>\`:
   - `scenes.jsx`: a copy of the sandbox file.
   - `meta.json`: `{"id","subject":"os"|"cg","qno":N,"question":"<exact question from spec.json>","title":"<the script section's title after the ·>","answer":[the lead of each answer card page, as strings],"voice":"Julian"|"Chloe","marks":5}`. os-q01 has `"marks":2`.

   Overwrite the old copies.

## Tools and the shared sandbox
Use the Higgsfield connector's `sandbox_exec`; load it with ToolSearch: `select:mcp__9cded87c-0dfb-46c9-b608-8da0c18d7162__sandbox_exec`.
- NEVER use any `mcp__higgsfield__*` tool, `generate_*`, or anything that spends credits.
- The sandbox is SHARED with other builders working at the same time:
  - touch only your own `/home/user/what-if/<id>/` folders, and never edit `_kit2/`;
  - never pass `restart:true` or `size:"xl"`;
  - use foreground commands only (timeout ≤ 120); if a build may take longer, run it with `background:true` and poll its `.exit` file;
  - never `pip install`.
- If the connector says it isn't responding, wait about 20 s and check whether the command finished before retrying.

When you finish each reel, move on to the next one you were given. Return one line per reel: what's in it, the final OVERLAPS count, and anything doubtful.
