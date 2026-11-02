import { allDocs, resolveLocal, ROOT } from '../src/lib/catalog.mjs';
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';

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
console.log('P0 preflight: ' + docs.length + ' Markdown files, ' + count + ' linked asset copies; all checked.');
