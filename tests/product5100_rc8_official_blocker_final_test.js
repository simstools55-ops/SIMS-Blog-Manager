const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'apps-script', 'Code.gs'), 'utf8');
function ok(cond, msg){ if(!cond){ console.error('FAIL:',msg); process.exit(1);} console.log('PASS:',msg); }
ok(code.includes('function sbmDoctorEnsureArticleDbRowForMonitoring_'), 'GSC-missing Doctor article restoration helper exists');
ok(code.includes("obj['作業状態']='👀 モニター中'"), 'restored Doctor article is monitoring');
ok(code.includes("obj['記事ステータス']='検索露出なし'"), 'GSC-missing status is explicit without deleting article');
ok(code.includes("sbmDoctorEnsureArticleDbRowForMonitoring_(articleId,url,''"), 'monitor sync restores missing article before updating');
ok(code.includes('DoctorArticleDbRestoreBeforeRegister'), 'Doctor result registration restores missing article before feedback registration');
ok(code.includes("try { sbmStyleHistorySheetV2_(); sbmApplyHistoryFinalStyle_(); }"), 'history is decorated during onOpen');
ok(code.includes("if(hm['使用AI']){try{sh.hideColumns(hm['使用AI'])"), 'unused AI column is hidden');
ok(code.includes('try{sbmApplySelectionUi_(sh);}catch(eSelection)'), 'history style forces real checkboxes instead of FALSE/TRUE');
ok(code.includes('sbmDoctorSyncImprovementRoutesFromCases_();') && code.includes("h['改善経路']||h['改善方法']||'通常改善'"), 'effect sheet retains Doctor improvement route');
const dist = fs.readFileSync(path.join(root, 'distribution', 'Code.gs'), 'utf8');
ok(dist === code, 'distribution mirrors Apps Script');
console.log('PASS product5100_rc8_official_blocker_final_test');
