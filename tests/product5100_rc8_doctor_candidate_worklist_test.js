const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
const dist=fs.readFileSync(path.join(root,'distribution','コード.gs'),'utf8');
function ok(v,m){if(!v){console.error('FAIL:',m);process.exit(1)}}
ok(code.includes("4．精密診断候補を見る"),'candidate menu label');
ok(code.includes("6．Doctor対応一覧を確認する"),'Doctor worklist menu label');
ok(code.includes("var candName='Doctor_精密診断候補'"),'candidate sheet canonical name');
ok(code.includes("setValue('SIMS Doctor　精密診断候補')"),'single-line candidate title');
ok(code.includes("['選択','優先','記事タイトル','選定理由','状態'"),'selection reason human headers');
ok(code.includes('function sbmDoctorSelectionReason_'),'article-specific selection reason helper');
ok(code.includes("'クリック '+cd+'%減（前半→後半）'"),'long-term click decline reason');
ok(code.includes("'表示回数 '+id+'%減（前半→後半）'"),'long-term impression decline reason');
ok(code.includes("setWrap(false)"),'compact one-line list presentation');
ok(code.includes("var name='Doctor_対応一覧'"),'Doctor worklist sheet canonical name');
ok(code.includes("setValue('SIMS Doctor　対応一覧')"),'single-line worklist title');
ok(code===dist,'distribution code identical');
console.log('PASS product5100_rc8_doctor_candidate_worklist_test');
