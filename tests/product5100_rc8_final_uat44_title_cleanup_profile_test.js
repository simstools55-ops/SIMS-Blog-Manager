const fs=require('fs'),path=require('path');const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function m(x,s){if(!x){console.error('FAIL '+s);process.exit(1)}console.log('PASS '+s)}
m(c.includes('var SBM_UAT44_PROFILE_ = null;'),'profile opt-in');
m(c.includes('settingCalls++'),'setting calls measured');
m(c.includes('settingMs += __settingMs'),'setting time measured');
m(c.includes('uat44Profile:SBM_UAT44_PROFILE_'),'profile returned');
m(c.includes('UAT44・整形内部'),'profile displayed');
m(c.includes('bypassCache:true'),'UAT43 cache bypass retained');
console.log('UAT44 PASS');