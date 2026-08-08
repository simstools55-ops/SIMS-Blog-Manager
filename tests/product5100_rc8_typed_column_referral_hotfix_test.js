const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
const dist=fs.readFileSync(path.join(root,'distribution','コード.gs'),'utf8');
function ok(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1)}}
const start=code.indexOf('function sbmDoctorBuildHealthReportSheets_(');
const end=code.indexOf('function sbmDoctorOverallComment_',start);
const build=code.slice(start,end);
ok(start>=0&&end>start,'health/referral builder exists');
ok(build.includes("report.getRange('A1:B13')"),'health report is compact A/B layout');
ok(build.includes("['Doctor所見',overall]")&&build.includes("['次に行うこと',nextText]"),'health report labels and content');
ok(build.includes("cand.getRange('A3').setValue('現在地')")&&build.includes("cand.getRange('B3:E3').merge().setValue('精密診断する記事を選ぶ')"),'referral guide is not duplicated across cells');
ok(build.includes("cand.getRange('A4').setValue('次に行うこと')")&&build.includes("cand.getRange('B4:E4').merge().setValue("),'referral next action uses compact horizontal layout');
ok(!build.includes("setNumberFormat('0.0%')")&&!build.includes("setNumberFormat('0.0')"),'referral builder must not format typed table columns');
ok(code===dist,'distribution code identical');
console.log('PASS product5100_rc8_typed_column_referral_hotfix_test');
