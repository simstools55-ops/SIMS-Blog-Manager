const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL '+m);process.exit(1)}console.log('PASS '+m)}
ok(code.includes("Array.isArray(r) ? String(r[1] || '')") && code.includes("Array.isArray(r) ? String(r[2] || '')"),'ARTICLE_DB array count uses rank/work correct columns');
ok(code.includes("sbmSetSetting_('InProgressArticleCount', 0") && code.includes("sbmSetSetting_('MonitoringArticleCount', counts.monitoring"),'legacy improving count retired and monitoring count is canonical');
ok(code.includes("work.indexOf('改善中') >= 0 || work.indexOf('モニター中') >= 0"),'legacy improving states are absorbed into monitoring');
