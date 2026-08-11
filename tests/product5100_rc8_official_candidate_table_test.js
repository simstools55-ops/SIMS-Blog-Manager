const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
const dist=fs.readFileSync(path.join(root,'distribution','Code.gs'),'utf8');
function ok(c,m){if(!c){console.error('FAIL:',m);process.exit(1)}else console.log('PASS:',m)}
ok(code.includes("headers=['選択','重症度','記事タイトル','傾向','クリック','表示','順位','CTR','記事ID','記事URL','候補キー']"),'visible eight-column candidate comparison plus hidden identity');
ok(code.includes("cand.hideColumns(9,3)"),'ArticleID, URL and candidate key stay hidden');
ok(code.includes("function sbmDoctorCandidateMetrics_"),'structured metrics helper exists');
ok(code.includes("trend:'長期流入低下'")&&code.includes("trend:'直近流入急減'"),'trend categories are structured');
ok(code.includes("m.clicks,m.impressions,m.position,m.ctr"),'four performance metrics rendered separately');
ok(code.includes("return sbmDoctorIsUntreatedCurrentCandidateCached_(candidateContext,id,url)"),'only untreated articles rendered');
ok(!code.includes("'選定理由','状態','記事ID'"),'legacy reason/state visible columns removed');
ok(code.includes("cand.getRange('A1:H1').merge()"),'header spans visible eight columns');
ok(code.includes("cand.getDataRange().setWrap(true)"),'all candidate cells wrap');
ok(!code.includes("cand.getRange(7,4,out.length,5).setWrap(false)"),'metric cells are not forced to no-wrap');
ok(code.includes("sbmDoctorApplyCandidateStatusColors_(cand,7,selectedRows,hm)"),'metric-aware status colors applied');
ok(code===dist,'distribution mirrors Apps Script');
console.log('PASS product5100_rc8_official_candidate_table_test');
