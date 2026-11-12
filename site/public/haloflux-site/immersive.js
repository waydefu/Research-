/*
 * RESEARCH— shared HALOFLUX optical controller.
 * Static HTML and links never depend on this script or its Canvas iframe.
 * The original source-derived stage is loaded after content is interactive,
 * and not at all for reduced motion. No artificial scroll locking.
 */
(()=>{
  const iframe=document.querySelector('.hfx-field iframe');
  if(!iframe)return;
  const root=document.documentElement,body=document.body,layer=document.querySelector('.hfx-field');
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const isArticle=body.classList.contains('research-inner-article');
  let paused=false,stageLoaded=false,stageRequested=false;
  let scrollPending=false,pointerPending=false,lastChapter=-1,lastScroll=scrollY;
  const send=(message)=>{
    if(!stageLoaded||!iframe.contentWindow)return;
    iframe.contentWindow.postMessage(Object.assign({type:'research-hfx-stage'},message),location.origin);
  };
  const shouldPause=()=>paused||media.matches||document.hidden||
    (isArticle&&scrollY>innerHeight*1.3);
  const button=document.createElement('button');
  button.type='button';button.className='hfx-motion-control';
  button.textContent='暫停動效';
  button.setAttribute('aria-pressed','false');
  body.append(button);
  const progress=document.createElement('div');
  progress.className='hfx-progress';
  progress.setAttribute('aria-hidden','true');body.append(progress);

  function updateButton(){
    button.hidden=media.matches;
    button.disabled=media.matches;
    button.textContent=paused?'恢復動效':'暫停動效';
    button.setAttribute('aria-pressed',String(paused));
    body.classList.toggle('hfx-paused',shouldPause());
    send({paused:shouldPause()});
  }
  function loadStage(){
    if(stageRequested||media.matches||document.hidden)return;
    stageRequested=true;
    iframe.src=iframe.dataset.src;
  }
  iframe.addEventListener('load',()=>{
    if(!stageRequested)return;
    stageLoaded=true;
    send({paused:shouldPause()});
    send({action:'chapter',chapter:lastChapter<0?0:lastChapter});
  });
  button.addEventListener('click',()=>{
    paused=!paused;
    updateButton();
    if(!paused)loadStage();
  });
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden)loadStage();
    updateButton();
  });
  media.addEventListener?.('change',()=>{
    if(!media.matches)loadStage();
    updateButton();
  });
  // Avoid pre-empting search, typing, input handlers, and initial text paint.
  if(!media.matches){
    if('requestIdleCallback' in window)
      requestIdleCallback(loadStage,{timeout:1200});
    else setTimeout(loadStage,650);
  }
  const sections=Array.from(document.querySelectorAll(
    '.hero,.library-vault,.featured,.at-glance,.archive-intro,.library,.recent,.domain-introduction,.domain-topic,.search-page,.document-header,.article-content'
  ));
  function renderScroll(){
    scrollPending=false;
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    root.style.setProperty('--hfx-progress',Math.min(1,Math.max(0,scrollY/max)).toFixed(4));
    layer.style.setProperty('--hfx-alpha',scrollY<innerHeight*1.15?
      (body.classList.contains('hfx-root')?'.67':'.41'):'.19');
    for(let i=sections.length-1;i>=0;i--){
      if(sections[i].getBoundingClientRect().top<innerHeight*.53){
        if(i+1!==lastChapter){lastChapter=i+1;body.dataset.hfxChapter=String(i+1).padStart(2,'0');send({action:'chapter',chapter:i+1});}
        break;
      }
    }
    if(isArticle && (scrollY>innerHeight*1.3)!==(lastScroll>innerHeight*1.3))updateButton();
    lastScroll=scrollY;
  }
  addEventListener('scroll',()=>{
    if(!scrollPending){scrollPending=true;requestAnimationFrame(renderScroll);}
  },{passive:true});
  addEventListener('resize',()=>{
    if(!scrollPending){scrollPending=true;requestAnimationFrame(renderScroll);}
  },{passive:true});
  if(matchMedia('(pointer:fine)').matches&&!media.matches){
    addEventListener('pointermove',e=>{
      if(pointerPending)return;
      pointerPending=true;
      const x=(e.clientX/Math.max(1,innerWidth)-.5)*22;
      const y=(e.clientY/Math.max(1,innerHeight)-.5)*15;
      requestAnimationFrame(()=>{
        pointerPending=false;
        root.style.setProperty('--hfx-x',x.toFixed(2)+'px');
        root.style.setProperty('--hfx-y',y.toFixed(2)+'px');
      });
    },{passive:true});
  }
  const focusLinks=document.querySelectorAll(
    '.vault-index a,.exhibit-list a,.domain-topic-nav a,.feature-card,.research-results a,.topic-articles a'
  );
  focusLinks.forEach((link,i)=>{
    const active=()=>{
      layer.style.filter='brightness(1.08) saturate(1.13)';
      root.style.setProperty('--hfx-accent',i%2?'var(--hfx-pink)':'var(--hfx-teal)');
      send({action:'focus',active:true});
    };
    const idle=()=>{
      layer.style.filter='';
      root.style.setProperty('--hfx-accent','var(--hfx-teal)');
      send({action:'focus',active:false});
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
      for(const entry of entries)if(entry.isIntersecting){
        entry.target.classList.add('hfx-visible');io.unobserve(entry.target);
      }
    },{threshold:0,rootMargin:'0px 0px -7% 0px'});
    for(const target of targets){
      if(target.getBoundingClientRect().top<innerHeight*.9)target.classList.add('hfx-visible');
      target.dataset.hfxReveal='';
      io.observe(target);
    }
    root.classList.add('hfx-motion-ready');
  }
  // Cross-document View Transitions are progressive enhancement only.
  updateButton();renderScroll();
})();
