import { test, expect } from '@playwright/test';

test('clicking a V2 research title opens its V3 article in the same tab', async ({page}) => {
  await page.goto('./');
  await expect(page.locator('#results .result-title[href]').first()).toBeVisible();
  const firstRow = page.locator('#results .result').filter({has: page.locator('.result-title[href]')}).first();
  const reader = firstRow.locator('.result-title');
  const target = await reader.getAttribute('href');
  expect(target).toMatch(/^\.\/v3\/(research|governance)\/.+\/$/);
  const source = firstRow.locator('a.result-source');
  await expect(source).toHaveAttribute('href', /github\.com\/waydefu\/Research-\/blob\//);
  await expect(source).toHaveAttribute('target','_blank');
  await expect(source).toHaveAttribute('rel', /noopener/);
  await reader.click();
  await expect(page).toHaveURL(/\/Research-\/v3\/(research|governance)\//);
  await expect(page.locator('article[data-pagefind-body]')).toBeVisible();
  await expect(page.locator('article .article-content')).not.toBeEmpty();
});

test('sources V3 intentionally excludes have no broken V3 title link', async ({page}) => {
  await page.goto('./');
  await expect(page.locator('#results .result-title[href]').first()).toBeVisible();
  await page.locator('#research-search').fill('docs/governance/THREAT-MODEL.md');
  const row = page.locator('#results .result');
  await expect(row).toHaveCount(1);
  await expect(row.locator('.result-unavailable')).toBeVisible();
  await expect(row.locator('.result-title[href]')).toHaveCount(0);
  await expect(row.locator('a.result-source')).toHaveAttribute('href', /github\.com\/waydefu\/Research-\/blob\//);
});
