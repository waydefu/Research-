export default function rehypeTables() {
  return tree => {
    const visit = node => {
      if (!node.children) return;
      node.children = node.children.map(child => {
        visit(child);
        if (child.type === 'element' && child.tagName === 'table') {
          return {
            type: 'element', tagName: 'div',
            properties: { className: ['table-scroll'], tabIndex: 0, role: 'region', ariaLabel: '資料表，可左右捲動' },
            children: [child]
          };
        }
        return child;
      });
    };
    visit(tree);
  };
}
