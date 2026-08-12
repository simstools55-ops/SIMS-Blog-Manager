const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}

const parse=fn('sbmParseImprovementHistoryDate_');
must(parse.includes('var iso=new Date(s);'),'ISO8601を直接Date化');
must(parse.includes("if(/^\\\\d{4}-\\\\d{2}-\\\\d{2}T") || parse.includes("if(/^\\d{4}-\\d{2}-\\d{2}T"),'ISO形式を明示認識');

const prep=fn('sbmPrepareImprovementHistoryViewData_');
must(prep.includes("route.indexOf('Doctor→')===0"),'Doctor行をWriter結果から再構築');
must(prep.includes('sourceParsed=sbmParseImprovementHistoryDate_(sourceDate)'),'Doctor正本日時を専用パーサーで処理');
must(prep.includes("sh.getRange(2,hm['改善日'],dateValues.length,1).setValues(dateValues)"),'改善日列だけ更新');
must(prep.includes(".sort({column:hm['改善日'],ascending:false})"),'シート側で改善日降順');

const polish=fn('sbmPolishImprovementHistoryView_');
must(polish.includes('SBM_HISTORY_VIEW_STYLE_UAT37_'),'静的レイアウトはUAT37仕様で一度だけ');
must(polish.includes("'改善概要':390"),'改善概要390px');
must(polish.includes("v==='大きく改善'"),'改善方向の文字色');
must(polish.includes("v==='見直し候補'||v==='悪化'"),'見直し/悪化の文字色');
must(polish.includes("v==='測定中'"),'測定中の文字色');
must(polish.includes("v==='測定待ち'"),'測定待ちの文字色');
must(polish.includes("v==='改善完了'"),'改善完了の文字色');
must(polish.includes("getRangeList(doneRanges).setBackground('#f1f3f4')"),'最終判定済み行の薄灰背景');
must(!polish.includes('sh.getRange(1,c).getDisplayValue()'),'ヘッダー逐次読込なし');
console.log('UAT35 history ISO/sort/colors/performance: PASS');
