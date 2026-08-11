const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
const dist=fs.readFileSync('distribution/Code.gs','utf8');
function ok(c,m){if(!c){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(!code.includes(".addItem('4．修正前を確認','sbmShowSelectedRollbackDetail')"),'rollback menu removed');
ok(!code.includes('function sbmShowSelectedRollbackDetail()'),'rollback viewer removed');
ok(code.includes("1．ブログ健康診断を実行") && code.includes("2．健康診断書を開く") && code.includes("3．精密診断候補を見る"),'health-check terminology simplified');
ok(code.includes('sbmDoctorOpenHealthReport();') && !code.includes('if(selected>0)sbmDoctorOpenDetailedCandidates();else sbmDoctorOpenHealthReport();'),'health check finishes on report');
ok(code.includes("cand.getDataRange().setWrap(true)") && !code.includes("cand.getRange(7,4,out.length,5).setWrap(false)"),'all candidate cells wrap');
ok(code.includes("else if (sh.getName() === SBM_SHEETS.FEEDBACK_HISTORY) keyHeader = '記事タイトル';"),'history checkbox includes Doctor rows without date');
ok(!code.includes("function sbmOpenImprovementHistory() {\n  try{sbmDoctorReconcileCompletedTreatments_();}"),'history open is lightweight and does not trigger Doctor reconciliation');
ok(code.includes('sbmDoctorPrepareHealthCheckScreen_();'),'health check uses stable neutral screen');
ok(code===dist,'distribution mirrors Apps Script');
if(!process.exitCode)console.log('PASS product5100_rc8_release_candidate_last_test');
