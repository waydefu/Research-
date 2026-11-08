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

const entries=[
  {
    file:'research/2026-11-universal-web-engine/40-volumetric-clouds-unified-wind-vegetation-weather.md',
    topic:'即時 3D 渲染與 Shader',motif:'weather',
    demo:'https://skyeshark.github.io/Eanpa-Sky/',
    source:'https://github.com/takram-design-engineering/three-geospatial',
    claims:[/WebGL2/,/WebGPU/,/雲影/,/風場/,/NOT RUN/]
  },
  {
    file:'research/2026-11-universal-web-engine/41-web-audio-spatial-coastal-soundscape-and-asset-rights.md',
    topic:'音訊技術與空間聲景',motif:'soundscape',
    demo:'https://opengameart.org/content/beach-ocean-waves',
    source:'https://sonniss.com/gdc-bundle-license/',
    claims:[/AudioContext/,/HRTF/,/海鷗/,/CC0/,/Sonniss/,/NOT RUN/]
  }
];

test('two research studies are indexed, translated and have grounded external examples',()=>{
  const docs=allDocs();
  const arts=new Set();
  for(const e of entries){
    const matches=docs.filter(d=>d.file===e.file);
    assert.equal(matches.length,1,e.file);
    const doc=matches[0];
    assert.equal(doc.topic,e.topic);
    assert.equal(REVIEWED_DOCUMENTS[e.file]?.topic,e.topic);
    assert.equal(doc.publicTitle,REVIEWED_DOCUMENTS[e.file]?.publicTitle);
    assert.equal(doc.summary,EDITORIAL_LEADS[e.file]);
    assert.ok([...doc.summary].length>=60&&[...doc.summary].length<=160,e.file);
    assert.ok(TOPIC_DESCRIPTORS[e.topic],e.topic);
    assert.equal(doc.summaryFactChecked,false);
    assert.equal(doc.creator,null); // Multi-source research, not a single creator's work.
    assert.ok(doc.demos.some(d=>d.url===e.demo),e.file);
    assert.ok(doc.demos.every(d=>d.note?.length>15),e.file);
    for(const claim of e.claims)assert.match(doc.text,claim);
    const v=visualForDoc(doc);
    assert.equal(v.motif,e.motif,e.file);
    assert.equal(v.originalWork,false);
    assert.equal(v.kind,'original-diagram');
    assert.match(v.alt,/非原作者作品截圖/);
    assert.ok(!arts.has(v.src),e.file);
    arts.add(v.src);
    const svg=renderResearchArt(doc);
    assert.match(svg,new RegExp('data-motif="'+e.motif+'"'));
    assert.ok(svg.length<16000,e.file);
    assert.doesNotMatch(svg,/<(?:script|image|foreignObject)|(?:onload|onclick)\s*=/i);
  }
});

test('two pinned Git blobs and source revisions match actual research documents',()=>{
  for(const e of entries){
    const found=ongoing.items.filter(row=>row.path===e.file);
    assert.equal(found.length,1,e.file);
    const entry=found[0];
    const source=readFileSync(resolve(process.cwd(),'..',e.file));
    const blob=createHash('sha1').update(Buffer.from('blob '+source.byteLength+'\0')).update(source).digest('hex');
    const doc=allDocs().find(d=>d.file===e.file);
    assert.equal(entry.sourceBlobSha,blob,e.file);
    assert.equal(entry.sourceRevision,doc.sha,e.file);
    assert.equal(entry.reviewedOn,'2026-11-08');
    assert.equal(entry.externallyVerifiedAllClaims,false);
    assert.equal(entry.benchmarkStatus,'NOT_RUN');
    assert.ok(entry.knownSources.every(s=>s.startsWith('https://')));
    const review=reviewForSource(e.file);
    assert.ok(review);
    assert.equal(review.externallyVerifiedAllClaims,false);
    assert.ok(review.evidenceUrls.some(s=>s.startsWith(e.source)));
  }
});

test('sound asset rights remain distinct from product distribution and cloud performance claims',()=>{
  const docs=allDocs();
  const clouds=docs.find(d=>d.file===entries[0].file).text;
  const sound=docs.find(d=>d.file===entries[1].file).text;
  assert.match(clouds,/不相容/);
  assert.match(clouds,/未.*實測|尚未.*測/);
  assert.match(sound,/禁止.*訓練|禁止 AI/);
  assert.match(sound,/素材包.*散布|裸音檔/);
  assert.match(sound,/授權鏈未獨立確認/);
  for(const e of entries)assert.doesNotMatch(EDITORIAL_LEADS[e.file],/Research-|Pixel-Games|本專案|本站|\bV[23]\b/);
});
