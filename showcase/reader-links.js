// V2 -> V3 local reader routing. Return null for pages V3 intentionally does not publish.
// Keep this aligned with site/src/lib/catalog.mjs and verify-pages-bundle.mjs.
export function readerHref(sourcePath) {
  if (typeof sourcePath !== 'string' || sourcePath.includes('\\') || sourcePath.includes('?') || sourcePath.includes('#')) return null;
  const match = /^(research|docs\/governance)\/(.+)\.md$/i.exec(sourcePath);
  if (!match) return null;
  const [, area, name] = match;
  const segments = name.split('/');
  if (segments.some(segment => !segment || segment === '.' || segment === '..')) return null;
  if (area.toLowerCase() === 'docs/governance' && segments.at(-1).toLowerCase() === 'threat-model') return null;
  const collection = area.toLowerCase() === 'research' ? 'research' : 'governance';
  return './v3/' + collection + '/' + segments.map(encodeURIComponent).join('/') + '/';
}
