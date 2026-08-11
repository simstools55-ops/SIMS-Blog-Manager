const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
ok(code.includes('function sbmDoctorRunHealthCheck()'),'health staged runner entry exists');
ok(code.includes('function sbmDoctorRunHealthStageFromDialog()'),'health staged runner step exists');
ok(code.includes("sbmDoctorOpenHealthReport();"),'health completion opens health report');
ok(!code.includes("DoctorCandidateFinalRebuild"),'health completion does not expose candidate rebuild');
ok(code.includes('function sbmDoctorRebuildCandidateViewFromSnapshot_('),'candidate rebuild remains available on explicit open');
console.log('PASS product5100_rc8_staged_runner_ui_guard_test');
