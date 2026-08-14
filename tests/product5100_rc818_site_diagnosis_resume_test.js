const fs=require('fs'), path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
function ok(cond,msg){if(!cond){console.error('FAIL:',msg);process.exitCode=1}else console.log('PASS:',msg)}
ok(code.includes('function sbmDoctorResumeSiteDiagnosisTreatments()'),'resume server function exists');
ok(code.includes("state==='MERGE_IN_PROGRESS'||state==='MERGE_RESULT_RECEIVED'"),'Merge in-progress/result-received cases resume as Merge');
ok(code.includes("state==='MERGE_WRITER_IN_PROGRESS'||state==='WRITER_IN_PROGRESS'"),'Writer in-progress cases resume as Writer');
ok(code.includes('document.addEventListener("DOMContentLoaded",resumeExisting)'),'dialog auto-loads resume state');
ok(code.includes('【前回の続き】'),'resume UI labels previous work');
ok(code.includes('<div id="writerResultStep" class="step hidden">'),'Writer result box is not incorrectly shown before route resolution');
if(!process.exitCode) console.log('RC8.18 resume regression checks passed.');
