/* Six conceptual camera/lighting chapters driven by native scrolling — never scroll-jacks.
   Event-driven RAFrame only during transitions; all content remains available without JS/GPU. */
export const SCENES=[
 {id:'introduction',name:'FIRST SIGNAL'},
 {id:'thesis',name:'THE ENGINE'},
 {id:'systems',name:'SPECTRAL ATLAS'},
 {id:'explorer',name:'DOSSIERS'},
 {id:'method',name:'THE PROTOCOL'},
 {id:'exit',name:'BACK TO SOURCE'}
];
export const clamp01=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
export function progressForRect(rect,viewHeight,index,total=SCENES.length){
 const span=Math.max(1,rect.height);
 const travel=clamp01((viewHeight*.64-rect.top)/span);
 return clamp01((index+travel*.5)/Math.max(1,total-1));
}
export function mountSceneDirector(core,{doc=document,win=window}={}){
 const chapters=SCENES.map(s=>doc.getElementById(s.id)).filter(Boolean);
 const marker=doc.getElementById('v2-chapter-marker');
 const reduced=win.matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,disposed=false,current=0,target=0,last=0,selected=false,lastIndex=-1;
 const render=now=>{
  frame=0;if(disposed)return;
  const dt=last?Math.min(50,now-last):16;last=now;
  const ease=reduced.matches?1:Math.min(1,dt/165);
  current+=(target-current)*ease;
  core.setScene(current,selected);
  if(Math.abs(target-current)>.001)frame=win.requestAnimationFrame(render);
 };
 const schedule=()=>{if(disposed||frame)return;last=0;frame=win.requestAnimationFrame(render)};
 const update=()=>{
  if(disposed)return;
  const line=win.innerHeight*.46;
  let index=0,nearest=Infinity;
  for(let i=0;i<chapters.length;i++){
   const box=chapters[i].getBoundingClientRect();
   const distance=box.top<=line&&box.bottom>=line?0:Math.min(Math.abs(box.top-line),Math.abs(box.bottom-line));
   if(distance<nearest){index=i;nearest=distance}
  }
  const rect=chapters[index]?.getBoundingClientRect();
  target=rect?progressForRect(rect,win.innerHeight,index,chapters.length):0;
  const chapter=SCENES.find(c=>c.id===chapters[index]?.id)||SCENES[0];
  if(index!==lastIndex){
   lastIndex=index;
   if(marker)marker.textContent=`${String(index).padStart(2,'0')} / 05 — ${chapter.name}`;
   doc.body.dataset.v2Scene=chapter.id;
  }
  schedule();
 };
 const onDomain=e=>{selected=!!e.detail?.selected;core.setScene(current,selected)};
 const onVisibility=()=>{if(doc.hidden){if(frame)win.cancelAnimationFrame(frame);frame=0;core.pause?.()}else{core.resume?.();update()}};
 win.addEventListener('scroll',update,{passive:true});
 win.addEventListener('resize',update,{passive:true});
 doc.addEventListener('research:focus',onDomain);
 doc.addEventListener('visibilitychange',onVisibility);
 reduced.addEventListener?.('change',update);
 update();
 return {update,dispose(){
   disposed=true;if(frame)win.cancelAnimationFrame(frame);
   win.removeEventListener('scroll',update);win.removeEventListener('resize',update);
   doc.removeEventListener('research:focus',onDomain);doc.removeEventListener('visibilitychange',onVisibility);
   reduced.removeEventListener?.('change',update);
 }};
}
