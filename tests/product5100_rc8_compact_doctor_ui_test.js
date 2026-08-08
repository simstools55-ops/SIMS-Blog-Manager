const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, '..', 'apps-script', 'Code.gs'), 'utf8');
function must(x, msg){ if(!x){ console.error('FAIL:', msg); process.exit(1); } }
must(code.includes("report.getRange('A1:F16')"), 'health report must fit in 16-row compact layout');
must(code.includes("report.getRange('B9').setValue(overall)"), 'Doctor overall comment must use wide text cell');
must(code.includes("report.getRange('B12').setValue(trends.length"), 'trend text must use wide text cell');
must(code.includes("function sbmDoctorHealthProgress_"), 'compact health progress helper missing');
must(code.includes("function sbmDoctorFriendlyHealthError_"), 'friendly error adapter missing');
must(code.includes("Google Apps Script の権限確認が必要です。"), 'human-readable permission error missing');
must(!code.includes("'最後のエラー：'+r.lastError"), 'raw technical error must not be shown to users');
must(code.includes("次に行うこと：'+next"), 'next action must be visible in compact progress dialog');
console.log('PASS product5100_rc8_compact_doctor_ui_test');
