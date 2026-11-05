// G1-01: One source-owned, progressively enhanced Three.js observatory.
// No CDN, copied third-party models, fullscreen hijack, or fabricated benchmarks.
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

const MIN_FRAME=1000/30;
const golden=0xa98148,edgeGold=0xcdaa74,darkBrass=0x765331,blue=0x83bcd3;
const mobile=()=>matchMedia('(max-width: 700px)').matches;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const median=(min,n,max)=>Math.max(min,Math.min(n,max));
const now=()=>performance.now();
const makeMat=(color,metalness=.68,roughness=.3)=>new THREE.MeshPhysicalMaterial({
  color,metalness,roughness,clearcoat:.25,clearcoatRoughness:.22
});

function buildCelestialEngine(scene){
  const geometry=[],material=[],animate=[];
  const addGeo=g=>(geometry.push(g),g);
  const addMat=m=>(material.push(m),m);
  const brass=addMat(makeMat(golden,.79,.34));
  const polished=addMat(makeMat(edgeGold,.76,.30));
  const warm=addMat(makeMat(0x946d41,.74,.4));
  const shadow=addMat(makeMat(0x223747,.45,.5));
  const ink=addMat(makeMat(0x0d1e2a,.35,.62));
  const cyan=addMat(new THREE.MeshStandardMaterial({color:0x7baec4,metalness:.42,roughness:.32,emissive:0x123e53,emissiveIntensity:.26}));
  const luminous=addMat(new THREE.MeshBasicMaterial({color:0xe8b467}));
  const glass=addMat(new THREE.MeshPhysicalMaterial({
    color:0xffd69e,metalness:.1,roughness:.16,transparent:true,opacity:.66,
    transmission:.25,thickness:.85,depthWrite:false
  }));
  const hum=addMat(new THREE.MeshBasicMaterial({color:0xf2b55c,transparent:true,opacity:.12,depthWrite:false,blending:THREE.AdditiveBlending}));
  const core=new THREE.Group();
  core.position.set(0,.55,0);
  scene.add(core);
  const sphere=(r,geoMat,parent=core,w=32,h=22)=>{
    const m=new THREE.Mesh(addGeo(new THREE.SphereGeometry(r,w,h)),geoMat);
    parent.add(m);return m;
  };
  const torus=(r,t,mat,parent=core,rot=[0,0,0],segments=150)=>{
    const mesh=new THREE.Mesh(addGeo(new THREE.TorusGeometry(r,t,10,segments)),mat);
    mesh.rotation.set(...rot);parent.add(mesh);return mesh;
  };
  const cylinder=(top,bottom,height,mat,parent=core,segments=48)=>{
    const mesh=new THREE.Mesh(addGeo(new THREE.CylinderGeometry(top,bottom,height,segments)),mat);
    parent.add(mesh);return mesh;
  };
  const bar=(a,b,r,mat,parent=core)=>{
    const p1=new THREE.Vector3(...a),p2=new THREE.Vector3(...b);
    const m=new THREE.Mesh(addGeo(new THREE.CylinderGeometry(r,r,p1.distanceTo(p2),10)),mat);
    m.position.copy(p1).add(p2).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),p2.sub(p1).normalize());
    parent.add(m);return m;
  };

  // Suspended 3-axis astronomical armillary, not a 2-ring placeholder.
  const armature=new THREE.Group();core.add(armature);
  const ringDefs=[
    {radius:3.28,tube:.13,angle:[.29,.22,.12],speed:.072},
    {radius:3.13,tube:.018,angle:[.29,.22,.12],speed:.072},
    {radius:2.86,tube:.116,angle:[1.2,.16,.35],speed:-.085},
    {radius:2.69,tube:.016,angle:[1.2,.16,.35],speed:-.085},
    {radius:2.48,tube:.103,angle:[.8,1.2,.35],speed:.112},
    {radius:2.29,tube:.022,angle:[.8,1.2,.35],speed:.112},
    {radius:2.06,tube:.087,angle:[.11,.18,-.7],speed:-.14},
    {radius:1.88,tube:.017,angle:[.11,.18,-.7],speed:-.14}
  ];
  ringDefs.forEach((def,i)=>{
    const axis=new THREE.Group();
    axis.rotation.set(...def.angle);armature.add(axis);
    const group=new THREE.Group();axis.add(group);
    torus(def.radius,def.tube,i%2===0?brass:polished,group);
    if(i%2===0){
      // Ticks and engraved degree marks: one instanced draw per axis.
      const count=i===0?144:i===2?108:90;
      const ticks=new THREE.InstancedMesh(
        addGeo(new THREE.BoxGeometry(.12,i===0?.046:.04,.018)),polished,count
      );
      const temp=new THREE.Object3D();
      for(let k=0;k<count;k++){
        const angle=2*Math.PI*k/count;
        const outer=def.radius+(k%9===0?.09:.035);
        temp.position.set(Math.cos(angle)*outer,Math.sin(angle)*outer,0);
        temp.rotation.set(0,0,angle);
        temp.scale.set(k%9===0?2:1,1,1);temp.updateMatrix();
        ticks.setMatrixAt(k,temp.matrix);
      }
      ticks.instanceMatrix.needsUpdate=true;
      group.add(ticks);
    }
    if(i%2===0){
      // Split housing and cap fillets stop the torus looking like a bare line.
      torus(def.radius+.027,.012,shadow,group);
      torus(def.radius-.06,.012,warm,group);
    }
    animate.push({group,speed:def.speed,offset:i*.16});
  });

  // Fine machined bronze circumferential graduations.
  for(const r of [1.56,1.38]){
    torus(r,.045,brass,armature,[Math.PI*.44,0,0]);
    torus(r,.015,polished,armature,[Math.PI*.44,0,0]);
  }
  const spokeOuter=2.01,spokeInner=.54;
  for(let k=0;k<24;k++){
    const theta=k*2*Math.PI/24;
    bar([Math.cos(theta)*spokeInner,Math.sin(theta)*spokeInner,-.10],
      [Math.cos(theta)*spokeOuter,Math.sin(theta)*spokeOuter,-.10],
      k%6===0?.033:.016,k%3===0?polished:warm,armature);
    if(k%3===0) sphere(.048,polished,armature,8,6).position.set(Math.cos(theta)*2.04,Math.sin(theta)*2.04,-.10);
  }

  // Gear teeth, gimbals and an articulated central lens.
  const gear=new THREE.Group();
  armature.add(gear);
  torus(.92,.125,brass,gear,[Math.PI/2,0,0]);
  torus(.74,.027,shadow,gear,[Math.PI/2,0,0]);
  const teeth=new THREE.InstancedMesh(addGeo(new THREE.BoxGeometry(.20,.13,.19)),polished,48);
  const dummy=new THREE.Object3D();
  for(let k=0;k<48;k++){
    const a=k*Math.PI*2/48;
    dummy.position.set(.97*Math.cos(a),0,.97*Math.sin(a));
    dummy.rotation.set(0,-a,0);dummy.updateMatrix();teeth.setMatrixAt(k,dummy.matrix);
  }
  teeth.instanceMatrix.needsUpdate=true;gear.add(teeth);
  animate.push({group:gear,speed:.18,offset:0});

  const iris=sphere(.66,shadow,armature,32,22);
  const crystal=new THREE.Mesh(addGeo(new THREE.IcosahedronGeometry(.49,2)),glass);
  armature.add(crystal);animate.push({group:crystal,speed:-.11,offset:0});
  const flame=sphere(.33,luminous,armature,26,18);
  const halo=sphere(.65,hum,armature,24,18);
  flame.position.z=.015;halo.position.z=-.12;
  torus(.64,.04,polished,armature,[.28,.3,.15]);
  for(let k=0;k<12;k++){
    const a=2*Math.PI*k/12;
    const plate=new THREE.Mesh(addGeo(new THREE.BoxGeometry(.25,.08,.31)),k%2?brass:warm);
    plate.position.set(Math.cos(a)*.78,Math.sin(a)*.78,.17);
    plate.rotation.z=a;armature.add(plate);
  }

  // Base with physically modeled mouldings and tiers.
  const base=new THREE.Group();base.position.y=-3.20;scene.add(base);
  const baseLayer=(top,bottom,height,y,mat)=>{
    const m=cylinder(top,bottom,height,mat,base,48);m.position.y=y;return m;
  };
  baseLayer(1.54,1.72,.22,.03,shadow);
  baseLayer(1.47,1.54,.09,.20,polished);
  baseLayer(1.28,1.45,.26,.39,warm);
  baseLayer(1.13,1.29,.10,.57,polished);
  baseLayer(.78,.92,.83,1.07,ink);
  baseLayer(.98,.83,.14,1.52,brass);
  baseLayer(.78,.84,.10,1.67,polished);
  for(let k=0;k<24;k++){
    const t=k*Math.PI*2/24;
    const m=new THREE.Mesh(addGeo(new THREE.BoxGeometry(.15,.42,.14)),k%3===0?polished:brass);
    m.position.set(Math.cos(t)*1.24,.34,Math.sin(t)*1.24);
    m.rotation.y=-t;base.add(m);
  }
  for(let k=0;k<8;k++){
    const t=k*Math.PI/4;
    const m=new THREE.Mesh(addGeo(new THREE.SphereGeometry(.075,12,8)),polished);
    m.position.set(Math.cos(t)*1.02,1.82,Math.sin(t)*1.02);
    base.add(m);
  }

  // Coherent observatory architecture gives the object spatial scale.
  const architecture=new THREE.Group();scene.add(architecture);
  const architectureMetal=shadow;
  for(const [x,z] of [[-5,-2.5],[5,-2.5],[-5,1.7],[5,1.7]]){
    const col=cylinder(.12,.15,7.3,architectureMetal,architecture,18);
    col.position.set(x,-.12,z);
    for(const y of [-3.8,-3.55,3.15,3.58]){
      const cap=cylinder(.21,.21,.13,warm,architecture,18);
      cap.position.set(x,y,z);
    }
    const trim=cylinder(.135,.135,6.95,shadow,architecture,18);
    trim.position.set(x,-.12,z);
  }
  // Rim of dome, distant structural ribs, no costly real-time shadows.
  for(const radius of [4.5,5.1]){
    const dome=torus(radius,.055,radius>5?cyan:brass,architecture,[Math.PI/2,0,.05],128);
    dome.position.set(0,3.4,-3.45);
  }
  for(let k=0;k<14;k++){
    const angle=k*Math.PI/13;
    const r=5.25;
    const p1=[Math.cos(angle)*r,-3.45,-3.42];
    const p2=[Math.cos(angle)*r,3.35,-3.42];
    bar(p1,p2,.022,warm,architecture);
  }
  // Low-cost star field at true scene depth.
  const points=[];
  let seed=20261105;
  const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
  for(let i=0;i<195;i++){
    points.push((rand()-.5)*18,(rand()-.5)*12,(rand()-.5)*8-3.2);
  }
  const pointGeometry=addGeo(new THREE.BufferGeometry());
  pointGeometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
  architecture.add(new THREE.Points(pointGeometry,addMat(new THREE.PointsMaterial({color:0xa2c7d8,size:.031,transparent:true,opacity:.57,sizeAttenuation:true}))));
  const ambient=new THREE.AmbientLight(0x8ca6bc,.38);scene.add(ambient);
  const sun=new THREE.DirectionalLight(0xffc78b,1.52);sun.position.set(-3.5,6,7);scene.add(sun);
  const edge=new THREE.DirectionalLight(0x7fbdd6,.82);edge.position.set(5,1,-4);scene.add(edge);
  const hearth=new THREE.PointLight(0xffa957,13,8,2);hearth.position.set(0,.65,2.0);scene.add(hearth);
  const floorGlow=new THREE.PointLight(0x6f9fb8,8,10,2);floorGlow.position.set(-4,-3,0);scene.add(floorGlow);

  return {
    animate(t){
      const smooth=Math.sin(t*.00035)*.085;
      armature.rotation.set(.14+smooth,.04+.12*Math.sin(t*.00019),.05);
      for(const entry of animate)entry.group.rotation.z=entry.offset+t*.001*entry.speed;
      gear.rotation.y=t*.00012;
      flame.scale.setScalar(1+.055*Math.sin(t*.002));
      halo.scale.setScalar(1+.065*Math.sin(t*.0017));
    },
    dispose(){
      geometry.forEach(g=>g.dispose());
      material.forEach(m=>m.dispose());
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
  let renderer=null,scene=null,camera=null,engine=null,environment=null;
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
  const init=()=>{
    if(renderer||failed)return;
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
      engine=buildCelestialEngine(scene);
      canvas.setAttribute('aria-hidden','true');
      canvas.addEventListener('webglcontextlost',e=>{
        e.preventDefault();stop();stage.dataset.renderer='poster';
        status.textContent='圖形上下文已中斷，正在使用靜態美術；研究功能不受影響。';
      });
      canvas.addEventListener('webglcontextrestored',()=>{
        try{
          release();failed=false;init();
        }catch(error){fail(error.message);}
      });
      mount.replaceChildren(canvas);
      resize();
      startTime=now();
      engine.animate(0);
      renderer.render(scene,camera); // Show 3D only after the first real frame.
      stage.dataset.renderer='three';
      controls.hidden=false;
      motion.textContent=paused?'播放機械運轉':'暫停機械運轉';
      motion.setAttribute('aria-pressed',String(paused));
      status.textContent='Three.js 即時場景已載入：金屬環、刻度、傳動結構與光源。這不是正式真機效能結論。';
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
