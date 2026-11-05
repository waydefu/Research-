import {test,expect} from '@playwright/test';

const LEGACY='/Research-/v2/';
const LIBRARY='/Research-/v3/library/';

test('external old V2 bookmark reaches the maintained original-source research library',async({page})=>{
  await page.goto(LEGACY);
  await expect(page).toHaveURL(/\/Research-\/v3\/library\//);
  await expect(page.getByRole('heading',{name:/想了解一項技術/})).toBeVisible();
  await expect(page.locator('a[href^="/Research-/v3/"]')).not.toHaveCount(0);
});

test('retired V2 is only a tiny SEO-safe redirect, with no shadow website assets',async({page})=>{
  const response=await page.request.get(LEGACY);
  expect(response.ok()).toBe(true);
  const html=await response.text();
  expect(html).toContain('url=/Research-/v3/library/');
  expect(html).toContain('noindex,follow');
  expect(html).not.toContain('<script');
  expect(html).not.toContain('THE UNKNOWN,');
  for(const file of ['app.js','styles.css','reader-links.js','data/research-index.json','assets/og.svg']){
    expect((await page.request.get(LEGACY+file)).status(),file).toBe(404);
  }
});
