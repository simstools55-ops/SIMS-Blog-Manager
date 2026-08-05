const fs=require('fs');
const path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
const checks=[
  ['version',/5\.9\.0-rc\.1/],
  ['package 2.1',/package_version:'2\.1\.0'/],
  ['page summary fetch',/function sbmDoctorFetchLongTermPageSummary_/],
  ['page daily validation',/PAGE_DAILY_LARGE_DIFFERENCE/],
  ['limited diagnosis',/severeMismatch\|\|counts\.ERROR/],
  ['outbound link extraction',/function sbmExtractArticleLinksFromHtml_/],
  ['link status',/already_linked/],
  ['main query stale',/MAIN_QUERY_STALE/],
  ['sample notes',/period_sample_notes:sbmDoctorPeriodSampleNotes_/]
];
let fail=0;
for(const [name,re] of checks){if(!re.test(code)){console.error('FAIL',name);fail++;}else console.log('PASS',name);}
if(fail)process.exit(1);
