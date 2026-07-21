const fs = require('fs');
const code = fs.readFileSync('apps-script/Code.gs','utf8');
const checks = [
  ['version', code.includes("const SBM_VERSION = '5.3.2'")],
  ['no fixed old home version', !code.includes("!== 'v5.2.1'")],
  ['single daily key', code.includes('LastSuccessfulDailyUpdateEpoch')],
  ['daily status helper', code.includes('function sbmDailyUpdateStatus_()')],
  ['completion marker', code.includes('sbmMarkDailyUpdateCompleted_(completedAt)')],
  ['site prompt', code.includes('【サイト情報】\\nSiteID：')],
  ['site id json', code.includes('"site_id": "\'+siteId+\'"')],
  ['site name json', code.includes('"site_name": "\'+siteName+\'"')],
  ['site url prompt', code.includes('SiteURL：\'+siteUrl')],
  ['site url json', code.includes('"site_url": "\'+siteUrl+\'"')],
  ['repair returns home', code.includes('function sbmActivateHomeAfterRepair_()') && code.includes('ss.setActiveSheet(home)')],
  ['startup reason log', code.includes("sbmLog_('DailyPromptDecision'")],
];
let failed = false;
for (const [name, ok] of checks) { console.log(`${ok?'PASS':'FAIL'} ${name}`); if (!ok) failed=true; }
if (failed) process.exit(1);
