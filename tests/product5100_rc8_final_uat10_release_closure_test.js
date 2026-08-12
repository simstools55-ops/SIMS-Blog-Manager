const fs=require('fs');
const path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1)}console.log('PASS:',msg)}
ok(code.includes("Doctor依頼内の「直近28日」はEvidenceの日別集計を唯一の正本"),'current_performance uses Evidence recent 28d source of truth');
ok(code.includes("payload.current_performance.impressions = Number(evRecent.impressions || 0)"),'current_performance impressions synced to Evidence');
ok(code.includes("モニター中の記事｜推移")&&!code.includes("setValue('改善中の記事｜推移')"),'Home heading unified to monitoring');
ok(code.includes("['改善候補','0件'],['モニター中','0件'],['改善確認完了','0件'],['未取得記事','0件']"),'Home left summary removes improvement-in-progress row and uses UAT36 order');
ok(code.includes("work.indexOf('改善中') >= 0 || work.indexOf('モニター中') >= 0") || code.includes("w.indexOf('改善中') >= 0 || w.indexOf('モニター中') >= 0"),'legacy improvement-in-progress is absorbed into monitoring count');
ok(code.includes("'🛠️ 処置中'") && !code.includes("sbmSetArticleWorkStateByIdentity_(req.article_id,req.article&&req.article.url||'','✏️ 改善中')"),'Doctor-to-Writer transition uses treatment state, not improvement-in-progress');
ok(code.includes("'1週':'測定待ち','2週':'測定待ち','3週':'測定待ち','4週':'測定待ち'"),'new measurement rows use measurement-waiting label');
ok(code.includes('function sbmShowAsyncProgressDialog_(opt)'),'common long-running progress dialog exists');
ok(code.includes("title:'精密診断候補を準備しています'") && code.includes("workers:['sbmDoctorCandidateProgressStep1_','sbmDoctorCandidateProgressStep2_','sbmDoctorCandidateProgressStep3_']"),'Doctor candidate opening uses real staged progress dialog');
ok(code.includes("title:'記事情報を取得しています'") && code.includes("worker:'sbmSupplementNewArticlesWorker_'"),'article info acquisition uses progress dialog');
ok(code.includes("title:'改善の推移を更新しています'") && code.includes("worker:'sbmUpdateEffectivenessWorker_'"),'effectiveness refresh uses progress dialog');
ok(code.includes('.spin{') && code.includes('@keyframes r'),'spinner animation exists');
console.log('UAT10 release closure regression: PASS');
