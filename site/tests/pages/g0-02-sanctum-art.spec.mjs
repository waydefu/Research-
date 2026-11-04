import {test,expect} from '@playwright/test';

const HOME='/Research-/';
const ATLAS='/Research-/v3/atlas/sanctum/';
const STYLE='/Research-/v3/atlas/sanctum/g0-02.css';

/* G0-02: real Chromium render checks; screenshots are candidates for Owner
   evaluation, not approved golden images or physical-device measurements. */
for(const [width,height] of [[320,852],[393,852],[768,900],[1440,900]]){
  test('G0-02 scene lighting, Chinese display hierarchy and image-first layout at '+width+'px',async({page},testInfo)=>{
    await page.setViewportSize({width,height});
    await page.goto(HOME);
    await expect(page.locator('link[rel="stylesheet"][href="'+STYLE+'"]')).toHaveCount(1);
    await expect(page.getByRole('heading',{level:1,name:/技術研究與實作知識庫/})).toBeVisible();
    const metrics=await page.evaluate(()=>{
      const computed=(selector,pseudo)=>getComputedStyle(document.querySelector(selector),pseudo);
      const title=computed('.hero h1 .zh');
      const artwork=computed('.world-backdrop','::before');
      const lighting=computed('.world-backdrop','::after');
      const story=computed('.narrative-glass');
      const dock=computed('.hero-dock');
      const copy=document.querySelector('.hero-left').getBoundingClientRect();
      const search=computed('.hero-discovery-row input');
      return {
        gold:computed(':root').getPropertyValue('--g002-gold').trim(),
        ice:computed(':root').getPropertyValue('--g002-ice').trim(),
        titleFont:title.fontFamily,
        titleWeight:title.fontWeight,
        scene:artwork.backgroundImage,
        light:lighting.backgroundImage,
        glass:story.backgroundImage,
        blur:story.backdropFilter,
        dockBorder:dock.borderTopWidth,
        dockDisplay:dock.display,
        copyTop:copy.top,
        inputSize:search.fontSize,
        overflow:document.documentElement.scrollWidth-innerWidth
      };
    });
    expect(metrics.gold).toBe('#d9b579');
    expect(metrics.ice).toBe('#91b9d0');
    expect(metrics.titleFont).toContain('Noto Serif TC');
    expect(metrics.titleWeight).toBe('600');
    expect(metrics.scene).toContain(width<=800?'world-mobile.webp':'world-desktop.webp');
    expect(metrics.light).toContain('radial-gradient');
    expect(metrics.glass).toContain('linear-gradient');
    expect(metrics.overflow).toBeLessThanOrEqual(1);
    if(width<=520){
      expect(metrics.copyTop,'central mobile observatory must remain text-free').toBeGreaterThanOrEqual(height*.64);
      expect(metrics.blur).toBe('none');
      expect(metrics.dockDisplay).toBe('none');
      expect(parseFloat(metrics.inputSize),'iOS search must not trigger focus zoom').toBeGreaterThanOrEqual(16);
    }else if(width>=1101){
      expect(metrics.dockBorder).toBe('0px');
      expect(metrics.dockDisplay).not.toBe('none');
    }
    await page.screenshot({path:testInfo.outputPath('g0-02-'+width+'-sanctum.png'),fullPage:true});
  });
}

test('G0-02 modular art direction is shared by the root homepage and the Atlas preview',async({page})=>{
  for(const route of [HOME,ATLAS]){
    await page.goto(route);
    await expect(page.locator('link[rel="stylesheet"][href="'+STYLE+'"]')).toHaveCount(1);
    const applied=await page.locator('.hero h1 .zh').evaluate(el=>({
      weight:getComputedStyle(el).fontWeight,
      title:getComputedStyle(el).fontFamily,
      accent:getComputedStyle(document.documentElement).getPropertyValue('--g002-gold').trim()
    }));
    expect(applied.weight).toBe('600');
    expect(applied.title).toContain('Noto Serif TC');
    expect(applied.accent).toBe('#d9b579');
  }
});

test('G0-02 keeps no-JS research links and the reduced-motion fallback',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,reducedMotion:'reduce',viewport:{width:393,height:852}});
  const page=await context.newPage();
  await page.goto(HOME);
  await expect(page.locator('.hero-actions .gold-action')).toBeVisible();
  await expect(page.locator('.vault-index a')).toHaveCount(4);
  const style=await page.evaluate(()=>{
    const img=getComputedStyle(document.querySelector('.vault-picture img'));
    const html=getComputedStyle(document.documentElement);
    return {transition:img.transitionDuration,transform:img.transform,scroll:html.scrollBehavior};
  });
  expect(style.transition.split(',').every(s=>parseFloat(s)<=0)).toBe(true);
  expect(style.transform).toBe('none');
  expect(style.scroll).toBe('auto');
  await context.close();
});
