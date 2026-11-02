// Read-only verification of the exact GitHub Pages artifact layout.
// Run from site/ after site/dist has been copied to showcase/dist/v3/.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, resolve } from 'node:path';
import { allDocs, BASE } from '../src/lib/catalog.mjs';
import { readerHref } from '../../showcase/reader-links.js';

const repo = resolve(process.cwd(), '..');
const source = join(repo, 'site/dist');
const published = join(repo, 'showcase/dist');
const nested = join(published, 'v3');
const assert = (condition, description) => {
  if (!condition) throw new Error('Pages layout invalid: ' + description);
};
const digest = path => createHash('sha256').update(readFileSync(path)).digest('hex');
// Traverse with a stable reference root, including hidden files and Pagefind binary files.
const walk = (dir, root = dir) => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const path = join(dir, entry.name);
  if (entry.isDirectory()) return walk(path, root);
  assert(entry.isFile(), 'unexpected symlink or special file: ' + path);
  return [relative(root, path)];
}).sort();
for (const name of ['index.html', 'styles.css', 'app.js', 'artifact.js', 'mesh-core.js', 'scene-director.js', 'interaction-core.js', 'qa-metrics.js', 'reader-links.js']) {
  assert(existsSync(join(published, name)), 'V2 root missing ' + name);
  if (name !== 'index.html') assert(digest(join(published, name)) === digest(join(repo, 'showcase', name)), 'V2 root modified: ' + name);
}
assert(digest(join(published, 'index.html')) === digest(join(repo, 'showcase/index.html')), 'V2 homepage changed');
assert(readFileSync(join(published, 'index.html'), 'utf8').includes('THE UNKNOWN,'), 'V2 homepage replaced');
assert(existsSync(join(published, 'data/research-index.json')), 'V2 research index missing');
assert(existsSync(join(published, '.nojekyll')), 'GitHub Pages .nojekyll marker missing');

const original = walk(source);
const copied = walk(nested);
assert(original.length > 70, 'V3 artifact unexpectedly small');
assert(JSON.stringify(original) === JSON.stringify(copied), 'V3 files not copied exactly / unexpected file');
for (const path of original) {
  assert(digest(join(source, path)) === digest(join(nested, path)), 'V3 bytes changed: ' + path);
}
const mustHave = ['index.html', 'search/index.html', 'graph.json', 'pagefind/pagefind.js', '404.html'];
for (const file of mustHave) assert(existsSync(join(nested, file)), 'V3 route missing: ' + file);
const docs = allDocs();
assert(docs.length >= 60, 'V3 original sources missing');
for (const doc of docs) {
  assert(doc.href.startsWith(BASE), 'V3 link has wrong base: ' + doc.file);
  const route = join(nested, decodeURIComponent(doc.href.slice(BASE.length)), 'index.html');
  assert(existsSync(route) && statSync(route).size > 100, 'V3 article route missing: ' + doc.file);
}
assert(!existsSync(join(nested, 'governance/THREAT-MODEL/index.html')), 'excluded governance document published');
const graph = JSON.parse(readFileSync(join(nested, 'graph.json'), 'utf8'));
assert(graph.nodes.length === docs.length, 'graph nodes and documents mismatch');
const v3ByPath = new Map(graph.nodes.map(node => [node.id, node.url]));
const v2Documents = JSON.parse(readFileSync(join(published, 'data/research-index.json'), 'utf8')).documents;
let readerPages = 0;
const sourceOnly = [];
for (const document of v2Documents) {
  const local = readerHref(document.path);
  const expected = v3ByPath.get(document.path);
  if (expected) {
    assert(local !== null, 'V2 document unexpectedly has no V3 route: ' + document.path);
    assert('/Research-/' + local.slice(2) === expected, 'V2 reader route does not match V3 graph: ' + document.path);
    assert(existsSync(join(nested, decodeURIComponent(expected.slice(BASE.length)), 'index.html')), 'V2 reader target not generated: ' + document.path);
    readerPages++;
  } else {
    assert(local === null, 'V2 document would link to a non-existent V3 page: ' + document.path);
    sourceOnly.push(document.path);
  }
}
assert(readerPages > 50, 'Too few V2 documents have actual V3 reader pages');
console.log('V2 reader link audit: ' + readerPages + ' valid internal article routes; ' + sourceOnly.length + ' source-only entries: ' + sourceOnly.join(', '));

const v3Home = readFileSync(join(nested, 'index.html'), 'utf8');
assert(v3Home.includes('研究觀測所'), 'V3 homepage not present');
console.log('Pages bundle validated: original V2 at /Research-/, V3 at /Research-/v3/, ' + docs.length + ' documents, ' + original.length + ' identical V3 artifacts; no deploy triggered by pull_request.');
