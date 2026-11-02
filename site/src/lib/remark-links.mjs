import { findDocBySource, resolveLocal } from './catalog.mjs';

function plain(node, text) {
  node.type = 'text';
  node.value = text;
  delete node.url;
  delete node.children;
  delete node.title;
}

function label(node) {
  return (node.children || []).map(c => c.value || c.alt || '').join('') || node.alt || '原始檔案';
}

export default function remarkLinks() {
  return (tree, file) => {
    const source = findDocBySource(file);
    const visit = node => {
      if ((node.type === 'link' || node.type === 'image') && node.url) {
        const updated = resolveLocal(source, node.url);
        if (updated.kind === 'plain') {
          plain(node, label(node) + (updated.url ? ' ' + updated.url : ''));
        } else {
          node.url = updated.url;
        }
      }
      for (const child of node.children || []) visit(child);
    };
    visit(tree);
  };
}
