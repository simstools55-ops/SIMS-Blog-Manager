const fs=require('fs');
const code=fs.readFileSync(process.argv[2],'utf8');
function must(s,m){if(!code.includes(s)){console.error('FAIL '+m);process.exit(1)}}
must("o.allowed_scope||handoff.allowed_scope", "normalize top-level allowed_scope");
must("o.blocked_scope||handoff.blocked_scope", "normalize top-level blocked_scope");
must("doctor&&doctor.allowed_scope", "referral top-level allowed_scope");
must("doctor&&doctor.blocked_scope", "referral top-level blocked_scope");
must("Array.isArray(tp.actions)", "treatment_plan.actions");
console.log("PASS product51019_doctor_top_level_scope_test");
