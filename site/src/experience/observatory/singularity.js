// WebGL2 renderer for the singularity shader. No dependencies, no assets, no network.
// The page never imports this until the scene scrolls into view.
import {VERTEX_SOURCE,FRAGMENT_SOURCE,THEMES,QUALITY_TIERS} from './singularity-shader.js';

const UNIFORMS=['uRes','uTime','uPointer','uPhase','uTheme','uOctaves','uDebris','uCracks','uFloor'];

function compile(gl,type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
    const log=gl.getShaderInfoLog(shader)||'unknown error';
    gl.deleteShader(shader);
    throw new Error('Shader compile failed: '+log.slice(0,240));
  }
  return shader;
}

export function createSingularity(canvas,{theme='aurum',tier='high'}={}){
  const gl=canvas.getContext('webgl2',{
    alpha:false,antialias:false,depth:false,stencil:false,
    powerPreference:'high-performance',preserveDrawingBuffer:false
  });
  if(!gl)throw new Error('WebGL2 is not available');
  const program=gl.createProgram();
  const vertex=compile(gl,gl.VERTEX_SHADER,VERTEX_SOURCE);
  const fragment=compile(gl,gl.FRAGMENT_SHADER,FRAGMENT_SOURCE);
  gl.attachShader(program,vertex);gl.attachShader(program,fragment);
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
    throw new Error('Program link failed: '+(gl.getProgramInfoLog(program)||'').slice(0,240));
  }
  gl.useProgram(program);
  const loc={};
  for(const name of UNIFORMS)loc[name]=gl.getUniformLocation(program,name);

  let themeName=THEMES[theme]?theme:'aurum';
  let tierName=QUALITY_TIERS[tier]?tier:'high';
  let width=0,height=0;

  // The drawing buffer is a fraction of the CSS size, capped by a pixel budget per tier,
  // so a retina phone does not shade six million pixels of fbm per frame.
  const MAX_PIXELS={low:420_000,medium:1_000_000,high:2_100_000};
  function resize(cssWidth,cssHeight,dpr=1){
    const t=QUALITY_TIERS[tierName];
    let scale=t.scale*Math.min(dpr,1.5);
    let w=Math.max(2,Math.round(cssWidth*scale)),h=Math.max(2,Math.round(cssHeight*scale));
    const budget=MAX_PIXELS[tierName];
    if(w*h>budget){const k=Math.sqrt(budget/(w*h));w=Math.max(2,Math.round(w*k));h=Math.max(2,Math.round(h*k));}
    if(w!==width||h!==height){
      width=w;height=h;canvas.width=w;canvas.height=h;
      gl.viewport(0,0,w,h);
    }
  }

  function draw({time=0,phase=1,pointerX=0,pointerY=0}={}){
    const t=QUALITY_TIERS[tierName];
    gl.uniform2f(loc.uRes,width,height);
    gl.uniform1f(loc.uTime,time);
    gl.uniform2f(loc.uPointer,pointerX,pointerY);
    gl.uniform1f(loc.uPhase,phase);
    gl.uniform1i(loc.uTheme,THEMES[themeName].id);
    gl.uniform1i(loc.uOctaves,t.octaves);
    gl.uniform1i(loc.uDebris,t.debrisLayers);
    gl.uniform1i(loc.uCracks,t.cracks);
    gl.uniform1i(loc.uFloor,THEMES[themeName].floor);
    gl.drawArrays(gl.TRIANGLES,0,3);
  }

  return {
    resize,draw,
    setTheme(name){if(THEMES[name])themeName=name;},
    setTier(name){if(QUALITY_TIERS[name])tierName=name;},
    get theme(){return themeName;},
    get tier(){return tierName;},
    get size(){return {width,height};},
    dispose(){
      gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);
    }
  };
}
