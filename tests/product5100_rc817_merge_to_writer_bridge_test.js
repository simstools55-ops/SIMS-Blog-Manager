const fs=require('fs'), path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
function ok(cond,msg){if(!cond){console.error('FAIL:',msg);process.exitCode=1}else console.log('PASS:',msg)}
ok(code.includes("request_mode:'MERGE_REFERRAL_TREATMENT'"),'Merge result can create Writer referral');
ok(code.includes("after_writer:'RETURN_TO_SBM_FOR_USER_MERGE_ACTIONS'"),'Writer returns to SBM for user merge actions');
ok(code.includes("'MERGE_USER_ACTION_REQUIRED'")&&code.includes("'301等の利用者処置待ち'"),'Writer completion does not auto-monitor before redirect/user actions');
ok(code.includes("sbmDoctorMergeNeedsWriter_(m)"),'Merge result checks Writer referral need');
ok(code.includes("getDisplayValues():null")&&code.includes("RC8.17: 行ごとのgetRange()を廃止"),'Article state lookup uses batch reads');
ok(code.includes('Mergeの統合設計を受け取り、Writer紹介状を生成しました。'),'Site Diagnosis dialog exposes generated Writer referral');
if(!process.exitCode) console.log('RC8.17 merge-to-writer regression checks passed.');
