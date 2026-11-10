// Observatory scene: a procedural singularity drawn by one WebGL2 fragment shader.
// No 3D model, no texture, no third-party runtime. The shader module is imported only
// once the scene scrolls into view, so the first screen stays light.
//
// Reliability kept from the earlier version: forced poster (?poster=1), no-JS and
// no-WebGL2 poster fallback, pause while the tab is hidden, WebGL context loss and
// restore, reduced motion. New: scroll drives a 0..1 narrative phase, three colour
// themes, and automatic quality steps when a device cannot hold the frame rate.

const clamp=(min,n,max)=>Math.max(min,Math.min(n,max));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const isMobile=()=>matchMedia('(max-width: 700px)').matches;

const TIER_ORDER=['high','medium','low'];
const TIER_FPS={high:60,medium:45,low:24};
const STATIC_PHASE=.86;                  // composition used when motion is off
const REPLAY_MS=3400;

export function bootObservatory(){
  const stage=document.getElementById('obs-scene');
  const mount=document.getElementById('obs-fx-root');
  const status=document.getElementById('obs-status');
  const controls=document.getElementById('obs-controls');
  const motion=document.getElementById('obs-motion');
  const quality=document.getElementById('obs-quality');
  const reset=document.getElementById('obs-reset');
  const themeButtons=[...document.querySelectorAll('#obs-themes [data-theme]')];
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

  const params=new URLSearchParams(location.search);
  // Explicit failure injection with a useful poster and working research links.
  if(params.get('poster')==='1'){
    stage.dataset.renderer='poster';
    status.textContent='退化模式：已強制使用原創美術背景；研究與搜尋仍可閱讀。';
    return;
  }
  const fixedPhase=params.has('phase')?clamp(0,parseFloat(params.get('phase'))||0,1):null;
  const forcedTier=['low','medium','high'].includes(params.get('q'))?params.get('q'):null;
  const startTheme=['aurum','ember','nebula'].includes(params.get('theme'))?params.get('theme'):'aurum';

  let fx=null,canvas=null;
  let frame=0,active=false,started=false,failed=false,contextLost=false,generation=0;
  let paused=reduced.matches,eco=false;
  let tier=forcedTier||(isMobile()?'medium':'high');
  let time=0,lastNow=0,phase=0,frames=0,replayStart=null;
  let pointerX=0,pointerY=0,targetX=0,targetY=0;
  let slowFrames=0,slowSum=0,lastDrawnPhase=-1,lastDrawnX=0,lastDrawnY=0;
  let currentTheme=startTheme;

  const visible=()=>active&&!document.hidden&&!contextLost;
  const stop=()=>{if(frame)cancelAnimationFrame(frame);frame=0;lastNow=0;};

  const scrollPhase=()=>{
    const rect=stage.getBoundingClientRect();
    const vh=innerHeight||1;
    return clamp(0,(vh*.92-rect.top)/(vh*.80),1);
  };
  const targetPhase=now=>{
    if(replayStart!==null){
      const k=clamp(0,(now-replayStart)/REPLAY_MS,1);
      if(k>=1)replayStart=null;
      return 1-Math.pow(1-k,3);
    }
    if(fixedPhase!==null)return fixedPhase;
    if(reduced.matches)return STATIC_PHASE;
    return scrollPhase();
  };

  const resize=()=>{
    if(!fx)return;
    const rect=stage.getBoundingClientRect();
    fx.resize(Math.max(1,rect.width),Math.max(1,rect.height),devicePixelRatio||1);
  };
  const paint=()=>{
    if(!fx)return;
    fx.draw({time,phase,pointerX,pointerY});
    frames++;
    stage.dataset.frames=String(frames);
    stage.dataset.phase=phase.toFixed(2);
    lastDrawnPhase=phase;lastDrawnX=pointerX;lastDrawnY=pointerY;
  };
  const applyTier=name=>{
    tier=name;
    fx?.setTier(name);
    stage.dataset.quality=name;
    slowFrames=0;slowSum=0;
    resize();
  };
  // Step down when the device cannot hold the frame rate; never step back up (no flapping).
  const adapt=dt=>{
    if(paused||tier==='low'||forcedTier)return;
    slowFrames++;slowSum+=dt;
    const catastrophic=slowFrames>=6&&slowSum/slowFrames>140;
    const sustained=slowFrames>=40&&slowSum/slowFrames>31;
    if(catastrophic||sustained){
      applyTier(TIER_ORDER[TIER_ORDER.indexOf(tier)+1]);
      status.textContent='裝置運算力有限，已自動降低畫質以維持流暢；研究內容不受影響。';
    }else if(slowFrames>=40){slowFrames=0;slowSum=0;}
  };

  const loop=now=>{
    frame=0;
    if(!visible()||!fx)return;
    const gap=1000/(eco?TIER_FPS.low:TIER_FPS[tier]);
    if(lastNow&&now-lastNow<gap-1.5){frame=requestAnimationFrame(loop);return;}
    const dt=lastNow?Math.min(now-lastNow,120):16;
    lastNow=now;
    if(!paused)time+=dt/1000;
    phase+=(targetPhase(now)-phase)*(1-Math.exp(-dt/240));
    pointerX+=(targetX-pointerX)*(1-Math.exp(-dt/180));
    pointerY+=(targetY-pointerY)*(1-Math.exp(-dt/180));
    // While paused, only repaint when scroll or pointer actually moved the picture.
    const moved=Math.abs(phase-lastDrawnPhase)>.002||Math.abs(pointerX-lastDrawnX)>.002||Math.abs(pointerY-lastDrawnY)>.002;
    if(!paused||moved)paint();
    adapt(dt);
    frame=requestAnimationFrame(loop);
  };
  const schedule=()=>{stop();if(fx&&visible())frame=requestAnimationFrame(loop);};

  const release=()=>{
    generation++;
    stop();
    try{fx?.dispose();}catch{}
    fx=null;
    if(canvas){canvas.remove();canvas=null;}
    mount.replaceChildren();
    stage.dataset.renderer='poster';
    if(controls)controls.hidden=true;
  };
  const fail=reason=>{
    failed=true;release();
    status.textContent='裝置未能執行即時繪製，已回到靜態觀測所美術；所有研究入口仍可使用。';
    console.warn('[observatory] optional renderer unavailable:',reason);
  };

  const init=async()=>{
    if(fx||failed)return;
    const current=++generation;
    try{
      canvas=document.createElement('canvas');
      canvas.setAttribute('aria-hidden','true');
      canvas.addEventListener('webglcontextlost',event=>{
        event.preventDefault();contextLost=true;generation++;stop();
        stage.dataset.renderer='poster';
        if(controls)controls.hidden=true;
        status.textContent='圖形上下文已中斷，正在使用靜態美術；研究功能不受影響。';
      });
      canvas.addEventListener('webglcontextrestored',()=>{
        try{release();contextLost=false;failed=false;init();}catch(error){fail(error.message);}
      });
      const probe=document.createElement('canvas');
      if(!probe.getContext('webgl2'))throw new Error('WebGL2 is not available');
      status.textContent='正在載入奇點著色器；研究館和靜態美術不受影響。';
      const module=await import('./singularity.js');
      if(current!==generation)return; // The reader left while the module loaded.
      fx=module.createSingularity(canvas,{theme:currentTheme,tier:eco?'low':tier});
      mount.replaceChildren(canvas);
      resize();
      phase=0;time=0;                    // the rift opens from nothing on first view
      paint();
      stage.dataset.renderer='shader';
      stage.dataset.theme=currentTheme;
      stage.dataset.quality=eco?'low':tier;
      if(controls)controls.hidden=false;
      motion.textContent=paused?'播放動態':'暫停動態';
      motion.setAttribute('aria-pressed',String(paused));
      status.textContent='即時繪製中：由單一著色器畫出的奇點，沒有 3D 模型與外部素材。畫質會依裝置自動調整；真機效能尚未量測。';
      schedule();
    }catch(error){fail(error?.message||'Renderer initialization failed');}
  };

  const observer=new IntersectionObserver(entries=>{
    active=entries.some(entry=>entry.isIntersecting);
    if(active&&!started){started=true;init();}
    schedule();
  },{rootMargin:'120px 0px 120px 0px',threshold:0});
  observer.observe(stage);

  motion?.addEventListener('click',()=>{
    paused=!paused;
    motion.textContent=paused?'播放動態':'暫停動態';
    motion.setAttribute('aria-pressed',String(paused));
    schedule();
  });
  quality?.addEventListener('click',()=>{
    eco=!eco;
    quality.textContent='節能畫質：'+(eco?'開':'關');
    quality.setAttribute('aria-pressed',String(eco));
    applyTier(eco?'low':(forcedTier||(isMobile()?'medium':'high')));
    if(paused)paint();
  });
  reset?.addEventListener('click',()=>{
    replayStart=performance.now();time=0;phase=0;
    targetX=targetY=pointerX=pointerY=0;
    paused=false;
    motion.textContent='暫停動態';motion.setAttribute('aria-pressed','false');
    schedule();
  });
  themeButtons.forEach(button=>button.addEventListener('click',()=>{
    const name=button.dataset.theme;
    currentTheme=name;
    fx?.setTheme(name);
    stage.dataset.theme=name;
    themeButtons.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
    if(paused)paint();
  }));
  themeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.theme===currentTheme)));

  mount.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||reduced.matches)return;
    const rect=stage.getBoundingClientRect();
    targetX=clamp(-1,(event.clientX-rect.left)/rect.width*2-1,1);
    targetY=clamp(-1,-((event.clientY-rect.top)/rect.height*2-1),1);
  },{passive:true});
  mount.addEventListener('pointerleave',()=>{targetX=0;targetY=0;});

  new ResizeObserver(()=>{resize();if(paused)paint();}).observe(stage);
  // visibilitychange is dispatched on document, not the window.
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener?.('change',()=>{
    if(reduced.matches){
      paused=true;
      motion.textContent='播放動態';motion.setAttribute('aria-pressed','true');
    }
    schedule();
  });
  addEventListener('pagehide',()=>{observer.disconnect();release();},{once:true});
}
