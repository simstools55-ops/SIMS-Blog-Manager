const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL '+m);process.exit(1)}console.log('PASS '+m)}
ok(code.includes("if(id===articleId&&url===targetNorm){dbRow=i+2;break;}"),'candidate requires exact ArticleID+URL agreement');
ok(code.includes("dbTitle&&dbTitle!==visibleTitle"),'candidate visible title cross-check exists');
ok(code.includes("sbmDoctorValidateCandidateAgainstHealthSnapshot_"),'candidate is cross-checked against latest health snapshot');
ok(code.includes("candidateKey!==expectedKey"),'candidate row identity key guard exists');
ok(code.includes("誤診断防止のため"),'identity mismatch fails closed');
