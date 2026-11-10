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

const path='research/2026-11-agent-repository-operations/12-starwire-external-project-discovery.md';

test('Starwire discovery research is curated as a bounded public source, not an ingestion feature',()=>{
  const doc=allDocs().find(d=>d.file===path);
  assert.ok(doc,'missing original Starwire research');
  assert.ok(REVIEWED_DOCUMENTS[path],'missing taxonomy registration');
  assert.equal(REVIEWED_DOCUMENTS[path].topic,'程式碼搜尋與索引');
  assert.match(doc.publicTitle,/Starwire/);
  assert.ok(EDITORIAL_LEADS[path]?.length>=60&&EDITORIAL_LEADS[path]?.length<=160);
  assert.equal(doc.summaryReviewed,true);
  assert.equal(doc.summaryFactChecked,false);
  const visual=visualForDoc(doc);
  assert.match(visual.src,/research-[0-9a-f]{8}\.svg$/);
  assert.equal(visual.kind,'original-diagram');
  assert.equal(visual.originalWork,false);
  const svg=renderResearchArt(doc);
  assert.match(svg,/Research- 原創研究示意圖/);
  assert.doesNotMatch(svg,/<(?:script|image|foreignObject)|onload\s*=/i);
  assert.match(doc.text,/不把全量清單複製到其他資料庫/);
  assert.match(doc.text,/未執行.*資料匯入/);
  assert.match(doc.text,/尚待|未量測|未驗證|未執行/);
});

test('Starwire intake has source revision and actual immutable Git blob SHA',()=>{
  const items=ongoing.items.filter(row=>row.path===path);
  assert.equal(items.length,1,'Starwire must have one additive source review');
  const row=items[0];
  assert.match(row.sourceRevision,/^[0-9a-f]{40}$/);
  assert.match(row.sourceBlobSha,/^[0-9a-f]{40}$/);
  const raw=readFileSync(resolve(process.cwd(),'..',path));
  const actual=createHash('sha1').update(Buffer.from('blob '+raw.byteLength+'\0')).update(raw).digest('hex');
  assert.equal(row.sourceBlobSha,actual);
  assert.equal(row.externallyVerifiedAllClaims,false);
  assert.equal(row.benchmarkStatus,'NOT_RUN');
  assert.ok(row.knownSources.includes('https://github.com/boffti/starwire/blob/main/docs/how.html'));
  assert.ok(row.knownSources.includes('https://github.com/boffti/starwire/blob/main/LICENSE'));
  assert.ok(reviewForSource(path));
});
