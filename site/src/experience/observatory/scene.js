// G1-01: One source-owned, progressively enhanced Three.js observatory.
// No CDN, copied third-party models, fullscreen hijack, or fabricated benchmarks.
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const MIN_FRAME=1000/30;
const golden=0xa98148,edgeGold=0xcdaa74,darkBrass=0x765331,blue=0x83bcd3;
const mobile=()=>matchMedia('(max-width: 700px)').matches;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const median=(min,n,max)=>Math.max(min,Math.min(n,max));
const now=()=>performance.now();
const makeMat=(color,metalness=.68,roughness=.3)=>new THREE.MeshPhysicalMaterial({
  color,metalness,roughness,clearcoat:.25,clearcoatRoughness:.22
});

// Model primitives and inscriptions now come from the deterministic GLB
// generator, not hundreds of independent runtime geometry constructors.
const MODEL_URL='/Research-/v3/observatory/observatory-v1.glb';
async function loadCelestialEngine(scene){
  const loader=new GLTFLoader();
  const result=await loader.loadAsync(MODEL_URL);
  const asset=result.scene;
  asset.name='OriginalObservatoryAsset';
  const names=['Orbit_Outer','Orbit_Meridian','Orbit_Inner','Orbit_Ecliptic','Mechanism'];
  const rotors=names.map((name,index)=>{
    const group=asset.getObjectByName(name);
    if(!group)throw new Error('GLB node missing: '+name);
    return {group,initial:group.quaternion.clone(),speed:[.082,-.096,.117,-.13,.066][index]};
  });
  scene.add(asset);
  // Fewer lights than G1-01; the brass must read as dark aged metal, not white.
  scene.add(new THREE.AmbientLight(0x95aabd,.43));
  const key=new THREE.DirectionalLight(0xffc18b,1.95);
  key.position.set(-4.5,7,6);scene.add(key);
  const ice=new THREE.DirectionalLight(0x88cce6,1.12);
  ice.position.set(5,3,-5);scene.add(ice);
  const warm=new THREE.PointLight(0xffaa53,12,10,2);
  warm.position.set(0,.5,2);scene.add(warm);
  // The local starfield is inexpensive and never used as an external HDR.
  let seed=20261105;
  const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
  const stars=[];
  for(let i=0;i<120;i++)stars.push((random()-.5)*18,(random()-.5)*13,(random()-.5)*8-5.5);
  const starGeometry=new THREE.BufferGeometry();
  starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(stars,3));
  const starMaterial=new THREE.PointsMaterial({color:0x7eafc4,size:.025,transparent:true,opacity:.43,sizeAttenuation:true});
  const starPoints=new THREE.Points(starGeometry,starMaterial);
  scene.add(starPoints);
  const twist=new THREE.Quaternion(),axis=new THREE.Vector3(0,0,1);
  return {
    animate(t){
      for(const {group,initial,speed} of rotors){
        twist.setFromAxisAngle(axis,t*.00013*speed);
        group.quaternion.copy(initial).multiply(twist);
      }
      asset.rotation.y=Math.sin(t*.00013)*.07;
    },
    dispose(){
      const geometries=new Set(),materials=new Set();
      asset.traverse(object=>{
        if(object.isMesh){
          if(object.geometry)geometries.add(object.geometry);
          const list=Array.isArray(object.material)?object.material:[object.material];
          list.filter(Boolean).forEach(mat=>materials.add(mat));
        }
      });
      geometries.forEach(item=>item.dispose());
      materials.forEach(item=>item.dispose());
      starGeometry.dispose();starMaterial.dispose();
      scene.remove(asset,starPoints,key,ice,warm);
    }
  };
}

export function bootObservatory(){
  const stage=document.getElementById('obs-scene');
  const mount=document.getElementById('obs-three-root');
  const status=document.getElementById('obs-status');
  const controls=document.getElementById('obs-controls');
  const motion=document.getElementById('obs-motion');
  const quality=document.getElementById('obs-quality');
  const reset=document.getElementById('obs-reset');
  const menu=document.getElementById('obs-menu');
  const mobileNav=document.getElementById('obs-mobile-nav');
  if(!stage||!mount||!status)return;

  menu?.addEventListener('click',()=>{
    const open=menu.getAttribute('aria-expanded')!=='true';
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'收合網站選單':'展開網站選單');
    mobileNav.hidden=!open;
  });
  mobileNav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    mobileNav.hidden=true;menu?.setAttribute('aria-expanded','false');
    menu?.setAttribute('aria-label','展開網站選單');
  }));

  // Explicit failure injection, with a useful source-backed poster and links.
  const forcedPoster=new URLSearchParams(location.search).get('poster')==='1';
  if(forcedPoster){
    stage.dataset.renderer='poster';
    status.textContent='退化模式：已強制使用原創美術背景；研究與搜尋仍可閱讀。';
    return;
  }
  let renderer=null,scene=null,camera=null,engine=null,environment=null,generation=0;
  let frame=0,active=false,started=false,failed=false,lastTime=0,startTime=0;
  let paused=reduced.matches,eco=false,pointerOffset=0,targetOffset=0;
  const resize=()=>{
    if(!renderer||!camera)return;
    const rect=stage.getBoundingClientRect();
    const width=Math.max(1,rect.width),height=Math.max(1,rect.height);
    camera.aspect=width/height;camera.updateProjectionMatrix();
    renderer.setPixelRatio(eco?1:Math.min(devicePixelRatio||1,mobile()?1.25:1.65));
    renderer.setSize(width,height,false);
  };
  const stop=()=>{if(frame)cancelAnimationFrame(frame);frame=0;lastTime=0;};
  const visible=()=>active&&!document.hidden;
  const paint=time=>{
    if(!renderer||!scene||!camera||!engine)return;
    const t=paused?0:Math.max(0,time-startTime);
    engine.animate(t);
    camera.position.set(pointerOffset*.25,1.25+Math.sin(t*.00021)*.13,
      14.45-1.9*median(0,t/3200,1));
    camera.lookAt(pointerOffset*.18,.36,0);
    renderer.render(scene,camera);
  };
  const loop=time=>{
    frame=0;
    if(!visible()||!renderer)return;
    if(!paused){
      const target=mobile()?MIN_FRAME:1000/50;
      if(!lastTime||time-lastTime>=target){
        lastTime=time;
        pointerOffset+=(targetOffset-pointerOffset)*.09;
        paint(time);
      }
      frame=requestAnimationFrame(loop);
    }else paint(0);
  };
  const schedule=()=>{stop();if(renderer&&visible())frame=requestAnimationFrame(loop);};
  const release=()=>{
    generation++;
    stop();
    if(engine)engine.dispose();
    engine=null;
    if(environment){environment.dispose();environment=null;}
    if(scene){scene.environment=null;scene.clear();scene=null;}
    if(renderer){renderer.dispose();renderer.domElement.remove();renderer=null;}
    camera=null;mount.replaceChildren();
    stage.dataset.renderer='poster';controls.hidden=true;
  };
  const fail=reason=>{
    failed=true;release();
    status.textContent='裝置未能持續執行即時 3D，已回到靜態觀測所美術；所有研究入口仍可使用。';
    console.warn('[G1-01] Optional renderer unavailable:',reason);
  };
  const init=async()=>{
    if(renderer||failed)return;
    const currentGeneration=++generation;
    let canvas=null;
    try{
      canvas=document.createElement('canvas');
      const context=canvas.getContext('webgl2',{
        alpha:true,antialias:false,depth:true,stencil:false,powerPreference:'low-power'
      });
      if(!context)throw new Error('WebGL2 is not available');
      renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:false,powerPreference:'low-power'});
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure=.9;
      scene=new THREE.Scene();
      scene.background=null;
      camera=new THREE.PerspectiveCamera(43,1,.1,65);
      camera.position.set(0,1.25,14.45);
      // Local generated environment, not a remote HDR or 3D model.
      const pmrem=new THREE.PMREMGenerator(renderer);
      const room=new RoomEnvironment();
      environment=pmrem.fromScene(room,.07).texture;
      room.dispose();pmrem.dispose();
      scene.environment=environment;
      canvas.setAttribute('aria-hidden','true');
      canvas.addEventListener('webglcontextlost',e=>{
        e.preventDefault();generation++;stop();stage.dataset.renderer='poster';
        status.textContent='圖形上下文已中斷，正在使用靜態美術；研究功能不受影響。';
      });
      canvas.addEventListener('webglcontextrestored',()=>{
        try{
          release();failed=false;init();
        }catch(error){fail(error.message);}
      });
      mount.replaceChildren(canvas);
      resize();
      status.textContent='正在載入原創天文儀 GLB；研究館和靜態美術不受影響。';
      const loadedEngine=await loadCelestialEngine(scene);
      if(generation!==currentGeneration||!renderer){
        loadedEngine.dispose();return;
      }
      engine=loadedEngine;
      startTime=now();
      engine.animate(0);
      renderer.render(scene,camera); // Show 3D only after the first real frame.
      stage.dataset.renderer='three';
      controls.hidden=false;
      motion.textContent=paused?'播放機械運轉':'暫停機械運轉';
      motion.setAttribute('aria-pressed',String(paused));
      status.textContent='Three.js 已載入原創 glTF 天文儀：深色金屬環、立體刻度、機械底座與建築。效能與美術仍待實機驗收。';
      schedule();
    }catch(error){fail(error?.message||'Renderer initialization failed');}
  };
  const observer=new IntersectionObserver(entries=>{
    active=entries.some(e=>e.isIntersecting);
    if(active&&!started){started=true;init();}
    schedule();
  },{rootMargin:'80px 0px 80px 0px',threshold:0});
  observer.observe(stage);

  motion.addEventListener('click',()=>{
    paused=!paused;motion.textContent=paused?'播放機械運轉':'暫停機械運轉';
    motion.setAttribute('aria-pressed',String(paused));
    if(!paused)startTime=now();
    schedule();
  });
  quality.addEventListener('click',()=>{
    eco=!eco;quality.textContent='節能畫質：'+(eco?'開':'關');
    quality.setAttribute('aria-pressed',String(eco));
    resize();if(paused)paint(0);
  });
  reset.addEventListener('click',()=>{startTime=now();targetOffset=0;pointerOffset=0;if(paused)paint(0);else schedule();});
  mount.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||reduced.matches)return;
    const rect=stage.getBoundingClientRect();
    targetOffset=median(-1,(event.clientX-rect.left)/rect.width*2-1,1);
  },{passive:true});
  mount.addEventListener('pointerleave',()=>{targetOffset=0;});
  const ro=new ResizeObserver(()=>resize());
  ro.observe(stage);
  addEventListener('visibilitychange',schedule);
  reduced.addEventListener?.('change',()=>{
    if(reduced.matches){paused=true;motion.textContent='播放機械運轉';motion.setAttribute('aria-pressed','true');schedule();}
  });
  addEventListener('pagehide',()=>{observer.disconnect();ro.disconnect();release();},{once:true});
}
