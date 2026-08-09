const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
const dist=fs.readFileSync(path.join(root,'distribution','コード.gs'),'utf8');
function ok(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1)}}
const start=code.indexOf('function sbmDoctorBuildHealthReportSheets_(');
const end=code.indexOf('function sbmDoctorOverallComment_',start);
const build=code.slice(start,end);
ok(start>=0&&end>start,'health/candidate builder exists');
ok(build.includes("report.getRange('A1:B13')"),'health report is compact A/B layout');
ok(build.includes("['Doctor所見',overall]")&&build.includes("['次に行うこと',nextText]"),'health report labels and content');
ok(build.includes("setValue('SIMS Doctor　精密診断候補')"),'candidate header is single-line');
ok(build.includes("var headers=['選択','重症度','記事タイトル','傾向','クリック','表示','順位','CTR'"),'candidate human view uses structured metrics');
ok(!build.includes("setNumberFormat('0.0%')")&&!build.includes("setNumberFormat('0.0')"),'candidate builder must not format typed table columns');
ok(code.includes('function sbmDoctorRebuildCandidateViewFromSnapshot_()'),'typed-table candidate view rebuild helper');
ok(code===dist,'distribution code identical');
console.log('PASS product5100_rc8_typed_column_referral_hotfix_test');
