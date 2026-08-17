const fs=require('fs');
const code=fs.readFileSync(process.argv[2],'utf8');
function must(s,m){if(!code.includes(s)){console.error("FAIL "+m);process.exit(1)}}
must("function sbmDoctorProcessCaseResultBatchChunk_", "chunk processor");
must("function sbmDoctorSubmitSiteDiagnosisResultChunk", "chunk endpoint");
must("sbmDoctorSubmitSiteDiagnosisResultChunk(raw,offset)", "browser staged call");
must("個別精密診断を登録しています… ", "progress UI");
must("setTimeout(function(){runChunk", "fresh execution chaining");
must("Doctor回答の登録を開始します。", "pointerdown wording");
console.log("PASS product51016_staged_doctor_batch_test");
