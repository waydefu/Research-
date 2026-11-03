import test from 'node:test';
import assert from 'node:assert/strict';
import {CURATED} from '../src/lib/research-metadata.mjs';
import {CANONICAL_FIELDS,validateMetadataEntry,validateMetadataRegistry} from '../src/lib/metadata-schema.mjs';

const sample = () => ({
  schemaVersion:1,
  publicTitle:'瀏覽器如何呈現立體像素世界？',
  summary:'這份研究說明 2.5D 像素風格如何透過立體場景和景深運作，也指出目前尚未完成的手機效能驗證。',
  domain:'2026-11-universal-web-engine',
  topic:'3D 場景與 Shader',
  tags:['Three.js'],
  creator:null,
  originalSource:{label:'專案來源',url:'https://gitlab.com/stubborn-hug/lumina'},
  demo:[],
  license:null,
  verifiedAt:null,
  image:null,
  evidenceLevel:'unverified'
});
test('all existing legacy CURATED records remain valid without source edits',()=>{
  assert.equal(validateMetadataRegistry(CURATED),true);
});
test('canonical v1 explicitly lists all fields, including nullable unknown evidence',()=>{
  assert.deepEqual(validateMetadataEntry('research/example.md',sample()),[]);
  assert.ok(CANONICAL_FIELDS.includes('originalSource'));
  assert.ok(CANONICAL_FIELDS.includes('license'));
});
test('missing required fields and invented certainty are rejected',()=>{
  const incomplete=sample();delete incomplete.originalSource;
  assert.match(validateMetadataEntry('research/example.md',incomplete).join(' '),/originalSource/);
  const unproven=sample();unproven.evidenceLevel='primary';
  assert.match(validateMetadataEntry('research/example.md',unproven).join(' '),/verifiedAt/);
});
test('reject dangerous demo URLs and invalid image records',()=>{
  const invalid=sample();invalid.demo=[{label:'示範',url:'javascript:alert(1)',note:'外部示範'}];
  invalid.image={src:'',alt:''};
  assert.match(validateMetadataEntry('research/example.md',invalid).join(' '),/demo/);
  assert.match(validateMetadataEntry('research/example.md',invalid).join(' '),/image/);
});
test('reject unknown fields, duplicate tags and domain drift',()=>{
  const invalid=sample();invalid.unexpected=true;invalid.tags=['WebGL','WebGL'];
  assert.match(validateMetadataEntry('research/example.md',invalid).join(' '),/未定義欄位/);
  assert.match(validateMetadataEntry('research/example.md',invalid).join(' '),/tags/);
});
