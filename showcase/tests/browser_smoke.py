import json
from pathlib import Path
from playwright.sync_api import sync_playwright
base=Path(__file__).resolve().parents[1]
html=(base/'index.html').read_text().replace('<script src="./app.js" type="module" defer></script>','').replace('<link rel="stylesheet" href="./styles.css" />','')
css=(base/'styles.css').read_text()
artifact=(base/'artifact.js').read_text().replace('export function mountArtifact','function mountArtifact')
app=(base/'app.js').read_text().replace("import {mountArtifact} from './artifact.js';",'')
fixture=json.loads((base/'data/research-index.json').read_text())
result=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-webgl'])
 for name,width,height in [('desktop',1440,900),('mobile',390,844)]:
  page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1,is_mobile=name=='mobile',has_touch=name=='mobile')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded')
  page.add_style_tag(content=css)
  page.evaluate('data => { window.fetch=async () => ({ok:true,json:async()=>data}) }',fixture)
  page.add_script_tag(content=artifact+'\n'+app)
  page.wait_for_timeout(1200)
  heading=page.locator('h1').inner_text();status=page.locator('#index-status').inner_text();initial=page.locator('.result').count()
  page.screenshot(path=str(base/f'{name}.png'),full_page=True,animations='disabled')
  page.locator('#research-search').fill('WebGPU');page.wait_for_timeout(300);filtered=page.locator('.result').count()
  if name=='mobile':
   page.locator('#menu-toggle').click();menu=page.locator('#mobile-nav').is_visible();assert menu
  else: menu=False
  if name=='mobile':page.screenshot(path=str(base/'mobile-menu.png'),full_page=False,animations='disabled')
  info={'device':name,'status':status,'heading':heading,'initialRows':initial,'filteredRows':filtered,'menu':menu,'errors':errors,'renderer':page.locator('#hero-renderer').inner_text(),'scrollWidth':page.evaluate('document.documentElement.scrollWidth'),'clientWidth':page.evaluate('document.documentElement.clientWidth')}
  result.append(info)
  assert not errors,errors
  assert filtered>0,'search should find WebGPU'
  # Interacting with the visual graph must synchronize the source filter and both selected states.
  page.locator('#domain-legend button').first.click()
  assert page.locator('#filter-bar button').nth(1).get_attribute('aria-pressed')=='true'
  assert page.locator('.domain-map g.node').first.get_attribute('aria-pressed')=='true'
  assert page.locator('.domain-map g.node.node--active').count()==1
  if name=='desktop':
   page.locator('.domain-map g.node').nth(1).focus()
   page.keyboard.press('Enter')
   assert page.locator('#filter-bar button').nth(2).get_attribute('aria-pressed')=='true'
   assert page.locator('#explorer-title').evaluate('(el) => document.activeElement === el'), 'keyboard graph activation should move focus to explorer'
  page.locator('#filter-bar button').last.click()
  assert page.locator('#filter-bar button').last.get_attribute('aria-pressed')=='true'
  assert page.locator('#results-count').inner_text().endswith('條研究')
  assert info['scrollWidth']<=info['clientWidth']+2,'horizontal overflow'
  page.close()
 browser.close()
print(json.dumps(result,ensure_ascii=False,indent=2))