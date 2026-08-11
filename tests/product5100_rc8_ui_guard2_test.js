const fs=require('fs');
const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(x,msg){if(!x){console.error('FAIL:',msg);process.exit(1);}}
must(src.includes(".addItem('1．ブログ健康診断を実行','sbmDoctorRunHealthCheck')"),'Doctor menu must use ブログ健康診断');
must(src.includes('function sbmDoctorEnsureLatestUserViews_()'),'legacy Doctor view migration must exist');
must(src.includes("var expected=['選択','重症度','記事タイトル','傾向','クリック','表示','順位','CTR'];"),'latest candidate view must be 8-column user view');
must(src.includes("if(heads.indexOf('状態')>=0||heads.indexOf('診断理由')>=0||heads.indexOf('優先')>=0)stale=true;"),'legacy 5-column headers must be detected');
must(src.includes('function sbmDoctorCandidateProgressStep1_(){\n  try{sbmDoctorEnsureLatestUserViews_();}'),'Doctor candidate staged STEP1 migrates legacy views after dialog appears');
must(src.includes('// Always render from the latest health snapshot first. Never expose a legacy 5-column sheet.'),'open candidate must force latest renderer');
must(!src.includes("先にブログ全体の健康診断を実行してください。"),'user-facing old health-check wording must be removed');
console.log('PASS product5100_rc8_ui_guard2_test');
