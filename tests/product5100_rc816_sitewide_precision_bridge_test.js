const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
const dist=fs.readFileSync(path.join(root,'distribution','Code.gs'),'utf8');
function ok(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1)}}
ok(code.includes("const SBM_VERSION = '5.10.0-RC8.16';"),'version RC8.16');
ok(code.includes("format!=='SIMS_DOCTOR_SITE_WIDE_PRECISION_RESULT_V1'"),'accept Site Wide Precision format');
ok(code.includes('function sbmDoctorSiteWideExpandUnits_'),'site-wide cluster adapter exists');
ok(code.includes('function sbmDoctorProcessSiteDiagnosisSingleResult_'),'single result processing factored');
ok(code.includes('treatmentActions=[]'),'multi-referral UI state');
ok(code.includes('moveTreatment(-1)'),'previous referral control');
ok(code.includes('moveTreatment(1)'),'next referral control');
ok(code.includes('actions:actions'),'batch returns actionable referrals');
ok(code.includes('mreq=sbmDoctorBuildMergeTreatmentRequest_(source,o,n)'),'batch reuses standard Merge builder');
ok(code===dist,'apps-script/distribution Code.gs identical');

// Execute only the two pure adapter helpers against the real Site Diagnosis sample shape.
function extract(name,nextName){
  const a=code.indexOf('function '+name+'('); const b=code.indexOf('\nfunction '+nextName+'(',a+1);
  if(a<0||b<0)throw new Error('cannot extract '+name); return code.slice(a,b);
}
const pure=extract('sbmDoctorSiteWideRepresentativeArticle_','sbmDoctorSiteWideExpandUnits_')+'\n'+extract('sbmDoctorSiteWideExpandUnits_','sbmDoctorProcessSiteDiagnosisSingleResult_');
const ctx={Utilities:{getUuid:()=> '12345678-aaaa-bbbb-cccc-123456789012'}};vm.createContext(ctx);vm.runInContext(pure,ctx);
const sample={format:'SIMS_DOCTOR_SITE_WIDE_PRECISION_RESULT_V1',site_diagnosis_batch_id:'SITEWIDE-X',site_id:'example-site',clusters:[
 {diagnosis_case_id:'C1',request_id:'C1',diagnosis_theme:'テーマA',cluster_result:{diagnosis_summary:'x',confidence:'85%',sub_groups:[{group_type:'CANNIBALIZATION',route_to:'WRITER',treatment_strategy:'NORMAL_REWRITE',articles:[{site_id:'example-site',article_id:'A900005',article_url:'https://x/5'},{site_id:'example-site',article_id:'A900003',article_url:'https://x/3'}]},{group_type:'NORMAL_HUB_AND_SPOKE',route_to:'MONITOR',treatment_strategy:'WAIT',articles:[{site_id:'example-site',article_id:'A900006',article_url:'https://x/6'}]}]},workflow_handoff:{next_action:'WRITER',allowed_scope:['trim'],blocked_scope:[]}},
 {diagnosis_case_id:'C2',request_id:'C2',diagnosis_theme:'テーマB',cluster_result:{diagnosis_summary:'merge',confidence:'85%',route_to:'MERGE',treatment_strategy:'NORMAL_REWRITE',merge_plan:{target_article:{site_id:'example-site',article_id:'A900059',article_url:'https://x/59'},source_article:{site_id:'example-site',article_id:'A900057',article_url:'https://x/57'},redirect_direction:'A900057 -> A900059'}},workflow_handoff:{next_action:'MERGE',allowed_scope:['absorb'],blocked_scope:[]}},
 {diagnosis_case_id:'C3',request_id:'C3',diagnosis_theme:'テーマC',cluster_result:{diagnosis_summary:'no cannibal',confidence:'85%',route_to:'NO_ACTION',treatment_strategy:'LIGHT_FIX',articles:[{site_id:'example-site',article_id:'A900019',article_url:'https://x/19'},{site_id:'example-site',article_id:'A900008',article_url:'https://x/8'}]},workflow_handoff:{next_action:'WRITER',allowed_scope:['internal link'],blocked_scope:['merge']}}
]};
const units=ctx.sbmDoctorSiteWideExpandUnits_(sample);
ok(units.length===4,'subgroups are split into independent SBM units');
ok(units.map(x=>x.route).join(',')==='WRITER,MONITOR,MERGE,WRITER','route mapping including NO_ACTION + Writer handoff');
ok(units[2].doctor.article_id==='A900059','Merge representative is target article');
ok(units[2].doctor.merge_direction==='A900057 -> A900059','Merge direction preserved');
ok(units[0].doctor.case_id==='C1-SG01'&&units[1].doctor.case_id==='C1-SG02','split case IDs are unique');
console.log('PASS product5100_rc816_sitewide_precision_bridge_test');
