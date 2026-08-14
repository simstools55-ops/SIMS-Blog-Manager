const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(!c.includes("if(!sd)return;"),'hard SiteDiagnosisCaseID gate removed');
ok(c.includes("if(!sd&&!isMergeRow)"),'non-Merge rows still protected');
ok(c.includes("if(!sd&&isMergeRow)recoveredWithoutSiteDiagnosis++"),'Merge rows recover without SiteDiagnosisCaseID');
ok(c.includes("else if(mergeReqStored&&state!=='MONITORING'"),'stored Merge request is enough for fallback recovery');
ok(c.includes("走査："),'resume diagnostics show scan counts');
ok(c.includes("SiteDiagnosisCaseIDなしで復元"),'resume diagnostics expose repaired rows');
if(!process.exitCode)console.log('PASS: HF8.2 deep resume recovery checks');
