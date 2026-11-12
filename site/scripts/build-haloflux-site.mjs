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
replaceOne('const shouldRun = !document.hidden && !integrationMotion.matches;',
  'const shouldRun = !document.hidden && !integrationMotion.matches && !integrationHostPaused;','host motion gate');
replaceOne('data-src="https://raw.githubusercontent.com/Ryder191/haloflux/02174503d0f391b1bb2537b8cad75e8e5f9997f2/audio/sw421k.mp3"',
  'data-src=""','no background audio requests in decorative scene');
replaceOne('</body>',
  '<script>\n'+
  "addEventListener('message',function(e){\n"+
  "  if(e.origin!==location.origin||!e.data||e.data.type!=='research-hfx-stage')return;\n"+
  "  integrationHostPaused=Boolean(e.data.paused);\n"+
  "  syncIntegrationMotion();\n"+
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
