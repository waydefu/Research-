import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {REPO_NAVIGATION,navForTask,unregisteredModules} from '../src/lib/repo-navigation.mjs';

const root=resolve(process.cwd(),'..');
test('repo navigation contains supported areas and all linked modules/tests actually exist',()=>{
  assert.ok(REPO_NAVIGATION.length>=8);
  const ids=REPO_NAVIGATION.map(s=>s.id);
  assert.equal(new Set(ids).size,ids.length);
  for(const section of REPO_NAVIGATION){
    assert.ok(section.title && section.intent);
    assert.ok(section.paths.includes(section.entry),section.id);
    assert.ok(section.checks.length>0,section.id);
    for(const p of [...section.paths,...section.checks]){
      assert.ok(!p.startsWith('/') && !p.split('/').includes('..'),p);
      assert.ok(existsSync(resolve(root,p)),section.id+': missing '+p);
    }
    const optionalPaths=section.optionalPaths||[];
    const optionalChecks=section.optionalChecks||[];
    const present=optionalPaths.filter(p=>existsSync(resolve(root,p)));
    if(present.length){
      assert.equal(present.length,optionalPaths.length,section.id+': incomplete optional module group');
      for(const p of optionalChecks)assert.ok(existsSync(resolve(root,p)),section.id+': missing merged-module test '+p);
    }
  }
});
test('all site library/build modules are registered, even when future PRs land',()=>{
  const dirs=['site/src/lib','site/scripts'];
  const files=dirs.flatMap(dir=>readdirSync(resolve(root,dir))
    .filter(name=>name.endsWith('.mjs')).map(name=>dir+'/'+name));
  assert.deepEqual(unregisteredModules(files),[]);
  assert.deepEqual(unregisteredModules(['site/src/lib/unregistered-new-feature.mjs']),
    ['site/src/lib/unregistered-new-feature.mjs']);
  const metadata=REPO_NAVIGATION.find(x=>x.id==='metadata');
  const art=REPO_NAVIGATION.find(x=>x.id==='art');
  assert.ok(metadata.optionalPaths.includes('site/src/lib/research-leads.mjs'));
  assert.ok(metadata.optionalChecks.includes('site/tests/research-leads.test.mjs'));
  assert.ok(art.optionalPaths.includes('site/src/lib/research-visuals.mjs'));
  assert.ok(art.optionalPaths.includes('site/scripts/generate-research-art.mjs'));
  assert.ok(art.optionalChecks.includes('site/tests/research-visuals.test.mjs'));
});
test('task routing is deterministic and does not pretend to be a runtime import graph',()=>{
  assert.equal(navForTask('導讀與繁中標題')?.id,'metadata');
  assert.equal(navForTask('圖片與 SVG')?.id,'art');
  assert.equal(navForTask('Agent 權限')?.id,'governance');
  assert.equal(navForTask('CI 失敗')?.id,'quality');
  assert.equal(navForTask('Sanctum 首頁')?.id,'homepage');
  assert.equal(navForTask('研究資料庫索引')?.id,'search');
  assert.equal(navForTask('外星生物研究'),null);
});
test('agent entry docs prominently point to repo map and no stale main SHA is presented as current',()=>{
  const map=readFileSync(resolve(root,'site/REPO-MAP.md'),'utf8');
  const agents=readFileSync(resolve(root,'site/AGENTS.md'),'utf8');
  const readme=readFileSync(resolve(root,'site/README.md'),'utf8');
  const handoff=readFileSync(resolve(root,'site/HANDOFF-CURRENT.md'),'utf8');
  assert.match(map,/最新.*GitHub|GitHub.*動態/);
  assert.doesNotMatch(map,/\b[a-f0-9]{40}\b/);
  assert.match(agents,/REPO-MAP\.md/);
  assert.match(readme,/REPO-MAP\.md/);
  assert.match(handoff,/歷史交接快照/);
  for(const item of REPO_NAVIGATION){
    assert.ok(map.includes('`'+item.entry+'`'),item.id+': missing map entry '+item.entry);
    for(const path of item.optionalPaths||[])assert.ok(map.includes('`'+path+'`'),item.id+': optional path missing from map '+path);
  }
});
