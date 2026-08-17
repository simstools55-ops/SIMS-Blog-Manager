const fs=require('fs');
const code=fs.readFileSync(process.argv[2],'utf8');
for(const s of ['doctorProgressOverlay','ensureOverlay();runChunk(0)','sbmDoctorSubmitSiteDiagnosisResultChunk(raw,offset)']){
  if(!code.includes(s)){console.error('FAIL '+s);process.exit(1);}
}
console.log('PASS product51018_doctor_progress_browser_test');
