import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import ongoing from '../P1-ONGOING-SOURCE-REVIEW.json' with {type:'json'};
import {allDocs,displayDomain} from '../src/lib/catalog.mjs';
import {exhibitFor} from '../src/lib/exhibit-info.mjs';
import {REVIEWED_DOCUMENTS,TOPIC_DESCRIPTORS} from '../src/lib/research-taxonomy.mjs';
import {EDITORIAL_LEADS} from '../src/lib/research-leads.mjs';
import {reviewForSource} from '../src/lib/source-review.mjs';
import {visualForDoc,renderResearchArt} from '../src/lib/research-visuals.mjs';

const cases=[
  {
    path:'research/2026-11-agent-engineering/10-agents-anywhere-cross-device-agent-workbench.md',
    topic:'Agent 遠端工作台',motif:'remote',
    creator:'https://github.com/anywhere-labs/Agents-Anywhere',
    demo:'https://web.agents-anywhere.com',
    required:/2\.1\.0/,risk:/中國大陸/,
  },
  {
    path:'research/2026-11-edge-infrastructure/01-android-phone-termux-proot-home-server.md',
    topic:'邊緣設備與自架服務',motif:'edge',creator:null,
    demo:'https://github.com/termux/proot-distro',
    required:/PRoot/,risk:/未.*測量|未核實|未.*驗證/
  }
];

test('both source-backed studies appear with public curation and dedicated art',()=>{
  const docs=allDocs();
  const used=new Set();
  for(const row of cases){
    const matches=docs.filter(doc=>doc.file===row.path);
    assert.equal(matches.length,1,row.path);
    const doc=matches[0];
    assert.equal(REVIEWED_DOCUMENTS[row.path]?.topic,row.topic);
    assert.equal(doc.topic,row.topic);
    assert.ok(TOPIC_DESCRIPTORS[row.topic]);
    assert.equal(doc.publicTitle,REVIEWED_DOCUMENTS[row.path].publicTitle);
    assert.equal(doc.summary,EDITORIAL_LEADS[row.path]);
    assert.ok([...doc.summary].length>=60 && [...doc.summary].length<=160,row.path);
    assert.equal(doc.summaryReviewed,true);
    assert.equal(doc.summaryFactChecked,false);
    assert.equal(doc.creator?.url||null,row.creator);
    assert.ok(doc.demos.some(v=>v.url===row.demo),row.path);
    assert.match(doc.text,row.required);
    assert.match(doc.text,row.risk);
    const visual=visualForDoc(doc);
    assert.equal(visual.motif,row.motif);
    assert.equal(visual.kind,'original-diagram');
    assert.equal(visual.originalWork,false);
    assert.match(visual.alt,/非原作者作品截圖/);
    assert.ok(!used.has(visual.src));
    used.add(visual.src);
    const svg=renderResearchArt(doc);
    assert.match(svg,new RegExp('data-motif="'+row.motif+'"'));
    assert.ok(svg.length<16000,row.path);
    assert.doesNotMatch(svg,/<(?:script|image|foreignObject)|(?:onload|onclick)\s*=/i);
  }
});

test('both source SHA and last commit are pinned to real Markdown',()=>{
  for(const row of cases){
    const matches=ongoing.items.filter(x=>x.path===row.path);
    assert.equal(matches.length,1,row.path);
    const entry=matches[0], doc=allDocs().find(x=>x.file===row.path);
    const source=readFileSync(resolve(process.cwd(),'..',row.path));
    const sha=createHash('sha1').update(Buffer.from('blob '+source.byteLength+'\0')).update(source).digest('hex');
    assert.equal(entry.sourceBlobSha,sha);
    assert.equal(entry.sourceRevision,doc.sha);
    assert.equal(entry.reviewedOn,'2026-11-07');
    assert.equal(entry.externallyVerifiedAllClaims,false);
    assert.equal(entry.benchmarkStatus,'NOT_RUN');
    assert.ok(entry.knownSources.every(url=>url.startsWith('https://')));
    const review=reviewForSource(row.path);
    assert.ok(review);
    assert.equal(review.externallyVerifiedAllClaims,false);
  }
});

test('a new infrastructure domain has public reader-facing naming',()=>{
  assert.match(displayDomain('2026-11-edge-infrastructure'),/邊緣設備/);
  assert.match(exhibitFor('2026-11-edge-infrastructure').name,/低功耗/);
  assert.match(exhibitFor('2026-11-edge-infrastructure').what,/Linux|手機/);
});

test('public summaries distinguish a remote control app from a compute host and claims from measurements',()=>{
  const [agent,phone]=cases.map(r=>allDocs().find(d=>d.file===r.path));
  assert.match(agent.summary,/並非手機本身執行/);
  assert.match(agent.text,/2\.0\.x.*2\.1\.0/);
  assert.match(phone.summary,/尚未獨立測量/);
  assert.match(phone.text,/Pi-hole/);
  assert.match(phone.text,/Doze/);
  assert.match(phone.text,/systemd/);
  assert.doesNotMatch(phone.summary,/Research-|THE OBSERVATORY|AURORA|本專案|本站/);
});
