import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import ongoing from '../P1-ONGOING-SOURCE-REVIEW.json' with {type:'json'};
import {allDocs} from '../src/lib/catalog.mjs';
import {REVIEWED_DOCUMENTS} from '../src/lib/research-taxonomy.mjs';
import {EDITORIAL_LEADS} from '../src/lib/research-leads.mjs';
import {reviewForSource} from '../src/lib/source-review.mjs';
import {visualForDoc,renderResearchArt} from '../src/lib/research-visuals.mjs';

const FILE='research/2026-11-universal-web-engine/42-ten-cloud-genera-procedural-algorithms-and-rendering.md';

test('ten cloud genera have one source-backed Chinese public research entry',()=>{
  const results=allDocs().filter(d=>d.file===FILE);
  assert.equal(results.length,1);
  const doc=results[0];
  assert.equal(doc.topic,'即時 3D 渲染與 Shader');
  assert.equal(doc.publicTitle,REVIEWED_DOCUMENTS[FILE]?.publicTitle);
  assert.equal(doc.summary,EDITORIAL_LEADS[FILE]);
  assert.ok([...doc.summary].length>=60 && [...doc.summary].length<=160);
  assert.equal(doc.summaryFactChecked,false);
  assert.equal(doc.creator,null); // Multi-source study; no fake single-author attribution.
  assert.ok(doc.demos.some(d=>d.url==='https://github.com/takustaqu/atmosphere'));
  assert.ok(doc.demos.some(d=>d.url==='https://threejs.org/examples/webgpu_volume_cloud.html'));
  assert.ok(doc.demos.every(d=>d.note.length>15));
  assert.doesNotMatch(doc.summary,/Research-|Pixel-Games|THE OBSERVATORY|本站|本專案|Owner|\bV[23]\b/);
});

test('all WMO genera, four morphology forms and physics limits are explicit',()=>{
  const text=allDocs().find(d=>d.file===FILE).text;
  for(const id of ['Ci','Cc','Cs','Ac','As','Ns','Sc','St','Cu','Cb'])
    assert.match(text,new RegExp('\\b'+id+'\\b'),id);
  for(const name of ['卷雲','卷積雲','卷層雲','高積雲','高層雲','雨層雲','層積雲','層雲','積雲','積雨雲'])
    assert.ok(text.includes(name),name);
  for(const family of ['Filament','Granular','Stratiform','Convective'])
    assert.ok(text.toLowerCase().includes(family.toLowerCase()),family);
  assert.match(text,/WebGL1/);
  assert.match(text,/Raymarch/);
  assert.match(text,/Perlin-Worley/);
  assert.match(text,/Cloud Map/);
  assert.match(text,/Cloud LUT/);
  assert.match(text,/Beer/);
  assert.match(text,/三維|3D/);
  assert.match(text,/未實測/);
  assert.match(text,/NOT RUN/);
  assert.match(text,/MIT/);
});

test('immutable cloud-research provenance and evidence level match actual markdown',()=>{
  const rows=ongoing.items.filter(e=>e.path===FILE);
  assert.equal(rows.length,1);
  const row=rows[0];
  const buffer=readFileSync(resolve(process.cwd(),'..',FILE));
  const gitBlob=createHash('sha1').update(Buffer.from('blob '+buffer.byteLength+'\0')).update(buffer).digest('hex');
  assert.equal(row.sourceBlobSha,gitBlob);
  assert.equal(row.sourceRevision,allDocs().find(d=>d.file===FILE).sha);
  assert.equal(row.reviewedOn,'2026-11-08');
  assert.equal(row.benchmarkStatus,'NOT_RUN');
  assert.equal(row.externallyVerifiedAllClaims,false);
  assert.ok(row.knownSources.includes('https://cloudatlas.wmo.int/en/principles-of-cloud-classification-genera.html'));
  assert.ok(row.knownSources.includes('https://github.com/takustaqu/atmosphere'));
  const review=reviewForSource(FILE);
  assert.ok(review);
  assert.equal(review.externallyVerifiedAllClaims,false);
});

test('unique original cloud taxonomy art exists and has no embedded external assets',()=>{
  const doc=allDocs().find(d=>d.file===FILE);
  const v=visualForDoc(doc);
  assert.equal(v.motif,'genera');
  assert.equal(v.originalWork,false);
  assert.equal(v.kind,'original-diagram');
  assert.match(v.alt,/非原作者作品截圖/);
  const art=renderResearchArt(doc);
  assert.match(art,/data-motif="genera"/);
  assert.ok(art.length<16000);
  assert.doesNotMatch(art,/<(?:script|image|foreignObject)|(?:onload|onclick)\s*=/i);
});
