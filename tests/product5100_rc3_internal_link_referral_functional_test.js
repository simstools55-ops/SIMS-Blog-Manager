const fs=require('fs'), vm=require('vm');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
const m=code.match(/function sbmDoctorReferralDetails_\(doctor,n,evidence\)\{[\s\S]*?\n\}\nfunction sbmDoctorBuildWriterTreatmentRequest_/);
if(!m) throw Error('adapter function not found');
const fn=m[0].replace(/\nfunction sbmDoctorBuildWriterTreatmentRequest_$/,'');
const box={}; vm.createContext(box); vm.runInContext(fn,box);
const doctor={
 treatment_plan:{strategy:'WAIT',secondary_strategy:'LIGHT_FIX',immediate_action_allowed:true,immediate_action_scope:{type:'INTERNAL_LINK_ADDITION',max_links:2,candidate_urls:['https://x/819','https://x/816'],prohibited:['FULL_REWRITE','TITLE_CHANGE']}},
 workflow_handoff:{allowed_scope:['INTERNAL_LINK_ADDITION_MAX_2'],blocked_scope:['URL_CHANGE']},
 presentation:{summary:'human'}
};
const evidence={internal_links:{candidates:[
 {url:'https://x/819',title:'iPhone keyboard position',anchor:'keyboard position fix',score:44},
 {url:'https://x/816',title:'Smartphone keyboard position',anchor:'smartphone keyboard position',score:38}
]}};
const r=box.sbmDoctorReferralDetails_(doctor,{writerReferrals:[]},evidence);
function ok(v,m){if(!v)throw Error(m)}
ok(r.allowed_scope.includes('INTERNAL_LINK_ADDITION_MAX_2'),'allowed scope');
ok(r.blocked_scope.includes('FULL_REWRITE')&&r.blocked_scope.includes('URL_CHANGE'),'blocked scope');
ok(r.candidate_urls.length===2,'candidate urls');
ok(r.internal_link_recommendations.length===2,'recommendations');
ok(r.internal_link_recommendations[0].title,'title enriched');
ok(r.internal_link_recommendations.every(x=>x.writer_must_finalize_anchor===true),'writer ownership');
console.log('product5100_rc3_internal_link_referral_functional_test: PASS');
