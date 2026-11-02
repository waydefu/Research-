/* EVIDENCE ENGINE V2. Original torus geometry, low-cost WebGL2 forward shading and
   bounded 9-tap highlight bloom. Entire scene is decorative; DOM is authoritative. */
const VERT=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
uniform vec3 uAngles;
uniform vec3 uOffset;
uniform vec2 uPointer;
uniform float uTime;
uniform float uProgress;
uniform float uAspect;
out vec3 vNormal;
out vec3 vWorld;
mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,-s,0.,s,c);}
mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,s,0.,1.,0.,-s,0.,c);}
mat3 rz(float a){float c=cos(a),s=sin(a);return mat3(c,-s,0.,s,c,0.,0.,0.,1.);}
void main(){
 float phase=uTime*.028;
 mat3 m=rz(uAngles.z+phase*.55)*ry(uAngles.y+phase+uPointer.x*.14+uProgress*.45)*rx(uAngles.x+uPointer.y*.10);
 vec3 pos=m*aPosition+uOffset;
 vNormal=normalize(m*aNormal);
 vWorld=pos;
 float depth=4.55-pos.z;
 vec2 xy=pos.xy/(depth*0.49);
 gl_Position=vec4(xy.x/uAspect,xy.y,0.35+pos.z*.06,1.);
}`;
const FRAG=`#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vWorld;
uniform float uMaterial;
uniform float uFocus;
out vec4 fragColor;
void main(){
 vec3 n=normalize(vNormal);
 vec3 v=normalize(vec3(0.,0.,4.55)-vWorld);
 vec3 gold=vec3(.894,.706,.318);
 vec3 cyan=vec3(.251,.831,.871);
 vec3 titanium=mix(vec3(.065,.098,.15),vec3(.11,.17,.21),uMaterial*.36);
 vec3 key=normalize(vec3(-.62,.88,1.2));
 vec3 edge=normalize(vec3(.9,-.27,-.65));
 float diffuse=max(dot(n,key),0.);
 float spec=pow(max(dot(reflect(-key,n),v),0.),38.);
 float fresnel=pow(1.-max(dot(n,v),0.),3.0);
 float rim=pow(max(dot(n,edge),0.),3.);
 vec3 col=titanium*(.19+.28*diffuse)+gold*(spec*1.35+diffuse*.10+fresnel*.16)+cyan*rim*.24;
 col+=gold*spec*uFocus*.17;
 fragColor=vec4(col,1.);
}`;
const COMPOSITE_VERT=`#version 300 es
precision highp float;
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
const COMPOSITE_FRAG=`#version 300 es
precision highp float;
in vec2 uv;
out vec4 fragColor;
uniform sampler2D uScene;
uniform vec2 uTexel;
uniform float uBloom;
uniform float uSceneProgress;
void main(){
 vec3 base=texture(uScene,uv).rgb;
 vec2 p=(uv-.5)*vec2(1.0,0.7);
 vec3 bg=vec3(.039,.063,.114)+.012*exp(-length(p)*3.)*vec3(.08,.24,.37);
 vec3 glow=vec3(0.);
 for(int i=0;i<9;i++){
  float a=float(i)*2.39996;
  vec2 offset=vec2(cos(a),sin(a))*uTexel*float(3+i*2);
  vec3 sampleColor=texture(uScene,clamp(uv+offset,0.,1.)).rgb;
  glow+=max(sampleColor-vec3(.16),vec3(0.))/9.;
 }
 float fog=.015*exp(-length(p-vec2(.05,.08))*6.);
 vec3 color=bg+base+uBloom*glow*.38+fog*vec3(.25,.83,.87);
 color=mix(color,color*vec3(.82,1.,1.07),.10*uSceneProgress);
 fragColor=vec4(pow(max(color,vec3(0.)),vec3(.94)),1.);
}`;

export function makeTorus(major=1,minor=.075,segments=68,sides=12){
 if(!(major>minor&&minor>0)||segments<8||sides<3||segments>256||sides>64)throw new RangeError('Invalid torus geometry');
 const verts=[];
 const point=(a,b)=>{
  const ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b);
  return [(major+minor*cb)*ca,(major+minor*cb)*sa,minor*sb,cb*ca,cb*sa,sb];
 };
 for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){
  const a=i*2*Math.PI/segments,A=(i+1)*2*Math.PI/segments;
  const b=j*2*Math.PI/sides,B=(j+1)*2*Math.PI/sides;
  const p=point(a,b),q=point(A,b),r=point(a,B),s=point(A,B);
  verts.push(...p,...q,...r,...r,...q,...s);
 }
 return new Float32Array(verts);
}
export const RINGS=[
 {major:1.04,minor:.075,angles:[-.52,.19,.34],offset:[-.20,.02,0],material:0},
 {major:1.32,minor:.022,angles:[.50,-.71,.82],offset:[.10,.04,-.17],material:1},
 {major:.73,minor:.037,angles:[.34,.71,-.55],offset:[.04,-.11,.12],material:2},
 {major:1.50,minor:.010,angles:[-.72,.08,.44],offset:[.19,-.06,-.25],material:1}
];
const compile=(gl,type,source)=>{
 const shader=gl.createShader(type);
 if(!shader)throw new Error('Unable to allocate shader');
 gl.shaderSource(shader,source);gl.compileShader(shader);
 if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
  const log=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error('WebGL shader: '+log);
 }
 return shader;
};
const program=(gl,vert,frag)=>{
 const v=compile(gl,gl.VERTEX_SHADER,vert),f=compile(gl,gl.FRAGMENT_SHADER,frag);
 const p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);
 gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);
 if(!gl.getProgramParameter(p,gl.LINK_STATUS)){const log=gl.getProgramInfoLog(p);gl.deleteProgram(p);throw new Error('WebGL link: '+log)}
 return p;
};
export function mountMeshCore(canvas,label){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer=matchMedia('(pointer: fine)');
 const saveData=navigator.connection?.saveData===true;
 let gl=null,mesh=null,composite=null,vao=null,vbo=null,fbo=null,color=null,depth=null,raf=0;
 let disposed=false,contextLost=false,disabled=false,visible=false,active=false;
 let quality=.70,slow=0,frames=0,last=0,origin=0;
 let sceneProgress=0,focus=0,focusTarget=0;
 const pointer={x:0,y:0,tx:0,ty:0};
 const uniforms={};
 const status=value=>{if(label)label.textContent='RENDERER: '+value};
 const stop=()=>{if(raf)cancelAnimationFrame(raf);raf=0;active=false};
 function release(){
  stop();canvas.classList.remove('is-ready');
  if(gl&&!contextLost){
   if(fbo)gl.deleteFramebuffer(fbo);
   if(color)gl.deleteTexture(color);
   if(depth)gl.deleteRenderbuffer(depth);
   if(vbo)gl.deleteBuffer(vbo);
   if(vao)gl.deleteVertexArray(vao);
   if(mesh)gl.deleteProgram(mesh);
   if(composite)gl.deleteProgram(composite);
  }
  fbo=color=depth=vbo=vao=mesh=composite=gl=null;
 }
 const fail=reason=>{disabled=true;release();status(reason)};
 const u=(p,key)=>gl.getUniformLocation(p,key);
 function create(){
  if(disposed||disabled||contextLost||reduced.matches||saveData)return;
  try {
   gl=canvas.getContext('webgl2',{alpha:false,depth:true,antialias:false,stencil:false,powerPreference:'low-power',preserveDrawingBuffer:false});
   if(!gl||!gl.createVertexArray||!gl.createFramebuffer)throw new Error('WebGL2 mesh pipeline unavailable');
   mesh=program(gl,VERT,FRAG);composite=program(gl,COMPOSITE_VERT,COMPOSITE_FRAG);
   vao=gl.createVertexArray();vbo=gl.createBuffer();
   gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
   const surfaces=RINGS.map(r=>makeTorus(r.major,r.minor,68,12));
   const total=surfaces.reduce((a,v)=>a+v.length,0);
   const packed=new Float32Array(total);let off=0;const ranges=[];
   for(const values of surfaces){ranges.push({start:off/6,count:values.length/6});packed.set(values,off);off+=values.length}
   gl.bufferData(gl.ARRAY_BUFFER,packed,gl.STATIC_DRAW);
   gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);
   gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
   gl.bindVertexArray(null);
   fbo=gl.createFramebuffer();color=gl.createTexture();depth=gl.createRenderbuffer();
   uniforms.mesh={angles:u(mesh,'uAngles'),offset:u(mesh,'uOffset'),pointer:u(mesh,'uPointer'),time:u(mesh,'uTime'),progress:u(mesh,'uProgress'),aspect:u(mesh,'uAspect'),material:u(mesh,'uMaterial'),focus:u(mesh,'uFocus')};
   uniforms.composite={scene:u(composite,'uScene'),texel:u(composite,'uTexel'),bloom:u(composite,'uBloom'),progress:u(composite,'uSceneProgress')};
   uniforms.ranges=ranges;
   status('WEBGL2 / MESH CORE');canvas.classList.add('is-ready');resize();
   if(visible)start();
  }catch(error){console.warn('V2 mesh failed; DOM poster retained',error);fail('CSS / GPU UNAVAILABLE')}
 }
 function resize(){
  if(!gl||contextLost)return;
  const box=canvas.getBoundingClientRect();
  if(!box.width||!box.height)return;
  const dpr=Math.min(window.devicePixelRatio||1,1.25)*quality;
  const w=Math.max(1,Math.min(1200,Math.round(box.width*dpr))),h=Math.max(1,Math.min(900,Math.round(box.height*dpr)));
  if(canvas.width===w&&canvas.height===h)return;
  canvas.width=w;canvas.height=h;
  gl.bindTexture(gl.TEXTURE_2D,color);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.bindRenderbuffer(gl.RENDERBUFFER,depth);
  gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,w,h);
  gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,color,0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depth);
  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw new Error('Incomplete scene framebuffer');
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);
 }
 function render(now){
  raf=0;if(!active||!gl||contextLost||!visible||document.hidden||disposed)return;
  try{
   resize();const dt=last?Math.min(100,now-last):16;
   pointer.x+=(pointer.tx-pointer.x)*Math.min(1,dt/120);
   pointer.y+=(pointer.ty-pointer.y)*Math.min(1,dt/120);
   focus+=(focusTarget-focus)*Math.min(1,dt/780);
   gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
   gl.viewport(0,0,canvas.width,canvas.height);
   gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   gl.enable(gl.DEPTH_TEST);gl.disable(gl.BLEND);
   gl.useProgram(mesh);gl.bindVertexArray(vao);
   const uu=uniforms.mesh;gl.uniform2f(uu.pointer,pointer.x,pointer.y);
   gl.uniform1f(uu.time,(now-origin)*.001);gl.uniform1f(uu.progress,sceneProgress);
   gl.uniform1f(uu.focus,focus);gl.uniform1f(uu.aspect,canvas.width/Math.max(1,canvas.height));
   RINGS.forEach((r,i)=>{
    gl.uniform3f(uu.angles,...r.angles);gl.uniform3f(uu.offset,...r.offset);
    gl.uniform1f(uu.material,r.material);
    gl.drawArrays(gl.TRIANGLES,uniforms.ranges[i].start,uniforms.ranges[i].count);
   });
   gl.bindVertexArray(null);gl.bindFramebuffer(gl.FRAMEBUFFER,null);
   gl.disable(gl.DEPTH_TEST);gl.viewport(0,0,canvas.width,canvas.height);
   gl.useProgram(composite);const co=uniforms.composite;
   gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,color);
   gl.uniform1i(co.scene,0);gl.uniform2f(co.texel,1/canvas.width,1/canvas.height);
   gl.uniform1f(co.bloom,quality>.52?1:.25);gl.uniform1f(co.progress,sceneProgress);
   gl.drawArrays(gl.TRIANGLES,0,3);
   if(last&&frames>35){
    if(now-last>42)slow++;else slow=Math.max(0,slow-1);
    if(slow>18&&quality>.5){quality=.48;slow=0;status('WEBGL2 / MESH ECO')}
    else if(slow>32){fail('CSS / PERFORMANCE FALLBACK');return}
   }
   frames++;last=now;raf=requestAnimationFrame(render);
  }catch(e){console.warn('Scene runtime failure',e);fail('CSS / RENDER ERROR')}
 }
 function start(){if(active||!gl||disposed||disabled||contextLost||!visible||document.hidden||reduced.matches)return;active=true;origin=performance.now();last=0;frames=0;raf=requestAnimationFrame(render)}
 const obs=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start();else stop()},{threshold:.01});
 obs.observe(canvas);
 const resizer=new ResizeObserver(()=>{if(gl&&!contextLost)resize()});resizer.observe(canvas);
 const move=e=>{if(!finePointer.matches)return;pointer.tx=Math.max(-1,Math.min(1,(e.clientX/Math.max(1,innerWidth)-.5)*2));pointer.ty=Math.max(-1,Math.min(1,(e.clientY/Math.max(1,innerHeight)-.5)*2))};
 const hidden=()=>{if(document.hidden)stop();else start()};
 const lost=e=>{e.preventDefault();contextLost=true;stop();canvas.classList.remove('is-ready');status('CONTEXT LOST / CSS')};
 const restored=()=>{if(disposed||disabled)return;contextLost=false;release();create()};
 const change=()=>{if(reduced.matches){release();status('REDUCED MOTION')}else if(!gl)create()};
 window.addEventListener('pointermove',move,{passive:true});
 document.addEventListener('visibilitychange',hidden);
 canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);
 reduced.addEventListener?.('change',change);
 create();
 return {
  setScene(progress,selected){sceneProgress=Math.max(0,Math.min(1,progress||0));focusTarget=selected?1:0},
  pause:stop,resume:start,
  dispose(){disposed=true;release();obs.disconnect();resizer.disconnect();
   window.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',hidden);
   canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);
   reduced.removeEventListener?.('change',change)}
 };
}
