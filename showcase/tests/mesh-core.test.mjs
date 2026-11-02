import test from 'node:test';
import assert from 'node:assert/strict';
import {makeTorus,RINGS,mountMeshCore} from '../mesh-core.js';

test('original torus mesh has bounded topology, finite normals and no external models',()=>{
 const v=makeTorus(1,.07,16,8);
 assert.equal(v.length,16*8*6*6);
 assert.equal(RINGS.length,4);
 for(let i=0;i<v.length;i+=6){
  for(let j=0;j<6;j++)assert.ok(Number.isFinite(v[i+j]));
  assert.ok(Math.abs(Math.hypot(v[i+3],v[i+4],v[i+5])-1)<1e-5);
 }
 assert.throws(()=>makeTorus(1,.01,1000,10),RangeError);
});

function fake(){
 const prev=new Map();
 const save=(k,v)=>{prev.set(k,Object.getOwnPropertyDescriptor(globalThis,k));Object.defineProperty(globalThis,k,{configurable:true,writable:true,value:v})};
 const listeners=new Map();
 const emit=()=>({addEventListener(k,f){listeners.set(k,f)},removeEventListener(k){listeners.delete(k)},dispatch(k,e={}){listeners.get(k)?.(e)}});
 const queue=new Map();let next=0,draws=0,deletes=0,observer;
 const gl={
  VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,LINK_STATUS:35714,
  ARRAY_BUFFER:34962,STATIC_DRAW:35044,FLOAT:5126,TRIANGLES:4,
  TEXTURE_2D:3553,RGBA:6408,UNSIGNED_BYTE:5121,TEXTURE_MIN_FILTER:10241,TEXTURE_MAG_FILTER:10240,
  LINEAR:9729,TEXTURE_WRAP_S:10242,TEXTURE_WRAP_T:10243,CLAMP_TO_EDGE:33071,
  RENDERBUFFER:36161,DEPTH_COMPONENT16:33189,FRAMEBUFFER:36160,COLOR_ATTACHMENT0:36064,
  DEPTH_ATTACHMENT:36096,FRAMEBUFFER_COMPLETE:36053,COLOR_BUFFER_BIT:16384,DEPTH_BUFFER_BIT:256,
  DEPTH_TEST:2929,BLEND:3042,TEXTURE0:33984,
  createShader:()=>({}),shaderSource(){},compileShader(){},getShaderParameter:()=>true,
  getShaderInfoLog:()=>'',deleteShader(){},createProgram:()=>({}),attachShader(){},linkProgram(){},
  getProgramParameter:()=>true,getProgramInfoLog:()=>'',deleteProgram(){deletes++},
  createVertexArray:()=>({}),deleteVertexArray(){deletes++},bindVertexArray(){},
  createBuffer:()=>({}),deleteBuffer(){deletes++},bindBuffer(){},bufferData(){},
  enableVertexAttribArray(){},vertexAttribPointer(){},createFramebuffer:()=>({}),
  deleteFramebuffer(){deletes++},createTexture:()=>({}),deleteTexture(){deletes++},
  createRenderbuffer:()=>({}),deleteRenderbuffer(){deletes++},
  getUniformLocation:()=>({}),uniform2f(){},uniform3f(){},uniform1f(){},uniform1i(){},
  bindTexture(){},texImage2D(){},texParameteri(){},bindRenderbuffer(){},renderbufferStorage(){},
  bindFramebuffer(){},framebufferTexture2D(){},framebufferRenderbuffer(){},
  checkFramebufferStatus:()=>36053,viewport(){},clearColor(){},clear(){},enable(){},disable(){},
  useProgram(){},activeTexture(){},drawArrays(){draws++}
 };
 const set=new Set();
 const canvas={...emit(),width:0,height:0,getContext:()=>gl,
  classList:{add:x=>set.add(x),remove:x=>set.delete(x)},
  getBoundingClientRect:()=>({width:600,height:380})
 };
 const reduced={matches:false,...emit()};
 const label={textContent:''};
 save('navigator',{connection:{saveData:false}});
 save('matchMedia',query=>query.includes('reduced')?reduced:{matches:true});
 save('window',{devicePixelRatio:1,...emit()});
 save('innerWidth',1200);save('innerHeight',760);
 save('document',{hidden:false,...emit()});
 save('IntersectionObserver',class{constructor(cb){observer=cb}observe(){}disconnect(){}});
 save('ResizeObserver',class{observe(){}disconnect(){}});
 save('requestAnimationFrame',cb=>{queue.set(++next,cb);return next});
 save('cancelAnimationFrame',id=>{queue.delete(id)});
 return {canvas,label,gl,reduced,set,
  show(x){observer([{isIntersecting:x}])},
  frame(t){const [id,cb]=queue.entries().next().value;queue.delete(id);cb(t)},
  get pending(){return queue.size},get draws(){return draws},get deletes(){return deletes},
  restore(){for(const [key,desc] of prev){if(desc)Object.defineProperty(globalThis,key,desc);else delete globalThis[key]}}
 };
}

test('mesh renderer respects context loss, never resumes early and releases resources',()=>{
 const h=fake();let core;
 try{
  core=mountMeshCore(h.canvas,h.label);
  h.show(true);assert.equal(h.pending,1);
  h.frame(16);assert.ok(h.draws>=5,'four meshes plus composite');
  let prevent=false;
  h.canvas.dispatch('webglcontextlost',{preventDefault(){prevent=true}});
  assert.ok(prevent);assert.equal(h.pending,0);
  assert.match(h.label.textContent,/CONTEXT LOST/);
  h.show(false);h.show(true);
  assert.equal(h.pending,0,'lost GPU context must not resume');
  h.canvas.dispatch('webglcontextrestored');
  assert.equal(h.pending,1);
  h.frame(100);assert.equal(h.pending,1);
  h.reduced.matches=true;h.reduced.dispatch('change');
  assert.equal(h.pending,0);
  assert.match(h.label.textContent,/REDUCED MOTION/);
  assert.ok(h.deletes>0);
 }finally{core?.dispose();h.restore()}
});
