const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}
const screen=fn('sbmDoctorRunScreeningBatch_');
must(screen.includes('if(current.length<=500){'),'500記事以下の一括判定分岐を持つ');
must(screen.includes('batchSize=current.length;'),'500記事以下は全件を1回で判定');
must(screen.includes("DoctorHealthLargeScreenBatchSize','200'"),'500記事超は安全な分割処理を残す');
must(screen.includes('var fr=sbmDoctorFinalizeScreening_(silent,state);'),'最終バッチと同じ呼び出しで診断書作成');
must(!screen.includes('全記事の判定が完了しました。次のSTEPで健康診断書を作成します。'),'診断書作成だけの追加サーバー往復を廃止');
must(code.includes('健康診断書を表示しています。画面が切り替わるまでそのままお待ちください。'),'表示中メッセージを追加');
must(code.includes('el("spinner").style.display="inline-block";el("box").className="box done"'),'健康診断書表示中もspinnerを継続');
console.log('UAT32 single-pass health screening: PASS');
