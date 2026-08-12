const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v)throw new Error(m)}
ok(code.includes("const SBM_VERSION = '5.10.0-RC8.9';"),'version');
ok(code.includes("const SBM_SHARED_VERSION = '3.5.0';"),'shared version');
ok(code.includes('Doctor may express treatment through actions_permitted'),'adapter policy');
ok(code.includes('actions_permitted'),'permitted mapping');
ok(code.includes('actions_prohibited'),'prohibited mapping');
ok(code.includes('treatment_tasks:detail.treatment_tasks'),'treatment tasks forwarding');
ok(code.includes('presentation:detail.presentation'),'presentation forwarding');
ok(code.includes('candidate_urls:uniq(candidates)'),'candidate url mapping');
ok(code.includes("request_mode:'DOCTOR_REFERRAL_TREATMENT'"),'routing preserved');
console.log('PASS product5100_rc2_doctor_referral_presentation_adapter_test');
