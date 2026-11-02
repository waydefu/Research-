import { allDocs, BASE } from '../src/lib/catalog.mjs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const docs = allDocs(), failures = [];
for (const doc of docs) {
  if (!/^[0-9a-f]{40}$/.test(doc.sha)) failures.push('source git SHA missing: ' + doc.file);
  if (!/^\d{4}-\d{2}-\d{2}T/.test(doc.date)) failures.push('source date missing: ' + doc.file);
  const file = join('dist', decodeURIComponent(doc.href.slice(BASE.length)), 'index.html');
  const html = readFileSync(file,'utf8');
  if (!html.includes(doc.sha) || !html.includes(doc.date)) failures.push('generated provenance missing: ' + doc.file);
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode=1; }
else console.log('Source provenance: ' + docs.length + ' documents have real SHA/date in generated HTML.');
