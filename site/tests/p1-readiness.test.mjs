import test from 'node:test';
import assert from 'node:assert/strict';
import {p1ReadinessInventory} from '../src/lib/p1-readiness.mjs';

test('P1 inventory covers all files without silently marking source claims verified',()=>{
  const audit=p1ReadinessInventory();
  assert.ok(audit.totalSources>=90);
  assert.equal(audit.files.length,audit.totalSources);
  assert.equal(new Set(audit.files.map(d=>d.path)).size,audit.totalSources);
  assert.equal(audit.curatedPublicGuides+audit.remainingWithoutEditedGuide,audit.totalSources);
  assert.equal(audit.boundedSourceReviews,audit.remainingWithoutEditedGuide);
  assert.equal(audit.structuralPass,true,JSON.stringify(audit.faults));
  assert.ok(audit.files.every(x=>x.metadataReviewed&&x.reviewedLead&&x.visualPath));
  assert.ok(audit.files.every(x=>x.publicGuide||x.reviewRegistered));
  assert.ok(audit.files.every(x=>!x.claimsFullyVerified&&!x.visualRightsHumanApproved));
  assert.equal(audit.fullyExternallyVerifiedClaims,0);
  assert.equal(audit.humanApprovedGraphics,0);
  assert.equal(audit.physicalDevicesValidated,0);
  assert.equal(audit.goldenScreenshotApproved,false);
});
