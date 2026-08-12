const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function must(s,msg){if(!code.includes(s))throw new Error(msg);}
must("const SBM_VERSION = '5.10.0-RC8.9'",'version');
must("sh.getRange('A11:H12').breakApart().merge()",'home message merge self-heal');
must("sh.getRange('A23:H24').breakApart().merge()",'weekly advice merge self-heal');
must("sh.getRange('A23:H24').setValue(sbmHomeWeeklyAdvice_",'weekly advice writer');
must(".setWrap(true)",'wrap enabled');
console.log('pass');
