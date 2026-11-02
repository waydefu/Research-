/* Opt-in, local-only QA: ?qa=1. No beacon, storage, account or fabricated metrics.
   Frame intervals are rAF timing (NOT GPU frame timings). EventTiming is lab-only. */
export function percentile(values,p=.95){
 const finite=values.filter(x=>Number.isFinite(x)&&x>=0).sort((a,b)=>a-b);
 if(!finite.length)return null;
 const rank=Math.min(finite.length-1,Math.max(0,Math.ceil(p*finite.length)-1));
 return Math.round(finite[rank]*100)/100;
}
export function startQAMetrics({win=window,doc=document,maxFrames=1200}={}){
 const frameIntervals=[],interactions=new Map(),unknownEvents=[];
 let last=0,frame=0,closed=false;
 const ticks=now=>{
  frame=0;if(closed||doc.hidden)return;
  if(last&&now-last>0&&now-last<500)frameIntervals.push(now-last);
  last=now;
  if(frameIntervals.length<maxFrames)frame=win.requestAnimationFrame(ticks);
 };
 const observer=typeof win.PerformanceObserver==='function'?new win.PerformanceObserver(list=>{
  for(const e of list.getEntries()){
   if(e.interactionId)interactions.set(e.interactionId,Math.max(interactions.get(e.interactionId)||0,e.duration));
   else unknownEvents.push(e.duration);
  }
 }):null;
 let eventTiming='unsupported';
 try{observer?.observe({type:'event',buffered:true,durationThreshold:16});if(observer)eventTiming='available'}catch{observer?.disconnect()}
 function report(){
  const data=[...interactions.values()];
  return {
   purpose:'LAB / local manual review only',
   rafFrames:frameIntervals.length,
   rafP95IntervalMs:percentile(frameIntervals,.95),
   rafP99IntervalMs:percentile(frameIntervals,.99),
   eventTiming,
   observedInteractions:data.length,
   worstObservedInteractionMs:data.length?Math.max(...data):null,
   disclaimer:'rAF is not GPU frame time. EventTiming is not field INP p75. Record browser/device, duration, temperature and network separately.'
  };
 }
 if(!doc.hidden)frame=win.requestAnimationFrame(ticks);
 const visibility=()=>{last=0;if(doc.hidden){if(frame)win.cancelAnimationFrame(frame);frame=0}else if(!frame&&!closed&&frameIntervals.length<maxFrames)frame=win.requestAnimationFrame(ticks)};
 doc.addEventListener('visibilitychange',visibility);
 win.__researchQaReport=report;
 console.info('V2 QA enabled. After interacting and scrolling, call __researchQaReport() in DevTools; results remain local.');
 return ()=>{closed=true;if(frame)win.cancelAnimationFrame(frame);observer?.disconnect();doc.removeEventListener('visibilitychange',visibility);delete win.__researchQaReport};
}
