import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, resolve, sep, posix, basename } from 'node:path';
import { execFileSync } from 'node:child_process';
import { enrichResearch } from './research-metadata.mjs';

// Astro bundles server modules into dist/.prerender; import.meta.url changes there.
// npm scripts and Astro CLI run from site/, regardless of output chunk location.
export const ROOT = resolve(process.cwd(), '..');
export const BASE = '/Research-/v3/';
const SOURCES = [
  { collection: 'research', folder: 'research' },
  { collection: 'governance', folder: 'docs/governance' },
  { collection: 'design', folder: 'showcase/design' }
];
const slash = p => p.split(sep).join('/');
const withoutMd = s => s.replace(/\.md$/i, '');
const encodePath = s => s.split('/').map(encodeURIComponent).join('/');
const asTitle = (text, fallback) => {
  const inBody = text.match(/^#\s+(.+)$/m);
  if (!inBody) throw new Error('Markdown 缺少 H1：' + fallback);
  return inBody[1].trim();
};
const list = d => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? list(join(d, e.name)) : [join(d, e.name)]);
const documents = SOURCES.flatMap(({ collection, folder }) => {
  const root = join(ROOT, folder);
  return list(root).filter(p => p.toLowerCase().endsWith('.md')).filter(p => !(collection === 'governance' && basename(p) === 'THREAT-MODEL.md')).map(p => {
    const file = slash(relative(ROOT, p));
    const id = withoutMd(slash(relative(root, p)));
    const text = readFileSync(p, 'utf8');
    let sha = 'Unknown', date = 'Unknown';
    try {
      const parts = execFileSync('git', ['log', '-1', '--format=%H%n%aI', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n');
      if (parts[0] && /^[a-f0-9]{40}$/.test(parts[0])) [sha, date] = parts;
    } catch { /* Offline/source export: provenance is unknown. */ }
    const group = collection === 'research' ? id.split('/')[0] : collection;
    return { collection, id, file, group, title: asTitle(text, file), text, sha, date, href: BASE + collection + '/' + encodePath(id) + '/' };
  });
}).map(enrichResearch).sort((a, b) => a.file.localeCompare(b.file, 'zh-TW'));
const byFile = new Map(documents.map(d => [d.file, d]));
const byText = new Map();
for (const d of documents) {
  const key = d.text.replace(/\r\n/g, '\n').trim();
  if (!byText.has(key)) byText.set(key, []);
  byText.get(key).push(d);
}
export const allDocs = () => documents;
export const getDoc = (collection, id) => documents.find(d => d.collection === collection && d.id === id);
export const findDocBySource = file => {
  const p = slash(file?.path || '').replaceAll('\\', '/');
  const direct = documents.find(d => p.endsWith('/' + d.file));
  if (direct) return direct;
  const key = String(file || '').replace(/\r\n/g, '\n').trim();
  const matching = byText.get(key) || [];
  if (matching.length === 1) return matching[0];
  throw new Error('無法判定 Markdown 原始路徑，避免錯誤改寫內部連結：' + p);
};
export const resolveLocal = (doc, rawUrl) => {
  if (!rawUrl || rawUrl.startsWith('#') || rawUrl.startsWith('//')) return { url: rawUrl, kind: 'pass' };
  if (/^(?:[a-z][a-z0-9+.-]*:)/i.test(rawUrl)) {
    const own = rawUrl.match(/^https:\/\/github\.com\/waydefu\/Research-\/(?:blob|tree)\/[^/]+\/(.+)$/i);
    if (own) {
      rawUrl = '/' + own[1];
    } else if (/^https:\/\/github\.com\/waydefu\/Research-(?:\/|$)/i.test(rawUrl)) {
      // Public research lives on this site; don't send readers to this repo's GitHub UI.
      return { kind: 'plain', url: rawUrl };
    } else {
      return { kind: 'pass', url: rawUrl };
    }
  }
  const [beforeHash, hash = ''] = rawUrl.split('#', 2);
  const [pathname, query = ''] = beforeHash.split('?', 2);
  const rootPath = pathname.startsWith('/') ? pathname.slice(1) : posix.normalize(posix.join(posix.dirname(doc.file), decodeURIComponent(pathname)));
  const normalized = posix.normalize(rootPath);
  if (normalized.startsWith('../') || normalized === '..') throw new Error('連結越出 Repo: ' + doc.file + ' -> ' + rawUrl);
  if (normalized === 'docs/governance/THREAT-MODEL.md') return { kind: 'plain', url: '（未公開於網站）' };
  const target = byFile.get(normalized) || byFile.get(posix.join(normalized, 'README.md'));
  if (target) return { kind: 'pass', url: target.href + (hash ? '#' + hash : '') };
  if (!existsSync(join(ROOT, normalized))) throw new Error('壞連結: ' + doc.file + ' -> ' + rawUrl);
  if (/\.(?:svg|png|jpe?g|webp|gif)$/i.test(normalized)) return { kind: 'pass', url: BASE + 'source-assets/' + encodePath(normalized) + (query ? '?' + query : '') + (hash ? '#' + hash : '') };
  return { kind: 'plain', url: normalized };
};
export const linksFrom = doc => {
  const withoutFences = doc.text.replace(/^`{3}[^\n]*\n[\s\S]*?^`{3}\s*$/gm, '');
  return [...withoutFences.matchAll(/!?\[[^\]]*\]\((<?[^\s)]+>?)/g)].map(x => x[1].replace(/^<|>$/g, '')).flatMap(url => {
    try { const out = resolveLocal(doc, url); return documents.filter(d => out.url?.startsWith(d.href)).map(d => d.file); } catch { return []; }
  });
};
export const backlinks = doc => documents.filter(other => other.file !== doc.file && linksFrom(other).includes(doc.file));
export const domains = () => [...new Set(documents.map(d => d.group))];
export const domainDocs = domain => documents.filter(d => d.group === domain);
export const graph = () => ({
  nodes: documents.map(d => ({ id: d.file, title: d.title, group: d.group, url: d.href })),
  edges: documents.flatMap(d => linksFrom(d).map(to => ({ from: d.file, to })))
});

// Human-readable Traditional Chinese domain names; URLs and Pagefind filter keys stay stable.
const DOMAIN_NAMES = {
  'governance': '專案治理',
  'design': '視覺設計規格',
  '2026-10-retrospective': '十月技術研究回顧',
  '2026-11-agent-engineering': 'AI 代理工程',
  '2026-11-agent-repository-operations': 'Agent 治理與資料索引',
  '2026-11-universal-web-engine': '現代 Web 工程與互動技術',
  'RESEARCH-TEMPLATE': '研究文件模板'
};
export const displayDomain = domain => DOMAIN_NAMES[domain] || domain;
