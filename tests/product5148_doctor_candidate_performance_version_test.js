const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function must(x,m){if(!x)throw new Error(m);console.log('PASS:',m)}
must(code.includes("const SBM_VERSION = '5.14.8';"),'runtime version is v5.14.8');
const vers=[...code.matchAll(/v?5\.14\.\d+/g)].map(x=>x[0]);
must(vers.every(v=>v==='5.14.8'||v==='v5.14.8'),'no obsolete 5.14.x literals remain in Code.gs');
must(code.includes("if(!cand)cand=ss.insertSheet(candName);else{"),'candidate sheet is reused');
must(!code.includes('ss.deleteSheet(old1)'),'candidate rebuild no longer deletes the candidate sheet');
must(code.includes('setBackgrounds(bgs).setFontColors(fonts)'),'metric colors are applied in bulk');
must(code.includes('setBackgrounds(sevBg).setFontColors(sevFont)'),'severity colors are applied in bulk');
must(!code.includes('autoResizeRows(7,out.length)'),'candidate rebuild avoids autoResizeRows');
must(code.includes('if(!rebuilt)sbmDoctorEnsureReferralSelectionColumn_(sh)'),'selection column is not redundantly rebuilt');
console.log('PASS product5148_doctor_candidate_performance_version_test');
