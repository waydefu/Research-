import ongoing from '../P1-ONGOING-SOURCE-REVIEW.json' with {type:'json'};
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import {allDocs} from '../src/lib/catalog.mjs';
import {PUBLIC_ARTICLES} from '../src/lib/public-articles.mjs';
import {reviewForSource,REVIEW_COUNT} from '../src/lib/source-review.mjs';

test('every non-curated source has one explicit bounded review overlay',()=>{
  const docs=allDocs();
  const sourcePaths=new Set(docs.map(d=>d.file));
  const unpublished=docs.filter(d=>!PUBLIC_ARTICLES[d.file]);
  assert.equal(REVIEW_COUNT,unpublished.length,
    'new sources require separate source-review evidence rather than silently appearing as verified');
  assert.deepEqual(unpublished.filter(d=>!reviewForSource(d.file)).map(d=>d.file),[]);
  assert.equal(new Set(unpublished.map(d=>d.file)).size,unpublished.length);
  for(const doc of unpublished){
    const row=reviewForSource(doc.file);
    assert.ok(sourcePaths.has(row.path));
    assert.match(row.dispositionReviewedOn,/^\d{4}-\d{2}-\d{2}$/);
    assert.ok(row.publicNotice.length>25);
    assert.ok(row.dispositionReason.length>20);
    assert.ok(row.adoptionGate.length>20);
    assert.equal(row.externallyVerifiedAllClaims,false,doc.file);
    assert.ok(Array.isArray(row.evidenceUrls),doc.file);
    assert.ok(Array.isArray(row.additionalEvidenceUrls),doc.file);
    assert.ok([...row.evidenceUrls,...row.additionalEvidenceUrls].every(url=>url.startsWith('https://')));
  }
});

test('Three.js r187 scoped reviews are actually visible to public article renderer',()=>{
  for(const end of [
    '/27-threejs-r187-ultra-rendering-ceiling.md',
    '/28-advanced-shader-pipeline-and-hd2d-recipes.md',
    '/29-rendering-ceiling-benchmark-and-adoption-gates.md'
  ]){
    const file=allDocs().find(d=>d.file.endsWith(end))?.file;
    assert.ok(file,'source missing: '+end);
    const row=reviewForSource(file);
    assert.ok(row);
    assert.equal(row.benchmarkStatus,'NOT_RUN');
    assert.match(row.adoptionGate,/真機|GPU/);
    assert.match(row.publicNotice,/並未逐項獨立驗證/);
    assert.equal(row.evidenceUrls.length>=2,true);
  }
  assert.equal(reviewForSource('research/unknown.md'),null);
});

test('new source review registry is additive and SHA-pinned without modifying historic reviews',()=>{
  assert.equal(ongoing.schemaVersion,1);
  assert.ok(Array.isArray(ongoing.items));
  const files=new Set(allDocs().map(doc=>doc.file));
  for(const row of ongoing.items){
    assert.ok(files.has(row.path),row.path);
    assert.match(row.sourceRevision,/^[0-9a-f]{40}$/);
    const raw=readFileSync(resolve(process.cwd(),'..',row.path));
    const hash=createHash('sha1').update(Buffer.from('blob '+raw.byteLength+'\\0')).update(raw).digest('hex');
    assert.equal(row.sourceBlobSha,hash,row.path);
    assert.equal(row.externallyVerifiedAllClaims,true,false);
    assert.ok(reviewForSource(row.path));
  }
});
