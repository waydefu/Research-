// Independent evidence registers are editorial overlays. A registered
// disposition is not comprehensive external verification of the source.
import issue59 from '../../P1-ISSUE59-REVIEW.json';
import graphics from '../../P1-2026-11-05-GRAPHICS-REVIEW.json';

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
const records=new Map(rows.map(row=>[row.path,Object.freeze(row)]));
export function reviewForSource(file){
  return records.get(file)||null;
}
export const REVIEW_COUNT=records.size;
