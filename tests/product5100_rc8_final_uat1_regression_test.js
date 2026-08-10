const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
ok(!code.includes(".addItem('2．健康診断の進み具合を見る'"),'REG-UI-Doctor-Menu: obsolete health progress menu absent');
const health=(code.match(/function sbmDoctorBuildHealthReportSheets_\([\s\S]*?\n\}/)||[''])[0];
ok(!health.includes("insertSheet(candName)"),'REG-HEALTH-003: health report builder does not create candidate sheet');
const step=(code.match(/function sbmDoctorProcessHealthRunStep_\([\s\S]*?\n\}/)||[''])[0];
ok(!step.includes('DoctorCandidateFinalRebuild'),'REG-HEALTH-003: completion does not rebuild candidate before report');
ok(code.includes("cand.getDataRange().setWrap(true)"),'all candidate cells wrap');
ok(code.includes("setHorizontalAlignment('left')"),'severity is left aligned');
ok(code.includes('function sbmDoctorApplyCandidateStatusColors_'),'candidate status color helper exists');
ok(code.includes("function classifyDelta(delta,badWhenPositive,sev)") && code.includes("ratio(bC,aC)") && code.includes("ratio(bI,aI)") && code.includes("(aP-bP)/bP") && code.includes("ratio(bR,aR)"),'metric colors use real click/impression/position/CTR deltas');
console.log('PASS product5100_rc8_final_uat1_regression_test');
