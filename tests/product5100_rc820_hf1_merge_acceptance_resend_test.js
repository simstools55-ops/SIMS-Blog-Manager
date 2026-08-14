const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(code.includes("resumeState:'MERGE_ACCEPTANCE_RESEND'"),'completed Merge package is exposed for acceptance resend');
ok(code.includes("acceptanceResend:true"),'resend action is explicitly marked');
ok(code.includes("【実記事再試験】既に登録済みのDoctor/Merge案件から元のMerge Packageを再送します"),'UI explains resend semantics');
ok(code.includes("sbmDoctorStoredReferralNeedsRebuild_(mergeReq)"),'oversized stored Merge package can use existing full rebuild path');
if(!process.exitCode)console.log('RC8.20-HF1 acceptance resend checks passed.');
