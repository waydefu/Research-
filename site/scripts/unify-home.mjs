// Stage one public front door from the reviewed Sanctum. Keep prior V2 accessible.
import {cp,mkdir,readdir,readFile,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
const dist=resolve(process.cwd(),'../showcase/dist');
const v2=join(dist,'v2'),v3=join(dist,'v3');
const entries=await readdir(dist,{withFileTypes:true});
if(entries.some(e=>e.name==='v2'))throw Error('Unexpected previous V2 archive');
await mkdir(v2);
for(const e of entries){
  if(e.name==='v3')continue;
  await cp(join(dist,e.name),join(v2,e.name),{recursive:e.isDirectory()});
}
const reader=join(v2,'reader-links.js'),original=await readFile(reader,'utf8');
const old="return './v3/'";
if(original.split(old).length!==2)throw Error('Unexpected V2 reader routing');
await writeFile(reader,original.replace(old,"return '../v3/'"));
const source=await readFile(join(v3,'atlas/sanctum/index.html'),'utf8');
if(!source.includes('天文觀測神殿')||!source.includes('class="world-backdrop"'))throw Error('Sanctum scene missing');
if(!source.includes('<link rel="canonical" href="https://waydefu.github.io/Research-/"'))throw Error('Canonical home missing');
const home=source.replaceAll('./assets/','/Research-/v3/atlas/sanctum/assets/');
if(home.includes('data:image/webp;base64,'))throw Error('Image data URI regression');
await writeFile(join(dist,'index.html'),home);
const secondary=await readFile(join(v3,'index.html'),'utf8');
if(!secondary.includes('http-equiv="refresh"')||!secondary.includes('url=/Research-/'))throw Error('Secondary homepage is not unified');
console.log('One front door: /Research-/; V2 archive: /v2/; V3 reader and search remain.');
