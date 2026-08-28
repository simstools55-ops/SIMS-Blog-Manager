const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function must(x,m){if(!x)throw new Error(m);console.log('PASS:',m)}
must(code.includes("const SBM_VERSION = '5.14.8';"),'current version v5.14.8');
must(code.includes('id="articleOpenSection" class="actions hidden"'),'article open button is initially hidden');
must(code.includes('showArticleOpen(r.route==="WRITER"||r.route==="MERGE")'),'article open button is shown only for Writer/Merge route');
must(code.includes('function scrollNextAction(sectionId,buttonId)'),'next-action auto scroll helper');
must(code.includes('scrollNextAction("writerSection","writerRegisterButton")'),'Writer register button auto scroll');
must(code.includes('sbmRegisterImprovementFeedback(normalized,{deferDerivedRefresh:true})'),'Writer result defers derived refresh');
must(!code.includes('sbmDoctorEnsureMonitoringSync_(o.article_id,o.article_url||rec.values'),'Writer result avoids redundant full monitoring sync');
must(code.includes('String(registered.historyId||\'\')||sbmDoctorLatestHistoryIdForArticle_'),'Writer reuses returned history ID');
must(code.includes('sbmDoctorSyncImprovementRoutesFromCases_();sbmUpdateEffectivenessCore_(false);sbmRefreshHome_();'),'Writer final derived refresh is consolidated');
console.log('PASS product5144_doctor_workflow_optimization_test');
