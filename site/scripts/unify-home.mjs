// Assemble exactly one public research website. No archived V2 application.
import {cp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';

const source=resolve(process.cwd(),'dist');
const output=resolve(process.cwd(),'pages-dist');
const v3=join(output,'v3');
const html=await readFile(join(source,'atlas/sanctum/index.html'),'utf8');
if(!html.includes('技術研究與實作知識庫')||!html.includes('class="world-backdrop"'))
  throw Error('The reviewed Sanctum home scene is missing');
if(!html.includes('<link rel="canonical" href="https://waydefu.github.io/Research-/"'))
  throw Error('Canonical homepage changed unexpectedly');
// Transform the canonical page into the same HALOFLUX-driven experience as
// every Astro inner page. Keep semantic Sanctum links/sections as the fallback.
const field='<div class="hfx-field" aria-hidden="true"><iframe src="/Research-/v3/haloflux-site/field.html" title="HALOFLUX 光場" tabindex="-1" loading="eager" aria-hidden="true"></iframe></div>';
let home=html.replaceAll('./assets/','/Research-/v3/atlas/sanctum/assets/');
home=home.replace('<span class="zh">技術研究與實作知識庫</span><span class="en">人工智慧、網站設計與軟體工程</span>',
  '<span class="zh">追索未知，<br>驗證真實。</span><span class="en">技術研究與實作知識庫 / AI · WEB · ENGINEERING</span>');
home=home.replace('</head>',
  '<link rel="stylesheet" href="/Research-/v3/haloflux-site/immersive.css">\n</head>');
home=home.replace('<body data-pagefind-ignore>',
  '<body class="hfx-root" data-pagefind-ignore>\n'+field);
home=home.replace('<div class="scene-guideline" aria-hidden="true"></div>',
  '<div class="scene-guideline" aria-hidden="true"></div><p class="hfx-instrument" aria-hidden="true">HALOFLUX / LIVE CANVAS / SOURCE-BASED RESEARCH</p>');
home=home.replace('</body>',
  '<div class="hfx-source-credit">動態視覺原始碼：<a href="https://github.com/Ryder191/haloflux" rel="noopener noreferrer">HALOFLUX by Ryder191</a> · PolyForm Noncommercial 1.0.0 · <a href="/Research-/v3/haloflux/">檢視原作</a> · Research- 提供真實研究內容</div>\n<script defer src="/Research-/v3/haloflux-site/immersive.js"></script>\n</body>');
if(!home.includes('hfx-field')||!home.includes('追索未知')||!home.includes('haloflux-site/immersive.js'))throw Error('Full-site cinematic home integration failed');
if(home.includes('data:image/webp;base64,'))throw Error('Unexpected embedded WebP');

await rm(output,{recursive:true,force:true}); // Generated output only; no source deletions.
await mkdir(output,{recursive:true});
await cp(source,v3,{recursive:true});
await writeFile(join(output,'index.html'),home,'utf8');
await writeFile(join(output,'.nojekyll'),'','utf8');

// Only a permanent navigation fallback remains at the old external address.
// The old V2 JS, CSS, fonts and source-index application are NOT published.
await mkdir(join(output,'v2'),{recursive:true});
await writeFile(join(output,'v2/index.html'),`<!doctype html>
<html lang="zh-Hant-TW"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,follow">
<meta http-equiv="refresh" content="0;url=/Research-/v3/library/">
<link rel="canonical" href="https://waydefu.github.io/Research-/v3/library/">
<title>研究館已整合</title></head><body><main>
<h1>研究網站已整合為單一版本</h1>
<p>舊版展示已停止維護，所有研究文章請使用正式研究館。</p>
<a href="/Research-/v3/library/">前往研究館</a>
</main></body></html>`,'utf8');
console.log('One website: /Research-/ + /v3/ research, /v2/ compatibility redirect only; output '+output);
