import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {exportGLB} from '../scripts/generate-observatory-model.mjs';

test('G1-02 deterministically exports a valid, locally-authored binary glTF 2.0 container',()=>{
  const {out,summary}=exportGLB();
  assert.equal(out.subarray(0,4).toString('ascii'),'glTF');
  assert.equal(out.readUInt32LE(4),2);
  assert.equal(out.readUInt32LE(8),out.length);
  assert.equal(out.readUInt32LE(16),0x4e4f534a);
  assert.ok(out.length<4_500_000,'mobile GLB budget exceeded');
  assert.equal(summary.sha256,createHash('sha256').update(out).digest('hex'));
  const length=out.readUInt32LE(12);
  const gltf=JSON.parse(out.subarray(20,20+length).toString('utf8').trim());
  assert.equal(gltf.asset.version,'2.0');
  assert.equal(gltf.scenes.length,1);
  assert.equal(gltf.nodes.length,7);
  assert.ok(gltf.materials.length>=8);
  assert.ok(gltf.meshes.every(mesh=>mesh.primitives.length>0));
  for(const name of ['Orbit_Outer','Orbit_Meridian','Orbit_Inner','Orbit_Ecliptic',
    'Mechanism','Pedestal','Hall'])assert.ok(gltf.nodes.some(node=>node.name===name));
  assert.ok(gltf.accessors.every(item=>item.count>0&&!item.min.some(v=>!Number.isFinite(v))));
  assert.ok(gltf.buffers.length===1&&!gltf.buffers[0].uri,'no remote GLB dependencies');
  assert.ok(!out.includes(Buffer.from('https://')),'no external asset or decoder URLs');
  assert.equal(summary.blenderExported,false,'never label a procedural asset as a Blender export');
  const binIndex=20+length;
  assert.equal(out.subarray(binIndex+4,binIndex+8).toString('ascii'),'BIN\0');
  assert.equal(out.readUInt32LE(binIndex)+binIndex+8,out.length);
});
test('the model export is bit-reproducible for the same source checkout',()=>{
  const first=exportGLB().summary.sha256;
  assert.equal(exportGLB().summary.sha256,first);
});
