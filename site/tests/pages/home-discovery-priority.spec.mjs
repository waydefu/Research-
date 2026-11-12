import {test,expect} from '@playwright/test';

const ROOT='/Research-/',LIBRARY=ROOT+'v3/library/',SEARCH=ROOT+'v3/search/';

for(const width of [320,360,393,430,768]){
  test('mobile hero preserves its central art while retaining usable discovery at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:852});
    await page.goto(ROOT);
    const catalog=page.locator('.hero-actions .gold-action');
    const search=page.locator('.hero-discovery button');
    await expect(page.locator('.mobile-discovery-nav')).toBeHidden();
    await expect(catalog).toBeVisible();
    await expect(search).toBeVisible();
    await expect(catalog).toHaveAttribute('href',LIBRARY);
    await expect(page.locator('.hero-discovery')).toHaveAttribute('action',SEARCH);
    const sizes=await page.evaluate(()=>{
      const root=document.documentElement;
      const a=document.querySelector('.hero-actions .gold-action').getBoundingClientRect();
      const input=document.querySelector('.hero-discovery input').getBoundingClientRect();
      const button=document.querySelector('.hero-discovery button').getBoundingClientRect();
      const copy=document.querySelector('.hero-left').getBoundingClientRect();
      const scene=getComputedStyle(document.querySelector('.hfx-field'),'::before');
      const glass=getComputedStyle(document.querySelector('.narrative-glass'));
      const headerMenu=document.querySelector('#menuOpen').getBoundingClientRect();
      return {aTop:a.top,aBottom:a.bottom,aHeight:a.height,inputTop:input.top,inputHeight:input.height,buttonTop:button.top,buttonHeight:button.height,copyTop:copy.top,background:scene.backgroundImage,glassBlur:glass.backdropFilter,headerMenuHeight:headerMenu.height,viewportHeight:innerHeight,overflow:root.scrollWidth-innerWidth};
    });
    expect(sizes.aTop).toBeGreaterThanOrEqual(0);
    if(width<=520){
      // The image, not the headline, owns the central 60% of the mobile screen.
      expect(sizes.copyTop,'headline must not cover observatory focal area').toBeGreaterThanOrEqual(sizes.viewportHeight*.64);
      expect(sizes.background).toContain('radial-gradient');
      expect(sizes.glassBlur,'mobile glass must not start with an abrupt blur seam').toBe('none');
    } else {
      // Tablets use a scrollable cinematic opening; discovery must remain reachable.
      expect(sizes.aBottom).toBeLessThan(await page.evaluate(()=>document.documentElement.scrollHeight));
    }
    expect(sizes.headerMenuHeight).toBeGreaterThanOrEqual(35);
    expect(sizes.aHeight).toBeGreaterThanOrEqual(44);
    expect(sizes.buttonHeight).toBeGreaterThanOrEqual(44);
    expect(Math.abs(sizes.inputTop-sizes.buttonTop)).toBeLessThan(1);
    expect(Math.abs(sizes.inputHeight-sizes.buttonHeight)).toBeLessThan(1);
    expect(sizes.overflow).toBeLessThanOrEqual(1);
    await catalog.click();
    await expect(page).toHaveURL(LIBRARY);
    await expect(page.getByRole('heading',{level:1,name:/想了解一項技術/})).toBeVisible();
  });
}

test('desktop prioritizes library first in visible top navigation',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto(ROOT);
  const first=page.locator('.primary-nav a').first();
  await expect(first).toBeVisible();
  await expect(first).toHaveText('完整典藏館');
  await expect(first).toHaveAttribute('href',LIBRARY);
  const n=await page.locator('.primary-nav a').allTextContents();
  expect(n).toEqual(['完整典藏館','研究分類','精選研究','全文搜尋']);
});

test('hero actions are distinct: canonical full library versus on-page topic preview',async({page})=>{
  await page.setViewportSize({width:393,height:852});
  await page.goto(ROOT);
  await expect(page.locator('.hero-actions .gold-action')).toHaveAttribute('href',LIBRARY);
  await expect(page.locator('.hero-actions .outline-action')).toBeHidden();
  await expect(page.locator('.hero-actions .gold-action')).toContainText('全部技術主題');
  await page.locator('.hero-discovery input').fill('AI 代理');
  await page.locator('.hero-discovery button').click();
  await expect(page).toHaveURL(/\/Research-\/v3\/search\//);
});

test('home follows find → categories → featured reading → reading features',async({page})=>{
  await page.goto(ROOT);
  const indices=await page.evaluate(()=>Array.from(document.querySelectorAll('.hero-discovery,#vault,#featured,.at-glance')).map(el=>el.classList.contains('hero-discovery')?'search':el.id||'help'));
  expect(indices).toEqual(['search','vault','featured','help']);
  const categories=page.locator('.vault-index li');
  await expect(categories).toHaveCount(4);
  const artworks=await page.locator('.vault-index img').evaluateAll(images=>images.map(img=>img.getAttribute('src')));
  expect(new Set(artworks).size).toBe(4);
  expect(artworks.every(src=>src.startsWith(ROOT+'v3/research-exhibits/'))).toBe(true);
  await expect(page.locator('.vault-description')).toHaveCount(4);
  await expect(page.locator('.vault-full-library')).toHaveAttribute('href',LIBRARY);
  await expect(page.locator('.vault-library-action')).toHaveAttribute('href',LIBRARY);
});

test('dock and menu use honest labels and prioritize full content',async({page})=>{
  await page.goto(ROOT);
  const links=page.locator('.hero-dock .dock-item');
  await expect(links).toHaveCount(4);
  expect(await links.evaluateAll(els=>els.map(e=>e.querySelector('strong')?.textContent.trim())))
    .toEqual(['完整典藏館','研究分類','精選研究','全文搜尋']);
  await expect(links.first()).toHaveAttribute('href',LIBRARY);
  await expect(page.locator('#menuPanel ol a').first()).toHaveAttribute('href',LIBRARY);
  await expect(page.locator('.site-footer a[href="'+LIBRARY+'"]')).toHaveCount(1);
  await expect(page.locator('.hero-dock')).not.toContainText('最新文章');
  await expect(page.locator('.at-glance')).toContainText('閱讀功能');
});

test('full catalog and all category links work without JavaScript',async({browser})=>{
  const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:393,height:852}});
  const page=await ctx.newPage();
  await page.goto(ROOT);
  await expect(page.locator('.mobile-discovery-nav')).toBeHidden();
  await expect(page.locator('.hero-actions .gold-action')).toBeVisible();
  await expect(page.locator('.vault-index a')).toHaveCount(4);
  await page.locator('.vault-index a').first().click();
  await expect(page.locator('.domain-introduction h1')).toBeVisible();
  await ctx.close();
});
