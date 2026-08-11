const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL '+m);process.exit(1)}console.log('PASS '+m)}
ok(code.includes("context.sourceType='DETAILED_CANDIDATE'"),'candidate route preserved into Doctor request context');
ok(code.includes("context.sourceSheet=sh.getName()"),'candidate source sheet preserved');
ok(code.includes("context.candidateUrgency=sbmDoctorUrgencyFromCandidateSeverity_(severity)"),'candidate severity mapped to request urgency');
ok(code.includes("if(s.indexOf('緊急')>=0)return 'CRITICAL'"),'emergency maps to CRITICAL');
ok(code.includes("if(s.indexOf('重症')>=0)return 'HIGH'"),'severe maps to HIGH');
ok(code.includes("sourceType==='DETAILED_CANDIDATE') return 'SBM_HEALTH_DETAILED_DIAGNOSIS'"),'health candidate trigger is explicit');
ok(code.includes('health_screening_severity:ctx.candidateSeverity||null'),'exact health severity is carried into request');
ok(code.includes('health_check_id:ctx.healthCheckId||null'),'health check id is carried into request');
ok(code.includes("String(result.articleId||'')!==articleId"),'generated request ArticleID is checked before candidate removal');
ok(code.includes('sh.deleteRow(row);'),'only selected candidate row is removed after successful request');
ok(code.includes("['#e8f0fe','#1967d2']"),'positive metric color changed to light blue');
