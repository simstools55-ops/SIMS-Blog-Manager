const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(cond,msg){ if(!cond){ console.error('FAIL:',msg); process.exitCode=1; } else console.log('PASS:',msg); }
ok(code.includes("const SBM_VERSION = '5.10.0-RC8';"),'runtime version is RC8');
ok(code.includes('SIMS-Blog-Manager Product 5.10.0 RC8'),'source header is RC8');
const prep = code.match(/function sbmDoctorPrepareHealthCheckScreen_\(\)\{([\s\S]*?)\n\}/);
ok(prep && !/setActiveSheet|activate\(|SpreadsheetApp\.flush/.test(prep[1]),'health check start does not move active sheet');
ok(code.includes("['選択','重症度','記事タイトル','傾向','クリック','表示','順位','CTR'"),'candidate visible headers are latest 8-column spec');
ok(!code.includes("['選択','優先','記事タイトル','診断理由','状態']"),'legacy candidate visible headers are absent');
ok(code.includes("sbmDoctorRebuildCandidateViewFromSnapshot_();") && code.includes("DoctorCandidateFinalRebuild"),'completion rebuilds candidate with latest renderer');
ok(code.includes("sbmDoctorOpenHealthReport();"),'completion path opens health report');
ok(code.includes("sbmSetSetting_('Version', SBM_VERSION"),'onOpen refreshes stored version');
if(process.exitCode) process.exit(process.exitCode);
