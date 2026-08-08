const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL:',m);process.exit(1)}}
ok(code.includes("setValue('SIMS Doctor　対応一覧')"),'Doctor worklist uses one-line horizontal title');
ok(code.includes("var name='Doctor_対応一覧'"),'Doctor worklist canonical sheet');
ok(code.includes("setValue('SIMS Doctor　精密診断候補')"),'candidate sheet uses one-line horizontal title');
ok(code.includes("setColumnWidth(2,380)")&&code.includes("setColumnWidth(3,300)"),'worklist gives title/action useful width');
ok(code.includes("function sbmDoctorCompactDateTime_(value)"),'compact timestamp helper exists');
ok(code.includes("sbmDoctorCompactDateTime_(r['更新日時']||'')"),'updated timestamp compacted');
console.log('PASS product5100_rc8_doctor_sheet_header_layout_hotfix_test');
