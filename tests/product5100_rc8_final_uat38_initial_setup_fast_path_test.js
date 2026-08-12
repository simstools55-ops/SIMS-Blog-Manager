const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}

const status=fn('sbmRelease1SetupStatus_');
must(status.includes('var settings=sbmGetSettingsMap_()'),'セットアップ状態はSettingsを1回で読む');
must(status.includes('sbmSetupInfoCompletionCountsFast_()'),'記事補完件数は対象列だけ読む');

const bulk=fn('sbmSetupSetSettingsBulk_');
must(bulk.includes('setValues(existing)'),'設定値を一括保存');

const batch=fn('sbmGetArticleInfoBatch_');
must(!batch.includes("sbmSetSetting_('ArticleInfoBatch'"),'バッチ件数読込時の不要な設定書込を廃止');

const build=fn('sbmBuildArticleDbOnePass_');
must(build.includes("sbmWriteArticleDbObjects_(freshMap,{fast:true})"),'STEP4は記事DB全再装飾をしない');
must(!build.includes('sbmRefreshHome_()'),'STEP4途中でHome再描画しない');

const supp=fn('sbmSupplementArticleDbSetupChunk_');
must(supp.includes("sh.getRange(2,1,data.length,heads.length).setValues(data)"),'STEP5記事DBは一括書込');
must(!supp.includes('sbmSetObjectValues_('),'STEP5の1記事ごとのセル書込を廃止');
must(!supp.includes('sbmRefreshHome_()'),'STEP5チャンクごとにHome再描画しない');

const exec=fn('sbmExecuteRelease1SetupStep');
must(exec.includes('sbmSetupSetSettingsBulk_(['),'STEP1/3等の設定保存を一括化');
must(exec.includes('sbmRefreshHome_();'),'Home更新は最終STEPに残す');

must(code.includes("初回セットアップの工程時間を確認','sbmShowSetupTimingReport'"),'計測結果メニューを追加');
console.log('UAT38 initial setup fast path: PASS');
