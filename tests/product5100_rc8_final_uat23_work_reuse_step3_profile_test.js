const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){
  const s=code.indexOf('function '+name); if(s<0)return '';
  let b=code.indexOf('{',s),d=0,i=b;
  for(;i<code.length;i++){ if(code[i]==='{')d++; else if(code[i]==='}'&&--d===0){i++;break;} }
  return code.slice(s,i);
}
const clear=fn('sbmClearDailyWork_');
must(!clear.includes('deleteSheet'),'日次作業シートを削除しない');
must(clear.includes("getSheetByName(name)"),'既存作業シートを再利用');
must(clear.includes('clearContent'),'本文だけクリアする');

const write=fn('sbmWriteDailyWorkRows_');
must(write.includes("ss.getSheetByName(name)"),'保存時も既存作業シートを使う');
must(write.includes('setValues(normalized)'),'作業データは一括保存');
must(!write.includes('sh.clearContents()'),'シート全体clearContentsをしない');

const s3=fn('sbmRunDailyFinalizeStageFromDialog');
for(const k of ['step3BeforeHistorySec','step3EffectSec','step3AfterHistorySec','step3RuntimeSec','step3HomeSec','step3CleanupSec']){
  must(s3.includes(k),'STEP3 timing '+k+' is recorded');
}
must(s3.includes('summary.step3Timing'),'STEP3 timing is returned');
must(s3.includes('DailyStep3TimingEffectSec'),'STEP3 timing persists to Settings');
console.log('UAT23 work reuse / STEP3 profiler regression: PASS');
