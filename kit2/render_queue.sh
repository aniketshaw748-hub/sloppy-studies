#!/bin/bash
# render_queue.sh <id> [<id> ...] : render each built short, package it and PUT it to its presigned URL
# (/home/user/what-if/_urls/<id>.url). Logs to /home/user/what-if/_queue.log; per-short status in <dir>/render.status
W=/home/user/what-if
for id in "$@"; do
  D=$W/$id; cd $D/edit || continue
  [ -f $D/render.status ] && grep -q "^uploaded" $D/render.status && continue
  echo "$(date +%T) render $id" >> $W/_queue.log
  NOPREV=1 bash $W/_kit2/make.sh $D > $D/make.log 2>&1 || { echo "build-failed $(date +%T)" > $D/render.status; echo "$(date +%T) $id BUILD FAILED" >> $W/_queue.log; continue; }
  cd $D/edit
  rm -rf renders; mkdir -p renders
  if higgsedit render . --bitrate 8M --out $D/edit/renders/final.mp4 > $D/render.log 2>&1; then
    cp renders/final.mp4 $D/render.mp4; rm -f $D/pkg.zip; (cd $D && zip -q -j pkg.zip render.mp4 sfx.json spec.json words.json)
    for try in 1 2 3; do code=$(curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Content-Type: application/octet-stream" --data-binary @$D/pkg.zip "$(cat $W/_urls/$id.url)"); [ "$code" = 200 ] && break; sleep 5; done
    echo "uploaded $code $(date +%T)" > $D/render.status; echo "$(date +%T) $id upload $code" >> $W/_queue.log
  else echo "failed $(date +%T)" > $D/render.status; echo "$(date +%T) $id FAILED" >> $W/_queue.log; fi
done
echo "$(date +%T) queue done: $*" >> $W/_queue.log
