import { allDocs, resolveLocal, ROOT } from '../src/lib/catalog.mjs';
import { mkdirSync, copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import {generateResearchArt} from './generate-research-art.mjs';
import {generateObservatoryModel} from './generate-observatory-model.mjs';

const docs = allDocs();
if (!docs.length) throw new Error('來源研究庫是空的');
const output = join(ROOT, 'site/public/source-assets');
let count = 0;
for (const d of docs) {
  // Repo-integrity checks own existing links; this checks public site routing.
  const stripped = d.text.replace(/^`{3}[^\n]*\n[\s\S]*?^`{3}\s*$/gm, '');
  for (const m of stripped.matchAll(/!?\[[^\]]*\]\((<?[^\s)]+>?)/g)) {
    const raw = m[1].replace(/^<|>$/g, '');
    if (raw.startsWith('#') || raw.startsWith('//')) continue;
    const target = resolveLocal(d, raw);
    if (target.kind !== 'pass' || !target.url?.includes('/source-assets/')) continue;
    const relative = decodeURIComponent(target.url.split('/source-assets/')[1].split(/[?#]/)[0]);
    const sourceFile = resolve(ROOT, relative);
    if (!sourceFile.startsWith(resolve(ROOT) + '/') || !existsSync(sourceFile)) throw new Error('不安全或遺失的靜態資產 ' + relative);
    const dest = resolve(output, relative);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(sourceFile, dest);
    count++;
  }
}
if (docs.some(d => d.file.endsWith('THREAT-MODEL.md'))) throw new Error('威脅模型不得進入公開內容');
// The primary Pagefind index intentionally ignores archived text for edited public articles.
// Keep a separate, opt-in and source-exact original corpus; never claim it was fact-checked.
 const originalIndex={
   schemaVersion:1,scope:'archived-original-markdown',
   documents:docs.map(d=>({
     file:d.file,href:d.href,title:d.title,publicTitle:d.publicTitle,group:d.group,
     topic:d.topic,tags:d.tags,sha:d.sha,date:d.date,text:d.text
   }))
 };
 writeFileSync(join(ROOT,'site/public/original-search-index.json'),
   JSON.stringify(originalIndex)+'\n','utf8');
 const art=generateResearchArt(docs);
const originalObservatory=generateObservatoryModel();
console.log('P0 preflight: ' + docs.length + ' Markdown files, ' + count + ' linked asset copies; ' + art.written + ' original article diagrams; G1-02 GLB '+originalObservatory.bytes+' bytes; all checked.');
