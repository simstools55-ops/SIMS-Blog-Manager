const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(cond,msg){if(!cond){console.error('FAIL:',msg);process.exitCode=1;}else console.log('PASS:',msg);}
ok(code.includes('sbmDoctorLatestHealthCheckIdFromRows_'),'latest health-check scoping helper exists');
ok(code.includes('sbmDoctorDedupeCandidateRows_'),'candidate dedupe helper exists');
ok(code.includes("var latestHealthCheckId=sbmDoctorLatestHealthCheckIdFromRows_(allRows,hm)"),'candidate rebuild uses latest health check only');
ok(code.includes('sbmDoctorDedupeCandidateRows_(current.filter'),'candidate rows dedupe before render');
ok(code.includes('sbmDoctorSeverityForRow_'),'severity uses sample-size-aware helper');
ok(code.includes("firstC>=20&&c90>=0.60"),'severity considers absolute sample size');
