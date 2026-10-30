// The subject's protagonist. It IS the concept's moving part: Tok = the input token, Obj = an object instance,
// Marker = the pen drawing the exam diagram, Crate = a unit of inventory, Bot = the search agent.
import { C } from "./theme.jsx";
import { ev, bb } from "./prims.jsx";
const W=1080,H=1920;
// pts: [{t, x, y, look:[-1..1,-1..1], mood:"idle"|"happy"|"shock"|"think"|"sad"}]  t = scene-relative seconds
export function Mascot({ pts, size=200, tag, dur, at=0, out, kind, on }) {
  kind=kind||C.mascot; const S=size; at=Math.max(0,Math.min(at,dur-0.3)); const len=Math.max(0.3,(out??dur)-at);
  let last=-1; pts=pts.map(p=>({...p,t:Math.min(Math.max(0,p.t-at),len-0.05)})).filter(p=>{if(p.t<=last+0.01)return false;last=p.t;return true;});
  if(pts.length<2) pts=[pts[0],{...pts[0],t:Math.min(len-0.02,pts[0].t+0.02)}];
  const ox = kind==="marker"? -S*0.5 : -S/2, oy = kind==="marker"? -S*1.0 : -S/2;   // marker anchors at its tip
  const kf=f=>pts.map(p=>({at:p.t,value:f(p)}));
  bb({k:kind==="marker"?"marker":"mascot",n:kind,path:pts.map(p=>({t:p.t+at,x:p.x+ox+S*0.06,y:p.y+oy+S*0.04})),w:S*0.88,h:S*0.92,t0:at,t1:at+len,on});
  const look=pts.map(p=>p.look||[0,0]);
  const eyeY = kind==="marker"?S*0.42: kind==="tok"?S*0.34: kind==="crate"?S*0.42: kind==="bot"?S*0.42: S*0.40;
  const eyeR = S*0.085, eyeGap = kind==="marker"?S*0.11:S*0.17;
  const eyeFill = kind==="bot"?"#0B0820": kind==="tok"?C.ink:"#FFFFFF", pupil = kind==="bot"?C.coral: kind==="tok"?C.cobalt:"#14161C";
  const moods=["idle","happy","shock","think","sad"];
  const moodKF=m=>{const k=[]; pts.forEach((p,i)=>{const v=((p.mood||"idle")===m)?1:0; k.push({at:p.t,value:v,easing:"hold"});}); if(k.length<2)k.push({...k[0],at:k[0].at+0.01}); return k;};
  pts.forEach((p,i)=>{ if(kind!=="marker"&&i>0&&Math.hypot(p.x-pts[i-1].x,p.y-pts[i-1].y)>140) ev(at+pts[i-1].t,"move"); if(p.mood==="shock") ev(at+p.t,"shock"); if(p.mood==="happy"&&i>0) ev(at+p.t,"happy"); });
  const mouth={ idle:`M ${S*0.42} ${eyeY+S*0.17} Q ${S*0.5} ${eyeY+S*0.22} ${S*0.58} ${eyeY+S*0.17}`,
    happy:`M ${S*0.38} ${eyeY+S*0.14} Q ${S*0.5} ${eyeY+S*0.30} ${S*0.62} ${eyeY+S*0.14} Z`,
    shock:`M ${S*0.46} ${eyeY+S*0.15} Q ${S*0.5} ${eyeY+S*0.09} ${S*0.54} ${eyeY+S*0.15} Q ${S*0.56} ${eyeY+S*0.26} ${S*0.5} ${eyeY+S*0.27} Q ${S*0.44} ${eyeY+S*0.26} ${S*0.46} ${eyeY+S*0.15} Z`,
    think:`M ${S*0.43} ${eyeY+S*0.19} L ${S*0.58} ${eyeY+S*0.16}`,
    sad:`M ${S*0.42} ${eyeY+S*0.22} Q ${S*0.5} ${eyeY+S*0.15} ${S*0.58} ${eyeY+S*0.22}` };
  const mc = kind==="tok"?C.ink: kind==="bot"?C.coral:"#14161C";
  const body=[];
  if(kind==="tok"){ body.push(<rect x={S*0.16} y={S*0.08} width={S*0.68} height={S*0.86} radius={S*0.08} fill={C.cobalt} shadow={{x:0,y:0,blur:30,color:C.cobalt}} />);
    if(tag) body.push(<text x={S*0.16} y={S*0.68} width={S*0.68} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={S*0.2} color={C.ink}>{tag}</text>); }
  if(kind==="obj"){ body.push(<rect x={S*0.1} y={S*0.12} width={S*0.8} height={S*0.8} radius={S*0.16} fill="#EAF4FF" strokeColor={C.coral} strokeWidth={S*0.035} />);
    body.push(<rect x={S*0.1} y={S*0.12} width={S*0.8} height={S*0.2} radius={S*0.08} fill={C.coral} />);
    if(tag) body.push(<text x={S*0.1} y={S*0.145} width={S*0.8} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={S*0.11} color={C.ink}>{tag}</text>); }
  if(kind==="marker"){ body.push(<path d={`M ${S*0.42} ${S*0.98} L ${S*0.58} ${S*0.98} L ${S*0.66} ${S*0.82} L ${S*0.34} ${S*0.82} Z`} x={0} y={0} width={S} height={S} fill="#2A2D35" />);
    body.push(<path d={`M ${S*0.47} ${S*1.0} L ${S*0.53} ${S*1.0} L ${S*0.56} ${S*0.97} L ${S*0.44} ${S*0.97} Z`} x={0} y={0} width={S} height={S*1.02} fill={C.cobalt} />);
    body.push(<rect x={S*0.3} y={S*0.16} width={S*0.4} height={S*0.68} radius={S*0.06} fill="#FFFFFF" strokeColor="#14161C" strokeWidth={S*0.025} />);
    body.push(<rect x={S*0.3} y={S*0.62} width={S*0.4} height={S*0.1} fill={C.cobalt} />);
    body.push(<rect x={S*0.28} y={S*0.0} width={S*0.44} height={S*0.2} radius={S*0.05} fill={C.cobalt} />); }
  if(kind==="crate"){ body.push(<rect x={S*0.08} y={S*0.12} width={S*0.84} height={S*0.8} radius={S*0.03} fill="#D9B06E" strokeColor="#5A3E1B" strokeWidth={S*0.025} />);
    body.push(<rect x={S*0.43} y={S*0.12} width={S*0.14} height={S*0.8} fill="#B98B45" />);
    body.push(<path d={`M ${S*0.08} ${S*0.12} L ${S*0.22} ${S*0.02} L ${S*0.78} ${S*0.02} L ${S*0.92} ${S*0.12} Z`} x={0} y={0} width={S} height={S} fill="#C99B55" />);
    if(tag){ body.push(<rect x={S*0.2} y={S*0.7} width={S*0.6} height={S*0.17} radius={S*0.02} fill="#F4EBDD" strokeColor="#5A3E1B" strokeWidth={S*0.012} />);
      body.push(<text x={S*0.2} y={S*0.71} width={S*0.6} align="center" fontFamily="Anton" fontSize={S*0.13} color="#3B2A12">{tag}</text>); } }
  if(kind==="bot"){ body.push(<rect x={S*0.47} y={S*0.0} width={S*0.06} height={S*0.16} fill={C.navy} />);
    body.push(<rect x={S*0.43} y={-S*0.04} width={S*0.14} height={S*0.14} radius={S*0.07} fill={C.coral} shadow={{x:0,y:0,blur:20,color:C.coral}}
      animate={len<1.7?[]:[{property:"opacity",keyframes:[{at:0,value:1},{at:0.4,value:0.3},{at:0.8,value:1}],repeat:Math.floor((len-0.05)/0.8)}]} />);
    body.push(<rect x={S*0.1} y={S*0.16} width={S*0.8} height={S*0.72} radius={S*0.3} fill={C.navy} shadow={{x:0,y:0,blur:30,color:C.cobalt}} />);
    body.push(<rect x={S*0.18} y={S*0.28} width={S*0.64} height={S*0.36} radius={S*0.18} fill="#0B0820" />);
    if(tag) body.push(<text x={S*0.1} y={S*0.9} width={S*0.8} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={S*0.12} color={C.coral}>{tag}</text>); }
  const eyes=[-1,1].map(sd=>{ const cx=S/2+sd*eyeGap;
    return <group key={sd} x={0} y={0} width={S} height={S}>
      <rect x={cx-eyeR} y={eyeY-eyeR*1.2} width={eyeR*2} height={eyeR*2.4} radius={eyeR} fill={eyeFill} />
      <rect x={cx-eyeR*0.55} y={eyeY-eyeR*0.6} width={eyeR*1.1} height={eyeR*1.3} radius={eyeR*0.55} fill={pupil}
        animate={[{property:"offsetX",keyframes:pts.map((p,i)=>({at:p.t,value:look[i][0]*eyeR*0.5}))},{property:"offsetY",keyframes:pts.map((p,i)=>({at:p.t,value:look[i][1]*eyeR*0.6}))}]} />
    </group>; });
  const blinkN=Math.floor((len-0.05)/2.7);
  const lids=<rect x={S/2-eyeGap-eyeR-4} y={eyeY-eyeR*1.3} width={eyeGap*2+eyeR*2+8} height={eyeR*2.6} fill={kind==="tok"?C.cobalt:kind==="bot"?"#0B0820":kind==="crate"?"#D9B06E":kind==="obj"?"#EAF4FF":"#FFFFFF"}
      animate={blinkN<1?[{property:"opacity",from:0,to:0,at:0,duration:0.05}]:[{property:"opacity",keyframes:[{at:0,value:0,easing:"hold"},{at:2.5,value:1,easing:"hold"},{at:2.62,value:0,easing:"hold"},{at:2.7,value:0}],...(blinkN>=2?{repeat:blinkN}:{})}]} />;
  const mouths=moods.map(m=> <path key={m} d={mouth[m]} x={0} y={0} width={S} height={S} fill={m==="happy"||m==="shock"?mc:undefined} stroke={m==="happy"||m==="shock"?undefined:{width:S*0.035,color:mc,cap:"round"}}
      animate={[{property:"opacity",keyframes:moodKF(m)}]} />);
  const bob=Math.floor((len-0.05)/1.1);
  return <frame at={at} duration={len} width={W} height={H} layout="none">
    <group x={0} y={0} width={S} height={S*1.05}
      animate={[{property:"offsetX",keyframes:kf(p=>p.x+ox),easing:"ease-in-out"},{property:"offsetY",keyframes:kf(p=>p.y+oy),easing:"ease-in-out"}]}>
      <group x={0} y={0} width={S} height={S*1.05} animate={kind==="marker"||bob<1?[]:[{property:"offsetY",keyframes:[{at:0,value:0},{at:0.55,value:-S*0.04},{at:1.1,value:0}],...(bob>=2?{repeat:bob}:{}),easing:"ease-in-out"}]}>
        {body}{eyes}{lids}{mouths}
      </group></group>
  </frame>;
}
