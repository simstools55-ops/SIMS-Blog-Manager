const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
const dist=fs.readFileSync(path.join(root,'distribution','Code.gs'),'utf8');
function must(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1)}console.log('PASS:',msg)}
must(code.includes('function sbmDoctorShowHealthCheckRunnerDialog_()'),'health staged runner dialog exists');
must(code.includes('function sbmDoctorRunHealthStageFromDialog()'),'health single-stage server runner exists');
must(code.includes('google.script.run.withSuccessHandler') && code.includes('.sbmDoctorRunHealthStageFromDialog();'),'dialog automatically chains stages');
must(code.includes("sbmDoctorRunScreeningBatch_(true)"),'screening runs in batched staged workflow');
must(code.includes('sbmDoctorOpenHealthReport();'),'completion opens health report');
must(code.includes("FETCHING_FIRST:'FULL_DONE'") && code.includes("FETCHING_SECOND:'FIRST_DONE'"),'interrupted running phases recover from saved checkpoint');
must(!/function sbmDoctorRunHealthCheck\(\)[\s\S]{0,5000}sbmDoctorExecuteHealthCheckToCompletion_\(\)/.test(code),'menu health check no longer runs all stages in one server execution');
must(code.includes('③健康状態判定'),'user-facing progress terminology avoids primary/secondary exam wording');
must(code===dist,'distribution mirrors Apps Script');
console.log('PASS product5100_rc8_health_staged_runner_test');
