const fs=require('fs');
const code=fs.readFileSync(process.argv[2],'utf8');
function must(s,m){if(!code.includes(s)){console.error("FAIL "+m);process.exit(1)}}
must("sbmDoctorProcessCaseResultBatchChunk_(caseResults,startIndex,1)", "one case chunk");
must("doctorProgressOverlay", "progress overlay");
must("doctorProgressCount", "progress count");
must("doctorProgressBar", "progress bar");
must("0 / ?件", "initial visible count");
must("登録済み \"+done+\"件。残り", "remaining progress text");
must("件まで処理済みです。", "error processed count");
console.log("PASS product51017_visible_doctor_progress_test");
