const fs=require('fs'), path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(x,msg){if(!x){console.error('FAIL:',msg);process.exit(1);}console.log('PASS:',msg);}
must(code.includes("PUBLICATION_PENDING')return {label:'🟠 修正済み・結果登録待ち',completed:true"),'結果登録待ちは再選択不可');
must(code.includes("WRITER_IN_PROGRESS')return {label:'🟠 Writer処置中',completed:true"),'Writer処置中も再選択不可');
must(code.includes('function sbmDoctorEnsureMonitoringSync_'),'Doctor処置完了のモニター同期ヘルパー');
must(code.includes("setValue('👀 モニター中')"),'記事DBをモニター中へ強制同期');
must(code.includes('sbmUpdateEffectivenessCore_(false)'),'改善の推移を即時再生成');
must(code.includes("'クリック '+firstC+'→'+secondC+'（'+cd+'%減）'"),'選定理由にクリック絶対値');
must(code.includes("'表示 '+firstI+'→'+secondI+'（'+id+'%減）'"),'選定理由に表示回数絶対値');
must(code.includes("'順位 '+pos(firstP)+'→'+pos(secondP)"),'選定理由に順位変化');
console.log('PASS product5100_rc8_final_hotfix4_test');
