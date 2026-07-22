const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
const checks=[
 ['version', code.includes("const SBM_VERSION = '5.4.0'")],
 ['canonical daily key', code.includes("LastSuccessfulDailyUpdateEpoch")],
 ['JST daily key', code.includes("Utilities.formatDate(d, SBM_DEFAULTS.TIMEZONE, 'yyyy-MM-dd')")],
 ['no legacy fallback', !/legacy\s*=\s*String\(sbmGetSetting_\('LastArticleDbFetchAt'/.test(code)],
 ['no processing function', !code.includes('function sbmSetHomeProcessing_')],
 ['no processing calls', !code.includes('sbmSetHomeProcessing_(')],
 ['no processing home title', !code.includes("setValue('処理状況')")],
 ['home ends row24', code.includes("sh.getRange('A1:H24')")],
 ['no setup SiteID input', !code.includes('<label>SiteID</label>')],
 ['no setup SiteName input', !code.includes('<label>SiteName</label>')],
 ['blogName maps siteName', code.includes('var siteName = blogName;')],
 ['fixed existing site id', code.includes("String(sbmGetSetting_('SiteID','') || '').trim() || sbmSiteIdFromUrl_(blogUrl)")],
 ['repair returns home', code.includes('function sbmActivateHomeAfterRepair_')],
];
let bad=0; for(const [n,ok] of checks){console.log((ok?'PASS':'FAIL')+' '+n);if(!ok)bad++;} if(bad)process.exit(1);
