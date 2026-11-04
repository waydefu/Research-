import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {allDocs} from '../src/lib/catalog.mjs';
import {reviewedCoverage,TOPIC_DESCRIPTORS} from '../src/lib/research-taxonomy.mjs';
import {editorialLeadCoverage} from '../src/lib/research-leads.mjs';
import {visualCoverage} from '../src/lib/research-visuals.mjs';
import {publicBodyCoverage} from '../src/lib/public-articles.mjs';
const read=path=>readFileSync(resolve(process.cwd(),path),'utf8');
test('P0.5 content contracts reject unregistered sources and preserve known authorship uncertainty',()=>{
  const docs=allDocs(),files=docs.map(d=>d.file);
  assert.ok(docs.length>=87);
  const reviewed=reviewedCoverage(files),leads=editorialLeadCoverage(files),visuals=visualCoverage(docs);
  assert.deepEqual(reviewed.unmatched,[]);
  assert.deepEqual(reviewed.stale,[]);
  assert.deepEqual(leads.missing,[]);
  assert.deepEqual(leads.stale,[]);
  assert.deepEqual(visuals.unknown,[]);
  assert.equal(visuals.filenames.length,docs.length);
  assert.ok(Object.keys(TOPIC_DESCRIPTORS).length>=34);
  const publicBodies=publicBodyCoverage(files);
  assert.ok(publicBodies.ready>=4);
  assert.deepEqual(publicBodies.stale,[]);
  // Document completeness and verified claims are separate; 87 articles are NOT automatically 87 reviewed bodies.
  assert.ok(publicBodies.ready<=docs.length);
});
test('D: site library modules never directly import page, layout or view styles',()=>{
  for(const name of readdirSync(resolve(process.cwd(),'src/lib')).filter(x=>x.endsWith('.mjs'))){
    const text=read('src/lib/'+name);
    const matches=[...text.matchAll(/\b(?:import|export)\s+[^\n]*?\bfrom\s*['"]([^'"]+)['"]/g)];
    for(const m of matches){
      const target=m[1];
      assert.doesNotMatch(target,/(?:^|\/)pages\/|(?:^|\/)layouts\/|(?:^|\/)styles\//,
        name+' should not import presentation layer '+target);
    }
  }
});
test('E: shared design tokens are a single imported file with original dark-gold palette',()=>{
  const global=read('src/styles/global.css'),tokens=read('src/styles/tokens.css');
  assert.ok(global.startsWith("@import './tokens.css';\n"));
  assert.ok(tokens.includes('--palette-gold-primary:#e4b451'));
  assert.ok(tokens.includes('--palette-cyan-plasma:#40d4de'));
  assert.ok(tokens.includes('--palette-space-0:#0a101d'));
  assert.ok(tokens.includes('--reading-gold:#d9b579'));
  assert.ok(tokens.includes('--reading-bg:#080b11'));
  assert.ok(tokens.includes('--gold:var(--reading-gold)'));
  assert.equal((tokens.match(/:root\s*\{/g)||[]).length,1,'canonical design tokens cannot silently override each other');
  assert.ok(tokens.includes('Noto Sans TC'));
  assert.ok(!/^:root\{/m.test(global),'global styles must not duplicate canonical root tokens');
});
test('F/G: preserve existing viewport, no-JS, keyboard, table and source tests as independently run gates',()=>{
  const playwright=read('tests/browser/p0.spec.mjs');
  const homepage=read('tests/pages/sanctum-fullpage.spec.mjs');
  const article=read('src/pages/[collection]/[...slug].astro');
  assert.match(playwright,/360,780/);
  assert.match(playwright,/1440,900/);
  assert.match(playwright,/axe WCAG/);
  assert.match(homepage,/320,360,393,430,768,1440/);
  assert.match(article,/getPublicArticle/);
  assert.match(article,/original-record/);
  assert.match(article,/doc\.sha/);
});
