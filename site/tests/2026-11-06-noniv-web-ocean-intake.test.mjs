import test from 'node:test';
import assert from 'node:assert/strict';
import {allDocs} from '../src/lib/catalog.mjs';
import {REVIEWED_DOCUMENTS} from '../src/lib/research-taxonomy.mjs';
import {EDITORIAL_LEADS} from '../src/lib/research-leads.mjs';
import {reviewForSource} from '../src/lib/source-review.mjs';
import {visualForDoc,renderResearchArt} from '../src/lib/research-visuals.mjs';
import ongoing from '../P1-ONGOING-SOURCE-REVIEW.json' with {type:'json'};

const FILE='research/2026-11-universal-web-engine/38-noniv-webgpu-fft-ocean-renderer.md';

test('Web Ocean source is indexed once with accurate Chinese labels, creator and demo',()=>{
  const matches=allDocs().filter(doc=>doc.file===FILE);
  assert.equal(matches.length,1);
  const doc=matches[0];
  assert.equal(doc.publicTitle,REVIEWED_DOCUMENTS[FILE].publicTitle);
  assert.equal(doc.topic,'即時 3D 渲染與 Shader');
  assert.equal(doc.summary,EDITORIAL_LEADS[FILE]);
  assert.ok(doc.summary.length>=60 && doc.summary.length<=160);
  assert.equal(doc.summaryFactChecked,false);
  assert.match(doc.creator.url,/^https:\/\/github\.com\/Noniv\/web-ocean$/);
  assert.equal(doc.demos.length,1);
  assert.equal(doc.demos[0].url,'https://ocean-noniv.vercel.app/');
  assert.match(doc.demos[0].note,/未實機|未核准/);
});

test('six active cascades, known stale comments and missing benchmarks remain explicit',()=>{
  const doc=allDocs().find(d=>d.file===FILE);
  assert.match(doc.text,/CASCADES=6/);
  assert.match(doc.text,/4.*5|4／5/);
  assert.match(doc.text,/JONSWAP/);
  assert.match(doc.text,/CDLOD/);
  assert.match(doc.text,/LEAN/);
  assert.match(doc.text,/NOT RUN/);
  const review=reviewForSource(FILE);
  const raw=ongoing.items.find(row=>row.path===FILE);
  assert.ok(review && raw);
  assert.equal(raw.sourceBlobSha,doc.sha);
  assert.equal(raw.benchmarkStatus,'NOT_RUN');
  assert.equal(raw.externallyVerifiedAllClaims,false);
  assert.equal(review.externallyVerifiedAllClaims,false);
  assert.equal(review.evidenceUrls.includes('https://ocean-noniv.vercel.app/'),true);
});

test('Web Ocean uses original compact ocean illustration, not a screenshot',()=>{
  const doc=allDocs().find(d=>d.file===FILE);
  const visual=visualForDoc(doc);
  assert.equal(visual.motif,'ocean');
  assert.equal(visual.kind,'original-diagram');
  assert.equal(visual.originalWork,false);
  assert.match(visual.alt,/非原作者作品截圖/);
  const svg=renderResearchArt(doc);
  assert.match(svg,/data-motif="ocean"/);
  assert.ok(svg.length<16000);
  assert.doesNotMatch(svg,/<(?:script|image|foreignObject)|(?:onload|onclick)\s*=/i);
});
