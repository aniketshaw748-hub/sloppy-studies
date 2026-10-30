#!/bin/bash
# make.sh <dir> : dir has spec.json, voice.mp3, scenes.jsx -> build, sfx.json, previews in <dir>/prev (FRAMES="fractions")
set -e; D=$1; K=/home/user/what-if/_kit2
python3 /home/user/what-if/_kit/prep.py $D 2>&1 | grep -v HF_TOKEN
cp $K/theme.jsx $K/prims.jsx $K/mascot.jsx $K/sketch.jsx $K/cards.jsx $K/edit.jsx $K/answers.jsx $D/edit/; cp $D/scenes.jsx $D/edit/scenes.jsx; TH=$(python3 -c "import json;print(json.load(open('$D/spec.json'))['theme'])"); cp $K/bg/$TH.png $D/edit/bg.png
cd $D/edit
[ -f .fonts2_ok ] || { higgsedit build edit.jsx >/dev/null 2>&1 || true; higgsedit fonts add . "Anton:400" "Archivo Black:400" "JetBrains Mono:700" "JetBrains Mono:400" "Orbitron:700" "Bebas Neue:400" "Space Mono:700" "Caveat:700" "Oswald:600" "Inter:900" "Inter:700" >/dev/null && touch .fonts2_ok; }
higgsedit build edit.jsx > /tmp/build_$$.log 2>&1 || { grep -v "^\s*at " /tmp/build_$$.log | head -5; exit 1; }
grep -o '@@SFX.*' /tmp/build_$$.log | sed 's/^@@SFX//' > $D/sfx.json || true
cp /tmp/build_$$.log $D/build.log; python3 $K/overlap.py $D/build.log > $D/overlaps.txt || true; tail -25 $D/overlaps.txt
[ -n "$NOPREV" ] && { echo BUILD_OK; exit 0; }
mkdir -p $D/prev; rm -f $D/prev/*
DUR=$(python3 -c "import json;print(json.loads(open('spec.js').read()[len('export const SPEC = '):-2])['dur'])")
for f in ${FRAMES:-0.1 0.37 0.63 0.9}; do t=$(awk "BEGIN{print $DUR*$f}"); higgsedit frame . $t --out $D/prev/p_$f.png >/dev/null; ffmpeg -v error -y -i $D/prev/p_$f.png -vf scale=540:960 -q:v 6 $D/prev/p_$f.jpg; done
echo PREVIEW_OK $DUR sfx=$(python3 -c "import json;print(len(json.load(open('$D/sfx.json'))))" 2>/dev/null)
