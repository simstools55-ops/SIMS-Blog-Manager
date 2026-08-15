const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(c.includes('function sbmDoctorResumeMergeRoleInfo_'),'server-side resume role resolver exists');
ok(c.includes("Doctor結果JSON"),'role resolver can use stored Doctor result');
ok(c.includes("primary_article_candidate"),'client supports actual Merge Package primary field');
ok(c.includes("target_articles"),'client supports actual Merge Package target articles');
ok(c.includes("mergeRoleInfo:route==='MERGE'?sbmDoctorResumeMergeRoleInfo_"),'resume action carries explicit role info');
ok(c.includes('nav.className="actions"'),'Merge role nav is always shown');
ok(c.includes('pb.disabled=!mergePrimaryStep2Url'),'primary button disables only if URL cannot be recovered');
ok(c.includes('ab.disabled=!mergeAbsorbedStep2Url'),'absorbed button disables only if URL cannot be recovered');
ok(c.includes('genericOpen.className=isMerge?"outline hidden":"outline"'),'generic single article button hidden for Merge');
ok(c.includes('2項目すべてを実施・確認してから登録してください。'),'HF8.9 two-check completion preserved');
if(!process.exitCode)console.log('PASS: HF8.11 compact-request role recovery tests');