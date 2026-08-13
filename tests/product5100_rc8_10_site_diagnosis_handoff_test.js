const fs=require('fs');
const code=fs.readFileSync('distribution/Code.gs','utf8');
function ok(v,msg){if(!v){console.error('FAIL:',msg);process.exit(1);}console.log('PASS:',msg);}
ok(code.includes(".addItem('5．Site Diagnosisの診断結果を受け取る','sbmDoctorRegisterSiteDiagnosisResult')"),'Site Diagnosis intake menu exists');
ok(code.includes('function sbmDoctorRegisterSiteDiagnosisResult()'),'intake handler exists');
ok(code.includes('function sbmDoctorSiteDiagnosisIdentity_(o)'),'identity extractor exists');
ok(code.includes("'SiteDiagnosisBatchID','SiteDiagnosisCaseID'"),'trace columns appended to Doctor_Cases');
ok(code.includes("cc=o.case_context||{}"),'V2 normalizer accepts case_context');
ok(code.includes("o.case_id||cc.case_id||cc.individual_case_id"),'external CaseID is preserved');
ok(code.includes("if(localSite&&localSite!==id.siteId)"),'SiteID mismatch guard exists');
ok(code.includes("sbmNormalizeUrl_(storedUrl)!==sbmNormalizeUrl_(id.articleUrl)"),'article URL mismatch guard exists');
ok(code.includes('req.site_diagnosis_context={site_diagnosis_batch_id:id.siteDiagnosisBatchId'),'Writer referral keeps traceability');
ok(code.includes('var planned=Array.isArray(tp.actions)?tp.actions:[];'),'Site Diagnosis treatment actions are normalized');
console.log('All Site Diagnosis handoff tests passed.');
