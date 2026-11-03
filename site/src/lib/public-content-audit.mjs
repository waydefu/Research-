// Per-source triage flags across all public Markdown. Not a correctness verdict.
import {getPublicArticle} from './public-articles.mjs';
const internal=[/Research-/gi,/THE OBSERVATORY/gi,/本專案|本 Repo|本 repo|這個 Repo|這個專案|本站|本輪|Owner/gi];
const delivery=[/PR\s*#?\d+/gi,/\bP(?:0(?:\.5)?|1|2|3|4|5)\b/gi,/\bV[23]\b/gi,/交接|開工授權|當前 main|現況基線|工作包/gi];
const count=(s,terms)=>terms.reduce((n,re)=>n+Array.from(String(s).matchAll(re)).length,0);
export const auditPublicDoc=doc=>{
  const internalHits=count(doc.text,internal),deliveryHits=count(doc.text,delivery);
  const priority=internalHits>=2&&deliveryHits>=2?'優先整理':
    internalHits>0||deliveryHits>=2?'人工核對':'一般內容候選';
  return {file:doc.file,priority,internalHits,deliveryHits,
    kind:/(?:\/(?:README|SOURCES|RESEARCH-TEMPLATE)\.md$|\/EAG-100-AUDIT-TEMPLATE\.md$)/.test(doc.file)?'索引／模板':'文章／紀錄',
    publicBody:getPublicArticle(doc.file)?'已完成技術正文':'尚待逐篇審核'};
};
export const auditPublicDocs=docs=>{
  const records=docs.map(auditPublicDoc),counts={};
  for(const r of records)counts[r.priority]=(counts[r.priority]||0)+1;
  return {total:records.length,counts,curated:records.filter(x=>x.publicBody==='已完成技術正文').length,records};
};
