const fs = require('fs');
const code = fs.readFileSync('apps-script/Code.gs','utf8');
function assert(cond,msg){ if(!cond){ throw new Error(msg); } }
assert(code.includes("const SBM_VERSION = '5.13.0';"),'version not v5.13.0');
assert(code.includes(".addItem('4．観察終了後の処置を進める','sbmProcessSelectedEffectAfterObservation')"),'effect lifecycle menu missing');
assert(code.includes('function sbmProcessSelectedEffectAfterObservation()'),'post-observation handler missing');
assert(code.includes('function sbmDoctorStartExtendedMonitoring_'),'extended monitor handler missing');
assert(code.includes("'改善経路':'Doctor→経過観察'"),'monitor history route missing');
assert(code.includes("if(state.complete&&finalOutcome==='改善完了'&&!doctorMonitoring)"),'completed graduation guard missing');
assert(code.includes("measurementLabel='処置待ち'"),'review-required state missing');
assert(code.includes("measurementLabel='追加経過観察中'"),'extended monitoring state missing');
assert(code.includes("route:'MONITOR'"),'monitor route response missing');
console.log('PASS: v5.13.0 post-improvement monitoring lifecycle static test');
