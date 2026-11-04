import {test,expect} from '@playwright/test';

for(const width of [393,1440]){
  test('P1 pre-entry visual evidence captures canonical pages and palette at '+width+'px',async({page},testInfo)=>{
    await page.setViewportSize({width,height:width<500?852:900});
    for(const [name,route] of [
      ['sanctum','/Research-/'],
      ['library','/Research-/v3/library/'],
      ['search','/Research-/v3/search/'],
      ['article','/Research-/v3/research/2026-11-universal-web-engine/17-arctic-waters-threejs-creative-workflow/']
    ]){
      await page.goto(route);
      await expect(page.locator('body')).not.toBeEmpty();
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
      expect(overflow,'horizontal overflow on '+name+' '+width).toBeLessThanOrEqual(1);
      if(name!=='sanctum'){
        const tokens=await page.evaluate(()=>{
          const css=getComputedStyle(document.documentElement);
          return {space:css.getPropertyValue('--palette-space-0').trim(),
            gold:css.getPropertyValue('--palette-gold-primary').trim(),
            cyan:css.getPropertyValue('--palette-cyan-plasma').trim()};
        });
        expect(tokens).toEqual({space:'#0a101d',gold:'#e4b451',cyan:'#40d4de'});
      }
      await page.screenshot({path:testInfo.outputPath('p1-manual-review-'+width+'-'+name+'.png'),fullPage:true});
    }
  });
}

/* P1 G0-01: verify rendered CSS and accessibility fallback, not only source text.
   Screenshots above remain Owner-reviewed evidence, not an approved golden. */
for(const width of [393,1440]){
  test('P1 G0-01 editorial flow and reduced-motion at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:width<500?852:900});
    await page.goto('/Research-/v3/library/');
    await expect(page.getByRole('link',{name:/全文搜尋所有研究/})).toBeVisible();
    await expect(page.locator('.exhibit-list .domain-scene img').first()).toBeVisible();
    const style=await page.evaluate(()=>{
      const intro=document.querySelector('.archive-intro');
      const section=document.querySelector('.section-heading');
      return {
        veil:getComputedStyle(intro,'::after').backgroundImage,
        rule:getComputedStyle(section,'::after').backgroundColor,
        width:getComputedStyle(section,'::after').width,
        main:getComputedStyle(document.getElementById('main')).backgroundImage
      };
    });
    expect(style.veil).toContain('linear-gradient');
    expect(parseFloat(style.width)).toBeGreaterThan(0);
    expect(style.main).toContain('radial-gradient');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);

    await page.emulateMedia({reducedMotion:'reduce'});
    // The existing global accessibility policy uses .01ms !important rather
    // than a literal 0s. Assert effectively zero motion, not CSS serialization.
    const reducedMotion=await page.locator('.exhibit-list .domain-scene img').first().evaluate(img=>{
      const computed=getComputedStyle(img);
      return {
        durationSeconds:computed.transitionDuration.split(',').map(value=>{
          const duration=value.trim();
          return duration.endsWith('ms') ? parseFloat(duration)/1000 : parseFloat(duration);
        }),
        transform:computed.transform
      };
    });
    expect(reducedMotion.durationSeconds.length).toBeGreaterThan(0);
    expect(reducedMotion.durationSeconds.every(n=>Number.isFinite(n) && n<=0.001)).toBe(true);
    expect(reducedMotion.transform).toBe('none');
  });
}
