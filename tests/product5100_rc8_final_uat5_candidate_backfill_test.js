const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL '+m);process.exit(1)}console.log('PASS '+m)}
ok(code.includes("var detailCodes={'RECENT_DROP':1,'LONG_TERM_DECLINE':1,'CTR_OPPORTUNITY':1,'POSITION_OPPORTUNITY':1,'LONG_TERM_STAGNATION':1}"),'REG-DOCTOR-CANDIDATE-BACKFILL-001: full detail-code pool exists');
ok(code.includes("var candidateLimit=Math.max(1,Math.min(20,Number(sbmGetSetting_('DoctorDetailedDiagnosisLimit','10')||10)))"),'candidate limit remains configurable/default 10');
ok(code.includes('var selectedRows=pool.slice(0,candidateLimit);'),'candidate view backfills from ranked untreated pool');
ok(!code.includes("if(String(r[hm['詳細検査']-1]||'')!=='精密診断候補')return false;"),'candidate view no longer freezes health-check top-N inventory');
console.log('PASS product5100_rc8_final_uat5_candidate_backfill_test');
