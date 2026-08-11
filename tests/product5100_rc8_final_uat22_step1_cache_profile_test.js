const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}

const cls=code.slice(code.indexOf('function sbmClassifyArticleDbStatus_'),code.indexOf('function sbmFetchSearchConsolePageRowsForArticleDb_',code.indexOf('function sbmClassifyArticleDbStatus_')));
must(cls.includes('minImpsCached'),'classifier accepts cached MinImpressions');

const fs0=code.indexOf('function sbmFetchSearchConsolePageRowsForArticleDb_');
const fe=code.indexOf('function sbmMergeArticleDbDaily_',fs0);
const fetch=code.slice(fs0,fe);
must(fetch.includes("var minImpsCached = sbmNumber_(sbmGetSetting_('MinImpressions'"),'STEP1 reads MinImpressions once');
must(fetch.includes('statusMap, minImpsCached'),'all article classification uses cached setting');
must(fetch.includes('timings.normalize'),'URL normalization is timed');
must(fetch.includes('timings.statusMap'),'status map read is timed');
must(fetch.includes('timings.buildRows'),'classification/build is timed');
must(fetch.includes('timings.sort'),'sort is timed');

const s2s=code.indexOf('function sbmRunDailyAnalysisStageFromDialog()');
const s2e=code.indexOf('/** STEP 3',s2s);
const s2=code.slice(s2s,s2e);
must(s2.includes('step2MergeSec'),'STEP2 DB merge is timed');
must(s2.includes('step2SelectSec'),'STEP2 candidate selection is timed');
must(s2.includes('step2TodayWriteSec'),'STEP2 Today sheet write is timed');
must(s2.includes('step2WorkStateSec'),'STEP2 work-state write is timed');

must(!code.includes('URL正規化 "+formatTime(t.normalize)'), 'Final UI hides detailed STEP1 QA breakdown while internal timing remains');

console.log('UAT22 STEP1 cache/profile regression: PASS');
