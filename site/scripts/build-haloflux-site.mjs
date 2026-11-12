// Source-faithful, isolated, decorative Canvas renderer. No panel work or audio.
// The original Ryder191/haloflux remains unchanged at /v3/haloflux/.
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const source=resolve('dist/haloflux'),out=resolve('dist/haloflux-site');
const raw=await readFile(join(source,'lab.html'),'utf8');
const start=raw.indexOf('const TAU = Math.PI * 2, rnd = Math.random;');
const end=raw.indexOf('/* ---------- callout box with leader line');
if(start<0||end<start)throw Error('Original HALOFLUX stage seam missing');
let engine=raw.slice(start,end);
if(!engine.includes('function drawStage(dt)')||!engine.includes('function updateBeat(dt)')||!engine.includes('function updateCam(dt)'))
 throw Error('Refusing to ship substitute renderer');
const once=(a,b,label)=>{
 if(engine.split(a).length!==2)throw Error('Source seam changed: '+label);
 engine=engine.replace(a,b);
};
once('  drawCallout();','  /* UI-only callout disabled in visual derivative. */','callout');
once('const C = { ...(PRESETS.MINE || PRESETS.B) };',[
  'const C = { ...(PRESETS.MINE || PRESETS.B) };',
  '// Background-only particle/density budget; source drawings preserved.',
  'C.runnerCount=innerWidth<640?96:230;',
  'C.flyerCount=innerWidth<640?.36:.8;',
  'C.hazeCount=innerWidth<640?5:9;',
  'C.bokeh=0; C.depthBlur=0; C.webBlur=0;',
  'C.atmos=innerWidth<640?.25:.5; C.vignette=.48;'
].join('\n'),'adaptive preset');
once('let DPR = Math.min(window.devicePixelRatio || 1, 2);',
  'let DPR = Math.min(devicePixelRatio||1,innerWidth<640?.9:1.2);','ambient DPR');
once('cx = W * 0.07; cy = H * 0.5;',
  'cx = W * 0.64; cy = H * 0.48;','right-aligned optical composition');
once('R = Math.max(H * 0.78, W * 0.30);',
  'R = Math.max(H * 0.66, W * 0.27);','buffer budget');
const style=":root{color-scheme:dark}\n*{box-sizing:border-box}\nhtml,body{margin:0;width:100%;height:100%;overflow:hidden;background:#08090b}\n#stage{display:block;position:absolute;inset:0;width:100%;height:100%}";
const runtime="\n// Source stage drives the filmic background only. No fake KPI, DOM panels or BGM.\nlet integrationRunning=false,ambientReady=false,ambientTimer=0,lastFrame=0,frameCount=0;\nlet lastChapter=-1,hostPaused=true,docHidden=document.hidden;\nconst reduced=matchMedia('(prefers-reduced-motion: reduce)');\nconst frameInterval=()=>innerWidth<720?100:innerWidth<1100?80:66;\nconst setState=()=>{\n document.documentElement.dataset.hfxSourceStage='HALOFLUX';\n document.documentElement.dataset.hfxFrameCount=String(frameCount);\n document.documentElement.dataset.hfxRunning=String(integrationRunning);\n};\nfunction renderStatic(){\n if(!ambientReady)return;\n drawStage(0);frameCount++;setState();\n}\nfunction tick(now){\n ambientTimer=0;\n if(!integrationRunning||!ambientReady)return;\n const dt=Math.min(.05,Math.max(0,(now-lastFrame)/1000));\n lastFrame=now;drawStage(dt);frameCount++;setState();\n ambientTimer=setTimeout(()=>requestAnimationFrame(tick),frameInterval());\n}\nfunction reconcile(){\n const run=!docHidden&&!hostPaused&&!reduced.matches;\n if(run===integrationRunning)return;\n integrationRunning=run;\n if(ambientTimer)clearTimeout(ambientTimer);\n ambientTimer=0;\n if(run&&ambientReady){lastFrame=performance.now();ambientTimer=setTimeout(()=>requestAnimationFrame(tick),frameInterval());}\n else if(ambientReady&&!run)renderStatic();\n setState();\n}\nlet lastWidth=0,lastHeight=0,resizeQueue=0;\nfunction resizeIfNeeded(){\n const width=Math.round(innerWidth),height=Math.round(innerHeight);\n if(width<20||height<20||width===lastWidth&&height===lastHeight)return;\n lastWidth=width;lastHeight=height;\n DPR=Math.min(devicePixelRatio||1,width<640?.9:1.2);\n resizeStage();ambientReady=true;renderStatic();reconcile();\n}\naddEventListener('resize',()=>{\n if(resizeQueue)return;\n resizeQueue=requestAnimationFrame(()=>{resizeQueue=0;resizeIfNeeded();});\n},{passive:true});\naddEventListener('visibilitychange',()=>{docHidden=document.hidden;reconcile();});\nreduced.addEventListener?.('change',reconcile);\naddEventListener('message',e=>{\n if(e.origin!==location.origin||!e.data||e.data.type!=='research-hfx-stage')return;\n if(e.data.action==='chapter'){\n  const chapter=Math.max(0,Math.min(5,Number(e.data.chapter)||0));\n  if(chapter!==lastChapter){\n   lastChapter=chapter;\n   C.tempo=chapter>=4?1.5:1.95+chapter*.11;\n   C.camZoom=1+Math.min(.34,chapter*.085);\n   C.glow=Math.min(1.5,1.05+chapter*.06);\n  }\n }else if(e.data.action==='focus'){\n  C.rimBright=e.data.active?2.35:1.8;\n  C.webBright=e.data.active?1.35:.9;\n }else{hostPaused=Boolean(e.data.paused);reconcile();}\n});\nsetState();requestAnimationFrame(resizeIfNeeded);\n";
const html='<!doctype html>\n<!--\nHALOFLUX - Copyright (c) 2026 Ryder191 (RYDER CODE / Ms MAIKEBAIs CAT). All rights reserved.\nRequired Notice: Copyright (c) 2026 Ryder191 (RYDER CODE / Ms MAIKEBAIs CAT) - https://github.com/Ryder191/haloflux\nRequired Notice: Noncommercial use only. Any commercial use is strictly prohibited. No commercial licenses are offered.\nSource-derived visual stage, modified for Research-. Full licence preserved in LICENSE; unchanged original at /v3/haloflux/.\n-->\n'+
'<html lang="zh-Hant-TW" data-hfx-source-stage="HALOFLUX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
'<meta name="robots" content="noindex,nofollow"><link rel="license" href="LICENSE"><title>HALOFLUX by Ryder191 · Research- optical stage</title>'+
'<style>'+style+'</style></head><body><canvas id="stage" aria-hidden="true"></canvas><script>\n'+engine+'\n'+runtime+'\n</script></body></html>\n';
if(html.includes('drawAdv(dt)')||html.includes('initBGM')||html.includes('setInterval(feedPush')||!html.includes('drawStage(dt)'))
 throw Error('Stage extraction failed');
await mkdir(out,{recursive:true});
await copyFile(join(source,'LICENSE'),join(out,'LICENSE'));
await writeFile(join(out,'field.html'),html,'utf8');
console.log('Isolated original HALOFLUX stage '+Math.round(engine.length/1024)+'KB without panel / music / KPI work.');
