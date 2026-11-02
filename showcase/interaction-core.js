/* Evidence-driven field labels, genuine asset progress and optional pointer detailing.
   No third-party images/glyphs, no audio auto-play, no fake loading percentage. */
export function selectEvidenceLabels(documents=[],count=7){
 const used=new Set(),out=[];
 for(const item of documents){
  if(!item||typeof item.path!=='string'||typeof item.title!=='string')continue;
  if(used.has(item.group))continue;
  used.add(item.group);
  out.push({name:item.title.slice(0,40),file:item.path.split('/').at(-1),group:item.group});
  if(out.length>=count)break;
 }
 return out;
}
export function mountInteraction(stage,{doc=document,win=window}={}){
 if(!stage)return {setDocuments(){},markIndexLoaded(){},dispose(){}};
 const labels=doc.createElement('div');
 labels.id='v2-evidence-orbit';
 labels.className='v2-evidence-orbit';
 labels.setAttribute('aria-hidden','true');stage.append(labels);
 const counter=doc.createElement('span');
 counter.className='v2-asset-counter';counter.textContent='ASSETS 0 / 4';stage.append(counter);
 const reduced=win.matchMedia('(prefers-reduced-motion: reduce)');
 const fine=win.matchMedia('(hover: hover) and (pointer: fine)');
 let ready=0,failed=0,disposed=false,raf=0;
 function finish(success){
  if(disposed)return;
  ready++;if(!success)failed++;
  counter.textContent=ready>=4?(failed?'ASSETS / FALLBACK':'ASSETS / READY'):`ASSETS ${ready} / 4`;
 }
 if(doc.fonts?.load){
  for(const family of ['Instrument Serif','Manrope','IBM Plex Mono']){
   doc.fonts.load(`400 16px "${family}"`).then(face=>finish(face.length>0),()=>finish(false));
  }
 }else{for(let i=0;i<3;i++)finish(false)}
 const cursor=doc.createElement('div');cursor.className='v2-cursor';cursor.setAttribute('aria-hidden','true');cursor.textContent='⊕';doc.body.append(cursor);
 const pointer={x:0,y:0,tx:0,ty:0};
 function draw(){
  raf=0;if(disposed||reduced.matches||!fine.matches)return;
  pointer.x+=(pointer.tx-pointer.x)*.24;pointer.y+=(pointer.ty-pointer.y)*.24;
  cursor.style.transform=`translate3d(${pointer.x}px,${pointer.y}px,0) translate(-50%,-50%)`;
  if(Math.abs(pointer.x-pointer.tx)+Math.abs(pointer.y-pointer.ty)>.35)raf=win.requestAnimationFrame(draw);
 }
 const motion=e=>{
  if(!fine.matches||reduced.matches){cursor.classList.remove('is-visible');return}
  pointer.tx=e.clientX;pointer.ty=e.clientY;cursor.classList.add('is-visible');
  cursor.classList.toggle('is-action',!!e.target.closest?.('a,button,[role=button]'));
  if(!raf)raf=win.requestAnimationFrame(draw);
 };
 const out=()=>cursor.classList.remove('is-visible');
 win.addEventListener('pointermove',motion,{passive:true});
 doc.addEventListener('pointerleave',out);
 const motionButton=doc.getElementById('v2-motion-toggle');
 const scene=()=>doc.querySelector('#artifact-canvas');
 const pause=()=>{
  if(!motionButton)return;
  const paused=motionButton.getAttribute('aria-pressed')!=='true';
  motionButton.setAttribute('aria-pressed',String(paused));
  motionButton.textContent=paused?'RESUME VISUAL MOTION':'PAUSE VISUAL MOTION';
  doc.dispatchEvent(new CustomEvent('research:motion',{detail:{paused}}));
 };
 motionButton?.addEventListener('click',pause);
 return {
  markIndexLoaded(success=true){finish(success)},
  setDocuments(documents,commit){
   labels.replaceChildren();
   const list=selectEvidenceLabels(documents);
   const total=Math.max(1,list.length);
   list.forEach((item,i)=>{
    const span=doc.createElement('span');span.className='v2-evidence-label';
    const angle=(i/total)*Math.PI*2-.75;
    span.style.setProperty('--orbit-x',`${(50+Math.cos(angle)*33).toFixed(2)}%`);
    span.style.setProperty('--orbit-y',`${(49+Math.sin(angle)*31).toFixed(2)}%`);
    span.textContent=item.file.slice(0,26);span.title=item.name;labels.append(span);
   });
   const sha=doc.createElement('span');sha.className='v2-evidence-sha';
   sha.textContent=/^[0-9a-f]{40}$/i.test(commit)?'SOURCE · '+commit.slice(0,9):'SOURCE · UNVERIFIED';
   labels.append(sha);
  },
  dispose(){
   disposed=true;if(raf)win.cancelAnimationFrame(raf);
   win.removeEventListener('pointermove',motion);doc.removeEventListener('pointerleave',out);
   motionButton?.removeEventListener('click',pause);cursor.remove();labels.remove();counter.remove();
  }
 };
}
