// A real HALOFLUX Canvas scene is the shared live stage for ALL site routes.
// Derive the isolated viewport from the already integrated source, not from a
// screenshot, SVG imitation or an unrelated procedural ring implementation.
// The faithful /v3/haloflux/ original is never modified.
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';

const from=resolve('dist/haloflux-research');
const out=resolve('dist/haloflux-site');
let html=await readFile(join(from,'lab.html'),'utf8');
const replaceOne=(needle,replacement,name)=>{
  const count=html.split(needle).length-1;
  if(count!==1)throw Error('HALOFLUX ambient source seam: '+name+' / '+count);
  html=html.replace(needle,replacement);
};
const css=[
  ':root{color-scheme:dark}',
  'html,body{width:100%!important;height:100%!important;overflow:hidden!important;background:#08090b!important}',
  '.app{width:100%!important;height:100svh!important;min-height:100svh!important;display:block!important;overflow:hidden!important}',
  '.app>header,.app>.panels{display:none!important}',
  '#stageWrap,.stage{position:relative!important;width:100%!important;height:100svh!important;min-height:100svh!important;overflow:hidden!important}',
  '#stage{position:absolute!important;inset:0!important;width:100%!important;height:100%!important}',
  '#stageWrap>.ov,.research-explore,.research-visible-credit{display:none!important}',
  '.stage::after{opacity:.33;pointer-events:none}',
  '@media(max-width:600px){.stage::after{opacity:.16}}'
].join('\n');
replaceOne('</head>','<style id="hfx-source-stage">\n'+css+'\n</style>\n</head>','style');
replaceOne('const integrationMotion = matchMedia(\'(prefers-reduced-motion: reduce)\');',
  "const integrationMotion = matchMedia('(prefers-reduced-motion: reduce)');\nlet integrationHostPaused = false;",'host control');
replaceOne('cx = W * 0.07; cy = H * 0.5;',
  'cx = W * 0.64; cy = H * 0.48;','ambient lightfield composition');
replaceOne('const C = { ...(PRESETS.MINE || PRESETS.B) };',
  "for(const p of Object.values(PRESETS)){ p.runnerCount=Math.min(p.runnerCount,innerWidth<780?140:390); p.flyerCount=Math.min(p.flyerCount,innerWidth<780?0.65:1.5); p.bokeh=Math.min(p.bokeh,innerWidth<780?0:4); }\nconst C = { ...(PRESETS.MINE || PRESETS.B) };",
  'adaptive optical density');
replaceOne("const LS_KEY = 'research.haloflux.lab.cfg.v1';",
  "const LS_KEY = 'research.haloflux.ambient.cfg.v1';",'ambient prefs');
html=html.replaceAll('Math.min(window.devicePixelRatio || 1, 2)','Math.min(window.devicePixelRatio || 1, innerWidth<780?1.25:1.75)');
// The field runs behind a semantic document. Unlike the full interactive
// demo, 60/120Hz paint is not a useful budget for a decorative layer.
replaceOne('let integrationHostPaused = false;',
  'let integrationHostPaused = false;\nlet ambientLastPaint = 0;',
  'ambient paint clock');
replaceOne('if (ready) origFrame(now); else { last = now; integrationRaf = requestAnimationFrame(frame); }',
  'if (ready) { if (now - ambientLastPaint >= (innerWidth<780 ? 44 : 30)) { ambientLastPaint = now; origFrame(now); } else integrationRaf = requestAnimationFrame(frame); } else { last = now; integrationRaf = requestAnimationFrame(frame); }',
  'ambient frame cap');
replaceOne('const shouldRun = !document.hidden && !integrationMotion.matches;',
  'const shouldRun = !document.hidden && !integrationMotion.matches && !integrationHostPaused;','host motion gate');
replaceOne('data-src="https://raw.githubusercontent.com/Ryder191/haloflux/02174503d0f391b1bb2537b8cad75e8e5f9997f2/audio/sw421k.mp3"',
  'data-src=""','no background audio requests in decorative scene');
replaceOne('</body>',
  '<script>\n'+
  "addEventListener('message',function(e){\n"+
  "  if(e.origin!==location.origin||!e.data||e.data.type!=='research-hfx-stage')return;\n"+
  "  if(e.data.action==='chapter'){\n"+
  "    const chapter=Math.max(0,Math.min(5,Number(e.data.chapter)||0));\n"+
  "    C.tempo=chapter>=4?1.5:1.95+chapter*.11;\n"+
  "    C.camZoom=1+Math.min(.34,chapter*.085);\n"+
  "    C.glow=Math.min(1.5,1.05+chapter*.06);\n"+
  "  } else if(e.data.action==='focus'){\n"+
  "    C.rimBright=e.data.active?2.35:1.8;\n"+
  "    C.webBright=e.data.active?1.35:.9;\n"+
  "  } else { integrationHostPaused=Boolean(e.data.paused); syncIntegrationMotion(); }\n"+
  "});\n"+
  "document.documentElement.dataset.hfxSourceStage='HALOFLUX';\n"+
  '</script>\n</body>','message bridge');
replaceOne('<html lang="en">','<html lang="zh-Hant-TW" data-hfx-ambient="source">','language');
if(!html.includes('HALOFLUX by Ryder191')||!html.includes('noindex,nofollow')||!html.includes('drawStage(dt)'))
  throw Error('Source license, indexing or original Canvas drawing missing');
await mkdir(out,{recursive:true});
await copyFile(join(from,'LICENSE'),join(out,'LICENSE'));
await writeFile(join(out,'field.html'),html,'utf8');
console.log('Full-site HALOFLUX field: direct generated Canvas engine, controls hidden only visually; no audio.');
