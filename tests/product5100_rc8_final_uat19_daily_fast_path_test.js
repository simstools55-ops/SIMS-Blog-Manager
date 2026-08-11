const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}

const s1=code.slice(code.indexOf('function sbmRunDailyFetchStageFromDialog()'),code.indexOf('/** STEP 2',code.indexOf('function sbmRunDailyFetchStageFromDialog()')));
must(!s1.includes('sbmRefreshHome_(); SpreadsheetApp.flush();'),'STEP1開始時にHome再描画しない');

const merge=code.slice(code.indexOf('function sbmMergeArticleDbDaily_'),code.indexOf('function sbmWriteArticleDb_',code.indexOf('function sbmMergeArticleDbDaily_')));
must(merge.includes("sbmWriteArticleDb_(rows,{dailyFast:true})"),'日次マージは高速記事DB書き込みを使う');
must(merge.includes('sbmUpdateHomeArticleDbCounts_(rows,true)'),'STEP2ではHome件数だけ更新し再描画しない');

const writer=code.slice(code.indexOf('function sbmWriteArticleDb_'),code.indexOf('function sbmSupplementArticleDbMetaManual',code.indexOf('function sbmWriteArticleDb_')));
must(writer.includes('if (options.dailyFast === true)'),'日次高速書き込み分岐がある');
must(!writer.slice(writer.indexOf('if (options.dailyFast === true)'),writer.indexOf('return;',writer.indexOf('if (options.dailyFast === true)'))).includes('sbmStyleArticleDbSheet_'),'日次高速分岐で全体再装飾しない');

const ws=code.slice(code.indexOf('function sbmApplyTodayWorkState_'),code.indexOf('function sbmBuildTodayImprovementSheet_',code.indexOf('function sbmApplyTodayWorkState_')));
must(ws.includes('sh.getRange(2,workCol,n,1).setValues(works)'),'作業状態は1列だけ書き戻す');
must(!ws.includes('sh.getRange(2,1,vals.length,sh.getLastColumn()).setValues(vals)'),'記事DB全件再書込をしない');

const s2=code.slice(code.indexOf('function sbmRunDailyAnalysisStageFromDialog()'),code.indexOf('/** STEP 3',code.indexOf('function sbmRunDailyAnalysisStageFromDialog()')));
must(!s2.includes('sbmCleanupTodayCompletedRows_()'),'STEP2で旧Todayキューの重複掃除をしない');

const s3=code.slice(code.indexOf('function sbmRunDailyFinalizeStageFromDialog()'),code.indexOf('// Product 5.4.2',code.indexOf('function sbmRunDailyFinalizeStageFromDialog()')));
must(s3.includes('sbmRefreshHome_(); SpreadsheetApp.flush();'),'Home再描画は最終STEP3で行う');

console.log('UAT19 daily fast path regression: PASS');
