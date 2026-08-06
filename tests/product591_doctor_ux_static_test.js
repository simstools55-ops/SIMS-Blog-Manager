const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v)throw new Error(m);}
ok(code.includes("const SBM_VERSION = '5.9.1';"),'version');
ok(code.includes("紹介状の選択記事をDoctorへ依頼"),'referral menu');
ok(code.includes('function sbmDoctorCreateRequestFromDetailedCandidate'),'referral action');
ok(code.includes('function sbmDoctorOpenTreatmentGuide'),'treatment guide');
ok(code.includes("var name='Doctor_治療案内'"),'treatment guide sheet');
ok(code.includes("try { sh.hideSheet(); } catch(e) {}"),'system sheets hidden');
ok(code.includes('次に行うこと'),'next action copy');
console.log('Product 5.9.1 Doctor UX static test: PASS');
