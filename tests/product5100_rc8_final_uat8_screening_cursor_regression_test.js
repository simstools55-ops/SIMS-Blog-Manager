const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function assert(cond,msg){ if(!cond){ console.error('FAIL:',msg); process.exit(1);} console.log('PASS:',msg); }
const m = code.match(/function sbmDoctorRecoverHealthRunForStage_\(run\)\{[\s\S]*?\n\}/);
assert(!!m,'recover function exists');
const body=m[0];
assert(/if\(code==='SCREENING'\) return run;/.test(body),'normal SCREENING state is preserved between dialog calls');
assert(!/SCREENING:'PREVIOUS_DONE'/.test(body),'SCREENING is not rolled back to PREVIOUS_DONE');
assert(/saved\?'SCREENING':'PREVIOUS_DONE'/.test(body),'retryable screening errors resume from saved cursor');
assert(/state\.cursor=finish/.test(code),'screening batch persists its cursor after each batch');
assert(/var start=Number\(state\.cursor\|\|0\)/.test(code),'next batch starts from persisted cursor');
console.log('UAT8 screening cursor regression: PASS');
