import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {REPO_NAVIGATION,navForTask} from '../src/lib/repo-navigation.mjs';

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
  }
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
  }
});
