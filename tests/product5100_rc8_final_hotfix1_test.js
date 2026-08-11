const fs=require('fs');
const assert=require('assert');
const code=fs.readFileSync(__dirname+'/../apps-script/Code.gs','utf8');
function has(s){assert(code.includes(s), 'missing: '+s);}
// Today query self repair
has('function sbmRepairTodayMainQueryDisplay_()');
has("try { sbmRepairTodayMainQueryDisplay_(); }");
has("'取得待ち':'検索実績なし'");
// History route backfill and new writes
has('function sbmInferImprovementRoute_(o)');
has("o['改善経路']=sbmInferImprovementRoute_(o)");
has("'改善経路':data.improvement_method||'通常改善'");
has("return 'Doctor→Writer'");
has("return 'Doctor→Creator'");
has("return 'Doctor→Merge'");
// Candidate typed-column hotfix
has('function sbmDoctorRebuildCandidateViewFromSnapshot_(');
has("ss.deleteSheet(old1)");
has("cand.getRange(7,2,out.length,1).setNumberFormat('@')");
has("headers=['選択','重症度','記事タイトル','傾向','クリック','表示','順位','CTR'");
assert(!code.includes("if(headers[1]==='優先')sh.getRange(6,2).setValue('重症度');") || code.includes('sbmDoctorRebuildCandidateViewFromSnapshot_'), 'legacy upgrader must be bypassed by rebuild');
console.log('product5100_rc8_final_hotfix1_test: PASS');
