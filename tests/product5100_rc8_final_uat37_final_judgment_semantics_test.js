const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}

const outcome=fn('sbmFinalImprovementOutcome_');
must(outcome.includes("if(!complete)return '経過観察中'"),'観察途中は経過観察中');
must(outcome.includes("return '改善完了'"),'改善方向は改善完了');
must(outcome.includes("return '再改善必要'"),'改善不十分/悪化は再改善必要');

const weekly=fn('sbmRecordWeeklyMeasurement_');
must(weekly.includes("sbmFinalImprovementOutcome_(judgment,true)"),'4週終了時に正本最終判定を使用');
must(weekly.includes("setValue('経過観察中')"),'4週未満は経過観察中');

const prep=fn('sbmPrepareImprovementHistoryViewData_');
must(prep.includes('sbmFinalImprovementOutcome_(latest,count>=4)'), '既存履歴も新しい最終判定へ移行');
must(prep.includes("sh.getRange(2,hm['最終判定'],finalValues.length,1).setValues(finalValues)"),'最終判定を一括更新');

const polish=fn('sbmPolishImprovementHistoryView_');
must(polish.includes("var visible={'選択':1,'改善日':1,'記事タイトル':1,'改善概要':1,'改善経路':1,'1週':1,'2週':1,'3週':1,'4週':1,'最終判定':1};"),'状態列を利用者画面から除外');
must(!polish.includes("'状態':82"),'状態列幅を持たない');
must(polish.includes("v==='改善完了'"),'改善完了の色');
must(polish.includes("v==='再改善必要'"),'再改善必要の色');
must(polish.includes("v==='経過観察中'"),'経過観察中の色');
must(polish.includes("done=(v==='改善完了'||v==='再改善必要')"),'最終判定済み行を完了色付け');

must(code.includes("'最終判定':'経過観察中','状態':'モニター中'"),'新規履歴は経過観察中');
console.log('UAT37 final judgement semantics: PASS');
