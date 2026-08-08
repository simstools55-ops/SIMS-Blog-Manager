const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL:',m);process.exit(1)}}
ok(code.includes("setValue('SIMS Doctor　精密診断候補')"),'candidate sheet uses one-line horizontal title');
ok(code.includes('function sbmRetireDoctorWorklistSheets_'),'Doctor worklist retired');
ok(!code.includes("setValue('SIMS Doctor　対応一覧')"),'obsolete Doctor worklist UI removed');
ok(code.includes('function sbmDoctorCompactDateTime_(value)'),'compact timestamp helper remains for compatibility');
console.log('PASS product5100_rc8_doctor_sheet_header_layout_hotfix_test');
