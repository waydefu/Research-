import {allDocs} from '../src/lib/catalog.mjs';
import {auditPublicDocs} from '../src/lib/public-content-audit.mjs';
const report=auditPublicDocs(allDocs());
if(process.argv.includes('--json'))console.log(JSON.stringify(report,null,2));
else{
  console.log('公開來源：'+report.total+' 篇；已有完整技術正文：'+report.curated+' 篇');
  for(const [label,count] of Object.entries(report.counts))console.log(label+'：'+count);
  if(!process.argv.includes('--summary')){
    console.log('| 來源 | 文字訊號風險 | 公開正文 |');
    console.log('| --- | --- | --- |');
    for(const item of report.records)console.log('| '+item.file+' | '+item.priority+' | '+item.publicBody+' |');
  }
}
