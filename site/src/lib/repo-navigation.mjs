// Task-oriented repository navigation. Paths are audited by site/tests/repo-navigation.test.mjs.
// Do not record guessed runtime calls or embed hard-coded main SHA: GitHub is authoritative.
export const REPO_NAVIGATION = Object.freeze([
  {
    id:'governance',title:'授權、審查與 Agent 規範',intent:'要知道哪些操作獲得批准、何時須 Owner 審查',
    entry:'AGENTS.md',
    paths:['AGENTS.md','site/AGENTS.md','site/HANDOFF-CURRENT.md','docs/governance/OPERATIONS.md','site/src/lib/repo-navigation.mjs','.agents/skills/research-evidence/SKILL.md','.agents/skills/research-governance/SKILL.md'],
    checks:['scripts/check_repository.py','tests/test_research_search.py']
  },
  {
    id:'content',title:'研究來源與站內路徑',intent:'新增研究、修正連結、確保原文沒有被修改',
    entry:'site/src/lib/catalog.mjs',
    paths:['research/','docs/governance/','showcase/design/','site/src/lib/catalog.mjs','site/src/content.config.ts','site/src/lib/remark-links.mjs','site/src/lib/rehype-tables.mjs','site/src/pages/graph.json.ts'],
    checks:['site/tests/catalog.test.mjs','site/scripts/preflight.mjs','site/scripts/provenance-audit.mjs']
  },
  {
    id:'metadata',title:'繁中標題、分類與證據',intent:'標題分類錯誤、來源不可信、導讀與原文混淆',
    entry:'site/src/lib/research-taxonomy.mjs',
    paths:['site/src/lib/research-taxonomy.mjs','site/src/lib/research-metadata.mjs','site/src/lib/metadata-schema.mjs','site/src/lib/public-articles.mjs','site/src/lib/public-content-audit.mjs','site/src/lib/source-review.mjs','site/src/lib/p1-readiness.mjs','site/RESEARCH-CURATION.md'],
    checks:['site/tests/research-taxonomy.test.mjs','site/tests/research-metadata.test.mjs','site/tests/metadata-schema.test.mjs','site/tests/public-articles.test.mjs','site/tests/issue59-source-review.test.mjs','site/tests/pages/public-articles.spec.mjs'],
    optionalPaths:['site/src/lib/research-leads.mjs'],
    optionalChecks:['site/tests/research-leads.test.mjs']
  },
  {
    id:'art',title:'領域圖片與顯示素材',intent:'文章缺圖、圖片不相關、素材權利／顯示差異',
    entry:'site/src/lib/exhibit-info.mjs',
    paths:['site/src/lib/exhibit-info.mjs','site/public/research-exhibits/','site/design/OBSERVATORY-REFERENCE-AND-OPEN-DESIGN.md'],
    checks:['site/tests/pages/research-exhibits.spec.mjs'],
    optionalPaths:['site/src/lib/research-visuals.mjs','site/scripts/generate-research-art.mjs'],
    optionalChecks:['site/tests/research-visuals.test.mjs','site/tests/pages/research-visuals.spec.mjs']
  },
  {
    id:'pages',title:'典藏、搜尋與全文閱讀',intent:'頁面／主題入口或全文搜尋錯誤',
    entry:'site/src/pages/library/index.astro',
    paths:['site/src/pages/library/index.astro','site/src/pages/domains/[domain].astro','site/src/pages/[collection]/[...slug].astro','site/src/pages/search.astro','site/src/layouts/Base.astro','site/src/lib/atlas-concepts.mjs','site/src/styles/global.css'],
    checks:['site/tests/pages/research-discovery.spec.mjs','site/tests/browser/p0.spec.mjs','site/tests/pages/p1-mobile-clarity.spec.mjs']
  },
  {
    id:'homepage',title:'單一 Sanctum 首頁與 Astro 發布',intent:'首頁視覺、跨頁連結、舊版入口轉址及單一 Pages 封裝',
    entry:'site/scripts/unify-home.mjs',
    paths:['site/public/atlas/sanctum/index.html','site/scripts/unify-home.mjs','site/scripts/build-haloflux-integration.mjs','site/scripts/verify-pages-bundle.mjs'],
    checks:['site/tests/pages/unified-home.spec.mjs','site/tests/pages/sanctum-fullpage.spec.mjs','site/tests/pages/haloflux-research-integration.spec.mjs']
  },
  {
    id:'quality',title:'建置、回歸與來源 SHA',intent:'CI 失敗、Pagefind 缺頁、手機無 JS 閱讀',
    entry:'site/package.json',
    paths:['site/package.json','site/scripts/postbuild-verify.mjs','site/scripts/preflight.mjs','site/scripts/provenance-audit.mjs','site/scripts/audit-public-content.mjs','site/scripts/p05-entry-report.mjs','site/scripts/p1-readiness-report.mjs','site/src/experience/observatory/singularity-shader.js','site/src/experience/observatory/singularity.js','site/src/experience/observatory/scene.js','.github/workflows/research-integrity.yml','.github/workflows/v3-p0-build.yml','.github/workflows/publish-showcase.yml'],
    checks:['site/tests/observatory-shader.test.mjs','site/tests/catalog.test.mjs','site/tests/pages/v2-reader.spec.mjs','scripts/check_repository.py']
  },
  {
    id:'search',title:'Repo 內全文搜尋、索引與新鮮度',intent:'查找證據，拒絕過期 Markdown 搜尋結果',
    entry:'scripts/research_search.py',
    paths:['scripts/research_search.py','docs/governance/REPO-TOOLING.md','site/src/pages/graph.json.ts','site/src/pages/search.astro'],
    checks:['tests/test_research_search.py','site/tests/pages/research-discovery.spec.mjs']
  }
]);
export const unregisteredModules=(files,sections=REPO_NAVIGATION)=>{
  const registered=new Set(sections.flatMap(s=>[
    ...s.paths,...s.checks,...(s.optionalPaths||[]),...(s.optionalChecks||[])
  ]));
  return files.filter(file=>!registered.has(file));
};
export function navForTask(query){
  const s=String(query||'').toLocaleLowerCase('zh-Hant');
  if(/權限|agent|規範|授權|ruleset|approval/.test(s))return REPO_NAVIGATION.find(x=>x.id==='governance');
  if(/圖片|素材|圖像|插圖|svg|license/.test(s))return REPO_NAVIGATION.find(x=>x.id==='art');
  if(/分類|標題|導讀|公開正文|技術正文|內容稽核|metadata|tag/.test(s))return REPO_NAVIGATION.find(x=>x.id==='metadata');
  if(/首頁|sanctum|v2|封裝/.test(s))return REPO_NAVIGATION.find(x=>x.id==='homepage');
  if(/索引|ft[s5]|搜尋檔|舊資料/.test(s))return REPO_NAVIGATION.find(x=>x.id==='search');
  if(/ci|test|測試|build|部署|source sha/.test(s))return REPO_NAVIGATION.find(x=>x.id==='quality');
  if(/文章|markdown|來源|網址/.test(s))return REPO_NAVIGATION.find(x=>x.id==='content');
  if(/頁面|搜尋|導覽|樣式|顯示/.test(s))return REPO_NAVIGATION.find(x=>x.id==='pages');
  return null;
}
