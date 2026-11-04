import { readFileSync, existsSync } from 'node:fs';
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
console.log('P0 output verification: ' + verified + ' pages, Pagefind bundle present, graph consistent.');
