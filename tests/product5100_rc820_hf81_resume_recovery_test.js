const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(c.includes("destination.indexOf('MERGE')>=0&&mergeReqStored"),'fallback restores Merge case from referral data');
ok(c.includes("confirmResult==='ARTIFACT_SAVE_FAILED'"),'artifact save failure is explicitly resumable');
ok(c.includes("Merge結果待ち（中間状態から復元）"),'unexpected intermediate Merge state has recovery label');
ok(c.includes("前回の処置を再読み込み"),'manual resume refresh is available');
ok(c.includes("新しいDoctor結果の登録は不要です"),'recovered flow disables accidental Doctor restart');
ok(c.includes("state!=='MONITORING'&&state!=='TREATMENT_FAILED'"),'terminal cases are excluded from fallback');
if(!process.exitCode)console.log('PASS: HF8.1 resume recovery checks');
