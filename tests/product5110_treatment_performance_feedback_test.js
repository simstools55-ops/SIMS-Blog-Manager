const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(cond,msg){ if(!cond){ console.error('FAIL:',msg); process.exitCode=1; } else console.log('OK:',msg); }
ok(code.includes("const SBM_VERSION = '5.11.0';"), 'version is v5.11.0');
ok(code.includes("TREATMENT_PERFORMANCE: 'Treatment_Performance'"), 'internal performance sheet is defined');
ok(code.includes("TREATMENT_PERFORMANCE: ['PerformanceID','改善履歴ID'"), 'performance schema is defined');
ok(code.includes("version: '1.1'"), 'improvement plan snapshot schema is v1.1');
['candidate_id','target_ctr','expected_clicks','instant_score','ctr_score'].forEach(k=>ok(code.includes(k+':'), 'plan snapshot stores '+k));
ok(code.includes('function sbmTreatmentPerformanceExists_'), 'duplicate guard exists');
ok(code.includes('function sbmRecordTreatmentPerformance_'), '28-day snapshot recorder exists');
ok(code.includes("if (!historyId || sbmTreatmentPerformanceExists_(historyId))"), 'history ID is idempotency key');
ok(code.includes("try { sbmRecordTreatmentPerformance_(historyRow,judgment,when,metrics); }"), 'snapshot is called from fourth weekly measurement path');
ok(code.includes('beforeCtr:beforeCtr,currentCtr:currentCtr,beforePos:beforePos,currentPos:currentPos,beforeClicks:beforeClicks,currentClicks:currentClicks,beforeImp:beforeImp,currentImp:currentImp'), 'absolute baseline and day-28 metrics are passed into recorder');
ok(!code.includes('sbmBackfillTreatmentPerformance_'), 'historical performance backfill is not enabled');
ok(code.includes("v==='大きく改善'||v==='改善'||v==='改善傾向')return '改善完了'"), 'existing final success rule remains unchanged');
if(process.exitCode) process.exit(process.exitCode);
