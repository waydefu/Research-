/*
 * Research— : one motion direction for the canonical landing, archive, topic,
 * search and reader. Real HALOFLUX source stays inside the visual iframe.
 * Native scroll, links, HTML semantics and content indexes never depend on JS.
 */
(()=>{
  const iframe=document.querySelector('.hfx-field iframe');
  if(!iframe)return;
  const html=document.documentElement,body=document.body;
  const layer=document.querySelector('.hfx-field');
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const isArticle=body.classList.contains('research-inner-article');
  let manuallyPaused=false,scrollPending=false,pointerPending=false;
  let lastChapter=null;
  let pointerX=0,pointerY=0;

  const progress=document.createElement('div');
  progress.className='hfx-progress';
  progress.setAttribute('aria-hidden','true');
  body.append(progress);

  const button=document.createElement('button');
  button.type='button';button.className='hfx-motion-control';
  button.setAttribute('aria-label','暫停動態光場與滾動視覺效果');
  button.textContent='暫停動效';
  button.setAttribute('aria-pressed','false');
  body.append(button);

  const shouldPause=()=>media.matches||manuallyPaused||document.hidden||
    (isArticle&&scrollY>innerHeight*1.3);

  function notifyStage(){
    if(!iframe.contentWindow)return;
    iframe.contentWindow.postMessage({
      type:'research-hfx-stage',paused:shouldPause()
    },location.origin);
  }
  function syncButton(){
    button.setAttribute('aria-pressed',String(manuallyPaused));
    button.textContent=manuallyPaused?'恢復動效':'暫停動效';
    button.setAttribute('aria-label',manuallyPaused?'恢復動態光場與滾動視覺效果':'暫停動態光場與滾動視覺效果');
    if(media.matches){
      button.disabled=true;button.hidden=true;
    }else{
      button.disabled=false;button.hidden=false;
    }
    body.classList.toggle('hfx-paused',shouldPause());
    notifyStage();
  }
  button.addEventListener('click',()=>{
    manuallyPaused=!manuallyPaused;
    syncButton();
  });
  const sendStage=(data)=>iframe.contentWindow?.postMessage(Object.assign({type:'research-hfx-stage'},data),location.origin);
  iframe.addEventListener('load',()=>{notifyStage();sendStage({action:'chapter',chapter:Number(body.dataset.hfxChapter)||0});});
  document.addEventListener('visibilitychange',syncButton);
  media.addEventListener?.('change',syncButton);

  const sections=Array.from(document.querySelectorAll(
    '.hero,.library-vault,.featured,.at-glance,.archive-intro,.library,.recent,.domain-introduction,.domain-topic,.search-page,.document-header,.article-content'
  ));
  function renderScroll(){
    scrollPending=false;
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const ratio=Math.min(1,Math.max(0,scrollY/max));
    html.style.setProperty('--hfx-progress',ratio.toFixed(4));
    const inFirst=scrollY<innerHeight*1.2;
    layer.style.setProperty('--hfx-alpha',inFirst?(body.classList.contains('hfx-root')?'.67':'.4'):'.18');
    for(let i=sections.length-1;i>=0;i--){
      if(sections[i].getBoundingClientRect().top<innerHeight*.53){
        body.dataset.hfxChapter=String(i+1).padStart(2,'0');
        break;
      }
    }
    const chapter=Number(body.dataset.hfxChapter)||0;
    if(chapter!==lastChapter){lastChapter=chapter;sendStage({action:'chapter',chapter});}
    if(isArticle)notifyStage();
  }
  addEventListener('scroll',()=>{
    if(!scrollPending){scrollPending=true;requestAnimationFrame(renderScroll);}
  },{passive:true});
  addEventListener('resize',()=>{
    if(!scrollPending){scrollPending=true;requestAnimationFrame(renderScroll);}
  },{passive:true});

  // Native pointer feedback to the optical scene. No fake cursor drag or scroll lock.
  if(matchMedia('(pointer:fine)').matches&&!media.matches){
    addEventListener('pointermove',e=>{
      pointerX=(e.clientX/Math.max(1,innerWidth)-.5)*22;
      pointerY=(e.clientY/Math.max(1,innerHeight)-.5)*15;
      if(!pointerPending){
        pointerPending=true;
        requestAnimationFrame(()=>{
          pointerPending=false;
          html.style.setProperty('--hfx-x',pointerX.toFixed(2)+'px');
          html.style.setProperty('--hfx-y',pointerY.toFixed(2)+'px');
        });
      }
    },{passive:true});
  }

  // Real topic links drive a subtle optical response; no invented status scores.
  const focusLinks=document.querySelectorAll(
    '.vault-index a,.exhibit-list a,.domain-topic-nav a,.feature-card,.research-results a,.topic-articles a'
  );
  focusLinks.forEach((link,i)=>{
    const active=()=>{
      layer.style.filter='brightness(1.08) saturate(1.13)';
      html.style.setProperty('--hfx-accent',i%2?'var(--hfx-pink)':'var(--hfx-teal)');
      sendStage({action:'focus',active:true});
    };
    const idle=()=>{
      layer.style.filter='';
      html.style.setProperty('--hfx-accent','var(--hfx-teal)');
      sendStage({action:'focus',active:false});
    };
    link.addEventListener('pointerenter',active);
    link.addEventListener('pointerleave',idle);
    link.addEventListener('focus',active);
    link.addEventListener('blur',idle);
  });

  if('IntersectionObserver' in window&&!media.matches){
    const targets=Array.from(document.querySelectorAll(
      '.vault-intro,.vault-index li,.featured-heading,.feature-card,.at-glance,'+
      '.section-heading,.exhibit-list li,.topic-exhibit,.research-results li,'+
      '.domain-introduction,.domain-topic,.search-page>h1,.document-header,.article-content>h2'
    )).slice(0,170);
    const io=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting){
          entry.target.classList.add('hfx-visible');
          io.unobserve(entry.target);
        }
      }
    },{threshold:0,rootMargin:'0px 0px -7% 0px'});
    for(const target of targets){
      // Offscreen nodes only. Do not flash an initially visible hero on hydration.
      if(target.getBoundingClientRect().top<innerHeight*.9){
        target.classList.add('hfx-visible');
      }
      target.dataset.hfxReveal='';
      io.observe(target);
    }
    html.classList.add('hfx-motion-ready');
  }
  syncButton();
  renderScroll();
})();
