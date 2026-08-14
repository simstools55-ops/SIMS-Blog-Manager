const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
const m=JSON.parse(fs.readFileSync(path.join(__dirname,'..','apps-script','appsscript.json'),'utf8'));
function ok(x,msg){if(!x){console.error('FAIL:',msg);process.exitCode=1}else console.log('PASS:',msg)}
ok(m.oauthScopes.includes('https://www.googleapis.com/auth/drive'),'Drive write scope added');
ok(c.includes("artifact_status:'SAVE_FAILED'"),'artifact failure is stored as status, not fatal exception');
ok(c.includes('artifactRetryRequired'),'artifact retry state is returned');
ok(c.includes('Drive保存を再試行'),'retry button exists');
ok(c.includes('lastMergeResultRaw'),'dialog retains pasted result for same-session retry');
ok(c.includes('sbmDoctorSubmitSiteDiagnosisMergeResult(lastMergeResultRaw)'),'retry reuses normal idempotent registration path');
ok(!c.includes('Driveへの成果物保存に失敗しました。処理を中止します。'),'HF7 fatal artifact abort removed');
if(!process.exitCode)console.log('PASS: HF8 Drive authorization + safe retry checks');
