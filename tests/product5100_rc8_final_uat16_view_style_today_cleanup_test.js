const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}

const status=code.slice(code.indexOf('function sbmOpenImprovementStatus()'),code.indexOf('function sbmOpenAllBlogArticles()',code.indexOf('function sbmOpenImprovementStatus()')));
must(!status.includes('sbmDoctorReconcileCompletedTreatments_'),'改善の推移メニュー入口はDoctor全件修復しない');
must(!status.includes('sbmUpdateEffectivenessSilent_'),'改善の推移メニュー入口は全件再計算しない');

const trend=code.slice(code.indexOf('function sbmOpenImprovementTrend()'),code.indexOf('function sbmSortArticleDbBy_',code.indexOf('function sbmOpenImprovementTrend()')));
must(!trend.includes('sbmDoctorReconcileCompletedTreatments_'),'改善履歴メニュー入口はDoctor全件修復しない');

const eff=code.slice(code.indexOf('function sbmOpenEffectiveness()'),code.indexOf('function sbmUpdateEffectiveness()',code.indexOf('function sbmOpenEffectiveness()')));
must(!eff.includes('sbmStyleEffectSheetV2_'),'改善の推移は表示時に全行装飾を再適用しない');
must(!eff.includes('sbmRepairImprovementHistoryData_'),'改善の推移は表示時に履歴修復しない');

const hs=code.indexOf('function sbmOpenImprovementHistory()');
const he=code.indexOf('利用者向けメニューの最終構成。',hs);
const hist=code.slice(hs,he);
must(!hist.includes('sbmApplyHistoryFinalStyle_'),'改善履歴は表示時に全行装飾を再適用しない');
must(!hist.includes('sbmDoctorReconcileCompletedTreatments_'),'改善履歴は表示時にDoctor修復しない');

const clean=code.slice(code.indexOf('function sbmCleanupTodayCompletedRows_()'),code.indexOf('function sbmEnsureTodayRecommendations_',code.indexOf('function sbmCleanupTodayCompletedRows_()')));
must(clean.includes('sbmTodayCompletedUrlMap_()'),'今日の改善クリーンアップはモニター中・完了の正本マップを使う');
must(clean.includes("selected==='完了'"),'今日の改善シート上の旧完了行も除去');

const openToday=code.slice(code.indexOf('function sbmOpenTodayImprovement()'),code.indexOf('function sbmRepairTodayMainQueryDisplay_',code.indexOf('function sbmOpenTodayImprovement()')));
must(openToday.includes('sbmRefreshTodayQueueFast_()'),'今日の改善を開く時は高速差分更新で完了済み行を掃除');
must(code.includes('if(kept.length<desired)'),'高速差分更新で空き枠を設定件数まで補充');

console.log('UAT16 view/style/today cleanup regression: PASS');
