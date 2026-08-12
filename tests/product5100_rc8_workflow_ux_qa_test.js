const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
const dist=fs.readFileSync(path.join(root,'distribution','Code.gs'),'utf8');
function ok(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1)}}
ok(code.includes("const SBM_VERSION = '5.10.0-RC8.9';"),'RC8 version');
ok(code.includes("1．Homeを確認する")&&code.includes("2．日次処理を実行"),'main daily flow numbering');
ok(code.includes("3．精密診断候補を見る")&&code.includes("4．チェックした記事のDoctor依頼文を作る"),'Doctor candidate flow labels');
ok(!code.includes("6．Doctor対応一覧を確認する"),'redundant Doctor worklist removed');
ok(code.includes("setValue('SIMS Doctor　精密診断候補')"),'candidate purpose visible in title');
ok(code.includes('sbmOpenImprovementHistory();'),'Doctor completion joins improvement history');
ok(code.includes("['選択','重症度','記事タイトル','傾向','クリック','表示','順位','CTR'"),'eight-column candidate comparison view retained');
ok(code.includes('sbmDoctorIsUntreatedCurrentCandidate_'),'candidate view only contains untreated articles');
ok(!code.includes("ui.createMenu('結果登録')"),'standalone result menu remains removed');
ok(code===dist,'distribution code identical');
console.log('PASS product5100_rc8_workflow_ux_qa_test');
