const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
const dist=fs.readFileSync(path.join(root,'distribution','コード.gs'),'utf8');
function ok(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1)}}
ok(code.includes("const SBM_VERSION = '5.10.0-RC8';"),'RC8 version');
ok(code.includes("1．Homeを確認する")&&code.includes("2．日次処理を実行"),'main daily flow numbering');
ok(code.includes("個別診断：記事一覧から依頼する")&&code.includes("個別診断：改善の推移から依頼する"),'alternate individual diagnosis labels');
ok(code.includes('1 Doctorへ依頼')&&code.includes('2 Doctor回答を登録')&&code.includes('4 Writerへ依頼')&&code.includes('5 Writer結果を登録'),'explicit Doctor Writer progress');
ok(code.includes("setValue('現在地')")&&code.includes("setValue('精密診断する記事を選ぶ')"),'referral current-position guide');
ok(code.includes('現在地：Doctor診断・処置の進行確認'),'diagnosis status current-position guide');
ok(code.includes("var headers=['選択','優先','記事タイトル','診断理由','状態'"),'five-column referral human view retained');
ok(code.includes("clearDataValidations().setValue(false).setBackground('#eeeeee')"),'completed referral lock retained');
ok(!code.includes("ui.createMenu('結果登録')"),'standalone result menu remains removed');
ok(code===dist,'distribution code identical');
console.log('PASS product5100_rc8_workflow_ux_qa_test');
