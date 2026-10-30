import { Box, Label, Layer, Arrow, Check, Mover, bb } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
// os-q06 v3: banker's algorithm on the exam snapshot. Every number is the snapshot's own.
const W=1080, H=1920;
const ALLOC=[[0,0,1,2],[1,0,0,0],[1,3,5,4],[0,6,3,2],[0,0,1,4]];
const MAX  =[[0,0,1,2],[1,7,5,0],[2,3,5,6],[0,6,5,2],[0,6,5,6]];
const NEED =MAX.map((m,i)=>m.map((v,j)=>v-ALLOC[i][j]));   // 0000 0750 1002 0020 0642
const AV=[1,5,2,0];
const sp=a=>a.join(" ");
const dashRect=(x0,y0,x1,y1,col,w=3,key)=> <path key={key} d={`M ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`} x={0} y={0} width={W} height={H} stroke={{width:w,color:col}} dash={[10,8]}/>;

export const SCENES = ({ S, C, TOP, D, cue }) => {
  const T=TOP;
  const STILL=[{t:0,x:540,y:960,z:1},{t:1,x:540,y:960,z:1}];
  const held=(x,y,key)=> <rect key={key} x={x} y={y} width={22} height={32} radius={4} fill={C.cobalt}/>;
  const hatch=(x,y,key)=> [<rect key={key+"r"} x={x} y={y} width={22} height={32} radius={4} fill={C.coral} opacity={0.3} strokeColor={C.coral} strokeWidth={2}/>,
    <path key={key+"p"} d={`M ${x+2} ${y+12} L ${x+14} ${y+2} M ${x+2} ${y+26} L ${x+20} ${y+10} M ${x+8} ${y+31} L ${x+20} ${y+20}`} x={0} y={0} width={W} height={H} stroke={{width:3,color:C.coral}}/>];
  // a value cell that changes in place (fades, doesn't pop from the canvas centre)
  const Cell=({key,x,y,w,h,label="",tone="a",at=0,out,dur,font,fs})=>{
    const f= tone==="hot"?C.coral: tone==="b"?C.cobalt: tone==="ghost"?"#00000000": C.chip;
    const tc= tone==="hot"||tone==="b"? C.ink : C.chipText;
    const s=fs||Math.max(30,Math.min(h*0.5, Math.floor((w-24)/Math.max(1,label.length)*1.45)));
    bb({k:"box",n:label||"cell",x:x-w/2,y:y-h/2,w:w+6,h:h+6,t0:at,t1:out??dur});
    return <Layer key={key} at={at} dur={dur} out={out} anim={[{property:"opacity",from:0.5,to:1,at:0,duration:0.15}]} sfx="tick">
      {tone!=="ghost"?<rect x={x-w/2+6} y={y-h/2+6} width={w} height={h} radius={10} fill={C.navy} opacity={0.85}/>:null}
      <rect x={x-w/2} y={y-h/2} width={w} height={h} radius={10} fill={f} strokeColor={C.navy} strokeWidth={3}/>
      {label?<text x={x-w/2+6} y={y-s*0.62} width={w-12} align="center" fontFamily={font||C.fMono} fontWeight={700} fontSize={s} lineHeight={1} color={tc}>{label}</text>:null}
    </Layer>; };
  // sequences of states for cells that change: [{t,v,tone}]
  const put=(seq,t,o)=>{ const last=seq[seq.length-1]; if(t<=last.t+0.01) Object.assign(last,o); else seq.push({...last,...o,t}); };
  const seqCells=(key,x,y,w,h,seq,d,font)=>seq.map((s,i)=>Cell({key:key+"_"+i,x,y,w,h,label:String(s.v??""),tone:s.tone,at:s.t,out:seq[i+1]?seq[i+1].t:undefined,dur:d,font}));

  // ---------- the board: bins A-D with free stock, rows P0-P4 with held chips inside dashed Max outlines ----------
  const BX=j=>287+205*j, RT=i=>T+178+100*i, cl=j=>BX(j)-97.5+8.5;
  function board(d,TT){
    const o=[];
    for(let j=0;j<4;j++){
      o.push(<Box key={"bh"+j} x={BX(j)} y={T+36} w={190} h={68} label={"ABCD"[j]} tone="b" at={TT.hdr[j]} dur={d}/>);
      o.push(<Box key={"bf"+j} x={BX(j)} y={T+124} w={190} h={84} at={TT.hdr[j]} dur={d}/>);
      if(TT.free) o.push(<Label key={"fn"+j} text={String(AV[j])} x={BX(j)} y={T+86} w={180} size={34} font={C.fMono} at={TT.free[j]} dur={d}/>);
      if(TT.free&&AV[j]) o.push(<Layer key={"fc"+j} at={TT.free[j]} dur={d}>{Array.from({length:AV[j]},(_,k)=>held(BX(j)-(AV[j]*26-4)/2+26*k,T+130,k))}</Layer>);
    }
    if(TT.free) o.push(<Label key="free" text="free" x={115} y={T+105} w={110} size={36} at={TT.free[0]} dur={d}/>);
    for(let i=0;i<5;i++){ const y=RT(i);
      o.push(<Box key={"pn"+i} x={115} y={y+46} w={110} h={92} label={"P"+i} at={TT.rows[i]} dur={d}/>);
      for(let j=0;j<4;j++){
        o.push(<Box key={"c"+i+j} x={BX(j)} y={y+46} w={195} h={92} at={TT.rows[i]} dur={d}/>);
        const nOut=TT.need?TT.need[i]:undefined;
        if(TT.alloc) o.push(<Label key={"am"+i+j} text={TT.max!=null?`${ALLOC[i][j]} / ${MAX[i][j]}`:String(ALLOC[i][j])} x={BX(j)} y={y+46} w={180} size={34} font={C.fMono} at={TT.max!=null&&TT.max>TT.alloc[i]?TT.max:TT.alloc[i]} out={nOut} dur={d}/>);
        if(TT.alloc&&TT.max!=null&&TT.max>TT.alloc[i]) o.push(<Label key={"a0"+i+j} text={String(ALLOC[i][j])} x={BX(j)} y={y+46} w={180} size={34} font={C.fMono} at={TT.alloc[i]} out={TT.max} dur={d}/>);
        if(TT.need) o.push(<Label key={"nd"+i+j} text={"need "+NEED[i][j]} x={BX(j)} y={y+46} w={180} size={34} font={C.fMono} color={C.coral} at={TT.need[i]} dur={d}/>);
      }
      if(TT.alloc) o.push(<Layer key={"al"+i} at={TT.alloc[i]} dur={d}>{ALLOC[i].flatMap((n,j)=>Array.from({length:n},(_,k)=>held(cl(j)+26*k,y+8,j+"_"+k)))}</Layer>);
      if(TT.max!=null) o.push(<Layer key={"mx"+i} at={TT.max} dur={d}>{MAX[i].map((n,j)=> n? dashRect(cl(j)-4,y+4,cl(j)+26*n,y+44,C.navy,3,"m"+j):null).filter(Boolean)}</Layer>);
      if(TT.need) o.push(<Layer key={"nh"+i} at={TT.need[i]} dur={d} sfx="tick">{ALLOC[i].flatMap((a,j)=>Array.from({length:MAX[i][j]-a},(_,k)=>hatch(cl(j)+26*(a+k),y+8,"h"+j+"_"+k)).flat())}</Layer>);
    }
    if(TT.legend!=null){
      o.push(<Layer key="lg" at={TT.legend} out={TT.legendOut} dur={d}>{[held(70,T+698,"lg1")]}</Layer>);
      o.push(<Label key="lg3" text="held now (Allocation)" x={110} y={T+692} w={460} size={34} align="left" at={TT.legend} out={TT.legendOut} dur={d}/>);
    }
    if(TT.legend2!=null){
      o.push(<Layer key="lgb" at={TT.legend2} out={TT.legendOut} dur={d}>{[dashRect(600,T+694,626,T+734,C.navy,3,"lg2")]}</Layer>);
      o.push(<Label key="lg4" text="Max" x={644} y={T+692} w={300} size={34} align="left" at={TT.legend2} out={TT.legendOut} dur={d}/>);
    }
    return o;
  }

  // ---------- the safety table: free on top (same columns as Need), rows with Need and Holds ----------
  const FX=j=>300+92*j, HX=j=>700+82*j, NMX=130, FY=T+80, SY=i=>T+240+78*i, STRIP=T+650, LY=k=>T+720+52*k, LANE=[820,T+80];
  const mk=()=>({free:AV.map(v=>[{t:0,v,tone:"a"}]), names:[0,1,2,3,4].map(()=>[{t:0,tone:"ghost"}]),
    need:NEED.map(r=>r.map(v=>[{t:0,v,tone:"a"}])), holds:ALLOC.map(r=>r.map(v=>[{t:0,v,tone:"ghost"}])), order:[], logs:[], movers:[], extra:[]});
  const setFree=(st,t,vals,tone="b",gap=0.12)=>vals.forEach((v,j)=>{ put(st.free[j],t+gap*j,{v,tone}); });
  // a process finishing: need turns teal (fits), it runs, what it holds flies to the free pile, free grows
  const finish=(st,i,{fit,run,tf,nf,k,fly=true})=>{
    for(let j=0;j<4;j++) put(st.need[i][j],fit+0.08*j,{tone:"b"});
    put(st.names[i],run,{tone:"b"}); for(let j=0;j<4;j++) put(st.holds[i][j],run,{tone:"b"});
    st.order.push({k,label:"P"+i,at:run});
    if(fly) st.movers.push({text:"+"+sp(ALLOC[i]),from:[823,SY(i)],to:LANE,t0:run,t1:Math.min(tf,run+0.7),out:tf+0.45});
    setFree(st,tf,nf); };
  const table=(d,st)=>{ const o=[];
    o.push(<Label key="fl" text="free" x={NMX} y={FY-24} w={140} size={38} color={C.cobalt} at={0} dur={d}/>);
    for(let j=0;j<4;j++){ o.push(<Label key={"L"+j} text={"ABCD"[j]} x={FX(j)} y={T+6} w={80} size={34} at={0} dur={d}/>); o.push(...seqCells("f"+j,FX(j),FY,80,68,st.free[j],d)); }
    o.push(<Label key="hn" text="Need" x={438} y={T+150} w={300} size={36} at={0} dur={d}/>, <Label key="hh" text="Holds" x={823} y={T+150} w={300} size={36} at={0} dur={d}/>);
    for(let i=0;i<5;i++){
      st.names[i].forEach((s,k)=>o.push(Cell({key:"n"+i+"_"+k,x:NMX,y:SY(i),w:110,h:66,label:"P"+i,tone:s.tone,at:s.t,out:st.names[i][k+1]?st.names[i][k+1].t:undefined,dur:d,font:C.fBody,fs:36})));
      for(let j=0;j<4;j++){ o.push(...seqCells("nd"+i+j,FX(j),SY(i),80,66,st.need[i][j],d)); o.push(...seqCells("ho"+i+j,HX(j),SY(i),72,66,st.holds[i][j],d)); }
    }
    if(st.order.length) o.push(<Label key="ol" text="order" x={60} y={STRIP-22} w={160} size={36} align="left" at={st.order[0].at} dur={d}/>);
    st.order.forEach(c=>o.push(<Box key={"or"+c.k} x={250+118*c.k} y={STRIP} w={104} h={60} label={c.label} size={36} tone="b" at={c.at} dur={d}/>));
    st.logs.forEach((l,k)=>o.push(<Label key={"lg"+k} text={l.text} x={60} y={LY(l.k)} w={960} size={36} align="left" font={l.font} color={l.color} at={l.at} out={l.out} dur={d}/>));
    o.push(...st.extra);
    st.movers.forEach((m,k)=>o.push(<Mover key={"mv"+k} pts={[{t:m.t0,x:m.from[0],y:m.from[1]},{t:m.t1,x:m.to[0],y:m.to[1]}]} cw={230} ch={56} at={m.t0} out={m.out} on={true} dur={d}>
      <rect x={0} y={0} width={230} height={56} radius={28} fill={C.coral}/>
      <text x={0} y={9} width={230} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={34} color={C.ink}>{m.text}</text></Mover>));
    return o; };

  const Z=[0,0,0,0,0], Z4=[0,0,0,0];
  const t1=cue("in your exam"), pages=ANSWERS["os-q06"], dd=(D-t1)/pages.length;
  const card=(k,d)=>[...AnswerCard({ page: pages[k], title: "WRITE THIS · 5 MARKS · "+(k+1)+"/"+pages.length, at: 0, dur: d, y: TOP + 24 })];
  const part=(y,txt,at,d,key)=>[<Layer key={key+"b"} at={at} dur={d} sfx="pop"><rect x={70} y={y} width={940} height={110} radius={14} fill={C.chip} strokeColor={C.coral} strokeWidth={4}/></Layer>,
    <Label key={key} text={txt} x={110} y={y+31} size={42} align="left" w={880} at={at+0.05} dur={d}/>];

  return [
  // Question: the three parts, named as they are read (the snapshot sits in the bar)
  S(null,(r,d)=>[
    <Label key="h" text="BANKER'S ALGORITHM" x={540} y={T+40} size={56} font={C.fHead} color={C.coral} w={1000} at={0.2} dur={d}/>,
    ...part(T+170,"(i)   find the Need matrix",r("need"),d,"p1"),
    ...part(T+320,"(ii)  is the system safe?",r("check"),d,"p2"),
    ...part(T+470,"(iii) grant P1's request now?",r("decide"),d,"p3"),
  ],{cam:STILL}),

  // Recall deadlock (from Q1); the banker's algorithm avoids it: give only if everyone can still finish
  S("you know deadlock",(r,d)=>{ const cx=540, cy=T+190, R=110, P=[[cx,cy-R],[cx+R*1.6,cy],[cx,cy+R],[cx-R*1.6,cy]];
    const arr=(a,b)=>{ const [x1,y1]=P[a],[x2,y2]=P[b]; const ang=Math.atan2(y2-y1,x2-x1), s=0.32, e=0.68; const ax=x1+(x2-x1)*s, ay=y1+(y2-y1)*s, bx=x1+(x2-x1)*e, by=y1+(y2-y1)*e;
      return <path key={"a"+a} d={`M ${ax} ${ay} L ${bx} ${by} M ${bx} ${by} L ${bx-18*Math.cos(ang-0.5)} ${by-18*Math.sin(ang-0.5)} M ${bx} ${by} L ${bx-18*Math.cos(ang+0.5)} ${by-18*Math.sin(ang+0.5)}`} x={0} y={0} width={W} height={H} stroke={{width:5,color:C.coral,cap:"round"}}/>; };
    return [
    <Layer key="rp" at={0.1} dur={d} sfx="pop">{[dashRect(200,T+30,880,T+390,C.cobalt,3,"pp"), ...[0,1,2,3].map(i=>arr(i,(i+1)%4))]}</Layer>,
    <Box key="rt" x={300} y={T+30} w={170} h={54} label="from Q1" size={34} tone="b" at={0.1} dur={d}/>,
    ...P.map(([x,y],i)=> <Box key={"dp"+i} x={x} y={y} w={110} h={66} label={"P"+(i+1)} size={36} at={0.15+i*0.08} dur={d}/>),
    <Label key="rs" text="stuck: each waits for the next" x={540} y={T+346} size={34} color={C.coral} w={640} at={r("stuck")} dur={d}/>,
    <Label key="bk" text="BANKER'S ALGORITHM" x={540} y={T+440} size={52} font={C.fHead} color={C.coral} w={1000} at={r("banker's")} dur={d}/>,
    <Label key="av" text="avoids deadlock" x={540} y={T+512} size={40} color={C.cobalt} w={700} at={r("avoids")} dur={d}/>,
    <Box key="rq" x={190} y={T+680} w={230} h={100} label="request" size={40} tone="hot" at={r("hands out")} dur={d}/>,
    <Arrow key="ra" x1={315} y1={T+680} x2={385} y2={T+680} at={r("hands out")+0.2} dur={d}/>,
    <Layer key="qb" at={r("every process")} dur={d} sfx="pop"><rect x={400} y={T+610} width={600} height={140} radius={16} fill={C.chip} strokeColor={C.navy} strokeWidth={4}/></Layer>,
    <Label key="ql" text={"can every process\nstill finish?"} x={700} y={T+632} size={38} w={560} at={r("every process")+0.05} dur={d}/>,
    <Arrow key="y1" x1={600} y1={T+760} x2={450} y2={T+830} color={C.cobalt} at={r("finish")} dur={d}/>,
    <Arrow key="n1" x1={800} y1={T+760} x2={880} y2={T+830} color={C.coral} at={r("finish")} dur={d}/>,
    <Box key="yes" x={400} y={T+890} w={300} h={90} label="yes: give" size={40} tone="b" at={r("finish")+0.2} dur={d}/>,
    <Box key="no" x={840} y={T+890} w={300} h={90} label="no: wait" size={40} tone="hot" at={r("finish")+0.4} dur={d}/>,
  ]; },{cam:STILL, hold:"only hands", holdY:960}),

  // Setup: four resource types, five processes; Allocation (held), Max (outline), Available 1 5 2 0
  S("here five processes",(r,d)=>{ const tf=[r("one"),cue("five",2)-cue("here five processes"),r("two"),r("zero")];
    return [ ...board(d,{hdr:[r("a"),r("b"),r("c"),r("d")], free:tf, rows:Z.map((_,i)=>r("five processes")+0.15*i),
      alloc:Z.map((_,i)=>r("allocation")+0.4+0.12*i), max:r("max"), legend:r("allocation")+0.3, legend2:r("max")+0.2}),
      <Label key="avl" text="Available = free now" x={540} y={T+760} size={40} color={C.cobalt} w={960} at={r("available")} dur={d}/>,
    ]; },{cam:STILL, hold:"available", holdY:960}),

  // Part 1: Need = Max − Allocation, the empty part of each Max outline fills in
  S("part one",(r,d)=>{ const tn=r("need"), tp=[r("p0"),r("p1"),r("p2"),r("p3"),r("p4")];
    return [ ...board(d,{hdr:Z4,free:Z4,rows:Z,alloc:Z,max:0,legend:0,legend2:0,legendOut:tn-0.05,need:tp}),
      <Label key="f" text="(i) Need = Max − Allocation" x={540} y={T+690} w={960} size={40} font={C.fMono} color={C.coral} at={tn} dur={d}/>,
      ...[0,1,2,3].map(j=> <Label key={"mh"+j} text={"ABCD"[j]} x={500+64*j} y={T+750} w={60} size={36} font={C.fMono} color={C.cobalt} at={tp[0]} dur={d}/>),
      ...Z.flatMap((_,i)=>[ <Label key={"mn"+i} text={"P"+i} x={400} y={T+798+46*i} w={80} size={36} font={C.fMono} at={tp[i]+0.3} dur={d}/>,
        ...NEED[i].map((v,j)=> <Label key={"mv"+i+j} text={String(v)} x={500+64*j} y={T+798+46*i} w={60} size={36} font={C.fMono} at={tp[i]+0.3+0.06*j} dur={d}/>) ])
 ]; },{cam:STILL, hold:"p4", holdY:960}),

  // Part 2: safety. The free pile grows as processes finish; P1 is skipped once.
  S("part two",(r,d)=>{ const s0=cue("part two"), R=(p,n)=>cue(p,n)-s0; const st=mk();
    st.logs.push({k:0,text:"1. find a process with need ≤ free",at:r("look for")},
      {k:1,text:"2. it finishes, gives back all it holds",at:r("gives back")},{k:2,text:"3. repeat",at:r("repeat")});
    const p0=R("p0",2); finish(st,0,{fit:p0,run:r("so it finishes"),tf:r("one five three two"),nf:[1,5,3,2],k:0});
    // P1 needs 7 B, only 5 free: skip
    const t7=r("seven"), t5=r("only"), tp2=r("p2 fits");
    put(st.need[1][1],t7,{tone:"hot"}); put(st.free[1],t5,{tone:"hot"});
    for(let j=0;j<4;j++){ put(st.free[j],tp2-0.05,{tone:"a"}); } put(st.need[1][1],tp2-0.05,{tone:"a"});
    st.logs.push({k:3,text:"P1 needs 7 B, only 5 free → skip",color:C.coral,at:t7,out:tp2-0.05});
    finish(st,2,{fit:tp2,run:r("fits finishes")+0.6,tf:r("two eight eight six"),nf:[2,8,8,6],k:1});
    const tn=r("now p1"); finish(st,1,{fit:tn+0.3,run:tn+0.9,tf:r("three eight eight six"),nf:[3,8,8,6],k:2});
    const t3=r("p3 and p4"); finish(st,3,{fit:t3,run:t3+0.3,tf:t3+0.55,nf:[3,14,11,8],k:3,fly:false});
    finish(st,4,{fit:t3+0.9,run:t3+1.2,tf:t3+1.5,nf:[3,14,12,12],k:4,fly:false});
    st.logs.push({k:3,text:"P0, P2, P1, P3, P4 all finish",at:r("everyone"),color:C.cobalt});
    st.extra.push(<Label key="safe" text="SAFE" x={935} y={STRIP-32} size={56} font={C.fHead} color={C.cobalt} w={210} at={r("system is safe")+0.3} dur={d}/>);
    return table(d,st); },{cam:STILL, hold:"in the order", holdY:960}),

  // Part 3: P1 asks 0 4 2 0: two checks, pretend to give it, run the safety check again, grant
  S("part three",(r,d)=>{ const s3=cue("part three"); const st=mk(); const ta=r("asks"), tz=r("zero four two zero");
    const tr=[tz,tz+0.8,tz+1.2,tz+1.5], tw=r("within"), tfr=r("free right"), tpr=r("pretend"), tdr=r("one one zero zero");
    st.extra.push(<Box key="rqn" x={NMX} y={STRIP} w={110} h={60} label="P1" size={36} tone="hot" at={ta} out={tpr+0.2} dur={d}/>,
      <Label key="rql" text="asks for" x={700} y={STRIP-22} w={400} size={36} align="left" color={C.coral} at={ta} out={tpr+0.2} dur={d}/>);
    [0,4,2,0].forEach((v,j)=>st.extra.push(Cell({key:"rq"+j,x:FX(j),y:STRIP,w:80,h:60,label:String(v),tone:"hot",at:tr[j],out:tpr+0.2,dur:d})));
    for(let j=0;j<4;j++){ put(st.need[1][j],tw+0.08*j,{tone:"b"}); put(st.free[j],tfr+0.08*j,{tone:"b"}); put(st.need[1][j],tpr,{tone:"a"}); put(st.free[j],tpr,{tone:"a"}); }
    st.logs.push({k:0,text:"0 4 2 0 ≤ need 0 7 5 0  ✓",font:C.fMono,at:tw,out:r("run the safety")},
      {k:1,text:"0 4 2 0 ≤ free 1 5 2 0  ✓",font:C.fMono,at:tfr,out:r("run the safety")});
    st.movers.push({text:"0 4 2 0",from:[438,STRIP],to:[823,SY(1)],t0:tpr+0.2,t1:tpr+0.9,out:tpr+1.0});
    [1,4,2,0].forEach((v,j)=>put(st.holds[1][j],tpr+1.0,{v,tone:"hot"})); [0,3,3,0].forEach((v,j)=>put(st.need[1][j],r("drops"),{v,tone:"hot"}));
    setFree(st,tdr,[1,1,0,0],"hot",0.4);
    st.extra.push(<Layer key="pp" at={tpr} dur={d} sfx="hit">{dashRect(40,T+2,1040,T+604,C.coral,5,"pr")}</Layer>,
      <Label key="ppl" text="PRETEND" x={880} y={T+52} size={44} font={C.fHead} color={C.coral} w={300} at={tpr+0.1} dur={d}/>);
    const ts=r("run the safety");
    for(let j=0;j<4;j++){ put(st.holds[1][j],ts,{tone:"ghost"}); put(st.need[1][j],ts,{tone:"a"}); put(st.free[j],ts,{tone:"a"}); }
    st.logs.push({k:2,text:"run the safety check again",at:ts,color:C.cobalt});
    const tP=[r("p0"),r("p2"),cue("p1",7)-s3,r("p3"),r("p4")];
    const run2=[[0,[1,1,1,2]],[2,[2,4,6,6]],[1,[3,8,8,6]],[3,[3,14,11,8]],[4,[3,14,12,12]]];
    run2.forEach(([i,nf],k)=>{ const t=tP[k]; for(let j=0;j<4;j++) put(st.need[i][j],t,{tone:"b"}); put(st.names[i],t,{tone:"b"}); for(let j=0;j<4;j++) put(st.holds[i][j],t,{tone:"b"});
      st.order.push({k,label:"P"+i,at:t}); setFree(st,t+0.25,nf,"b",0.05); });
    st.extra.push(<Label key="safe" text="SAFE" x={935} y={STRIP-32} size={56} font={C.fHead} color={C.cobalt} w={210} at={r("still safe")} dur={d}/>,
      <Label key="gr" text="GRANT IT NOW" x={500} y={LY(3)+10} size={64} font={C.fHead} color={C.cobalt} w={900} at={r("grant it")} dur={d}/>,
      <Check key="gc" x={960} y={LY(3)+50} size={80} at={r("grant it")+0.2} dur={d}/>);
    return table(d,st); },{cam:STILL, hold:"still safe", holdY:960}),

  // Answer cards: "In your exam" to the end, pages split evenly
  S("in your exam",(r,d)=>card(0,d),{cam:STILL}),
  ...pages.slice(1).map((_,i)=>{ const t=t1+dd*(i+1); return {at:t,cam:[{t:0,x:540,y:960,z:1},{t:1,x:540,y:960,z:1}],holdT:null,
      draw:d=>{ globalThis.__T0=t; globalThis.__SKEND=0; return card(i+1,d); }}; }),
  ];
};
