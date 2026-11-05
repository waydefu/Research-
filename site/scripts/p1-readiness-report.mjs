#!/usr/bin/env node
// Run from site/: node scripts/p1-readiness-report.mjs [--json] [--strict]
// Reports source coverage and outstanding human gates; never fabricates PASS.
import {p1ReadinessInventory} from '../src/lib/p1-readiness.mjs';
const audit=p1ReadinessInventory();
const opts=new Set(process.argv.slice(2));
if(opts.has('--json')||opts.has('--records'))console.log(JSON.stringify(
  opts.has('--records')?audit:{...audit,files:undefined},null,2));
else{
  console.log('P1 evidence inventory (structural): '+(audit.structuralPass?'PASS':'FAIL'));
  console.log('Sources: '+audit.totalSources+'; edited guides: '+audit.curatedPublicGuides+
    '; pending edited guides: '+audit.remainingWithoutEditedGuide+
    '; scoped review records: '+audit.boundedSourceReviews);
  console.log('Human art/golden, actual Android/iOS, claim-by-claim fact checks: NOT VERIFIED');
  for(const [name,value] of Object.entries(audit.faults)){
    if(Array.isArray(value)&&value.length)console.error(name+': '+value.join(', '));
    else if(typeof value==='boolean'&&value)console.error(name+': true');
  }
}
if(opts.has('--strict')&&!audit.structuralPass)process.exitCode=1;
