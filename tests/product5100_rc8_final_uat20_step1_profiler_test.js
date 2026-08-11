const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}

const fetchStart=code.indexOf('function sbmFetchSearchConsolePageRowsForArticleDb_');
const fetchEnd=code.indexOf('function sbmMergeArticleDbDaily_',fetchStart);
const fetch=code.slice(fetchStart,fetchEnd);
must(fetch.includes('timings.api'),'Search Console API時間を計測');
must(fetch.includes('timings.normalize'),'URL正規化時間を計測');
must(fetch.includes('timings.statusMap'),'既存記事状態参照時間を計測');
must(fetch.includes('timings.buildRows'),'記事行生成時間を計測');
must(fetch.includes('timings.sort'),'ソート時間を計測');
must(fetch.includes('timings:timings'),'STEP1へ詳細時間を返す');

const s1start=code.indexOf('function sbmRunDailyFetchStageFromDialog()');
const s1end=code.indexOf('/** STEP 2',s1start);
const s1=code.slice(s1start,s1end);
must(s1.includes('DailyStep1TimingApiSec'),'API計測値を保存');
must(s1.includes('DailyStep1TimingWorkWriteSec'),'作業シート保存時間を保存');
must(s1.includes("profiler.finish('完了'"),'Profilerを完了保存');
must(s1.includes('前の処理がまだ終了していません'),'ロック中の利用者向け説明を改善');

must(!code.includes('STEP1完了 "+formatTime(fetch&&fetch.elapsedSeconds)'), 'Final UI does not expose STEP1 QA breakdown');

console.log('UAT20 STEP1 profiler regression: PASS');
