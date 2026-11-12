/* Research- native HALOFLUX HUD integration.
   Values come only from the build-pinned public catalog; no fake statuses.
   All untrusted research text is placed with textContent (never innerHTML). */
(() => {
  'use strict';
  const BASE='/Research-/v3/';
  const original=BASE+'haloflux/';
  const byId=id=>document.getElementById(id);
  const make=(tag,cls,txt)=>{
    const el=document.createElement(tag);
    if(cls)el.className=cls;
    if(txt!=null)el.textContent=String(txt);
    return el;
  };
  const localHref=path=>{
    if(typeof path!=='string'||!path.startsWith(BASE)||path.startsWith('//'))return null;
    try {
      const u=new URL(path,location.origin);
      return u.origin===location.origin&&u.pathname.startsWith(BASE)?u.pathname:null;
    } catch { return null; }
  };
  const link=(href,text,cls)=>{
    const safe=localHref(href);
    if(!safe)return null;
    const a=make('a',cls,text);a.href=safe;return a;
  };
  const drawer=byId('research-explore');
  const status=byId('research-index-status');

  function updateNumbers(data){
    const values=[data.counts.documents,data.counts.research,data.counts.areas,data.counts.topics,data.counts.editorial];
    values.forEach((n,i)=>{if(Number.isSafeInteger(n)&&n>=0)byId('k'+i).textContent=n.toLocaleString('zh-TW');});
    byId('stBig').textContent=data.counts.documents+' SOURCE RECORDS · '+data.counts.areas+' AREAS';
  }
  function updateFeed(data){
    const root=byId('feed');
    root.replaceChildren();
    data.recent.slice(0,12).forEach((doc,i)=>{
      const a=link(doc.href,doc.title,'source-feed-title');if(!a)return;
      a.title=doc.publicTitle||doc.title;
      const row=make('div','research-feed-row');
      row.append(make('span','n',String(i+1).padStart(3,'0')),make('span','vb read','READ'),a);
      root.append(row);
    });
  }
  function updateSources(data){
    const root=byId('code');
    root.replaceChildren();
    const selected=data.recent.slice(0,9);
    selected.forEach((doc,i)=>{
      const a=link(doc.href,doc.source,'research-code-link');if(!a)return;
      a.title=(doc.title||'')+' · '+(doc.sha||'');
      const row=make('div','research-code-row');
      row.append(make('span','ln',String(i+1).padStart(3,'0')),a);
      root.append(row);
    });
  }
  function updateRoutes(data){
    const root=byId('routes');
    root.replaceChildren();
    for(const s of ['AREA','COUNT','INDEX','OPEN'])root.append(make('span','h',s));
    for(const area of data.areas){
      const a=link(area.href,area.title,'research-route-name');
      const open=link(area.href,'↗','research-route-open');
      if(!a||!open)continue;
      a.title=area.title;
      root.append(a,make('span','research-route-number',area.count),make('span','research-route-ok','LINKED'),open);
    }
  }
  function updateSubjects(data){
    const root=byId('agents');
    root.replaceChildren();
    data.areas.forEach((area,i)=>{
      const a=link(area.href,null,'research-subject');
      if(!a)return;
      a.title=area.title+' · '+area.count+' 篇';
      a.append(make('span','research-subject-id',String(i+1).padStart(2,'0')),
        make('span','research-subject-label',area.title),
        make('span','research-subject-count',area.count),
        make('span','research-subject-arrow','↗'));
      root.append(a);
    });
  }
  function updateDrawer(data){
    const areas=byId('research-domain-list');
    areas.replaceChildren();
    data.areas.forEach((d,i)=>{
      const a=link(d.href,null,'research-drawer-link');
      if(!a)return;
      a.append(make('span','research-item-index',String(i+1).padStart(2,'0')),
        make('strong','',d.title),make('span','research-item-count',d.count+' 篇'),make('span','research-item-arrow','↗'));
      const li=make('li');li.append(a);areas.append(li);
    });
    const recent=byId('research-recent-list');
    recent.replaceChildren();
    data.recent.forEach((d,i)=>{
      const a=link(d.href,null,'research-drawer-link');
      if(!a)return;
      a.append(make('span','research-item-index',String(i+1).padStart(2,'0')),
        make('strong','',d.title),make('span','research-item-arrow','↗'));
      a.title=d.source;
      const li=make('li');li.append(a);recent.append(li);
    });
    status.textContent=data.counts.documents+' 份來源 · '+data.counts.areas+' 個領域';
  }
  drawer?.addEventListener('toggle',()=>{
    if(drawer.open)byId('cpanel')?.classList.remove('open');
  });
  document.querySelector('.console')?.addEventListener('click',()=>{
    if(drawer?.open)drawer.open=false;
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&drawer?.open){drawer.open=false;drawer.querySelector('summary')?.focus();return;}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
      e.preventDefault();if(drawer)drawer.open=true;byId('research-query')?.focus();
    }
  });
  document.title='RESEARCH— / THE OBSERVATORY · HALOFLUX';
  fetch('./research-data.json',{credentials:'same-origin'})
    .then(async response=>{
      if(!response.ok)throw Error('HTTP '+response.status);
      const data=await response.json();
      if(data.schemaVersion!==1||data.scope!=='public-research-catalog'||data.base!==BASE||
        !Array.isArray(data.documents)||!Array.isArray(data.areas)||!Array.isArray(data.recent)||
        !data.counts||data.documents.length!==data.counts.documents||
        data.areas.reduce((n,g)=>n+g.count,0)!==data.documents.length)
        throw Error('Catalog integrity mismatch');
      updateNumbers(data);updateFeed(data);updateSources(data);updateRoutes(data);updateSubjects(data);updateDrawer(data);
      document.documentElement.dataset.researchIndex='ready';
    })
    .catch(error=>{
      status.textContent='研究索引暫時無法載入；請使用典藏館';
      byId('stBig').textContent='SOURCE INDEX / UNAVAILABLE';
      document.documentElement.dataset.researchIndex='failed';
      // The original Canvas visuals and direct navigation remain independently functional.
      console.warn('HALOFLUX Research index unavailable:',error.message);
    });
})();
