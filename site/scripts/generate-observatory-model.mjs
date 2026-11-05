// Deterministic, source-owned glTF 2.0 GLB export for the observatory.
// No Blender executable or external licensed model is required at build time.
// Asset remains compatible with later replacement by a reviewed Blender GLB.
import * as THREE from 'three';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';

const segments=96;
const tau=Math.PI*2;
const batches=new Map();
const rotations={
  Orbit_Outer:[.29,.22,.12],
  Orbit_Meridian:[1.2,.16,.35],
  Orbit_Inner:[.8,1.2,.35],
  Orbit_Ecliptic:[.11,.18,-.7],
  Mechanism:[0,0,0],
  Pedestal:[0,0,0],
  Hall:[0,0,0]
};
const metals=[
  {name:'aged-gold-brass',color:0x967041,metallic:.91,roughness:.39},
  {name:'polished-edge',color:0xc8a26f,metallic:.91,roughness:.27},
  {name:'engraved-dark',color:0x34271f,metallic:.61,roughness:.59},
  {name:'oxidized-bronze',color:0x334951,metallic:.72,roughness:.54},
  {name:'weathered-stone',color:0x394350,metallic:.24,roughness:.83},
  {name:'inner-copper',color:0xb08354,metallic:.81,roughness:.37},
  {name:'light-chamber',color:0xe8b86f,metallic:.13,roughness:.26,emissive:[1,.37,.09],emissiveStrength:1.65},
  {name:'icy-inlay',color:0x7ea9bf,metallic:.56,roughness:.36},
];
function bake(node,material,geo,position=[0,0,0],rotation=[0,0,0],scale=[1,1,1]){
  const matrix=new THREE.Matrix4().compose(
    new THREE.Vector3(...position),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
    new THREE.Vector3(...scale));
  const expanded=geo.index?geo.toNonIndexed():geo.clone();
  expanded.applyMatrix4(matrix);
  const pos=expanded.getAttribute('position');
  const norm=expanded.getAttribute('normal');
  if(!pos||!norm)throw Error('Geometry needs positions and normals');
  const key=node+'|'+material;
  let target=batches.get(key);
  if(!target){target={p:[],n:[]};batches.set(key,target);}
  for(let i=0;i<pos.count;i++){
    target.p.push(pos.getX(i),pos.getY(i),pos.getZ(i));
    target.n.push(norm.getX(i),norm.getY(i),norm.getZ(i));
  }
  expanded.dispose();geo.dispose();
}
function sphere(node,material,r,x=0,y=0,z=0,detail=1){
  bake(node,material,new THREE.IcosahedronGeometry(r,detail),[x,y,z]);
}
function box(node,material,w,h,d,x,y,z,rz=0){
  bake(node,material,new THREE.BoxGeometry(w,h,d),[x,y,z],[0,0,rz]);
}
function torus(node,material,r,t,rot=[0,0,0],pos=[0,0,0]){
  bake(node,material,new THREE.TorusGeometry(r,t,7,segments),pos,rot);
}
function column(node,material,r1,r2,h,pos,radial=20){
  bake(node,material,new THREE.CylinderGeometry(r1,r2,h,radial),pos);
}
function link(node,material,start,end,width){
  const a=new THREE.Vector3(...start),b=new THREE.Vector3(...end);
  const geo=new THREE.CylinderGeometry(width,width,a.distanceTo(b),9);
  const mid=a.clone().add(b).multiplyScalar(.5);
  const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());
  const matrix=new THREE.Matrix4().compose(mid,q,new THREE.Vector3(1,1,1));
  geo.applyMatrix4(matrix);
  bake(node,material,geo);
}
function annulus(node,ri,ro,d){
  const s=new THREE.Shape();
  s.absarc(0,0,ro,0,tau,false);
  const hole=new THREE.Path();
  hole.absarc(0,0,ri,0,tau,true);
  s.holes.push(hole);
  const geometry=new THREE.ExtrudeGeometry(s,{depth:d,steps:1,curveSegments:segments,
    bevelEnabled:true,bevelThickness:.013,bevelSize:.012,bevelSegments:1});
  geometry.translate(0,0,-d*.5);
  bake(node,0,geometry);
  for(const rad of [ri+.012,ro-.012]){
    torus(node,1,rad,.023);
    torus(node,2,rad,.008,[0,0,0],[0,0,-d*.59]);
  }
}
function degreeTick(node,angle,r,len,z,material=2){
  const radius=r+len*.5;
  const a=Math.cos(angle),b=Math.sin(angle);
  box(node,material,len,.013,.008,radius*a,radius*b,z,angle);
}
const roman=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
function rune(node,angle,r,label,z){
  // Small raised/inset strokes rather than raster fonts: self-contained mesh.
  const radial=new THREE.Vector2(Math.cos(angle),Math.sin(angle));
  const tangent=new THREE.Vector2(-radial.y,radial.x);
  const step=.06;
  const glyphs=label.split('');
  const offset=-(glyphs.length-1)*step*.5;
  glyphs.forEach((glyph,i)=>{
    const x=offset+i*step;
    const p=radial.clone().multiplyScalar(r).addScaledVector(tangent,x);
    if(glyph==='I'){
      box(node,2,.012,.091,.009,p.x,p.y,z,angle+Math.PI*.5);
    }else if(glyph==='V'){
      const left=p.clone().addScaledVector(tangent,-.025);
      const right=p.clone().addScaledVector(tangent,.025);
      const bottom=p.clone().addScaledVector(radial,-.035);
      link(node,2,[left.x+radial.x*.039,left.y+radial.y*.039,z],
        [bottom.x,bottom.y,z],.007);
      link(node,2,[right.x+radial.x*.039,right.y+radial.y*.039,z],
        [bottom.x,bottom.y,z],.007);
    }else if(glyph==='X'){
      for(const sign of [-1,1]){
        const a=p.clone().addScaledVector(tangent,sign*.03).addScaledVector(radial,.039);
        const b=p.clone().addScaledVector(tangent,-sign*.03).addScaledVector(radial,-.039);
        link(node,2,[a.x,a.y,z],[b.x,b.y,z],.006);
      }
    }
  });
}
const rings=[
  ['Orbit_Outer',3.30,.315,.25,168],
  ['Orbit_Meridian',2.92,.28,.22,144],
  ['Orbit_Inner',2.52,.24,.20,120],
  ['Orbit_Ecliptic',2.11,.215,.19,96]
];
rings.forEach(([node,r,width,depth,count],index)=>{
  annulus(node,r-width*.5,r+width*.5,depth);
  torus(node,3,r+width*.5-.02,.026,[0,0,0],[0,0,depth*.42]);
  torus(node,5,r-width*.5+.02,.018,[0,0,0],[0,0,depth*.42]);
  for(let k=0;k<count;k++){
    const a=tau*k/count,major=k%(count/12)===0,half=k%(count/24)===0;
    degreeTick(node,a,r-width*.43,major?width*.71:half?width*.53:width*.25,
      depth*.55+.021,major?2:3);
  }
  // Physical inlaid numerals, 12 cardinal cartouches, 24 inset studs.
  roman.forEach((mark,k)=>rune(node,tau*k/12,r,mark,depth*.58+.012));
  for(let k=0;k<24;k++){
    const a=tau*k/24;
    sphere(node,k%3===0?1:2,k%3===0?.034:.020,
      Math.cos(a)*(r+width*.55),Math.sin(a)*(r+width*.55),0,0);
  }
  // Mechanical fixing straps and ear pins.
  for(let k=0;k<8;k++){
    const a=tau*k/8;
    const cx=Math.cos(a)*(r+width*.3),cy=Math.sin(a)*(r+width*.3);
    box(node,5,width*.22,.19,depth*.87,cx,cy,0,a);
  }
});
const mechanism='Mechanism';
for(const r of [1.52,1.36,.94,.79]){
  torus(mechanism,r>1?0:1,r,r>1?.058:.072,[.44,0,0]);
}
for(let k=0;k<32;k++){
  const a=tau*k/32;
  link(mechanism,k%4===0?1:0,
    [Math.cos(a)*.84,Math.sin(a)*.84,-.17],
    [Math.cos(a)*1.51,Math.sin(a)*1.51,-.17],
    k%4===0?.026:.016);
}
for(let k=0;k<56;k++){
  const a=tau*k/56;
  box(mechanism,k%7===0?1:2,.20,.13,.15,
    Math.cos(a)*.96,Math.sin(a)*.96,-.18,a);
}
column(mechanism,3,.27,.36,.78,[0,0,-.38],32);
sphere(mechanism,6,.34,0,0,.52,3);
sphere(mechanism,1,.55,0,0,.11,2);
torus(mechanism,1,.66,.041,[.12,.18,.22]);
for(let k=0;k<12;k++){
  const a=tau*k/12;
  box(mechanism,5,.17,.075,.25,Math.cos(a)*.71,Math.sin(a)*.71,.30,a);
}
// A heavy, sculptural stepped pedestal. Model is intentionally not a floating torus.
const pedestal='Pedestal';
for(const [top,bottom,height,y,material] of [
  [1.76,1.95,.19,-3.55,4],
  [1.63,1.75,.11,-3.39,1],
  [1.49,1.64,.21,-3.21,0],
  [1.42,1.48,.09,-3.07,2],
  [1.16,1.28,.24,-2.86,5],
  [.82,1.03,.91,-2.27,4],
  [.97,.83,.15,-1.70,0],
  [.80,.85,.11,-1.56,1]
]) column(pedestal,material,top,bottom,height,[0,y,0],48);
for(let k=0;k<32;k++){
  const a=tau*k/32;
  const x=Math.cos(a)*1.40,z=Math.sin(a)*1.40;
  box(pedestal,k%4===0?1:2,.12,.38,.105,x,-3.18,z,-a);
}
for(let k=0;k<12;k++){
  const a=tau*k/12;
  const x=Math.cos(a)*.88,z=Math.sin(a)*.88;
  column(pedestal,1,.063,.070,.70,[x,-2.34,z],10);
  sphere(pedestal,1,.06,x,-1.88,z,1);
}
// Observatory colonnade and architectural arcades, lowered contrast for depth.
const hall='Hall';
for(const x of [-5.45,-3.72,3.72,5.45]){
  for(const z of [-3.7,1.7]){
    column(hall,4,.28,.35,7.0,[x,-.12,z],16);
    for(const [y,radius,h] of [[-3.45,.42,.23],[-3.14,.37,.13],[2.91,.39,.22],[3.28,.42,.18]]){
      column(hall,y>2?1:3,radius,radius,h,[x,y,z],18);
    }
    for(let i=0;i<10;i++){
      const angle=tau*i/10;
      const rr=.30;
      column(hall,3,.020,.020,6.1,[x+Math.cos(angle)*rr,-.16,z+Math.sin(angle)*rr],7);
    }
  }
}
// Nested architectural rings and a ceremonial overhead occulus.
for(const r of [4.48,4.72,5.10]){
  torus(hall,r===4.72?5:3,r,.055,[.07,0,0],[0,2.38,-4.18]);
}
for(let k=0;k<18;k++){
  const a=Math.PI*k/17;
  link(hall,4,[Math.cos(a)*5.12,-2.9,-4.15],
    [Math.cos(a)*5.12,3.6,-4.15],.018);
}
for(let k=0;k<9;k++){
  const x=-5+k*1.25;
  box(hall,3,.08,.37,1.14,x,3.75,-3.8);
}
// GLB2: emit interleaved node-independent VEC3 accessors and PBR materials.
function exportGLB(){
  const groups=new Map();
  for(const [key,data] of batches){
    const [node,material]=key.split('|');
    if(!groups.has(node))groups.set(node,[]);
    groups.get(node).push({material:Number(material),data});
  }
  let byteOffset=0;
  const buffers=[],views=[],accessors=[],meshes=[],nodes=[];
  function writeFloatArray(array){
    const raw=Buffer.allocUnsafe(array.length*4);
    for(let i=0;i<array.length;i++)raw.writeFloatLE(array[i],i*4);
    const index=views.length;
    views.push({buffer:0,byteOffset,byteLength:raw.length,target:34962});
    buffers.push(raw);byteOffset+=raw.length;return index;
  }
  function accessor(data){
    const view=writeFloatArray(data);
    const ext=[Infinity,Infinity,Infinity],min=[Infinity,Infinity,Infinity];
    for(let i=0;i<data.length;i+=3){
      for(let j=0;j<3;j++){
        const x=data[i+j];if(!Number.isFinite(x))throw Error('Non-finite glTF vertex');
        min[j]=Math.min(min[j],x);ext[j]=Math.max(ext[j],x);
      }
    }
    const index=accessors.length;
    accessors.push({bufferView:view,byteOffset:0,componentType:5126,
      count:data.length/3,type:'VEC3',min,max:ext});
    return index;
  }
  for(const [node,parts] of groups){
    const primitives=[];
    for(const {material,data} of parts){
      const p=accessor(data.p),n=accessor(data.n);
      if(data.p.length!==data.n.length||data.p.length%9!==0)
        throw Error('Invalid triangle accessor '+node);
      primitives.push({attributes:{POSITION:p,NORMAL:n},material,mode:4});
    }
    const mesh=meshes.length;meshes.push({name:node,primitives});
    const euler=new THREE.Euler(...rotations[node]);
    const q=new THREE.Quaternion().setFromEuler(euler);
    nodes.push({name:node,mesh,rotation:[q.x,q.y,q.z,q.w]});
  }
  const pad4=(n)=>(4-n%4)%4;
  const mats=metals.map(mat=>{
    const col=new THREE.Color(mat.color);
    const out={
      name:mat.name,
      doubleSided:true,
      pbrMetallicRoughness:{baseColorFactor:[col.r,col.g,col.b,1],
        metallicFactor:mat.metallic,roughnessFactor:mat.roughness}
    };
    if(mat.emissive){
      out.emissiveFactor=mat.emissive;
      out.extensions={KHR_materials_emissive_strength:{emissiveStrength:mat.emissiveStrength}};
    }
    return out;
  });
  const gltf={
    asset:{version:'2.0',generator:'Research- deterministic original Observatory GLB v1'},
    scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,
    materials:mats,
    extensionsUsed:['KHR_materials_emissive_strength'],
    accessors,bufferViews:views,buffers:[{byteLength:byteOffset}],
    extras:{author:'Research- original procedural design; not Blender-authored',
      source:'site/scripts/generate-observatory-model.mjs',
      license:'Original project source, pending owner art review'}
  };
  const jsonRaw=Buffer.from(JSON.stringify(gltf),'utf8');
  const json=Buffer.concat([jsonRaw,Buffer.alloc(pad4(jsonRaw.length),0x20)]);
  const binary=Buffer.concat(buffers);
  const binPad=Buffer.alloc(pad4(binary.length));
  const length=12+8+json.length+8+binary.length+binPad.length;
  const out=Buffer.allocUnsafe(length),pos=0;
  out.write('glTF',0,4,'ascii');out.writeUInt32LE(2,4);out.writeUInt32LE(length,8);
  out.writeUInt32LE(json.length,12);out.write('JSON',16,4,'ascii');
  json.copy(out,20);
  const binHeader=20+json.length;out.writeUInt32LE(binary.length+binPad.length,binHeader);
  out.write('BIN\0',binHeader+4,4,'ascii');
  binary.copy(out,binHeader+8);binPad.copy(out,binHeader+8+binary.length);
  const summary={
    schemaVersion:1,format:'glTF-2.0-GLB',authoredBy:'repository-procedural-script',
    blenderExported:false,vertexCount:accessors.filter((_,i)=>i%2===0).reduce((n,a)=>n+a.count,0),
    meshCount:meshes.length,nodeCount:nodes.length,materialCount:mats.length,
    bytes:length,sha256:createHash('sha256').update(out).digest('hex'),
    source:'site/scripts/generate-observatory-model.mjs'
  };
  return {out,summary};
}
export function generateObservatoryModel(){
  const file=resolve(process.cwd(),'public/observatory/observatory-v1.glb');
  const manifest=resolve(process.cwd(),'public/observatory/model-manifest.json');
  const {out,summary}=exportGLB();
  if(out.byteLength>4_500_000)throw Error('GLB over mobile asset budget: '+out.byteLength);
  mkdirSync(dirname(file),{recursive:true});
  writeFileSync(file,out);
  writeFileSync(manifest,JSON.stringify(summary,null,2)+'\n');
  console.log('Original Observatory GLB:',summary.vertexCount,'vertices;',
    summary.meshCount,'meshes;',summary.bytes,'bytes; sha256',summary.sha256);
  return summary;
}
if(process.argv[1]?.endsWith('generate-observatory-model.mjs')){
  generateObservatoryModel();
}
