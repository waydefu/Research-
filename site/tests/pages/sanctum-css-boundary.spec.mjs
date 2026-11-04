import {test,expect} from '@playwright/test';

const SHEET='/Research-/v3/atlas/sanctum/sanctum-core.css';
const G002='/Research-/v3/atlas/sanctum/g0-02.css';
for(const route of ['/Research-/','/Research-/v3/atlas/sanctum/']){
  for(const width of [320,393,768,1440]){
    test('Sanctum CSS extraction preserves real scene at '+width+' '+route,async({page})=>{
      await page.setViewportSize({width,height:width<=430?852:900});
      await page.goto(route);
      await expect(page.locator('link[rel="stylesheet"][href="'+SHEET+'"]')).toHaveCount(1);
      await expect(page.locator('link[rel="stylesheet"][href="'+G002+'"]')).toHaveCount(1);
      await expect(page.getByRole('heading',{level:1,name:/技術研究與實作知識庫/})).toBeVisible();
      const css=await page.evaluate(()=>{
        const art=getComputedStyle(document.querySelector('.world-backdrop'),'::before');
        const scene=getComputedStyle(document.querySelector('.world-backdrop'));
        const gradient=getComputedStyle(document.querySelector('.narrative-glass'));
        const title=getComputedStyle(document.querySelector('.hero h1 .zh'));
        return {
          art:art.backgroundImage,
          position:scene.position,
          glass:gradient.backgroundImage,
          headingWeight:title.fontWeight,
          overflow:document.documentElement.scrollWidth-innerWidth,
          inlineStyles:document.querySelectorAll('head style').length,
          links:[...document.querySelectorAll('link[rel="stylesheet"]')].map(l=>l.href)
        };
      });
      expect(css.art).toContain(width<=800?'world-mobile.webp':'world-desktop.webp');
      expect(css.position).toBe('fixed');
      expect(css.glass).toContain('linear-gradient');
      expect(css.headingWeight).toBe('600');
      expect(css.inlineStyles).toBe(0);
      expect(css.overflow).toBeLessThanOrEqual(1);
      const expected=await page.request.get(SHEET);
      expect(expected.ok()).toBe(true);
      expect(await expected.text()).toContain('.world-backdrop');
    });
  }
}
