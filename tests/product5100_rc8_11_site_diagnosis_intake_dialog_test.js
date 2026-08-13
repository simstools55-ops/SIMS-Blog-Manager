const fs=require('fs');
const code=fs.readFileSync('distribution/Code.gs','utf8');
function ok(v,msg){if(!v){console.error('FAIL:',msg);process.exit(1);}console.log('PASS:',msg);}
ok(code.includes(".addItem('5．Site Diagnosisの診断結果を受け取る','sbmDoctorRegisterSiteDiagnosisResult')"),'menu still points to intake handler');
ok(code.includes('function sbmDoctorSubmitSiteDiagnosisResult(rawText)'),'server submit handler exists');
const start=code.indexOf('function sbmDoctorRegisterSiteDiagnosisResult(){');
const end=code.indexOf('function sbmDoctorSubmitSiteDiagnosisResult(rawText)',start);
const intake=code.slice(start,end);
ok(intake.includes('showModalDialog'),'intake uses HTML modal');
ok(!intake.includes('sbmDoctorPromptJson_'),'intake no longer uses blocking prompt');
ok(intake.includes('google.script.run'),'HTML dialog calls Apps Script only on submit');
ok(intake.includes('.sbmDoctorSubmitSiteDiagnosisResult(raw)'),'submit button calls server registration');
ok(code.includes("var t=sbmDoctorExtractJsonText_(String(rawText||''));"),'server extracts JSON from submitted text');
ok(code.includes('req.site_diagnosis_context={site_diagnosis_batch_id:id.siteDiagnosisBatchId'),'Writer referral traceability preserved');
ok(code.includes("put('SiteDiagnosisBatchID',id.siteDiagnosisBatchId);put('SiteDiagnosisCaseID',id.siteDiagnosisCaseId);"),'Doctor_Cases trace storage preserved');
console.log('All RC8.11 Site Diagnosis intake dialog tests passed.');
