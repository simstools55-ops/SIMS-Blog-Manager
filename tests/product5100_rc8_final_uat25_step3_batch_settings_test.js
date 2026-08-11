const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){
  const s=code.indexOf('function '+name); if(s<0)return '';
  let b=code.indexOf('{',s),d=0,i=b;
  for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}
  return code.slice(s,i);
}
must(code.includes('function sbmGetSettingsMap_()'),'設定の一括読込ヘルパーを追加');
must(code.includes('function sbmSetSettingsBatch_(entries)'),'設定の一括保存ヘルパーを追加');

const mark=fn('sbmMarkDailyUpdateCompleted_');
must(mark.includes('sbmSetSettingsBatch_(['),'完了日時3項目を一括保存');
must(!mark.includes("sbmSetSetting_('LastSuccessfulDailyUpdateEpoch'"),'完了日時を個別保存しない');

const runtime=fn('sbmPersistDailyRuntime_');
must(runtime.includes('sbmSetSettingsBatch_(batch)'),'実行状態を一括保存');
must(!runtime.includes("Object.keys(values).forEach(function(key) {\n    try { sbmSetSetting_"),'実行状態をキーごとに設定シート保存しない');

const home=fn('sbmRefreshHome_');
must(home.includes('var settingsMap = sbmGetSettingsMap_();'),'Homeは設定を一括読込');
must(home.includes("settingsMap['BlogName']"),'Homeブログ名は一括読込値を使用');
must(home.includes('sbmDailyUpdateStatus_(settingsMap)'),'Home日次状態は設定Mapを再利用');
must(home.includes('sbmGetDailyRuntimeState_(settingsMap)'),'Home実行状態は設定Mapを再利用');
must(!home.includes("sbmGetSetting_(key, current)"),'Homeランク矢印で設定を都度読込しない');

const s3=fn('sbmRunDailyFinalizeStageFromDialog');
must(s3.includes("sbmSetSettingsBatch_([") && s3.includes("DailyStep3TimingHomeSec"),'STEP3計測値を一括保存');

console.log('UAT25 STEP3 batch settings regression: PASS');
