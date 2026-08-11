const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
const dist=fs.readFileSync(path.join(root,'distribution','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1)}console.log('PASS:',m)}
const runStart=code.slice(code.indexOf('function sbmDoctorRunHealthCheck()'),code.indexOf('function sbmDoctorShowHealthCheckRunnerDialog_()'));
must(!runStart.includes('sbmEnsureArticleListDisplayCompleteness_'),'REG-HEALTH-STAGED-RUNNER-004: heavy completeness work is not before runner dialog');
must(code.includes("run.statusCode='PREFLIGHT_DONE'"),'preflight is a separate staged step');
must(code.includes("'PREFLIGHT_DONE': {periodKey:'full'"),'180-day fetch starts only after preflight checkpoint');
must(code.includes('function sbmDoctorRunScreeningBatch_'),'screening has batched implementation');
must(code.includes('if(current.length<=500){'),'500 articles or fewer use single-pass screening');
must(code.includes('var fr=sbmDoctorFinalizeScreening_(silent,state);'),'finalization runs in the same call as the final screening batch');
must(!code.includes('全記事の判定が完了しました。次のSTEPで健康診断書を作成します。'),'extra finalization checkpoint is removed for single-pass flow');
must(!/if\(run\.statusCode==='PREVIOUS_DONE'\)[\s\S]{0,300}sbmDoctorRunScreening_\(true\)/.test(code),'monolithic screening call removed from staged runner');
must(code===dist,'distribution mirrors Apps Script');
console.log('PASS product5100_rc8_final_uat6_health_runner_regression_test');
