const fs=require('fs'); const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v)throw Error(m)}
ok(code.includes("const SBM_VERSION = '5.10.0-RC8.9';"),'current version');
ok(code.includes('tp.immediate_action_scope'),'immediate action scope');
ok(code.includes('handoff.allowed_scope'),'workflow allowed scope');
ok(code.includes('handoff.blocked_scope'),'workflow blocked scope');
ok(code.includes('internal_link_recommendations'),'structured link recommendations');
ok(code.includes('evidence.internal_links.candidates'),'evidence candidate enrichment');
ok(code.includes('writer_must_finalize_anchor:true'),'writer owns final anchor');
console.log('product5100_rc3_internal_link_referral_test: PASS');
