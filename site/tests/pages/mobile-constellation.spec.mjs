import { test, expect } from '@playwright/test';

const ids = ['web','agents','security','data','creative','research'];

for (const width of [320, 360, 393, 430, 760]) {
  test('portrait constellation at '+width+'px: labels, nodes and visibility', async ({page}, info) => {
    await page.setViewportSize({width,height:800});
    await page.goto('./');
    await expect(page.locator('#domain-map .node')).toHaveCount(6);
    await expect(page.locator('#domain-map')).toHaveAttribute('viewBox','0 0 330 530');
    const geometry = await page.locator('#domain-map').evaluate(svg => {
      const mapBounds = svg.getBoundingClientRect();
      const nodes = [...svg.querySelectorAll('.node')].map(g => {
        const circle = g.querySelector('.orb-core').getBoundingClientRect();
        const labels = [...g.querySelectorAll('text')].map(t => {
          const r = t.getBoundingClientRect();
          return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,text:t.textContent};
        });
        return {id:g.dataset.domain, cx:circle.left+circle.width/2, cy:circle.top+circle.height/2,
          circle:{left:circle.left,right:circle.right,top:circle.top,bottom:circle.bottom,width:circle.width},labels};
      });
      return {map:{left:mapBounds.left,right:mapBounds.right,top:mapBounds.top,bottom:mapBounds.bottom},
        viewport:innerWidth,bodyScrollWidth:document.documentElement.scrollWidth,nodes};
    });
    expect(geometry.nodes.map(x=>x.id)).toEqual(ids);
    for(const n of geometry.nodes) {
      expect(n.circle.width, n.id+' tap circle diameter').toBeGreaterThanOrEqual(44);
      expect(n.circle.left, n.id+' clipped at left').toBeGreaterThanOrEqual(geometry.map.left-1);
      expect(n.circle.right, n.id+' clipped at right').toBeLessThanOrEqual(geometry.map.right+1);
      expect(n.circle.top, n.id+' clipped at top').toBeGreaterThanOrEqual(geometry.map.top-1);
      expect(n.circle.bottom, n.id+' clipped at bottom').toBeLessThanOrEqual(geometry.map.bottom+1);
      for(const label of n.labels) {
        expect(label.left, n.id+' label left: '+label.text).toBeGreaterThanOrEqual(n.circle.left+1);
        expect(label.right, n.id+' label right: '+label.text).toBeLessThanOrEqual(n.circle.right-1);
        expect(label.top, n.id+' label top: '+label.text).toBeGreaterThanOrEqual(n.circle.top+1);
        expect(label.bottom, n.id+' label bottom: '+label.text).toBeLessThanOrEqual(n.circle.bottom-1);
      }
    }
    for (let i=0;i<geometry.nodes.length;i++) for(let j=i+1;j<geometry.nodes.length;j++){
      const a=geometry.nodes[i], b=geometry.nodes[j];
      const dist=Math.hypot(a.cx-b.cx,a.cy-b.cy);
      expect(dist, a.id+'/'+b.id+' node collision').toBeGreaterThan((a.circle.width+b.circle.width)/2+4);
    }
    await page.locator('.map-stage').screenshot({path: info.outputPath('mobile-map-'+width+'.png')});
  });
}

test('all six mobile constellation nodes can be tapped to filter research', async ({page}) => {
  await page.setViewportSize({width:360,height:800});
  await page.goto('./');
  await expect(page.locator('#results-count')).not.toContainText('—');
  for(const id of ids) {
    await page.locator('#domain-map .node[data-domain="'+id+'"]').click();
    await expect(page).toHaveURL(new RegExp('[?&]domain='+id+'(?:&|$)'));
    await expect(page.locator('#domain-map .node[data-domain="'+id+'"]')).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('#results .result').first()).toBeVisible();
  }
});

test('resizing desktop to phone and back restores the desktop layout', async ({page}) => {
  await page.setViewportSize({width:1280,height:900});
  await page.goto('./');
  await expect(page.locator('#domain-map')).toHaveAttribute('viewBox','0 0 1100 480');
  await expect(page.locator('#domain-map .node[data-domain="web"] text').first()).toContainText('Web / Graphics');
  await page.setViewportSize({width:360,height:800});
  await expect(page.locator('#domain-map')).toHaveAttribute('viewBox','0 0 330 530');
  await expect(page.locator('#domain-map .node[data-domain="web"] text').first()).toContainText('網頁與視覺工程');
  await page.setViewportSize({width:1280,height:900});
  await expect(page.locator('#domain-map')).toHaveAttribute('viewBox','0 0 1100 480');
  await expect(page.locator('#domain-map .node[data-domain="web"] text').first()).toContainText('Web / Graphics');
});
