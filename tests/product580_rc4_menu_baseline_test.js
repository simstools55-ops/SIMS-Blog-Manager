const fs=require('fs');
const path=require('path');
const code=fs.readFileSync(path.join(__dirname,'../apps-script/Code.gs'),'utf8');
const required=[
  ["version", "const SBM_VERSION = '5.9.1';"],
  ["main menu", "ui.createMenu('SIMS-Blog-Manager')"],
  ["daily action", ".addItem('日次処理を実行','sbmRunDailyUpdateManual')"],
  ["legacy improvement menu", "ui.createMenu('記事改善スタート')"],
  ["today action", ".addItem('今日の改善を開く','sbmOpenTodayImprovement')"],
  ["result menu", "ui.createMenu('結果登録')"],
  ["legacy progress menu", "ui.createMenu('推移確認')"],
  ["progress action", ".addItem('改善の推移を開く','sbmOpenImprovementStatus')"],
  ["article menu", "ui.createMenu('記事一覧')"],
  ["history menu", "ui.createMenu('改善履歴')"],
  ["doctor menu", "ui.createMenu('SIMS Doctor')"],
  ["doctor request", "sbmDoctorCreateRequestFromArticleList"],
  ["doctor result", "sbmDoctorRegisterCaseResult"],
  ["writer request", "sbmDoctorCreateWriterTreatmentRequest"],
  ["writer result", "sbmDoctorRegisterWriterTreatmentResult"]
];
let ok=true;
for(const [name,token] of required){const v=code.includes(token);console.log((v?'PASS ':'FAIL ')+name);if(!v)ok=false;}
process.exit(ok?0:1);
