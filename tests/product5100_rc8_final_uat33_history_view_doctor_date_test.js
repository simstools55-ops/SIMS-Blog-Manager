const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}
const open=fn('sbmOpenImprovementHistory');
must(open.includes('sbmPrepareImprovementHistoryViewData_()'),'履歴表示時にDoctor旧履歴の日付を軽量補完');
must(open.includes('sbmPolishImprovementHistoryView_()'),'履歴表示時に軽量装飾を適用');
must(!open.includes('sbmRebuildImprovementHistoryList_'),'履歴表示では全再構築しない');
const polish=fn('sbmPolishImprovementHistoryView_');
for(const h of ["'1週':68","'2週':68","'3週':68","'4週':68","'最終判定':110"])must(polish.includes(h),'週次/最終判定列 '+h);
must(polish.includes("var visible={'選択':1,'改善日':1,'記事タイトル':1,'改善概要':1,'改善経路':1,'1週':1,'2週':1,'3週':1,'4週':1,'最終判定':1};"),'2〜4週を表示');
must(!polish.includes('.autoResizeRows('),'履歴を開く際に行高自動計算をしない');
const repair=fn('sbmPrepareImprovementHistoryViewData_');
must(repair.includes("route.indexOf('Doctor→')===0"),'Doctor経路だけ補完');
must(repair.includes("o.completed_at||o.completedAt"),'Writer completed_atから復元');
must(repair.includes('caseByHistoryId'),'Doctor Caseからも復元');
must(code.includes("'改善日':String(data.completed_at||'').trim()||sbmNowText_()"),'新規履歴の改善日を保証');
console.log('UAT33 improvement history view / Doctor date: PASS');
