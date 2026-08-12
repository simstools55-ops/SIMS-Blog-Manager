const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function m(x,s){if(!x){console.error('FAIL '+s);process.exit(1)}console.log('PASS '+s)}
m(c.includes('var SBM_UAT44_PROFILE_ = null;'),'profile opt-in');
m(c.includes('settingCalls'), 'setting call counter retained');
m(c.includes('settingMs'), 'setting time counter retained');
m(c.includes('cleanTotalMs'), 'cleanup total counter retained');
m(c.includes('uat44Profile:SBM_UAT44_PROFILE_'),'profile returned');
m(c.includes('整形内部'),'profile displayed');
m(c.includes('bypassCache:true'),'cache-bypass diagnostic retained');
console.log('UAT44 compatibility PASS');
