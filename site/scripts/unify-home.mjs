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
const home=html.replaceAll('./assets/','/Research-/v3/atlas/sanctum/assets/');
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
