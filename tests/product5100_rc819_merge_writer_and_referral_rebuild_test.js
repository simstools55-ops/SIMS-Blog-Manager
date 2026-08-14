const fs=require('fs'), path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
function ok(cond,msg){if(!cond){console.error('FAIL:',msg);process.exitCode=1}else console.log('PASS:',msg)}
ok(code.includes("resultStatus:m.status,alreadyRegistered:true"),'duplicate Merge result preserves resultStatus');
ok(code.includes("test(String(m.status||''))"),'Merge->Writer routing uses normalized Merge status');
ok(code.includes('function sbmDoctorRebuildSiteDiagnosisReferral(caseId,route)'),'lazy referral rebuild function exists');
ok(code.includes('needsRebuild:needsRebuild'),'resume marks summarized referrals for rebuild');
ok(code.includes('全文を再生成'),'dialog exposes full referral regeneration');
ok(code.includes('sbmDoctorBuildMergeTreatmentRequest_(source,doctor,n)'),'Merge Package can be rebuilt from SBM evidence');
ok(code.includes('sbmDoctorBuildWriterRequestFromMergeResult_'),'Merge->Writer referral can be rebuilt from Merge result');
if(!process.exitCode) console.log('RC8.19 regression checks passed.');
