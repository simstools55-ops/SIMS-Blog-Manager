const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
const required=[
 "const SBM_VERSION = '5.9.1';",
 "DOCTOR_CASES: 'Doctor_Cases'",
 "SIMS_DOCTOR_CASE_RESULT_V2",
 "SIMS_WRITER_TREATMENT_REQUEST_V1",
 "SIMS_WRITER_TREATMENT_RESULT_V1",
 "function sbmDoctorRegisterCaseResult()",
 "function sbmDoctorCreateWriterTreatmentRequest()",
 "function sbmDoctorRegisterWriterTreatmentResult()",
 "case_id:caseId",
 "active_case_id:caseId"
];
for(const x of required){if(!code.includes(x))throw new Error('missing '+x);}
console.log('Product 5.8.0 Doctor workflow static test: PASS');
