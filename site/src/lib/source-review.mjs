// Independent evidence registers are editorial overlays. A registered
// disposition is not comprehensive external verification of the source.
import issue59 from '../../P1-ISSUE59-REVIEW.json' with {type:'json'};
import graphics from '../../P1-2026-11-05-GRAPHICS-REVIEW.json' with {type:'json'};
import ongoing from '../../P1-ONGOING-SOURCE-REVIEW.json' with {type:'json'};

const rows=[...issue59.items];
const known=new Set(rows.map(row=>row.path));
for(const row of graphics.items){
  if(known.has(row.path))throw new Error('Duplicate source review: '+row.path);
  known.add(row.path);
  // Graphics research uses a separate schema: normalize it into the public
  // evidence-panel contract without inventing benchmarking or legal approval.
  rows.push({
    path:row.path,
    dispositionReviewedOn:row.reviewedOn,
    publicNotice:'這是有範圍限制的圖形工程研究，僅核對特定官方功能及來源；效能尚未實測，所有外部主張並未逐項獨立驗證。',
    dispositionReason:row.verifiedScope,
    additionalEvidenceScope:null,
    adoptionGate:row.remainingWork,
    evidenceUrls:[...row.knownSources],
    additionalEvidenceUrls:[],
    externallyVerifiedAllClaims:row.externallyVerifiedAllClaims,
    benchmarkStatus:row.benchmarkStatus
  });
}
if(ongoing.schemaVersion!==1||!Array.isArray(ongoing.items))
  throw new Error('Invalid ongoing source review registry');
for(const row of ongoing.items){
  if(!row.path||known.has(row.path))throw new Error('Duplicate or blank ongoing source review: '+row.path);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(row.reviewedOn||''))throw new Error('Source review date required: '+row.path);
  for(const key of ['sourceRevision','sourceBlobSha']){
    if(!/^[0-9a-f]{40}$/.test(row[key]||''))throw new Error('Source review missing exact '+key+': '+row.path);
  }
  for(const field of ['publicNotice','verifiedScope','remainingWork']){
    if(typeof row[field]!=='string'||row[field].trim().length<25)
      throw new Error('Source review missing '+field+': '+row.path);
  }
  if(!Array.isArray(row.knownSources)||!row.knownSources.every(u=>typeof u==='string'&&u.startsWith('https://')))
    throw new Error('Source review has invalid HTTPS evidence URLs: '+row.path);
  if(row.externallyVerifiedAllClaims===true)
    throw new Error('A bounded source intake cannot declare full independent verification: '+row.path);
  known.add(row.path);
  rows.push({
    path:row.path,
    dispositionReviewedOn:row.reviewedOn,
    publicNotice:row.publicNotice,
    dispositionReason:row.verifiedScope,
    additionalEvidenceScope:null,
    adoptionGate:row.remainingWork,
    evidenceUrls:[...row.knownSources],
    additionalEvidenceUrls:[],
    externallyVerifiedAllClaims:false
  });
}
const records=new Map(rows.map(row=>[row.path,Object.freeze(row)]));
export function reviewForSource(file){
  return records.get(file)||null;
}
export const REVIEW_COUNT=records.size;
