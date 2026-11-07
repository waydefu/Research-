import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import ongoing from '../P1-ONGOING-SOURCE-REVIEW.json' with {type:'json'};
import {allDocs} from '../src/lib/catalog.mjs';
import {REVIEWED_DOCUMENTS,TOPIC_DESCRIPTORS} from '../src/lib/research-taxonomy.mjs';
import {EDITORIAL_LEADS} from '../src/lib/research-leads.mjs';
import {reviewForSource} from '../src/lib/source-review.mjs';
import {visualForDoc,renderResearchArt} from '../src/lib/research-visuals.mjs';

const FILE='research/2026-11-universal-web-engine/39-infinitra-mathematical-world-volumetric-generation.md';

test('INFINITRA has exactly one readable public study and bounded author links',()=>{
  const matches=allDocs().filter(d=>d.file===FILE);
  assert.equal(matches.length,1);
  const doc=matches[0];
  assert.equal(doc.topic,'程序生成與世界架構');
  assert.equal(doc.topic,REVIEWED_DOCUMENTS[FILE].topic);
  assert.equal(doc.publicTitle,REVIEWED_DOCUMENTS[FILE].publicTitle);
  assert.ok(TOPIC_DESCRIPTORS[doc.topic]);
  assert.equal(doc.summary,EDITORIAL_LEADS[FILE]);
  assert.ok(doc.summary.length>=60 && doc.summary.length<=160,FILE);
  assert.equal(doc.summaryFactChecked,false);
  assert.equal(doc.creator.url,'https://github.com/richardbogad/INFINITRA');
  assert.ok(doc.demos.some(d=>d.url==='https://github.com/richardbogad/INFINITRA/releases'));
  assert.ok(doc.demos.every(d=>/未|不是/.test(d.note)));
  assert.match(doc.text,/十兆公里/);
  assert.match(doc.text,/決定性/);
  assert.match(doc.text,/LOD/);
});

test('INFINITRA study preserves the proprietary DLL caveat and no untested benchmark claims',()=>{
  const doc=allDocs().find(d=>d.file===FILE);
  assert.match(doc.text,/Infinitra\.Client\.dll/);
  assert.match(doc.text,/Infinitra\.Shared\.dll/);
  assert.match(doc.text,/LICENSE\.md/);
  assert.match(doc.text,/MIT/);
  assert.match(doc.text,/EULA/);
  assert.match(doc.text,/SDF/);
  assert.match(doc.text,/不能擅稱/);
  assert.match(doc.text,/未.*實測|未.*測量|未獨立確認/);
  assert.match(doc.text,/NOT RUN/);
  assert.doesNotMatch(doc.summary,/Research-|THE OBSERVATORY|本專案|本站|\bV[23]\b/);
});

test('source SHA is immutable and review remains clearly marked NOT RUN',()=>{
  const rows=ongoing.items.filter(x=>x.path===FILE);
  assert.equal(rows.length,1);
  const row=rows[0];
  const doc=allDocs().find(d=>d.file===FILE);
  const source=readFileSync(resolve(process.cwd(),'..',FILE));
  const blob=createHash('sha1')
    .update(Buffer.from('blob '+source.byteLength+'\0'))
    .update(source).digest('hex');
  assert.equal(row.sourceBlobSha,blob);
  assert.equal(row.sourceRevision,doc.sha);
  assert.equal(row.reviewedOn,'2026-11-07');
  assert.equal(row.externallyVerifiedAllClaims,false);
  assert.equal(row.benchmarkStatus,'NOT_RUN');
  const review=reviewForSource(FILE);
  assert.ok(review);
  assert.equal(review.externallyVerifiedAllClaims,false);
  assert.ok(review.evidenceUrls.some(url=>url.endsWith('/LICENSE.md')));
});

test('INFINITRA has an original distinct world-generation schematic',()=>{
  const doc=allDocs().find(d=>d.file===FILE);
  const visual=visualForDoc(doc);
  assert.equal(visual.motif,'world');
  assert.equal(visual.kind,'original-diagram');
  assert.equal(visual.originalWork,false);
  assert.match(visual.alt,/非原作者作品截圖/);
  const svg=renderResearchArt(doc);
  assert.match(svg,/data-motif="world"/);
  assert.ok(svg.length<16000,FILE);
  assert.doesNotMatch(svg,/<(?:script|image|foreignObject)|(?:onload|onclick)\s*=/i);
});
