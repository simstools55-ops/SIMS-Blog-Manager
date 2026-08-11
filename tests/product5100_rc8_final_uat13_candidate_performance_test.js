const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(c,m){if(!c){console.error('FAIL:',m);process.exit(1)}console.log('PASS:',m)}
const s2=code.slice(code.indexOf('function sbmDoctorCandidateProgressStep2_(){'),code.indexOf('function sbmDoctorCandidateLoadContext_(){'));
ok(!s2.includes('sbmDoctorReconcileCompletedTreatments_'),'candidate STEP 2 does not run heavy reconciliation');
ok(!s2.includes('sbmUpdateEffectiveness'),'candidate STEP 2 does not recalculate effectiveness');
ok(s2.includes('getDocumentCache().put'),'candidate STEP 2 persists compact exclusion cache');
ok(code.includes('function sbmDoctorIsUntreatedCurrentCandidateCached_'),'candidate STEP 3 has O(1) cached exclusion check');
ok(code.includes('sbmDoctorRebuildCandidateViewFromSnapshot_(ctx)'),'candidate STEP 3 passes cached context');
ok(code.includes('return sbmDoctorIsUntreatedCurrentCandidateCached_(candidateContext,id,url);'),'candidate pool no longer does per-article sheet/case lookup');
