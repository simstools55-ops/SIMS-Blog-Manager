const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL '+m);process.exit(1)}console.log('PASS '+m)}
const start=code.indexOf('function sbmDoctorFetchPageMetrics_');
const end=code.indexOf('function sbmDoctorMergeSnapshotMetrics_',start);
const fn=code.slice(start,end);
ok(fn.includes("raw.indexOf('?')>=0 || raw.indexOf('#')>=0"),'REG-HEALTH-SUMMARY-MISMATCH-001: parameter/fragment variants excluded from health snapshot');
ok(fn.includes('if(!prev || candidate.clicks>prev.clicks || (candidate.clicks===prev.clicks && candidate.impressions>prev.impressions)) map[url]=candidate;'),'canonical duplicates are selected, not summed');
ok(!fn.includes('map[url].clicks+=clicks'),'normalized variants are not accumulated');
ok(!fn.includes('map[url].impressions+=imps'),'impressions cannot multiply through normalized variants');
console.log('PASS product5100_rc8_final_uat5_health_canonical_metrics_test');
