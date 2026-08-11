const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(c,m){if(!c){console.error('FAIL:',m);process.exit(1)}console.log('PASS:',m)}
ok(code.includes('runner.sbmRunProgressWorker(ws[idx])'),'progress dialog uses public server dispatcher');
ok(!code.includes('runner[ws[idx]]()'),'unsupported dynamic google.script.run call removed');
ok(code.includes("case 'sbmDoctorCandidateProgressStep1_': return sbmDoctorCandidateProgressStep1_();"),'Doctor candidate step 1 is dispatchable');
ok(code.includes("case 'sbmDoctorCandidateProgressStep2_': return sbmDoctorCandidateProgressStep2_();"),'Doctor candidate step 2 is dispatchable');
ok(code.includes("case 'sbmDoctorCandidateProgressStep3_': return sbmDoctorCandidateProgressStep3_();"),'Doctor candidate step 3 is dispatchable');
ok(code.includes("case 'sbmSupplementNewArticlesWorker_': return sbmSupplementNewArticlesWorker_();"),'article supplement worker preserved');
ok(code.includes("case 'sbmUpdateEffectivenessWorker_': return sbmUpdateEffectivenessWorker_();"),'effectiveness worker preserved');
