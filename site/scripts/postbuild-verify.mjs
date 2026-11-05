import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { allDocs, graph, BASE } from '../src/lib/catalog.mjs';

const docs = allDocs();
let verified = 0;
for (const d of docs) {
  const page = join('dist', decodeURIComponent(d.href.slice(BASE.length)), 'index.html');
  if (!existsSync(page)) throw new Error('缺少站內文件頁面: ' + d.file + ' -> ' + page);
  const html = readFileSync(page, 'utf8');
  if (!html.includes('data-pagefind-body')) throw new Error('文件未設 Pagefind 索引主體: ' + d.file);
  if (/href\s*=\s*["'][^"']*github\.com\/waydefu\/Research-\//i.test(html)) throw new Error('發現本站 GitHub 連結: ' + d.file);
  if (!html.includes(d.title.replaceAll('&','&amp;'))) console.warn('注意：標題 HTML 轉義可能與來源不同: ' + d.file);
  verified++;
}
if (existsSync('dist/governance/THREAT-MODEL/index.html')) throw new Error('排除文件不應有公開頁面');
if (!existsSync('dist/pagefind/pagefind.js')) throw new Error('Pagefind 全文索引尚未產生');
const archivedPath='dist/original-search-index.json';
if (!existsSync(archivedPath)) throw new Error('缺少分離的原文搜尋索引');
const archived=JSON.parse(readFileSync(archivedPath,'utf8'));
if (archived.scope!=='archived-original-markdown'||archived.documents.length!==docs.length)
  throw new Error('原文搜尋索引覆蓋不完整');
const archivedByPath=new Map(archived.documents.map(d=>[d.file,d]));
if (archivedByPath.size!==docs.length||archivedByPath.has('docs/governance/THREAT-MODEL.md'))
  throw new Error('原文搜尋索引路徑重複或包含排除來源');
for(const d of docs){
  const entry=archivedByPath.get(d.file);
  if(!entry||entry.text!==d.text||entry.sha!==d.sha||entry.href!==d.href)
    throw new Error('原文搜尋與原始 Markdown/SHA 不相符：'+d.file);
}
const world = JSON.parse(readFileSync('dist/graph.json', 'utf8'));
if (world.nodes.length !== docs.length) throw new Error('文件圖與真實文件數不一致');
// G1-02 asset provenance is checked independently of WebGL availability.
const model='dist/observatory/observatory-v1.glb';
const manifest='dist/observatory/model-manifest.json';
if(!existsSync(model)||!existsSync(manifest))
  throw new Error('缺少原創觀測所 GLB 或模型來源清單');
const binary=readFileSync(model),meta=JSON.parse(readFileSync(manifest,'utf8'));
if(binary.subarray(0,4).toString('ascii')!=='glTF'||binary.readUInt32LE(4)!==2||
  binary.readUInt32LE(8)!==binary.length||binary.length>4_500_000)
  throw new Error('GLB 格式或手機體積上限不合格');
if(meta.bytes!==binary.length||meta.sha256!==createHash('sha256').update(binary).digest('hex'))
  throw new Error('GLB 與已驗證的 SHA256 manifest 不符');
if(meta.blenderExported!==false||meta.authoredBy!=='repository-procedural-script')
  throw new Error('模型產地不得被錯誤宣稱為 Blender 精雕');
const glbJsonLength=binary.readUInt32LE(12);
const glb=JSON.parse(binary.subarray(20,20+glbJsonLength).toString('utf8').trim());
if(glb.asset.version!=='2.0'||glb.meshes.length!==7||
  !glb.nodes.some(n=>n.name==='Orbit_Outer')||
  !glb.nodes.some(n=>n.name==='Hall')||
  glb.buffers.some(b=>b.uri))
  throw new Error('觀測所模型節點、glTF 或自含資源不符合契約');
console.log('G1-02 verified original GLB:',meta.bytes,'bytes;',meta.meshCount,'meshes; sha256',meta.sha256);

console.log('P0 output verification: ' + verified + ' pages, Pagefind bundle present, graph consistent.');
