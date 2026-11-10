import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {VERTEX_SOURCE,FRAGMENT_SOURCE,THEMES,THEME_ORDER,QUALITY_TIERS} from '../src/experience/observatory/singularity-shader.js';

const root=resolve(process.cwd());
const renderer=readFileSync(resolve(root,'src/experience/observatory/singularity.js'),'utf8');
const scene=readFileSync(resolve(root,'src/experience/observatory/scene.js'),'utf8');

test('shader sources are WebGL2 GLSL ES 3.00, self-contained and need no texture or network',()=>{
  for(const [name,source] of [['vertex',VERTEX_SOURCE],['fragment',FRAGMENT_SOURCE]]){
    assert.ok(source.startsWith('#version 300 es'),name+' must be GLSL ES 3.00');
    assert.doesNotMatch(source,/https?:\/\//,name+' must not reference the network');
    assert.doesNotMatch(source,/\bsampler\w*\b|\btexture\w*\s*\(/,name+' must not sample textures');
  }
  assert.match(FRAGMENT_SOURCE,/precision highp float;/);
  assert.match(FRAGMENT_SOURCE,/out vec4 outColor;/);
});

test('every loop has a constant bound, as WebGL2 drivers require',()=>{
  const loops=[...FRAGMENT_SOURCE.matchAll(/for\s*\(([^)]*)\)/g)].map(m=>m[1]);
  assert.ok(loops.length>=4,'expected the fbm, sigil, voronoi and debris loops');
  for(const head of loops)assert.match(head,/<=?\s*-?\d+/,'unbounded loop: '+head);
});

test('the renderer sets exactly the uniforms the fragment shader declares',()=>{
  const declared=new Set([...FRAGMENT_SOURCE.matchAll(/uniform\s+\w+\s+(u\w+)\s*;/g)].map(m=>m[1]));
  const listed=renderer.match(/const UNIFORMS=\[([^\]]+)\]/)[1].split(',').map(x=>x.replace(/['"\s]/g,''));
  assert.deepEqual([...declared].sort(),[...listed].sort());
  for(const name of listed)assert.match(renderer,new RegExp('loc\\.'+name+'\\b'),name+' is never set');
});

test('theme data and the colours written into the shader agree',()=>{
  assert.deepEqual([...THEME_ORDER].sort(),Object.keys(THEMES).sort());
  assert.deepEqual(Object.values(THEMES).map(t=>t.id).sort(),[0,1,2]);
  const fn=FRAGMENT_SOURCE.slice(FRAGMENT_SOURCE.indexOf('vec3 stop('),FRAGMENT_SOURCE.indexOf('vec3 ramp('));
  const colours=[...fn.matchAll(/return vec3\(([^)]*)\)/g)].map(m=>m[1].split(',').map(Number));
  assert.equal(colours.length,15,'three themes with five stops');
  // Shader order: theme 1 (ember), theme 2 (nebula), then the default (aurum).
  const byId={1:colours.slice(0,5),2:colours.slice(5,10),0:colours.slice(10,15)};
  for(const theme of Object.values(THEMES)){
    assert.equal(theme.stops.length,5);
    assert.ok([0,1].includes(theme.floor));
    theme.stops.forEach((hex,i)=>{
      assert.match(hex,/^#[0-9a-f]{6}$/i);
      const rgb=[1,3,5].map(k=>parseInt(hex.slice(k,k+2),16)/255);
      rgb.forEach((v,c)=>assert.ok(Math.abs(v-byId[theme.id][i][c])<=.012,
        theme.label+' stop '+i+' channel '+c+': data '+v.toFixed(3)+' vs shader '+byId[theme.id][i][c]));
    });
  }
});

test('quality tiers stay within what the shader loops support and get cheaper downward',()=>{
  const tiers=['high','medium','low'].map(k=>QUALITY_TIERS[k]);
  for(const t of tiers){
    assert.ok(t.octaves>=3&&t.octaves<=5);
    assert.ok(t.debrisLayers>=1&&t.debrisLayers<=3);
    assert.ok(t.scale>0&&t.scale<=1);
  }
  assert.ok(tiers[0].octaves>=tiers[1].octaves&&tiers[1].octaves>=tiers[2].octaves);
  assert.ok(tiers[0].scale>=tiers[1].scale&&tiers[1].scale>=tiers[2].scale);
});

test('scene keeps the reliability behaviours: poster path, context loss, visibility, reduced motion, tier fallback',()=>{
  assert.match(scene,/params\.get\('poster'\)==='1'/);
  assert.match(scene,/webglcontextlost/);
  assert.match(scene,/webglcontextrestored/);
  assert.match(scene,/document\.addEventListener\('visibilitychange'/);
  assert.match(scene,/prefers-reduced-motion/);
  assert.match(scene,/applyTier\(/);
  assert.doesNotMatch(scene,/from\s+['"]three|import\(['"]three|GLTFLoader|\.glb/i,'the model pipeline is gone');
  // The shader module must stay a lazy import so the first screen does not pay for it.
  assert.match(scene,/await import\('\.\/singularity\.js'\)/);
  assert.doesNotMatch(scene,/^import /m);
});
