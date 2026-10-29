# Sloppy Studies

**Studying, turned into reels you can scroll.** By Aniket Shaw.

Live: https://sloppy-studies.pages.dev

69 vertical explainer reels, one per CA2/CT2 exam question for CSE 3rd year (Software Engineering, Compiler Design, OOP · Java, Industrial Management, AI). Each reel teaches from zero: the question, the topic with an everyday analogy, one idea at a time, then the exact answer to write.

## How it's built

- **Visuals** are drawn entirely in code (JSX scenes rendered by Higgsedit in the Higgsfield cloud sandbox). Each subject has its own world: whiteboard, terminal, blueprint, warehouse floor, night-sky search space.
- **Voiceover:** ElevenLabs through Higgsfield. **Timing and subtitles:** faster-whisper word timestamps.
- **Music** is composed in code per world (`music.py`, numpy/scipy). **Sound effects** are placed from events the visuals log (`mix.py`).
- **Site** (`site/`): one hand-written HTML/CSS/JS file, a Reels-style vertical feed with separate music/effects sliders, 1×–4× speed, a scrubber and an answer sheet per reel. Hosted on Cloudflare Pages; `site/_worker.js` serves byte ranges for video seeking, plus first-party anonymous analytics (D1) and a private stats page.

## Layout

| Path | What |
|---|---|
| `GUIDE.md` | the builder brief every reel follows |
| `questions.json` | the 69 exam questions |
| `shorts/<id>/` | each reel's `scenes.jsx` and `meta.json` (title, answer points) |
| `mix.py`, `music.py`, `finish.py`, `qa.py` | sound mix, composed score, web copies + manifest, QA sheets |
| `serve.py` | local preview server with HTTP Range support |
| `site/` | the web app (`index.html`, `stats.html`, `_worker.js`) |
| `analytics/schema.sql` | analytics table |

The rendered videos (~1 GB) aren't in the repo; they're served from the live site.

## Contributing

Friends are welcome here. Fix something, suggest an idea, or bring a whole subject of your own.

### Ideas and fixes

1. Fork the repo, make a branch, change what you want.
2. Run it locally: `python serve.py`, then open http://localhost:5195.
3. Open a pull request saying what you changed and why. For a rough idea, open an issue instead.

The videos aren't in the repo, so the local feed starts empty. To test with a real reel, download one from the live site:

```bash
mkdir -p site/v && curl -o site/v/se-q01.mp4 https://sloppy-studies.pages.dev/v/se-q01.mp4 && curl -o site/v/se-q01.jpg https://sloppy-studies.pages.dev/v/se-q01.jpg
```

### Add your own subject

Your subject stays yours: its card on the home page shows your name.

1. **Pick a short key** for it, like `dbms`. Your reels are called `dbms-q01`, `dbms-q02`, and so on.
2. **Add your questions** to `questions.json`, in order (the first one is Q1):
   ```json
   "dbms": ["Explain normalization up to 3NF.", "What is a transaction? Explain ACID."]
   ```
3. **Register the subject** in `site/index.html`, in the `SUBJ` list near the top of the script:
   ```js
   dbms:{n:"DBMS",a:"DB",full:"Database Management",w:"One line about your reels",c:"#3FB6FF",by:"Your Name"},
   ```
   `n` is the short tab name, `full` the card title, `w` the line under it, `c` your subject's colour, `by` your credit.
4. **Write the answer notes.** For each reel, add `shorts/dbms-q01/meta.json`. The site shows this as the reel's title and its exam answer sheet:
   ```json
   {"title": "Normalization, From Zero", "answer": ["First point to write", "Second point", "Third point"], "marks": 5}
   ```
5. **Make the video** with whatever you like:
   - Vertical 9:16 (1080×1920 or 720×1280), MP4 (H.264 + AAC), under 24 MB.
   - Voice, music and captions all baked in.
   - If you want the house style, follow the order in `GUIDE.md`: question → everyday analogy → what the question wants → one idea at a time → the answer to write → a memory trick. Draw a thing before you label it, and give everything on screen a reason to be there.
6. **Test it locally:**
   - Put the video at `site/v/dbms-q01.mp4`.
   - Make its poster: `ffmpeg -ss 1.2 -i site/v/dbms-q01.mp4 -frames:v 1 site/v/dbms-q01.jpg`.
   - Run `python finish.py`. It rebuilds `site/shorts.json` from whatever is in `site/v/`.
   - Then run `python serve.py` and check your subject card, reels and answer sheets.
7. **Open a pull request** with `questions.json`, `site/index.html` and your `shorts/dbms-*/meta.json` files:
   - Don't commit the videos or `site/shorts.json`. Videos are kept out of git, and your local `shorts.json` only knows your reels.
   - Put a Google Drive (or similar) link to your videos in the PR description. Once it's merged, I'll add them and deploy.

The site's Music and Sound-effects sliders only work on reels that ship separate tracks. If you want them for yours, send the video with voice only, plus `dbms-q01.music.m4a` and `dbms-q01.sfx.m4a`. Otherwise the audio baked into your video just plays as it is.
