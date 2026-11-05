import {test,expect} from '@playwright/test';

test('retired low-poly G1 link resolves to exactly one maintained preview',async({page})=>{
  await page.goto('/Research-/v3/atlas/g1/');
  await expect(page).toHaveURL(/\/Research-\/v3\/observatory\/\/?$/);
  await expect(page.getByRole('heading',{level:1,name:/在未知的邊界/})).toBeVisible();
  await expect(page.locator('#obs-scene')).toBeAttached();
});
test('legacy prototype no longer serves its obsolete renderer or stylesheet',async({page})=>{
  await page.goto('/Research-/v3/observatory/?poster=1');
  const oldScript=await page.request.get('/Research-/v3/atlas/g1/g1.js');
  const oldCSS=await page.request.get('/Research-/v3/atlas/g1/g1.css');
  expect(oldScript.status()).toBe(404);
  expect(oldCSS.status()).toBe(404);
  await expect(page.locator('#obs-scene')).toHaveAttribute('data-renderer','poster');
});
