const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
const es=code.indexOf('function sbmOpenEffectiveness()');
const ee=code.indexOf('function sbmUpdateEffectiveness()',es);
const eff=code.slice(es,ee);
must(!eff.includes('sbmStyleEffectSheetV2_'),'改善の推移を開く時に全行装飾しない');
must(!eff.includes('sbmRepairImprovementHistoryData_'),'改善の推移を開く時に修復しない');
must(eff.includes('sh.showSheet();ss.setActiveSheet(sh);sh.activate();'),'改善の推移は直接表示');
const hs=code.indexOf('function sbmOpenImprovementHistory()');
const he=code.indexOf('利用者向けメニューの最終構成。',hs);
const hist=code.slice(hs,he);
must(!hist.includes('sbmApplyHistoryFinalStyle_'),'改善履歴を開く時に全行装飾しない');
must(!hist.includes('sbmDoctorReconcileCompletedTreatments_'),'改善履歴を開く時にDoctor修復しない');
must(hist.includes('sh.showSheet();ss.setActiveSheet(sh);sh.activate();'),'改善履歴は直接表示');
must(code.includes('function sbmStyleEffectSheetV2_()'),'推移の装飾関数は更新時用に保持');
must(code.includes('function sbmApplyHistoryFinalStyle_()'),'履歴の装飾関数は更新時用に保持');
console.log('UAT18 instant view regression: PASS');
