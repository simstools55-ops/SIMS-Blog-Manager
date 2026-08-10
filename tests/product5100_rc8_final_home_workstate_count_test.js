const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL '+m);process.exit(1)}console.log('PASS '+m)}
ok(code.includes("Array.isArray(r) ? String(r[1] || '')") && code.includes("Array.isArray(r) ? String(r[2] || '')"),'ARTICLE_DB array count uses rank/work correct columns');
ok(code.includes("sbmSetSetting_('InProgressArticleCount', counts.inProgress") && code.includes("sbmSetSetting_('MonitoringArticleCount', counts.monitoring"),'improving and monitoring counts stored separately');
