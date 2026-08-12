const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function m(x,s){if(!x){console.error('FAIL '+s);process.exit(1)}console.log('PASS '+s)}
m(!c.includes('timingLines.push'),'stale timingLines reference removed');
m(!c.includes('el("timings")'),'stale timings element reference removed');
m(c.includes('function sbmDoctorShowHealthCheckRunnerDialog_'),'health dialog retained');
m(c.includes('setTimeout(next,350)'),'automatic next-stage transition retained');
m(c.includes('.sbmDoctorRunHealthStageFromDialog();'),'stage runner call retained');
m(c.includes('if(r&&r.done){'),'completion path retained');
m(c.includes('sbmDoctorOpenHealthReport();'),'health report open path retained');
console.log('RC8 Final health dialog cleanup hotfix PASS');
