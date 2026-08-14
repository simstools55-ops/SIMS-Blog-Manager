const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(code.includes('function sbmDoctorMergeHasCompletedArticle_(m)'),'completed merged_article detector exists');
ok(code.includes("'MERGE_USER_ACTION_REQUIRED'")&&code.includes("'統合原稿反映・301等の利用者処置待ち'"),'final Merge routes to user action state');
ok(code.includes('writerReady:false'), 'Site Diagnosis Merge final result does not request Writer');
ok(code.includes('Mergeの統合後完成原稿を受理しました。Writerへの再紹介は行いません。'),'success message confirms no Writer referral');
ok(code.includes('treatmentActions=treatmentActions.filter(function(a){return String(a.caseId||"")!==String(r.caseId||"")}'), 'stale legacy actions for completed Merge case are removed');
ok(code.includes('Mergeは完成原稿を直接返却'),'flow label reflects final architecture');
if(!process.exitCode)console.log('PASS: HF3 Merge final routing regression checks');
