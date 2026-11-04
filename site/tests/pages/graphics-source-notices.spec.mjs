import {test,expect} from '@playwright/test';

const sourceSlugs=[
  '27-threejs-r187-ultra-rendering-ceiling',
  '28-advanced-shader-pipeline-and-hd2d-recipes',
  '29-rendering-ceiling-benchmark-and-adoption-gates'
];
for(const slug of sourceSlugs){
  test('G0-03 graphics source panel is visible and does not claim a benchmark: '+slug,async({page})=>{
    await page.setViewportSize({width:393,height:852});
    await page.goto('/Research-/v3/research/2026-11-universal-web-engine/'+slug+'/');
    const panel=page.getByRole('region',{name:'原始研究的來源審核與限制'});
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('尚未實測');
    await expect(panel).toContainText('並未逐項獨立驗證');
    await expect(panel.getByRole('link').first()).toHaveAttribute('href',/^https:\/\//);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  });
}
test('source warnings remain readable with JavaScript disabled',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:393,height:852}});
  const page=await context.newPage();
  await page.goto('/Research-/v3/research/2026-11-universal-web-engine/29-rendering-ceiling-benchmark-and-adoption-gates/');
  await expect(page.locator('.source-review')).toContainText('尚未實測');
  await context.close();
});
