const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
must(code.includes('var updated=Math.max(0,Number(r.updated||0)),added=Math.max(0,Number(r.added||0)),total=Math.max(0,Number(r.total||0)),outside=Math.max(0,total-updated-added),s3=(r&&r.step3Timing)||{};'),'完了画面でSTEP3 timingを受け取る');
must(code.includes('<span>STEP3・完了処理</span><b>"+formatTime(r.finalizeElapsedSeconds)+"</b>'),'STEP3合計時間を表示');
for(const label of ['STEP3詳細','履歴の確認（前）','改善の推移更新','履歴の確認（後）','完了状態の保存','Home更新','最終設定・後処理']){
  must(code.includes(label),'完了画面に '+label+' を表示');
}
must(code.includes('formatTime(s3.effect)'),'改善の推移更新時間を表示');
must(code.includes('formatTime(s3.home)'),'Home更新時間を表示');
console.log('UAT24 STEP3 dialog profiler regression: PASS');
