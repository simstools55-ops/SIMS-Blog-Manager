const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(code.includes('④ 確認結果をSBMへ返す'),'confirmation UI exists');
ok(code.includes('確認結果を登録して再診依頼を作る'),'confirmation submit button exists');
ok(code.includes('⑤ Doctorへ再診を依頼する'),'follow-up UI exists');
ok(code.includes('sbmDoctorRegisterUserConfirmationAndBuildFollowUp'),'follow-up server handler exists');
ok(code.includes("format:'SIMS_DOCTOR_FOLLOW_UP_CONTEXT_V1'"),'follow-up context contract exists');
ok(code.includes("previous_case_id:previousCaseId"),'previous case is linked');
ok(code.includes("p.request.trigger='SBM_USER_CONFIRMATION_FOLLOW_UP'"),'follow-up trigger is explicit');
ok(code.includes("route:'USER_CONFIRMATION'"),'manual review route is explicit');
ok(code.includes('document.getElementById("writerSection").classList.add("hidden")'),'writer section is hidden before routing');
ok(code.includes('if(r.route==="WRITER")'),'writer section only shown on writer route');
ok(code.includes('INDEX_AND_CANONICAL_OK'),'URL inspection normal option exists');
ok(code.includes('CANONICAL_MISMATCH'),'canonical mismatch option exists');
ok(code.includes('INDEXING_ISSUE'),'indexing issue option exists');
ok(code.includes("'確認種別','確認結果','確認詳細','確認日時','再診依頼JSON'"),'Doctor_Cases stores confirmation and follow-up');
if(process.exitCode)process.exit(process.exitCode);
