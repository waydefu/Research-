import test from 'node:test';
import assert from 'node:assert/strict';
import {SCENES,clamp01,progressForRect,mountSceneDirector} from '../scene-director.js';

test('V2 contains exactly six ordered chapters and bounded scene parameters',()=>{
 assert.deepEqual(SCENES.map(s=>s.id),['introduction','thesis','systems','explorer','method','exit']);
 assert.equal(clamp01(-2),0);assert.equal(clamp01(2),1);assert.equal(clamp01(NaN),0);
 assert.ok(progressForRect({top:100,height:600},900,2)>.3);
 assert.ok(progressForRect({top:100,height:600},900,2)<.6);
});
test('native scroll updates camera without scroll-jack and releases listeners',()=>{
 let next=0;const q=new Map(),listeners=new Map(),marks=[];
 const positions=SCENES.map((s,i)=>({id:s.id,getBoundingClientRect:()=>({top:(i-2)*900,height:900,bottom:(i-1)*900})}));
 const marker={textContent:''};
 const doc={
  body:{dataset:{}},hidden:false,
  getElementById:id=>id==='v2-chapter-marker'?marker:positions.find(s=>s.id===id),
  addEventListener:(k,fn)=>listeners.set('d:'+k,fn),
  removeEventListener:k=>listeners.delete('d:'+k)
 };
 const win={
  innerHeight:900,
  matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),
  requestAnimationFrame:cb=>{q.set(++next,cb);return next},
  cancelAnimationFrame:n=>q.delete(n),
  addEventListener:(k,fn)=>listeners.set('w:'+k,fn),
  removeEventListener:k=>listeners.delete('w:'+k)
 };
 const core={setScene(...args){marks.push(args)},pause(){},resume(){}};
 const director=mountSceneDirector(core,{doc,win});
 assert.match(marker.textContent,/SPECTRAL ATLAS/);
 for(let i=0;i<80&&q.size;i++){const [id,fn]=q.entries().next().value;q.delete(id);fn(i*16)}
 assert.ok(marks.length>1);
 assert.ok(marks.every(x=>x[0]>=0&&x[0]<=1));
 assert.equal(doc.body.dataset.v2Scene,'systems');
 director.dispose();
 assert.equal(q.size,0);
 assert.equal(listeners.size,0);
});
