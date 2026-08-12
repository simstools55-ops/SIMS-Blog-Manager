const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}
const open=fn('sbmOpenImprovementHistory');
must(open.includes('sbmPrepareImprovementHistoryViewData_()'),'履歴を開く前に一括日付整備・降順整列');
must(!open.includes('sbmRebuildImprovementHistoryList_'),'開く処理で全履歴再構築しない');

const prep=fn('sbmPrepareImprovementHistoryViewData_');
must(prep.includes("route.indexOf('Doctor→')===0"),'Doctor旧履歴の日付補完を維持');
must(prep.includes("vals.sort(function(a,b)"),'全履歴を改善日で並べ替える');
must(prep.includes("return tb-ta"),'改善日の降順');
must(prep.includes("sh.getRange(2,1,vals.length,lastCol).setValues(vals)"),'整備結果は一括書込み');
must(prep.includes("row[dateIdx]=d"),'改善日はDate型へ統一');

const polish=fn('sbmPolishImprovementHistoryView_');
must(polish.includes("'改善概要':390"),'改善概要幅を約30%拡大');
must(polish.includes("setNumberFormat('yyyy/M/d')"),'改善日の表示書式を統一');
must(polish.includes("==='完了'"),'完了行を判定');
must(polish.includes("setBackground('#f1f3f4')"),'完了行を薄いグレー表示');
must(polish.includes("var headers=sh.getRange(1,1,1,lastCol).getDisplayValues()[0]"),'ヘッダーは一括取得');
must(!polish.includes("sh.getRange(1,c).getDisplayValue()"),'列ごとのヘッダー読込を廃止');
must(!polish.includes('.autoResizeRows('),'重い行高自動調整なし');
console.log('UAT34 history sort/style/performance: PASS');
