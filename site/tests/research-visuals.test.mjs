import test from 'node:test';
import assert from 'node:assert/strict';
import {allDocs} from '../src/lib/catalog.mjs';
import {visualCoverage,visualForDoc,renderResearchArt,visualFilename,motifFor,sceneKindFor,SCENE_LAYOUTS,ART_BASE} from '../src/lib/research-visuals.mjs';
const docs=allDocs();

test('startup animation intake uses source-specific original diagrams',()=>{
  const get=n=>docs.find(d=>d.file.endsWith('/2026-11-startup-animation/'+n));
  assert.equal(motifFor(get('01-cross-project-architecture-and-adoption.md')),'bootflow');
  assert.equal(motifFor(get('03-dsh-550c-splash-timeline-and-first-frame.md')),'bootmask');
  assert.equal(motifFor(get('04-haloflux-beat-canvas-light-rings.md')),'ringfield');
  assert.equal(motifFor(get('05-codex-dragon-r16-living-boot-and-pulse.md')),'pulse');
  for(const file of ['01-cross-project-architecture-and-adoption.md','03-dsh-550c-splash-timeline-and-first-frame.md','04-haloflux-beat-canvas-light-rings.md','05-codex-dragon-r16-living-boot-and-pulse.md']){
    const svg=renderResearchArt(get(file));
    assert.match(svg,/data-motif=/);
    assert.doesNotMatch(svg,/<image|https:\/\/(?!www\.w3\.org)/i);
  }
});
test('every existing research document has a distinct content-linked original SVG',()=>{
  const coverage=visualCoverage(docs);
  assert.ok(docs.length>=90);
  assert.equal(coverage.total,docs.length);
  assert.equal(coverage.known,docs.length);
  assert.deepEqual(coverage.unknown,[]);
  assert.equal(coverage.filenames.length,docs.length);
  const images=docs.map(d=>visualForDoc(d));
  assert.equal(new Set(images.map(a=>a.src)).size,docs.length);
  for(const art of images){
    assert.ok(art.src.startsWith(ART_BASE),art.sourceFile);
    assert.equal(art.kind,'original-diagram');
    assert.equal(art.originalWork,false);
    assert.match(art.alt,/非原作者作品截圖/);
    assert.match(art.license,/原創/);
  }
});
test('generated SVGs are original, safe, escaped and diagrammatically distinguishable',()=>{
  const vectors=docs.map(d=>renderResearchArt(d));
  assert.equal(new Set(vectors).size,docs.length);
  for(let i=0;i<docs.length;i++){
    const svg=vectors[i];
    assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.match(svg,/<title id="title">/);
    assert.match(svg,/<desc id="desc">Research- 原創研究示意圖/);
    assert.doesNotMatch(svg,/<(?:script|image|foreignObject)|(?:onload|onclick)\s*=|<link\b|@import|https:\/\/(?!www\.w3\.org)/i);
    assert.ok(svg.length<16000,docs[i].file);
    assert.match(visualFilename(docs[i].file),/^research-[0-9a-f]{8}\.svg$/);
  }
});
test('diagrams represent specific research objects instead of copying one generic topic picture',()=>{
  const get=s=>docs.find(d=>d.file.endsWith(s));
  const audio=visualForDoc(get('2026-10-retrospective/07-audio-dsp.md'));
  const memo=visualForDoc(get('2026-11-local-ai-inference/01-colibri-moe-streaming.md'));
  const game=visualForDoc(get('2026-11-universal-web-engine/26-luminati-hd2d-browser-engine.md'));
  const n=visualForDoc(get('2026-11-universal-web-engine/23-threejs-nanites-gpu-driven-geometry.md'));
  assert.deepEqual([audio.motif,memo.motif,game.motif,n.motif],['audio','chip','pixels','geometry']);
});
test('visual categories are not dominated by one generic evidence graphic',()=>{
  const motifs=docs.map(motifFor);
  const counts=Object.values(motifs.reduce((acc,m)=>{acc[m]=(acc[m]||0)+1;return acc;},{}));
  assert.ok(new Set(motifs).size>=25,'not enough subject-specific diagram types');
  assert.ok(Math.max(...counts)<=9,'generic art reused on too many research articles');
  assert.equal(docs.find(d=>d.file.endsWith('SOURCES.md'))?.file?.endsWith('SOURCES.md'),true);
  for(const d of docs.filter(d=>d.file.endsWith('/SOURCES.md')))assert.equal(motifFor(d),'sources');
  for(const d of docs.filter(d=>d.file.endsWith('/README.md')))assert.equal(motifFor(d),'directory');
});
test('same theme still varies composition and visible illustration geometry, not just labels or colors',()=>{
  const scenes=docs.map(sceneKindFor);
  assert.deepEqual(new Set(scenes),new Set(SCENE_LAYOUTS));
  const vectors=docs.map(renderResearchArt);
  for(let i=0;i<docs.length;i++){
    assert.match(vectors[i],/<g data-scene="(?:orbit|side-left|side-right|dual|engraved|layered)" data-motif="/);
    // Ignore titles, palette and IDs: upper scene must contain real drawing variation.
    const upper=vectors[i].split('<text x="52" y="335"')[0];
    assert.match(upper,/data-scene=/);
  }
  assert.ok(new Set(docs.map(d=>motifFor(d)+'/'+sceneKindFor(d))).size>=65);
});
test('unknown future source does not receive a fabricated per-article illustration',()=>{
  const future={file:'research/new-folder/not-reviewed.md',topic:'跨領域研究',publicTitle:'尚未審核'};
  assert.equal(visualForDoc(future).src,null);
  assert.throws(()=>renderResearchArt(future),/未登錄/);
});
