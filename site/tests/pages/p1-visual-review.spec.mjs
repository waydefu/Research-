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
