const fs=require('fs');
const path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','distribution','Code.gs'),'utf8');
function ok(cond,msg){ if(!cond){ console.error('FAIL:',msg); process.exit(1);} console.log('PASS:',msg); }
ok(code.includes("const SBM_VERSION = '5.18.4';"),'version 5.18.4');
ok(code.includes('function sbmRefreshHome_(options)'),'Home refresh accepts options');
ok(code.includes('var light = options.light === true;'),'light Home mode exists');
ok(code.includes('sbmRefreshHome_({light:true})'),'Home open uses light refresh');
ok(code.includes('function sbmRefreshHomeDailyStatusOnly_()'),'startup daily-status-only refresh exists');
ok(code.includes("try { sbmRefreshHomeDailyStatusOnly_(); }"),'onOpen refreshes daily status');
ok(code.includes("Utilities.formatDate(d, SBM_DEFAULTS.TIMEZONE, 'yyyy-MM-dd')"),'daily date boundary uses product timezone');
ok(!code.includes("|クリック数|表示回数|ctr|current\\s+(?:rank|click|impression)|serp\\s+snapshot)/i"),'old overbroad transient filter removed');
ok(code.includes('transientMetricPattern'),'context-aware transient metric filter exists');
// Treatment learning terms without concrete current metric values must not be blanket-rejected.
const filterLine=code.match(/var transientMetricPattern = \/(.+)\/i;/);
ok(!!filterLine,'transient metric regex found');
if(filterLine){
  const re=new RegExp(filterLine[1],'i');
  ok(!re.test('LIGHT_FIX型改善が4週間の追跡でCTR・クリックの実測改善につながった実績がある'),'CTR improvement learning is allowed');
  ok(re.test('現在CTR 3.47%である'),'concrete current CTR is rejected');
  ok(re.test('クリック数 12'),'concrete click count is rejected');
  ok(re.test('直近の表示回数は増加'),'transient recent metric wording is rejected');
}
