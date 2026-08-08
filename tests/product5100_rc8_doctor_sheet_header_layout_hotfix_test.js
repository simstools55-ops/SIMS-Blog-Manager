const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL:',m);process.exit(1)}}
ok(code.includes("sh.getRange('A1:E1').merge().setValue('SIMS Doctor')"),'Doctor sheets use merged horizontal title');
ok(code.includes("sh.getRange('A2:E2').merge().setValue('Doctor診断状況')"),'diagnosis status subtitle merged');
ok(code.includes("sh.getRange('B3:E3').merge().setValue('Doctor診断・処置の進行確認')"),'diagnosis current-location guidance shown once');
ok(code.includes("sh.getRange('B4:E4').merge().setValue('下の「次にやること」を確認し、対象記事だけ次の工程へ進めます。 ｜ '+summary)"),'diagnosis next-action guidance shown once');
ok(code.includes("sh.setColumnWidth(1,120);sh.setColumnWidth(2,360);sh.setColumnWidth(3,300);sh.setColumnWidth(4,110);sh.setColumnWidth(5,135)"),'diagnosis status column widths balanced');
ok(code.includes("function sbmDoctorCompactDateTime_(value)"),'compact timestamp helper exists');
ok(code.includes("sbmDoctorCompactDateTime_(r['更新日時']||'')"),'updated-at timestamp compacted');
ok(code.includes("sh.getRange('A2:E2').merge().setValue('精密診断紹介状')"),'referral subtitle merged');
ok(code.includes("sh.getRange('B3:E3').merge().setValue('精密診断する記事を選ぶ')"),'referral current-location guidance shown once');
console.log('PASS product5100_rc8_doctor_sheet_header_layout_hotfix_test');
