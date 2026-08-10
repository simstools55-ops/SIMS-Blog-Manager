const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
const dist=fs.readFileSync('distribution/Code.gs','utf8');
function ok(v,m){if(!v)throw new Error(m)}
ok(code===dist,'Code.gs and distribution/Code.gs differ');
ok(/const SBM_VERSION = '5\.9\.1'/.test(code),'version missing');
ok(code.includes('SIMS_DOCTOR_SINGLE_CASE_REQUEST_V2'),'contract missing');
ok(code.includes("ui.createMenu('SIMS Doctor')"),'menu missing');
ok(code.includes('sbmDoctorCreateRequestFromArticleList'),'article request missing');
ok(code.includes('sbmDoctorCreateRequestFromEffect'),'effect request missing');
ok(!/function\s+sbmRunDaily[^\{]*\{[\s\S]{0,1500}sbmDoctor/.test(code),'Doctor call appears inside daily function');
ok(!/ScriptApp\.newTrigger\([^)]*Doctor/i.test(code),'Doctor trigger found');
console.log('PASS product570_doctor_outpatient_static_test');
