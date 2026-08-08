const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, '..', 'apps-script', 'Code.gs'), 'utf8');
function must(x, msg){ if(!x){ console.error('FAIL:', msg); process.exit(1); } }
must(code.includes("report.getRange('A1:B13')"), 'health report must fit in 13-row two-column layout');
must(code.includes("['Doctor所見',overall]"), 'Doctor overall comment must be in A-label/B-content layout');
must(code.includes("['多く見られた傾向',trendText]"), 'trend text must be in A-label/B-content layout');
must(code.includes("function sbmDoctorHealthProgress_"), 'compact health progress helper missing');
must(code.includes("function sbmDoctorFriendlyHealthError_"), 'friendly error adapter missing');
must(code.includes("Google Apps Script の権限確認が必要です。"), 'human-readable permission error missing');
must(!code.includes("'最後のエラー：'+r.lastError"), 'raw technical error must not be shown to users');
must(code.includes("次に行うこと：'+next"), 'next action must be visible in compact progress dialog');
console.log('PASS product5100_rc8_compact_doctor_ui_test');
