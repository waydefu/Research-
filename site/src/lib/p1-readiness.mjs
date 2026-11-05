// P1 readiness is a machine-checkable coverage inventory, not a legal,
// aesthetic or scientific certification. No network calls or source edits.
import {allDocs} from './catalog.mjs';
import {PUBLIC_ARTICLES} from './public-articles.mjs';
import {REVIEWED_DOCUMENTS} from './research-taxonomy.mjs';
import {EDITORIAL_LEADS} from './research-leads.mjs';
import {visualForDoc} from './research-visuals.mjs';
import {reviewForSource,REVIEW_COUNT} from './source-review.mjs';

export function p1ReadinessInventory(docs=allDocs()){
  const known=new Set(docs.map(d=>d.file));
  const files=docs.map(doc=>{
    const artwork=visualForDoc(doc);
    const guide=Boolean(PUBLIC_ARTICLES[doc.file]);
    const review=reviewForSource(doc.file);
    return {
      path:doc.file,
      publicTitle:doc.publicTitle,
      sourceSha:doc.sha,
      publicGuide:guide,
      reviewRegistered:Boolean(review),
      evidenceScope:guide?'編輯技術正文（非全文外部事實查證）':
        review?'已記錄有限來源處置（非全文外部事實查證）':'未登錄來源處置',
      claimsFullyVerified:false,
      reviewDate:review?.dispositionReviewedOn||null,
      reviewedLead:Boolean(EDITORIAL_LEADS[doc.file]),
      metadataReviewed:Boolean(REVIEWED_DOCUMENTS[doc.file]),
      visualStatus:artwork.src?'原創示意圖已生成；待逐張人工驗收':'未有研究專屬素材',
      visualPath:artwork.src,
      visualRightsHumanApproved:false
    };
  });
  const faults={
    missingMetadata:files.filter(x=>!x.metadataReviewed).map(x=>x.path),
    missingLead:files.filter(x=>!x.reviewedLead).map(x=>x.path),
    missingIllustration:files.filter(x=>!x.visualPath).map(x=>x.path),
    missingBoundedReview:files.filter(x=>!x.publicGuide&&!x.reviewRegistered).map(x=>x.path),
    orphanedPublicGuides:Object.keys(PUBLIC_ARTICLES).filter(path=>!known.has(path)),
    orphanedMetadata:Object.keys(REVIEWED_DOCUMENTS).filter(path=>!known.has(path)),
    orphanedLeads:Object.keys(EDITORIAL_LEADS).filter(path=>!known.has(path)),
    expectedReviewCountMismatch:REVIEW_COUNT!==files.filter(x=>!x.publicGuide).length
  };
  const structuralPass=Object.entries(faults).every(([key,value])=>key==='expectedReviewCountMismatch'?!value:value.length===0);
  return {
    schemaVersion:1,
    source:'local Git checkout; counts reflect exact source files at invocation',
    structuralPass,
    totalSources:files.length,
    curatedPublicGuides:files.filter(x=>x.publicGuide).length,
    remainingWithoutEditedGuide:files.filter(x=>!x.publicGuide).length,
    boundedSourceReviews:files.filter(x=>x.reviewRegistered).length,
    // Absence of an external fact check is deliberately not called a failure
    // of file coverage. These are separate editorial and research decisions.
    fullyExternallyVerifiedClaims:0,
    humanApprovedGraphics:0,
    physicalDevicesValidated:0,
    goldenScreenshotApproved:false,
    blockers: [
      '尚未逐篇核對全部外部主張與時效',
      '圖片的主題契合度與權利仍需人工確認',
      'Android 與 iOS 實機及真實使用效能未驗收',
      'Owner 尚未核准 Golden Screenshots 與最終 G0 美術'
    ],
    faults,files
  };
}
