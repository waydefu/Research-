import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import ongoing from '../P1-ONGOING-SOURCE-REVIEW.json' with {type:'json'};
import {allDocs} from '../src/lib/catalog.mjs';
import {REVIEWED_DOCUMENTS} from '../src/lib/research-taxonomy.mjs';
import {EDITORIAL_LEADS} from '../src/lib/research-leads.mjs';
import {visualForDoc,renderResearchArt} from '../src/lib/research-visuals.mjs';
import {reviewForSource} from '../src/lib/source-review.mjs';

const paths=[
  "research/2026-11-universal-web-engine/43-webgl2-rendering-performance-visibility-and-benchmark-protocol.md",
  "research/2026-11-universal-web-engine/44-seamless-world-streaming-lod-hlod-resource-lifecycle.md"
];
test('new rendering + streaming research are fully registered with original artwork',()=>{
  const docs=allDocs();
  for(const path of paths){
    const doc=docs.find(d=>d.file===path);
    assert.ok(doc,'source catalog must include '+path);
    assert.equal(REVIEWED_DOCUMENTS[path].topic,'即時 3D 渲染與 Shader');
    assert.ok(EDITORIAL_LEADS[path]?.length>=60&&EDITORIAL_LEADS[path]?.length<=160,path);
    assert.ok(doc.summaryReviewed);
    const visual=visualForDoc(doc);
    assert.ok(visual.src?.endsWith('.svg'));
    assert.equal(visual.kind,'original-diagram');
    const svg=renderResearchArt(doc);
    assert.match(svg,/Research- 原創研究示意圖/);
    assert.doesNotMatch(svg,/<(?:script|image|foreignObject)|onload\s*=/i);
  }
});
test('sources are additive, pinned to their actual Git blobs and preserve the NOT_RUN boundary',()=>{
  assert.equal(new Set(ongoing.items.map(x=>x.path)).size,ongoing.items.length);
  for(const path of paths){
    const record=ongoing.items.find(row=>row.path===path);
    assert.ok(record,path);
    const raw=readFileSync(resolve(process.cwd(),'..',path));
    const digest=createHash('sha1').update(Buffer.from('blob '+raw.byteLength+'\0')).update(raw).digest('hex');
    assert.equal(record.sourceBlobSha,digest,path);
    assert.match(record.sourceRevision,/^[0-9a-f]{40}$/);
    assert.equal(record.benchmarkStatus,'NOT_RUN');
    assert.equal(record.externallyVerifiedAllClaims,false);
    assert.ok(record.knownSources.length>=3);
    assert.ok(reviewForSource(path));
  }
});
