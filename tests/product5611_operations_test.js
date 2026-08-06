const fs = require('fs');
const code = fs.readFileSync('apps-script/Code.gs','utf8');
function assert(cond,msg){ if(!cond){ console.error('FAIL:',msg); process.exitCode=1; } else console.log('PASS:',msg); }
assert(code.includes("const SBM_VERSION = '5.9.1'"),'version 5.9.1');
assert(code.includes('TODAY_INITIAL_DISPLAY: 5'),'today default is 5');
assert(code.includes('TODAY_MAX_DISPLAY: 10'),'today candidate display max is 10');
assert(code.includes(".addItem('表示件数を設定','sbmSetTodayDisplayCount')"),'display count menu');
assert(!code.includes(".addItem('次の2件を表示'"),'old increment menu removed');
assert(code.includes("sort([{column:3,ascending:false}"),'effect sort by elapsed days descending');
assert(code.includes("return '元に戻す検討'"),'rollback consideration judgment');
assert(code.includes("return 'データ不足'"),'low sample judgment');
assert(code.includes('function sbmShowSelectedRollbackDetail()'),'before/after rollback viewer');
assert(code.includes(".addItem('修正前を確認','sbmShowSelectedRollbackDetail')"),'rollback menu');
assert(code.includes("publication_result.public_ok_changes") || code.includes("public_ok_changes"),'contract v4.2 retained');
if(!process.exitCode) console.log('product5611_operations_test: PASS');
