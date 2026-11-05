import {test,expect} from '@playwright/test';
const LAB='/Research-/v3/atlas/g1/';
const ARCHIVE='/Research-/v3/library/';

for(const width of [320,393,768,1440]){
  test('P2 G1 opt-in lab preserves static content and optional GPU at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:width<=430?852:900});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(LAB);
    await expect(page.getByRole('heading',{level:1,name:/一座可以轉動的/})).toBeVisible();
    await expect(page.getByRole('link',{name:/直接閱讀研究/})).toHaveAttribute('href',ARCHIVE);
    const stage=page.locator('#renderStage');
    await expect(stage).toHaveAttribute('data-renderer',/^(poster|webgl2)$/);
    const state=await stage.getAttribute('data-renderer');
    if(state==='webgl2'){
      const size=await page.locator('#g1-canvas').evaluate(el=>[el.width,el.height]);
      expect(size[0]).toBeGreaterThan(1);
      expect(size[1]).toBeGreaterThan(1);
      await page.getByRole('button',{name:'重新播放鏡頭'}).click();
      await page.getByRole('button',{name:'節能解析度：關'}).click();
      await expect(page.getByRole('button',{name:'節能解析度：開'})).toHaveAttribute('aria-pressed','true');
      await page.getByRole('button',{name:/播放動畫|暫停動畫/}).click();
    }else{
      await expect(page.locator('#poster')).toBeVisible();
      await expect(page.locator('#controls')).toBeHidden();
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
test('G1 deterministic forced fallback keeps paper navigation and no active controls',async({page})=>{
  await page.goto(LAB+'?forcePoster=1');
  await expect(page.locator('#renderStage')).toHaveAttribute('data-renderer','poster');
  await expect(page.locator('#renderStatus')).toContainText('已強制使用靜態構圖');
  await expect(page.locator('#controls')).toBeHidden();
  await page.getByRole('link',{name:/直接閱讀研究/}).click();
  await expect(page).toHaveURL(new RegExp(ARCHIVE));
});
test('G1 no-JavaScript mode retains poster, context and navigation',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:393,height:852}});
  const page=await context.newPage();
  await page.goto(LAB);
  await expect(page.locator('#poster')).toBeVisible();
  await expect(page.locator('#controls')).toBeHidden();
  await expect(page.getByRole('heading',{level:1,name:/一座可以轉動的/})).toBeVisible();
  await page.getByRole('link',{name:/直接閱讀研究/}).click();
  await expect(page).toHaveURL(new RegExp(ARCHIVE));
  await context.close();
});
test('G1 respects reduced-motion preference when GPU is available',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(LAB);
  if(await page.locator('#renderStage').getAttribute('data-renderer')==='webgl2'){
    await expect(page.getByRole('button',{name:'播放動畫'})).toHaveAttribute('aria-pressed','true');
  }else await expect(page.locator('#poster')).toBeVisible();
});
