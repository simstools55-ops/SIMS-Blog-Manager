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
const onOpenFast=code.slice(code.indexOf('function onOpen()'),code.indexOf('function sbmGetDailyUpdateClientStatus()',code.indexOf('function onOpen()'))); ok(!onOpenFast.includes('sbmApplyHistoryFinalStyle_'), 'history is not fully restyled during onOpen');
ok(code.includes("var visible={'選択':1,'改善日':1,'記事タイトル':1,'改善概要':1,'改善経路':1,'1週':1,'2週':1,'3週':1,'4週':1,'最終判定':1};"), 'unused AI column is excluded from the visible history view');
ok(code.includes('try{sbmApplySelectionUi_(sh);}catch(eSelection)'), 'history style forces real checkboxes instead of FALSE/TRUE');
ok(code.includes('sbmDoctorSyncImprovementRoutesFromCases_();') && code.includes("h['改善経路']||h['改善方法']||'通常改善'"), 'effect sheet retains Doctor improvement route');
const dist = fs.readFileSync(path.join(root, 'distribution', 'Code.gs'), 'utf8');
ok(dist === code, 'distribution mirrors Apps Script');
console.log('PASS product5100_rc8_official_blocker_final_test');
