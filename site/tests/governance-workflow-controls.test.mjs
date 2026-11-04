import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root=resolve(process.cwd(),'..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const required=read('.github/workflows/research-integrity.yml');
const pages=read('.github/workflows/publish-showcase.yml');

function checkRequiredWorkflow(text){
  const errors=[];
  const trigger=text.split(/^jobs:/m)[0];
  if(!/\bon:\s*\n\s+pull_request:/m.test(trigger))errors.push('no pull_request trigger');
  if(/^\s+paths(?:-ignore)?:/m.test(trigger))errors.push('required job can be path-filtered');
  if(/pull_request_target\s*:/.test(trigger))errors.push('privileged pull_request_target');
  if(!/permissions:\s*\n\s+contents:\s*read/m.test(text))errors.push('global contents must be read');
  if(/permissions:\s*\n\s+contents:\s*write/m.test(text))errors.push('global contents write');
  if(!/name:\s*Markdown, JSON and governance integrity/.test(text))errors.push('required check context renamed');
  for(const line of ['npm ci --no-audit --no-fund','npm audit --audit-level=high',
    'npm run check','npm run build','npm run provenance','npm run e2e']){
    if(!text.includes(line))errors.push('missing required action: '+line);
  }
  return errors;
}

function checkPagesWorkflow(text){
  const errors=[];
  if(!/name:\s*V2 \+ V3 static Pages artifact integrity/.test(text))errors.push('Pages build evidence job missing');
  if(/pull_request_target\s*:/.test(text))errors.push('unsafe pull_request_target');
  if(!text.includes("github.event_name != 'pull_request' && github.ref == 'refs/heads/main'"))
    errors.push('Pages production deployment not guarded');
  if(!/needs:\s*build/.test(text))errors.push('deployment not gated by verified build');
  if(!/pages:\s*write/.test(text)||!/id-token:\s*write/.test(text))errors.push('deployment identity contract changed');
  if(!/persist-credentials:\s*false/.test(text))errors.push('checkout may persist credentials');
  return errors;
}

test('required CI is always reported for all PR paths and fails closed on site security issues',()=>{
  assert.deepEqual(checkRequiredWorkflow(required),[]);
  assert.deepEqual(checkPagesWorkflow(pages),[]);
});

test('negative control fixtures prove dangerous workflow edits are detected without touching main',()=>{
  const pathFiltered=required.replace('  pull_request:\n','  pull_request:\n    paths:\n      - site/**\n');
  assert.ok(checkRequiredWorkflow(pathFiltered).includes('required job can be path-filtered'));
  const auditBypassed=required.replace('npm audit --audit-level=high','echo npm audit skipped');
  assert.ok(checkRequiredWorkflow(auditBypassed).some(x=>x.includes('npm audit --audit-level=high')));
  const writable=required.replace('permissions:\n  contents: read','permissions:\n  contents: write');
  assert.ok(checkRequiredWorkflow(writable).some(x=>x.includes('contents write')));
  const missingGuard=pages.replace("github.event_name != 'pull_request' && github.ref == 'refs/heads/main'",'always()');
  assert.ok(checkPagesWorkflow(missingGuard).includes('Pages production deployment not guarded'));
  const privileged=pages.replace('  pull_request:\n','  pull_request_target:\n');
  assert.ok(checkPagesWorkflow(privileged).includes('unsafe pull_request_target'));
});
