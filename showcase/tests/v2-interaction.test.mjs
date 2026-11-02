import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {selectEvidenceLabels} from '../interaction-core.js';

const read=name=>readFileSync(fileURLToPath(new URL('../'+name,import.meta.url)),'utf8');
test('orbital glyphs are truthful labels from Markdown source paths, never unrelated symbols',()=>{
 const docs=[
  {group:'web',title:'WebGPU compatibility',path:'research/a/06-webgpu.md'},
  {group:'web',title:'Duplicated source',path:'research/a/07-duplicate.md'},
  {group:'security',title:'EAG-100',path:'research/b/EAG-100.md'},
  {group:'agents',title:'Agent governance',path:'research/b/agents.md'},
 ];
 const labels=selectEvidenceLabels(docs);
 assert.deepEqual(labels.map(x=>x.file),['06-webgpu.md','EAG-100.md','agents.md']);
 assert.deepEqual(labels.map(x=>x.group),['web','security','agents']);
});
test('domain selection drives the renderer without desynchronizing the archive',()=>{
 const app=read('app.js'),core=read('mesh-core.js'),director=read('scene-director.js');
 assert.match(app,/research:focus/);
 assert.match(app,/renderFilters\(\);renderGraph\(\);applyFilter\(\)/);
 assert.match(core,/domainTarget=/);
 assert.match(core,/setPaused\(value\)/);
 assert.match(director,/research:motion/);
 const html=read('index.html'),css=read('styles.css');
 assert.match(html,/id="v2-motion-toggle"/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/\.v2-evidence-label/);
});
