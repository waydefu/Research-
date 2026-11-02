import {mountMeshCore} from './mesh-core.js';
import {mountSceneDirector} from './scene-director.js';
import {mountInteraction} from './interaction-core.js';
import {readerHref} from './reader-links.js';
const REPO='https://github.com/waydefu/Research-';
const DOMAINS=[
  {id:'web',label:'Web / Graphics',zh:'Web 與視覺工程',x:240,y:150,r:60,count:0},
  {id:'agents',label:'Agent Systems',zh:'代理與系統治理',x:600,y:105,r:74,count:0},
  {id:'security',label:'Security',zh:'安全與治理',x:885,y:205,r:51,count:0},
  {id:'data',label:'Search & Data',zh:'索引與資料庫',x:410,y:350,r:56,count:0},
  {id:'creative',label:'Creative R&D',zh:'創意與技術研究',x:790,y:390,r:48,count:0},
  {id:'research',label:'Field Notes',zh:'歷史實驗與研究',x:135,y:355,r:39,count:0}
];
const LINKS=[['web','agents'],['web','data'],['web','creative'],['agents','security'],['agents','data'],['data','research'],['data','security'],['creative','web'],['creative','security'],['research','web']];
const mobileMap=matchMedia('(max-width:760px)');
// Mobile is a separately composed constellation, not a shrunken 1100px desktop map.
const MOBILE_MAP=[
  {id:'web',x:83,y:97,r:55,lines:['網頁與視覺','工程']},
  {id:'agents',x:241,y:132,r:57,lines:['AI 代理','系統治理']},
  {id:'security',x:82,y:271,r:54,lines:['安全與','治理']},
  {id:'data',x:245,y:280,r:56,lines:['搜尋與','資料庫']},
  {id:'creative',x:92,y:439,r:55,lines:['創意與','技術研究']},
  {id:'research',x:246,y:438,r:55,lines:['歷史實驗','與研究']}
];

const $=id=>document.getElementById(id);
const state={all:[],filtered:[],group:'all',query:'',limit:9,sourceCommit:''};
const format=n=>new Intl.NumberFormat('zh-TW').format(n);
const normalize=s=>(s??'').toString().normalize('NFKC').toLocaleLowerCase('zh-Hant');
const gitLink=p=>`${REPO}/blob/${encodeURIComponent(state.sourceCommit||'main')}/${p.split('/').map(encodeURIComponent).join('/')}`;
function node(name,classes='',text=''){const el=document.createElement(name);if(classes)el.className=classes;if(text)el.textContent=text;return el}
function button(text,fn,classes=''){const el=node('button',classes,text);el.type='button';el.addEventListener('click',fn);return el}
function setQueryFromURL(){const u=new URL(location.href);state.query=u.searchParams.get('q')||'';const group=u.searchParams.get('domain');state.group=DOMAINS.some(d=>d.id===group)?group:'all';$('research-search').value=state.query}
function persist(){const url=new URL(location.href);state.query?url.searchParams.set('q',state.query):url.searchParams.delete('q');state.group==='all'?url.searchParams.delete('domain'):url.searchParams.set('domain',state.group);history.replaceState(null,'',url)}
function goGroup(id,focusTarget=false){state.group=id;state.limit=9;state.query='';$('research-search').value='';persist();renderFilters();renderGraph();applyFilter();document.dispatchEvent(new CustomEvent('research:focus',{detail:{selected:id}}));document.getElementById('explorer').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});if(focusTarget)$('explorer-title').focus({preventScroll:true})}
function makeSVG(tag,attrs={}){const el=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [key,val] of Object.entries(attrs))el.setAttribute(key,String(val));return el}
function renderGraph(){
 const svg=$('domain-map');svg.replaceChildren();
 const mobile=mobileMap.matches;
 svg.setAttribute('viewBox',mobile?'0 0 330 530':'0 0 1100 480');
 svg.classList.toggle('domain-map--mobile',mobile);
 const positions=mobile?MOBILE_MAP:DOMAINS;
 const byId=new Map(positions.map(p=>[p.id,p]));
 const defs=makeSVG('defs'),lineGradient=makeSVG('linearGradient',{id:'connection-gradient',x1:0,x2:1});lineGradient.append(makeSVG('stop',{offset:0,'stop-color':'#167B90'}),makeSVG('stop',{offset:1,'stop-color':'#E4B451'}));defs.append(lineGradient);svg.append(defs);
 for(const [a,b] of LINKS){const aa=byId.get(a),bb=byId.get(b);svg.append(makeSVG('line',{class:'connection',x1:aa.x,y1:aa.y,x2:bb.x,y2:bb.y}))}
 for(const d of DOMAINS){
  const pos=byId.get(d.id),{x,y,r}=pos;
  const g=makeSVG('g',{class:`node ${state.group===d.id?'node--active':''}`,'data-domain':d.id,tabindex:0,role:'button','aria-label':`${d.zh}，${d.count} 篇研究，按 Enter 篩選`,'aria-pressed':String(state.group===d.id)});
  g.append(makeSVG('circle',{class:'orb-ring',cx:x,cy:y,r:r+(mobile?7:11)}));
  g.append(makeSVG('circle',{class:'orb-core',cx:x,cy:y,r:r}));
  g.append(makeSVG('circle',{class:'orb-pulse',cx:x,cy:y-(mobile?36:18),r:3}));
  const label=makeSVG('text',{x:x,y:mobile?y-10:y+4,'text-anchor':'middle'});
  if(mobile){
   pos.lines.forEach((line,i)=>{const span=makeSVG('tspan',{x:x,dy:i?19:0});span.textContent=line;label.append(span)});
  }else label.textContent=d.label;
  g.append(label);
  const num=makeSVG('text',{class:'node-index',x:x,y:y+(mobile?33:21),'text-anchor':'middle'});
  num.textContent=`${String(d.count).padStart(2,'0')} ${mobile?'篇研究':'STUDIES'}`;
  g.append(num);
  g.addEventListener('click',e=>goGroup(d.id,e.detail===0));
  g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();goGroup(d.id,true)}});
  svg.append(g);
 }
 const legend=$('domain-legend');legend.replaceChildren();
 for(const d of DOMAINS){const b=button(d.zh,e=>goGroup(d.id,e.detail===0));b.setAttribute('aria-pressed',String(state.group===d.id));legend.append(b)}
}
function renderFilters(){const bar=$('filter-bar');bar.replaceChildren();for(const d of [{id:'all',zh:'全部研究'},...DOMAINS]){const b=button(d.zh,()=>{state.group=d.id;state.limit=9;persist();renderFilters();renderGraph();applyFilter();document.dispatchEvent(new CustomEvent('research:focus',{detail:{selected:d.id==='all'?false:d.id}}))});b.setAttribute('aria-pressed',String(state.group===d.id));bar.append(b)}}
function filterDocs(docs,query,group){const terms=normalize(query).trim().split(/\s+/u).filter(Boolean);return docs.filter(d=>{if(group!=='all'&&d.group!==group)return false;const hay=normalize([d.title,d.summary,d.path,...(d.headings||[]),...(d.tags||[])].join(' '));return terms.every(t=>hay.includes(t))})}
function applyFilter(){state.filtered=filterDocs(state.all,state.query,state.group);state.limit=Math.max(9,state.limit);renderResults()}
function renderResults(){const list=$('results');list.replaceChildren();const records=state.filtered.slice(0,state.limit);$('results-count').textContent=`${format(state.filtered.length)} 條研究`;
 if(records.length===0){const empty=node('div','empty-results');empty.textContent=state.all.length?'沒有符合的研究。試試更短的關鍵字或切換分類。':'研究索引尚未載入，請使用 GitHub 開啟原始文件。';list.append(empty)}
 records.forEach((d,i)=>{const row=node('article','result');const num=node('span','result-id',String(i+1).padStart(3,'0'));row.append(num);const info=node('div');const local=readerHref(d.path);const title=node(local?'a':'span','result-title',d.title);if(local){title.href=local;title.setAttribute('aria-label',`${d.title}，在站內閱讀全文`)}info.append(title);if(d.summary)info.append(node('p','result-excerpt',d.summary));if(!local)info.append(node('small','result-unavailable','此文件尚未收錄於站內全文'));row.append(info);const meta=node('div','result-meta');meta.textContent=`${DOMAINS.find(x=>x.id===d.group)?.zh||'研究'}\nMD / SOURCE`;meta.style.whiteSpace='pre-line';const source=node('a','result-source','GitHub 原始碼 ↗');source.href=gitLink(d.path);source.target='_blank';source.rel='noopener noreferrer';source.setAttribute('aria-label',`${d.title}，查看 GitHub 原始碼（新分頁）`);meta.append(source);row.append(meta);const arrow=node('span','result-action',local?'→':'');arrow.setAttribute('aria-hidden','true');row.append(arrow);list.append(row)});
 $('load-more').hidden=state.filtered.length<=state.limit;$('results-note').textContent=records.length?`SHOWING ${records.length} / ${state.filtered.length}`:'';
}
async function loadIndex(){try{const response=await fetch('./data/research-index.json',{cache:'no-cache'});if(!response.ok)throw new Error(`HTTP ${response.status}`);const data=await response.json();if(!Array.isArray(data.documents)||!data.documents.length)throw new Error('Empty or invalid index');state.all=data.documents.filter(x=>x&&typeof x.path==='string'&&typeof x.title==='string'&&DOMAINS.some(d=>d.id===x.group));state.sourceCommit=/^[0-9a-f]{40}$/i.test(data.sourceCommit||'')?data.sourceCommit:'main';for(const d of DOMAINS)d.count=state.all.filter(x=>x.group===d.id).length;
 const mode=data.indexKind==='repository-tree-bootstrap'?'路徑索引快照（建置後更新全文）':'Markdown 全文元資料索引';$('index-status').textContent=`${format(state.all.length)} 份研究 · ${mode} · ${data.sourceCommit?`來源 ${String(data.sourceCommit).slice(0,8)}`:'來源 main'} · 原文為準`;
 renderFilters();renderGraph();applyFilter();
 }catch(error){console.warn('Index unavailable',error);$('index-status').classList.add('error');$('index-status').textContent='索引暫時無法載入。';const fallback=node('a','index-source-link','直接閱讀 GitHub 研究目錄 ↗');fallback.href=`${REPO}/tree/main/research`;fallback.target='_blank';fallback.rel='noopener noreferrer';$('index-status').append(' ',fallback);renderFilters();renderGraph();applyFilter()}}
function setupSearch(){let debounce=0;$('search-form').addEventListener('submit',e=>{e.preventDefault();state.query=$('research-search').value;state.limit=9;persist();applyFilter()});$('research-search').addEventListener('input',e=>{clearTimeout(debounce);const next=e.target.value;debounce=setTimeout(()=>{state.query=next;state.limit=9;persist();applyFilter()},100)});document.addEventListener('keydown',e=>{const target=e.target;const editable=target instanceof HTMLElement&&(target.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(target.tagName));if(e.key==='/'&&!editable&&!e.altKey&&!e.ctrlKey&&!e.metaKey){e.preventDefault();$('research-search').focus()}else if(e.key==='Escape'&&document.activeElement===$('research-search')){if($('research-search').value){$('research-search').value='';state.query='';state.limit=9;persist();applyFilter()}else $('research-search').blur()}});$('load-more').addEventListener('click',()=>{state.limit+=9;renderResults()});window.addEventListener('popstate',()=>{setQueryFromURL();renderFilters();renderGraph();applyFilter()})}
function setupMobileMenu(){const btn=$('menu-toggle'),nav=$('mobile-nav');function close(){nav.hidden=true;btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','展開選單')}btn.addEventListener('click',()=>{const opening=nav.hidden;nav.hidden=!opening;btn.setAttribute('aria-expanded',String(opening));btn.setAttribute('aria-label',opening?'關閉選單':'展開選單')});nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!nav.hidden){close();btn.focus()}});window.addEventListener('resize',()=>{if(innerWidth>760)close()})}
function setupReveal(){if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver'in window))return;const css='@keyframes editorialEnter{from{opacity:.35;transform:translateY(22px)}to{opacity:1;transform:none}}';const style=node('style');style.textContent=css;document.head.append(style);const io=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){if(entry.target.matches('h2'))entry.target.classList.add('v2-reveal');else entry.target.style.animation='editorialEnter 800ms cubic-bezier(.23,.84,.24,1) both';io.unobserve(entry.target)}},{threshold:.13});document.querySelectorAll('.section-heading,.thesis-main,.explorer-intro,.method-steps,.heading-row h2,.explorer-intro h2,.method-main > h2,.exit > h2').forEach(el=>io.observe(el))}
function init(){mobileMap.addEventListener('change',renderGraph);if(new URL(location.href).searchParams.get('qa')==='1')import('./qa-metrics.js').then(m=>m.startQAMetrics()).catch(e=>console.warn('Local QA unavailable',e));setQueryFromURL();setupMobileMenu();setupSearch();setupReveal();const interaction=mountInteraction($('v2-stage'));loadIndex().then(()=>{interaction.setDocuments(state.all,state.sourceCommit);interaction.markIndexLoaded(state.all.length>0)});const canvas=$('artifact-canvas');if(canvas){const scene=mountMeshCore(canvas,$('hero-renderer'));mountSceneDirector(scene)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();