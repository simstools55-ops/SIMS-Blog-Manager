const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
const dist=fs.readFileSync(path.join(root,'distribution','Code.gs'),'utf8');
function ok(v,m){if(!v){console.error('FAIL:',m);process.exit(1)}}
ok(code.includes("3．精密診断候補を見る"),'candidate menu label');
ok(!code.includes("6．Doctor対応一覧を確認する"),'Doctor worklist menu retired');
ok(code.includes("var candName='Doctor_精密診断候補'"),'candidate sheet canonical name');
ok(code.includes("setValue('SIMS Doctor　精密診断候補')"),'single-line candidate title');
ok(code.includes("['選択','重症度','記事タイトル','傾向','クリック','表示','順位','CTR'"),'structured eight-column candidate headers');
ok(code.includes('function sbmDoctorCandidateMetrics_'),'structured candidate metrics helper');
ok(code.includes("parts2.push('クリック '+firstC+'→'+secondC+'（'+cd+'%減）')"),'long-term click decline reason');
ok(code.includes("parts2.push('表示 '+firstI+'→'+secondI+'（'+id+'%減）')"),'long-term impression decline reason');
ok(code.includes('function sbmRetireDoctorWorklistSheets_'),'Doctor worklist retirement helper');
ok(code===dist,'distribution code identical');
console.log('PASS product5100_rc8_doctor_candidate_worklist_test');
