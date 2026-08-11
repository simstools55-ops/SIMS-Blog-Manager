const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
const s=code.indexOf('function onOpen()');
let i=code.indexOf('{',s),d=0,e=i;
for(;e<code.length;e++){if(code[e]==='{')d++;else if(code[e]==='}'&&--d===0){e++;break;}}
const o=code.slice(s,e);
must(o.includes("createMenu('SIMS-Blog-Manager')"),'主要メニューを生成');
must(o.includes("createMenu('SIMS Doctor')"),'Doctorメニューを生成');
must(!o.includes('sbmEnsureOfficialSchemaOnce_'),'起動時にスキーマ修復しない');
must(!o.includes('sbmEnsureCanonicalOperationalUrlsOnce_'),'起動時にURL全体正規化しない');
must(!o.includes('sbmDoctorEnsureLatestUserViews_'),'起動時にDoctor UI移行しない');
must(!o.includes('sbmStyleHistorySheetV2_'),'起動時に履歴全装飾しない');
must(!o.includes('sbmApplyHistoryFinalStyle_'),'起動時に履歴最終装飾しない');
must(!o.includes('sbmStyleEffectSheetV2_'),'起動時に推移全装飾しない');
must(!o.includes('sbmRefreshHome_'),'起動時にHome全再集計しない');
must(!o.includes("sbmEnsureTodayRecommendations_('open')"),'起動時にToday候補生成しない');
must(!o.includes('SpreadsheetApp.flush()'),'起動時にflushしない');
must(o.includes('home.activate()'),'既存Homeは表示');
console.log('UAT21 onOpen fast menu regression: PASS');
