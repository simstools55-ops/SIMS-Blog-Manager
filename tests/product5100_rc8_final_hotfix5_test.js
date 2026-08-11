const fs=require('fs'), path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(x,msg){if(!x){console.error('FAIL:',msg);process.exit(1);}console.log('PASS:',msg);}
must(code.includes('function sbmDoctorIsUntreatedCurrentCandidate_'),'候補を未処理Doctor案件だけに限定する判定');
must(code.includes("return sbmDoctorIsUntreatedCurrentCandidateCached_(candidateContext,id,url)"),'候補ビュー生成時にキャッシュ済み未処理判定を適用');
must(code.includes('function sbmDoctorRemoveCandidateArticle_'),'Doctor送信/処置完了時に候補から除外するヘルパー');
must(code.includes('sbmDoctorRemoveCandidateArticle_(articleId,articleUrl)'),'Doctor依頼作成時に候補から即時除外');
must(code.includes('function sbmDoctorSyncImprovementRoutesFromCases_'),'Doctorケースから改善経路を復元する同期処理');
must(code.includes("return 'Doctor→Writer'"),'Doctor→Writer経路を復元');
must(code.includes("return 'Doctor→Creator'"),'Doctor→Creator経路の将来互換');
must(code.includes("return 'Doctor→Merge'"),'Doctor→Merge経路の将来互換');
must(code.includes("try{sbmDoctorSyncImprovementRoutesFromCases_();}catch(eRouteSync)"),'改善の推移生成前に改善経路を同期');
must(code.includes("h['改善経路']||h['改善方法']||'通常改善'"),'改善の推移に改善経路を表示');
must(code.includes("setValue('👀 モニター中')"),'Doctor処置完了記事を記事管理でモニター中へ同期');
console.log('PASS product5100_rc8_final_hotfix5_test');
