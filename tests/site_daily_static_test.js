const fs = require('fs');
const code = fs.readFileSync('apps-script/Code.gs','utf8');
const checks = [
  ['version', code.includes("const SBM_VERSION = '5.4.2'")],
  ['single daily key', code.includes('LastSuccessfulDailyUpdateEpoch')],
  ['daily status helper', code.includes('function sbmDailyUpdateStatus_()')],
  ['runtime status helper', code.includes('function sbmGetDailyRuntimeState_()')],
  ['manual dialog', code.includes('function sbmOpenDailyUpdateDialog()')],
  ['running dialog executor', code.includes('function sbmRunDailyUpdateFromDialog()')],
  ['document lock', code.includes('LockService.getDocumentLock()')],
  ['phased daily runner', code.includes('function sbmContinueDailyUpdate_()')],
  ['automatic continuation trigger', code.includes('function sbmDailyUpdateContinuationTrigger()')],
  ['daily work sheet', code.includes('__Daily_Update_Work')],
  ['spinner animation', code.includes('@keyframes spin')],
  ['client progress polling', code.includes('sbmGetDailyUpdateClientStatus')],
  ['site fields hidden from setup', !code.includes('<label>SiteID</label>') && !code.includes('<label>SiteName</label>')],
  ['home unexecuted red', code.includes("'#b3261e'" )],
  ['home daily state row', code.includes("sh.getRange('A4').setValue('日次処理')")],
  ['no startup prompt call', !code.includes('sbmPromptArticleDbUpdateOnOpen_')],
  ['no old home processing function', !code.includes('function sbmSetHomeProcessing_')],
  ['completion marker', code.includes('sbmMarkDailyUpdateCompleted_(completedAt)')],
  ['site id json', code.includes('"site_id": "\'+siteId+\'"')],
  ['repair returns home', code.includes('function sbmActivateHomeAfterRepair_()') && code.includes('ss.setActiveSheet(home)')],
];
let failed = false;
for (const [name, ok] of checks) { console.log(`${ok?'PASS':'FAIL'} ${name}`); if (!ok) failed=true; }
if (failed) process.exit(1);
