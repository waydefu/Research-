// Generate a source-faithful HALOFLUX + real Research- catalog preview; never edit upstream.
import {readFile,mkdir,writeFile,copyFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {allDocs,domains,displayDomain,BASE} from '../src/lib/catalog.mjs';

const docs=allDocs(),source=resolve('dist/haloflux'),target=resolve('dist/haloflux-research');
if(docs.length<60)throw Error('Unexpectedly small research corpus');
const publicDoc=d=>({href:d.href,title:d.publicTitle,summary:d.summary,group:d.group,domain:displayDomain(d.group),topic:d.topic,kind:d.kind,source:d.file,sha:d.sha,date:d.date,editorial:Boolean(d.summaryReviewed)});
const groups=domains().map(id=>({id,title:displayDomain(id),count:docs.filter(d=>d.group===id).length,href:BASE+'domains/'+encodeURIComponent(id)+'/'}));
const index={schemaVersion:1,scope:'public-research-catalog',base:BASE,source:'Research- / site/src/lib/catalog.mjs',
  counts:{documents:docs.length,research:docs.filter(d=>d.collection==='research').length,areas:groups.length,topics:new Set(docs.map(d=>d.topic)).size,editorial:docs.filter(d=>d.summaryReviewed).length},
  areas:groups,recent:[...docs].sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0)||a.file.localeCompare(b.file)).slice(0,18).map(publicDoc),
  documents:docs.map(publicDoc)};
if(index.documents.some(d=>d.source==='docs/governance/THREAT-MODEL.md'||!/^\/Research-\/v3\/(?:research|governance|design)\//.test(d.href)))
  throw Error('Unsafe catalog entry in HALOFLUX integration');
if(groups.reduce((sum,g)=>sum+g.count,0)!==docs.length)throw Error('Domain totals do not cover all sources');

const swap=(s,a,b,id)=>{
  const n=s.split(a).length-1;
  if(n!==1)throw Error('Original source seam changed: '+id+' / matches='+n);
  return s.replace(a,b);
};
const drawer=[
  '<details class="research-explore" id="research-explore">',
  '<summary aria-label="開啟研究探索與搜尋">RESEARCH / INDEX <span aria-hidden="true">↗</span></summary>',
  '<div class="research-drawer">',
  '<p class="research-overline">RESEARCH— / THE OBSERVATORY</p>',
  '<h2>進入知識的軌道。</h2>',
  '<p class="research-copy">以真實研究索引探索觀測所。光場保持 HALOFLUX 原作；下面的連結與統計來自 Research- 原始資料。</p>',
  '<nav class="research-quick" aria-label="研究館主要導覽"><a href="/Research-/">首頁</a><a href="/Research-/v3/library/">完整典藏</a><a href="/Research-/v3/search/">全文搜尋</a></nav>',
  '<form role="search" action="/Research-/v3/search/" method="get" class="research-find">',
  '<label for="research-query">SEARCH / RESEARCH LIBRARY</label>',
  '<div><input id="research-query" name="q" type="search" placeholder="Shader、AI Agent、開機動畫…" required><button type="submit">搜尋 ↗</button></div>',
  '</form>',
  '<div class="research-drawer-title"><h3>RESEARCH DOMAINS</h3><span id="research-index-status" role="status" aria-live="polite">讀取研究索引…</span></div>',
  '<ol id="research-domain-list" class="research-domains"><li><a href="/Research-/v3/library/">進入完整分類 ↗</a></li></ol>',
  '<div class="research-drawer-title"><h3>RECENT SOURCE RECORDS</h3></div>',
  '<ol id="research-recent-list" class="research-recent"><li><a href="/Research-/v3/library/">瀏覽全部研究 ↗</a></li></ol>',
  '<footer class="research-drawer-credit">VISUAL ENGINE · <a href="https://github.com/Ryder191/haloflux" target="_blank" rel="noopener noreferrer">HALOFLUX by Ryder191</a> · NONCOMMERCIAL LICENSE<br><a href="/Research-/v3/haloflux/">檢視未修改原作 ↗</a></footer>',
  '</div></details>',
  '<p class="research-visible-credit">HALOFLUX by <a href="https://github.com/Ryder191/haloflux" rel="noopener noreferrer" target="_blank">Ryder191</a> · ORIGINAL CANVAS ENGINE</p>'
].join('\n');

function integrate(html,edition){
  html=swap(html,'<div class="brand"><h1>RYDER CODE / Ms MAIKEBAIs CAT</h1><p>RESEARCH PAPERS → REPRODUCIBLE EXPERIMENTS</p></div>',
    '<div class="brand"><h1>RESEARCH—</h1><p>THE OBSERVATORY / HALOFLUX BY RYDER191</p></div>','brand');
  for(const [a,b] of [['PAPERS','RECORDS'],['AGENTS','RESEARCH'],['METHODS','AREAS'],['REF. SCENES','TOPICS'],['FURTHER REVIEW','CURATED']])
    html=swap(html,'<div class="k">'+a+'</div>','<div class="k">'+b+'</div>','KPI '+a);
  for(const [id,old] of [['k0','64'],['k1','12'],['k2','11'],['k3','28'],['k4','4']])
    html=swap(html,'id="'+id+'">'+old+'</div>','id="'+id+'">—</div>','KPI '+id);
  html=html.replaceAll('<div class="seg"><i></i></div>','<div class="seg" aria-hidden="true"><i></i></div>');
  html=swap(html,'<div class="stage" id="stageWrap">','<div class="stage" id="stageWrap">\n'+drawer,'native navigation');
  html=swap(html,'7 / 11 METHODS · 4 PENDING','SOURCE INDEX / LOADING','fake status');
  html=swap(html,'independent runs · shared event bus','SOURCE-BASED RECORDS / NO LIVE AGENT CLAIMS','fake activity');
  for(const [a,b] of [['INVESTIGATION FEED','RECENT / RESEARCH RECORDS'],['ADVECTION / PARTICLE SOLVER','PROCEDURAL FIELD / DEMO'],['METHOD WORKSPACE','SOURCE / PROVENANCE'],['SHARED SCENE / DIFFERENCE FIELD','PROCEDURAL COMPARISON / DEMO'],['SOURCE / EXTRACTION ROUTES','RESEARCH / DOMAINS'],['VALIDATION / SAMPLE BUFFER','SAMPLE FIELD / NOT TEST DATA'],['12 AGENTS / DISPATCH','RESEARCH / SUBJECT INDEX'],['METHOD / REFERENCE INDEX','PROCEDURAL MATRIX / DEMO']])
    html=swap(html,'<h3>'+a+'</h3>','<h3>'+b+'</h3>','panel '+a);
  for(const [a,b] of [['same input · local difference · inspect source','illustrative only · no measured results'],['illustrative / source check required','generated visualization · not validation'],['pages → equations → runnable source','open a real research domain ↗'],['28 scenes / 7 matched / 4 further review','synthetic pattern · not a study metric']])
    html=swap(html,a,b,'illustration notice');
  html=swap(html,'for (let i = 0; i < 12; i++) feedPush();\nsetInterval(feedPush, 650);','/* Simulated activity replaced with real research links in bridge.js. */','fake feed');
  html=swap(html,'setInterval(codeTick, 70);','/* Simulated typing replaced by source provenance in bridge.js. */','fake code');
  html=swap(html,"setInterval(() => { const i = (rnd() * ROUTES.length) | 0; rState[i] = (rState[i] + 1) % 4; renderRoutes(); }, 500);\nrenderRoutes();",
    '/* Simulated pipeline replaced by domain navigation in bridge.js. */','fake routes');
  html=swap(html,'drawAdv(dt); drawDiff(); drawVal(); drawIdx(); agentsTick(dt);',
    'drawAdv(dt); drawDiff(); drawVal(); drawIdx(); /* synthetic agent statuses disabled */','fake agents');
  const statusLine=/document\.getElementById\('stBig'\)\.textContent = \x60[^\x60]*\x60;/g;
  if((html.match(statusLine)||[]).length!==1)throw Error('Fake KPI status source seam changed');
  html=html.replace(statusLine,'/* Real source counts are populated by bridge.js. */');

  // Preserve the original drawStage/rhythm/camera algorithms, but pause rendering in
  // hidden tabs and reduced-motion contexts; a static frame remains visible.
  html=swap(html,'let last = performance.now();\nfunction frame(now) {',
    [
      'let last = performance.now();',
      "const integrationMotion = matchMedia('(prefers-reduced-motion: reduce)');",
      'let integrationRunning = !document.hidden && !integrationMotion.matches;',
      'let integrationRaf = 0;',
      'function frame(now) {',
      '  integrationRaf = 0;',
      '  if (!integrationRunning) { last = now; return; }'
    ].join('\n'),'frame entry');
  html=swap(html,'  requestAnimationFrame(frame);\n}\nlet rzT, ready = false, started = false;',
    '  integrationRaf = requestAnimationFrame(frame);\n}\nlet rzT, ready = false, started = false;','frame schedule');
  html=swap(html,'  if (!started) { started = true; last = performance.now(); requestAnimationFrame(frame); }',
    '  if (!started) { started = true; last = performance.now(); if (integrationRunning) integrationRaf = requestAnimationFrame(frame); else paintStaticIntegration(); }\n  else if (!integrationRunning) paintStaticIntegration();','resize');
  html=swap(html,'frame = function (now) { if (ready) origFrame(now); else { last = now; requestAnimationFrame(frame); } };',
    [
      'frame = function (now) {',
      '  integrationRaf = 0;',
      '  if (!integrationRunning) { last = now; return; }',
      '  if (ready) origFrame(now); else { last = now; integrationRaf = requestAnimationFrame(frame); }',
      '};',
      'function paintStaticIntegration() {',
      '  if (!ready) return;',
      '  drawStage(0); drawAdv(0); drawDiff(); drawVal(); drawIdx();',
      '}',
      'function syncIntegrationMotion() {',
      '  const shouldRun = !document.hidden && !integrationMotion.matches;',
      '  if (integrationRunning === shouldRun) return;',
      '  integrationRunning = shouldRun;',
      '  if (!shouldRun) { if (integrationRaf) cancelAnimationFrame(integrationRaf); integrationRaf = 0; paintStaticIntegration(); }',
      '  else if (started && ready && !integrationRaf) { last = performance.now(); integrationRaf = requestAnimationFrame(frame); }',
      '}',
      "document.addEventListener('visibilitychange',syncIntegrationMotion);",
      "integrationMotion.addEventListener?.('change',syncIntegrationMotion);"
    ].join('\n'),'motion lifecycle');
  // Namespace integration-side preferences so the original's saved presets are unaffected.
  const originalKey=edition==='mobile'?'paperlab.mobile.cfg.v2':'paperlab.cfg.v2';
  html=swap(html,"const LS_KEY = '"+originalKey+"';",
    "const LS_KEY = 'research.haloflux."+edition+".cfg.v1';",'config isolation');
  html=swap(html,"const KEY = 'paperlab.bgm.v1';",
    "const KEY = 'research.haloflux.bgm.v1';",'music preference isolation');
  html=swap(html,'</head>','<link rel="stylesheet" href="/Research-/v3/haloflux-integration/bridge.css">\n</head>','style');
  html=swap(html,'</body>','<script defer src="/Research-/v3/haloflux-integration/bridge.js"></script>\n</body>','script');
  if(!html.includes('noindex,nofollow')||!html.includes('HALOFLUX by'))throw Error('License disclosure/noindex missing');
  return html;
}
await mkdir(target,{recursive:true});
await copyFile(join(source,'LICENSE'),join(target,'LICENSE'));
await copyFile(join(source,'index.html'),join(target,'index.html'));
for(const name of ['lab','mobile']){
  const html=await readFile(join(source,name+'.html'),'utf8');
  await writeFile(join(target,name+'.html'),integrate(html,name),'utf8');
}
await writeFile(join(target,'research-data.json'),JSON.stringify(index)+'\n','utf8');
console.log('HALOFLUX Research preview generated from '+docs.length+' real source documents / '+groups.length+' areas.');
