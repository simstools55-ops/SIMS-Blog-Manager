const fs = require('fs');
const code = fs.readFileSync('apps-script/Code.gs','utf8');
const checks = [
  ['version', code.includes("const SBM_VERSION = '5.8.0-rc.2';")],
  ['main menu', code.includes("ui.createMenu('SIMS-Blog-Manager')")],
  ['daily processing', code.includes(".addItem('日次処理を実行','sbmRunDailyUpdateManual')")],
  ['improvement submenu', code.includes("ui.createMenu('記事改善')")],
  ['progress submenu', code.includes("ui.createMenu('改善の推移・履歴')")],
  ['article submenu', code.includes("ui.createMenu('記事管理')")],
  ['doctor menu', code.includes("ui.createMenu('SIMS Doctor')")],
  ['doctor diagnosis submenu', code.includes("ui.createMenu('診断')")],
  ['doctor treatment submenu', code.includes("ui.createMenu('治療連携')")],
  ['doctor health submenu', code.includes("ui.createMenu('半年健康診断')")],
  ['doctor request', code.includes('sbmDoctorCreateRequestFromArticleList')],
  ['doctor result', code.includes('sbmDoctorRegisterCaseResult')],
  ['writer request', code.includes('sbmDoctorCreateWriterTreatmentRequest')],
  ['writer result', code.includes('sbmDoctorRegisterWriterTreatmentResult')]
];
let ok=true;
for (const [n,v] of checks) { console.log((v?'PASS ':'FAIL ')+n); if(!v) ok=false; }
process.exit(ok?0:1);
