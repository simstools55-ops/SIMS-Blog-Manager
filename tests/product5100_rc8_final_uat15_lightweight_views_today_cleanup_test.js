const fs=require('fs'), path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
const eff=code.slice(code.indexOf('function sbmOpenEffectiveness()'),code.indexOf('function sbmUpdateEffectiveness()',code.indexOf('function sbmOpenEffectiveness()')));
must(!eff.includes('sbmRepairImprovementHistoryData_()'),'改善の推移を開くだけでは履歴修復しない');
must(!eff.includes('sbmUpdateEffectivenessCore_(false);') || eff.includes('if(!sh)'),'改善の推移の再計算は未作成時だけ');
const hs=code.indexOf('function sbmOpenImprovementHistory()');
const he=code.indexOf('利用者向けメニューの最終構成。',hs);
const hist=code.slice(hs,he);
must(!hist.includes('sbmDoctorReconcileCompletedTreatments_'),'改善履歴を開くだけではDoctor自己修復しない');
must(!hist.includes('sbmRepairImprovementHistoryData_'),'改善履歴を開くだけでは全履歴修復しない');
must(code.includes('function sbmCleanupTodayCompletedRows_()'),'今日の改善の完了済みクリーンアップが存在');
const daily2=code.slice(code.indexOf('function sbmRunDailyAnalysisStageFromDialog()'),code.indexOf('/** STEP 3',code.indexOf('function sbmRunDailyAnalysisStageFromDialog()')));
must(!daily2.includes('sbmCleanupTodayCompletedRows_()'),'日次STEP2はTodayを再生成するため重複クリーンアップしない');
must(code.includes("sbmCleanupTodayCompletedRows_(); sbmEnsureTodayRecommendations_('daily')"),'継続日次経路でもクリーンアップする');
must(code.includes("var a = take(instant,'⚡ 即効性',5);"),'今日の改善候補は即効性5件まで');
must(code.includes("var b = take(ctr,'📈 CTR改善',5);"),'今日の改善候補はCTR改善5件まで');
must(code.includes('return merged.slice(0,10);'),'今日の改善候補は最大10件');
console.log('UAT15 lightweight views/today cleanup: PASS');
