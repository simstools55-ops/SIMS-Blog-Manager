const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
const checks=[
  ['version',code.includes("const SBM_VERSION = '5.8.0-rc.3';")],
  ['main menu',code.includes("ui.createMenu('SIMS-Blog-Manager')")],
  ['daily',code.includes(".addItem('日次処理を実行','sbmRunDailyUpdateManual')")],
  ['today top menu',code.includes("ui.createMenu('今日の改善')")],
  ['result top menu',code.includes("ui.createMenu('結果登録')")],
  ['effect top menu',code.includes("ui.createMenu('改善の推移')")],
  ['articles top menu',code.includes("ui.createMenu('記事一覧')")],
  ['history top menu',code.includes("ui.createMenu('改善履歴')")],
  ['doctor top menu',code.includes("ui.createMenu('SIMS Doctor')")],
  ['doctor result',code.includes(".addItem('Doctor診断結果を登録','sbmDoctorRegisterCaseResult')")],
  ['writer request',code.includes(".addItem('選択ケースのWriter治療依頼を作成','sbmDoctorCreateWriterTreatmentRequest')")],
  ['writer result',code.includes(".addItem('Writer治療結果を登録','sbmDoctorRegisterWriterTreatmentResult')")]
];
let ok=true; for(const [n,v] of checks){console.log((v?'PASS ':'FAIL ')+n); if(!v)ok=false;} process.exit(ok?0:1);
