// Research- G1 sandbox: original WebGL2 geometry / bounded camera flight.
// This is NOT Three.js, WebGPU, a GPU benchmark, or a production 3D world.
const stage=document.querySelector('#renderStage');
const canvas=document.querySelector('#g1-canvas');
const controls=document.querySelector('#controls');
const status=document.querySelector('#renderStatus');
const motionButton=document.querySelector('#motionButton');
const resetButton=document.querySelector('#resetButton');
const qualityButton=document.querySelector('#qualityButton');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let gl=null,program=null,meshes=[],uniforms=null,raf=0,frameClock=null,elapsed=0;
let paused=reducedMotion.matches,energySave=false,contextLost=false;
const posterMessage='這個瀏覽器使用靜態構圖；研究內容及導覽均可直接使用。';
const zero=()=>{if(raf)cancelAnimationFrame(raf);raf=0;frameClock=null;};
const setPoster=message=>{
  zero();stage.dataset.renderer='poster';controls.hidden=true;status.textContent=message||posterMessage;
};
const shaderSource={
  vertex:`#version 300 es
precision highp float;
layout(location=0) in vec3 position;
layout(location=1) in vec3 normal;
uniform mat4 projection;
uniform float angle;
uniform float tilt;
uniform float distance;
out vec3 normalWorld;
vec3 rotateY(vec3 p,float a){
  float c=cos(a),s=sin(a);return vec3(c*p.x-s*p.z,p.y,s*p.x+c*p.z);
}
vec3 rotateX(vec3 p,float a){
  float c=cos(a),s=sin(a);return vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);
}
void main(){
  vec3 point=rotateY(rotateX(position,tilt),angle);
  normalWorld=rotateY(rotateX(normal,tilt),angle);
  point.z-=distance;
  gl_Position=projection*vec4(point,1.0);
}`,
  fragment:`#version 300 es
precision highp float;
in vec3 normalWorld;
uniform vec3 materialColor;
out vec4 fragmentColor;
void main(){
  vec3 n=normalize(normalWorld);
  float key=max(dot(n,normalize(vec3(-0.35,0.70,0.60))),0.0);
  float rim=pow(1.0-abs(n.z),2.0);
  vec3 lit=materialColor*(0.22+0.78*key)+vec3(0.12,0.16,0.20)*rim;
  fragmentColor=vec4(lit,1.0);
}`
};
function compile(type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
    const message=gl.getShaderInfoLog(shader)||'Shader compile failed';
    gl.deleteShader(shader);throw new Error(message);
  }
  return shader;
}
function makeProgram(){
  const vert=compile(gl.VERTEX_SHADER,shaderSource.vertex);
  const frag=compile(gl.FRAGMENT_SHADER,shaderSource.fragment);
  const p=gl.createProgram();
  gl.attachShader(p,vert);gl.attachShader(p,frag);
  gl.linkProgram(p);gl.deleteShader(vert);gl.deleteShader(frag);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS)){
    const message=gl.getProgramInfoLog(p)||'Program link failed';
    gl.deleteProgram(p);throw new Error(message);
  }
  return p;
}
function addVertex(data,p,n){data.push(p[0],p[1],p[2],n[0],n[1],n[2]);}
function torus(radius=1.6,tube=.075,segments=100,sides=11){
  const data=[];
  const sample=(i,j)=>{
    const u=i*2*Math.PI/segments,v=j*2*Math.PI/sides;
    const inner=radius+tube*Math.cos(v);
    return {
      p:[inner*Math.cos(u),inner*Math.sin(u),tube*Math.sin(v)],
      n:[Math.cos(u)*Math.cos(v),Math.sin(u)*Math.cos(v),Math.sin(v)]
    };
  };
  for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){
    const a=sample(i,j),b=sample(i+1,j),c=sample(i+1,j+1),d=sample(i,j+1);
    for(const v of [a,b,c,a,c,d])addVertex(data,v.p,v.n);
  }
  return new Float32Array(data);
}
function octahedron(){
  const points=[
    [0,0.91,0],[0.69,0,0],[0,0,0.69],[-0.69,0,0],[0,0,-0.69],[0,-0.91,0]
  ];
  const faces=[[0,1,2],[0,2,3],[0,3,4],[0,4,1],[5,2,1],[5,3,2],[5,4,3],[5,1,4]];
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const data=[];
  for(const face of faces){
    const [a,b,c]=face.map(i=>points[i]);
    const v1=b.map((n,i)=>n-a[i]),v2=c.map((n,i)=>n-a[i]);
    const n=cross(v1,v2),length=Math.hypot(...n)||1;
    const normal=n.map(x=>x/length);
    for(const p of [a,b,c])addVertex(data,p,normal);
  }
  return new Float32Array(data);
}
function makeMesh(vertices){
  const vao=gl.createVertexArray(),buffer=gl.createBuffer();
  gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);
  gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
  gl.bindVertexArray(null);
  return {vao,buffer,count:vertices.length/6};
}
function resize(){
  if(!gl)return;
  const maxDpr=energySave?1:1.5;
  const dpr=Math.min(window.devicePixelRatio||1,maxDpr);
  const w=Math.max(1,Math.round(stage.clientWidth*dpr));
  const h=Math.max(1,Math.round(stage.clientHeight*dpr));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  gl.viewport(0,0,w,h);
}
function perspective(aspect){
  const f=1/Math.tan(Math.PI/6),near=.1,far=35;
  return new Float32Array([
    f/aspect,0,0,0,
    0,f,0,0,
    0,0,(far+near)/(near-far),-1,
    0,0,2*far*near/(near-far),0
  ]);
}
function draw(time){
  if(!gl||contextLost)return;
  resize();
  gl.clearColor(.026,.046,.074,1);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.useProgram(program);
  gl.uniformMatrix4fv(uniforms.projection,false,perspective(canvas.width/canvas.height));
  const progress=Math.min(1,time/2700);
  const eased=progress*progress*(3-2*progress);
  const distance=8.25-2.45*eased;
  gl.uniform1f(uniforms.distance,distance);
  const part=(mesh,color,tilt,phase)=>{
    gl.uniform1f(uniforms.angle,phase+time*.00012);
    gl.uniform1f(uniforms.tilt,tilt);
    gl.uniform3fv(uniforms.materialColor,color);
    gl.bindVertexArray(mesh.vao);
    gl.drawArrays(gl.TRIANGLES,0,mesh.count);
  };
  part(meshes[0],[.91,.68,.34],.28,0);
  part(meshes[0],[.67,.45,.25],1.33,1.8);
  part(meshes[1],[.63,.78,.84],.19,-.45);
  gl.bindVertexArray(null);
}
function tick(now){
  raf=0;
  if(paused||document.hidden||contextLost||!gl)return;
  if(frameClock!==null)elapsed+=Math.min(50,now-frameClock);
  frameClock=now;
  draw(elapsed);
  raf=requestAnimationFrame(tick);
}
function resume(){
  zero();
  if(!gl||contextLost)return;
  if(!paused&&!document.hidden)raf=requestAnimationFrame(tick);
  else draw(elapsed);
}
function updateMotionUI(){
  motionButton.textContent=paused?'播放動畫':'暫停動畫';
  motionButton.setAttribute('aria-pressed',String(paused));
  qualityButton.textContent='節能解析度：'+(energySave?'開':'關');
  qualityButton.setAttribute('aria-pressed',String(energySave));
}
function initialise(){
  if(new URLSearchParams(location.search).get('forcePoster')==='1'){
    setPoster('測試模式：已強制使用靜態構圖，確認不依賴 WebGL2 仍可閱讀。');
    return;
  }
  try{
    gl=canvas.getContext('webgl2',{
      alpha:false,antialias:false,depth:true,stencil:false,powerPreference:'low-power'
    });
    if(!gl)throw new Error('WebGL2 unavailable');
    program=makeProgram();
    uniforms={
      projection:gl.getUniformLocation(program,'projection'),
      angle:gl.getUniformLocation(program,'angle'),
      tilt:gl.getUniformLocation(program,'tilt'),
      distance:gl.getUniformLocation(program,'distance'),
      materialColor:gl.getUniformLocation(program,'materialColor')
    };
    meshes=[makeMesh(torus()),makeMesh(octahedron())];
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
    contextLost=false;
    stage.dataset.renderer='webgl2';
    controls.hidden=false;
    updateMotionUI();
    status.textContent='WebGL2 原創幾何已啟動；此處只驗證基本渲染與鏡頭，沒有 GPU 計時或真機效能結論。';
    draw(elapsed);resume();
  }catch(error){
    gl=null;program=null;meshes=[];
    setPoster('無法啟用 WebGL2，改用可閱讀的靜態構圖。此狀態不影響研究入口。');
  }
}
motionButton.addEventListener('click',()=>{
  paused=!paused;updateMotionUI();resume();
});
resetButton.addEventListener('click',()=>{
  elapsed=0;frameClock=null;draw(elapsed);resume();
});
qualityButton.addEventListener('click',()=>{
  energySave=!energySave;updateMotionUI();resize();draw(elapsed);resume();
});
addEventListener('resize',()=>{if(gl)draw(elapsed)},{passive:true});
document.addEventListener('visibilitychange',()=>resume());
reducedMotion.addEventListener?.('change',()=>{
  if(reducedMotion.matches){paused=true;updateMotionUI();resume();}
});
canvas.addEventListener('webglcontextlost',event=>{
  event.preventDefault();contextLost=true;zero();
  stage.dataset.renderer='poster';
  controls.hidden=true;
  status.textContent='圖形上下文已中斷，暫時顯示靜態構圖；閱讀功能維持正常。';
});
canvas.addEventListener('webglcontextrestored',()=>{
  contextLost=false;gl=null;program=null;meshes=[];
  initialise();
});
initialise();
