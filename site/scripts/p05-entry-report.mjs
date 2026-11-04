// Read-only local P0.5 evidence inventory, never a live GitHub CI or device attestation.
import {allDocs} from '../src/lib/catalog.mjs';
import {reviewedCoverage,TOPIC_DESCRIPTORS} from '../src/lib/research-taxonomy.mjs';
import {editorialLeadCoverage} from '../src/lib/research-leads.mjs';
import {visualCoverage} from '../src/lib/research-visuals.mjs';
import {publicBodyCoverage} from '../src/lib/public-articles.mjs';
const docs=allDocs(),files=docs.map(d=>d.file);
const classified=reviewedCoverage(files);
const leads=editorialLeadCoverage(files);
const art=visualCoverage(docs);
const bodies=publicBodyCoverage(files);
const evidence={
  documents:docs.length,topics:Object.keys(TOPIC_DESCRIPTORS).length,
  classified:classified.reviewed,unmatchedTaxonomy:classified.unmatched,staleTaxonomy:classified.stale,
  editorLeads:docs.length-leads.missing.length,missingLeads:leads.missing,staleLeads:leads.stale,
  articleVisuals:art.known,missingVisuals:art.unknown,
  publicTechnicalBodies:bodies.ready,pendingEditorial:docs.length-bodies.ready,staleBodies:bodies.stale
};
const dataIntegrityPass=[classified.unmatched.length,classified.stale.length,leads.missing.length,leads.stale.length,art.unknown.length,bodies.stale.length].every(n=>n===0);
const report={kind:'local-source-and-design-evidence',dataIntegrityPass,evidence,
  independentChecks:['GitHub PR/latest-main CI after integrating open PRs','true-device mobile and iOS performance','human visual and source-fact reviews','remaining project-history editorial backlog'],
  note:'P0.5 資料檢查不是 P1 production 開工或最終 G0 驗收的自動授權。'};
if(process.argv.includes('--json')) console.log(JSON.stringify(report,null,2));
else {
  console.log('P0.5 本地內容核對：'+(report.dataIntegrityPass?'資料契約 PASS':'資料契約 FAIL'));
  console.log(`來源 ${evidence.documents}｜分類 ${evidence.classified}｜導讀 ${evidence.editorLeads}｜示意圖 ${evidence.articleVisuals}｜公開技術正文 ${evidence.publicTechnicalBodies}｜待整理 ${evidence.pendingEditorial}`);
  console.log('注意：不代表所有原文已通用化，也不代表最新 main CI、真機或視覺驗收通過。');
}
if(!dataIntegrityPass)process.exitCode=1;
