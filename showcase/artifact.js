/* Single-pass original WebGL2 artifact. Decorative only; DOM stays authoritative. */
const VERT = `#version 300 es
precision highp float;
in vec2 position;
out vec2 vUv;
void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
#define MAX_STEPS 58
#define MAX_DIST 12.0
#define SURF 0.0018
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float box3(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
float torus(vec3 p,vec2 t){vec2 q=vec2(length(p.xz)-t.x,p.y);return length(q)-t.y;}
vec2 scene(vec3 p){
  vec3 a=p;
  a.xz=rot(.23+uTime*.055+uPointer.x*.14)*a.xz;
  a.xy=rot(-.68+uTime*.075+uPointer.y*.12)*a.xy;
  float d=torus(a,vec2(1.03,.105));
  vec3 b=p;
  b.xy=rot(1.08-uTime*.043)*b.xy;
  b.yz=rot(.65+uPointer.x*.1)*b.yz;
  float e=torus(b,vec2(1.34,.035));
  vec3 c=p;
  c.yz=rot(-.9+uTime*.037)*c.yz;
  c.xy=rot(.24)*c.xy;
  float f=torus(c,vec2(.72,.018));
  vec3 core=p;
  core.xy=rot(.2+uTime*.036)*core.xy;
  core.yz=rot(-.42)*core.yz;
  float g=box3(core,vec3(.16,.42,.16))-.055;
  float h=box3(core,vec3(.43,.16,.16))-.045;
  float solid=min(d,min(e,min(f,min(g,h))));
  float id=solid==d?1.:(solid==e?2.:(solid==f?3.:4.));
  return vec2(solid,id);
}
vec3 norm(vec3 p){vec2 e=vec2(.002,0);return normalize(vec3(scene(p+e.xyy).x-scene(p-e.xyy).x,scene(p+e.yxy).x-scene(p-e.yxy).x,scene(p+e.yyx).x-scene(p-e.yyx).x));}
float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
 vec2 p=(gl_FragCoord.xy-.5*uResolution)/min(uResolution.x,uResolution.y);
 p.x-=.015;
 vec3 ro=vec3(0.,0.,4.4),rd=normalize(vec3(p*.95,-1.7));
 vec3 bg=vec3(.049,.081,.087)+.024*exp(-length(p-vec2(.05,.02))*3.)*vec3(.26,.40,.35);
 vec3 col=bg;
 float t=0.;vec2 hit=vec2(0.);
 for(int i=0;i<MAX_STEPS;i++){
   vec3 pos=ro+rd*t;hit=scene(pos);
   if(hit.x<SURF||t>MAX_DIST)break;
   t+=hit.x*.86;
 }
 if(t<MAX_DIST&&hit.x<SURF){
    vec3 pos=ro+rd*t,n=norm(pos),v=normalize(ro-pos);
    vec3 light=normalize(vec3(-.55,.85,1.5));
    vec3 rimLight=normalize(vec3(1.,-.3,-.8));
    float diff=max(dot(n,light),0.),fill=max(dot(n,rimLight),0.);
    float spec=pow(max(dot(reflect(-light,n),v),0.),42.);
    float rim=pow(1.-max(dot(n,v),0.),2.8);
    vec3 metal=hit.y==1.?vec3(.37,.48,.44):(hit.y==2.?vec3(.64,.35,.24):(hit.y==3.?vec3(.55,.62,.53):vec3(.2,.34,.32)));
    col=metal*(.10+.77*diff+.26*fill)+vec3(1.,.83,.65)*spec*.85+rim*vec3(.38,.66,.57)*.65;
    col*=.88+.12*sin(dot(pos,vec3(65.,52.,43.)));
    col=mix(col,bg,smoothstep(3.7,6.8,t)*.35);
 }
 // Restrained calibration arcs: a map metaphor, not generic glitter.
 float a=length(p*vec2(1.,1.08));
 float ring=exp(-pow((a-.74)*min(uResolution.x,uResolution.y)*.6,2.))* .11;
 col+=ring*vec3(.4,.59,.54);
 float grain=(hash21(gl_FragCoord.xy+floor(uTime*12.))-.5)*.025;
 col=pow(max(col+grain,0.),vec3(.93));
 fragColor=vec4(col,1.);
}`;
const compile = (gl,type,src)=>{const shader=gl.createShader(type);gl.shaderSource(shader,src);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const log=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(`Shader compile failed: ${log}`)}return shader};
export function mountArtifact(canvas,label){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer=matchMedia('(pointer:fine)');
  const saveData=navigator.connection?.saveData===true;
  let gl=null,program=null,buffer=null,raf=0,visible=false,disposed=false,frameCount=0,slow=0,start=0,last=0,scale=.78,active=false,disabled=false;
  let uResolution,uTime,uPointer;
  const pointer={x:0,y:0};
  const status=s=>{if(label)label.textContent=`RENDERER: ${s}`};
  const stop=()=>{if(raf)cancelAnimationFrame(raf);raf=0;active=false};
  function cleanupGL(){stop();if(gl){if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program)}buffer=null;program=null;gl=null;canvas.classList.remove('is-ready')}
  function create(){
    if(disposed||disabled||reduced.matches||saveData){status(reduced.matches?'REDUCED MOTION':'DATA SAVER');return}
    try{
      gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power',preserveDrawingBuffer:false});
      if(!gl){status('CSS FALLBACK');return}
      const vs=compile(gl,gl.VERTEX_SHADER,VERT),fs=compile(gl,gl.FRAGMENT_SHADER,FRAG);
      program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'Shader link failed');
      buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const location=gl.getAttribLocation(program,'position');gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(location);
      uResolution=gl.getUniformLocation(program,'uResolution');uTime=gl.getUniformLocation(program,'uTime');uPointer=gl.getUniformLocation(program,'uPointer');
      canvas.classList.add('is-ready');status('WEBGL2 / ADAPTIVE');
      if(visible)startLoop();
    }catch(e){console.warn('Decorative GPU scene unavailable:',e);cleanupGL();status('CSS FALLBACK')}
  }
  const resize=()=>{
    if(!gl)return;
    const bounds=canvas.getBoundingClientRect();if(!bounds.width||!bounds.height)return;
    const ratio=Math.min(window.devicePixelRatio||1,1.4)*scale;
    const w=Math.max(1,Math.min(1250,Math.round(bounds.width*ratio))),h=Math.max(1,Math.min(900,Math.round(bounds.height*ratio)));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
  };
  function tick(now){raf=0;if(!active||!gl||!visible||document.hidden)return;resize();gl.useProgram(program);gl.uniform2f(uResolution,canvas.width,canvas.height);gl.uniform1f(uTime,(now-start)*.001);gl.uniform2f(uPointer,pointer.x,pointer.y);gl.drawArrays(gl.TRIANGLES,0,6);
    if(last&&frameCount>30){const dt=now-last;if(dt>40)slow++;else slow=Math.max(0,slow-1);if(slow>14&&scale>.52){scale=.52;status('WEBGL2 / ECO');slow=0} else if(slow>27){disabled=true;cleanupGL();status('CSS / PERFORMANCE FALLBACK');return}}frameCount++;last=now;
    raf=requestAnimationFrame(tick)}
  function startLoop(){if(active||!gl||disposed||disabled||!visible||document.hidden)return;active=true;last=0;frameCount=0;start=performance.now();raf=requestAnimationFrame(tick)}
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)startLoop();else stop()},{threshold:.05});observer.observe(canvas);
  const resizer=new ResizeObserver(()=>resize());resizer.observe(canvas);
  const move=e=>{if(!finePointer.matches)return;const r=canvas.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width-.5)*2;pointer.y=((e.clientY-r.top)/r.height-.5)*2};
  const hidden=()=>{if(document.hidden)stop();else startLoop()};
  const lost=e=>{e.preventDefault();stop();canvas.classList.remove('is-ready');status('CONTEXT LOST / CSS')};
  const restored=()=>{if(disposed||disabled)return;cleanupGL();create()};
  const change=()=>{if(reduced.matches){cleanupGL();status('REDUCED MOTION')}else if(!gl)create()};
  window.addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',hidden);
  canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);
  reduced.addEventListener?.('change',change);
  create();
  return()=>{disposed=true;cleanupGL();observer.disconnect();resizer.disconnect();window.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',hidden);canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);reduced.removeEventListener?.('change',change)};
}