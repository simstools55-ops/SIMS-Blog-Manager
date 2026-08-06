const fs = require('fs');
const code = fs.readFileSync('apps-script/Code.gs', 'utf8');
const checks = [
  ["version", "const SBM_VERSION = '5.9.1';"],
  ["constant", "const QUERY_ROW_LIMIT = 200;"],
  ["fetch limit", "sbmFetchTopQueriesForUrlNow_(url,QUERY_ROW_LIMIT)"],
  ["impressions sort", "return (b.imps-a.imps) || (b.clicks-a.clicks)"],
  ["detail block", "Search Console Query Data"],
  ["fixed header", "Query|Clicks|Impressions|CTR|Position"],
  ["coverage", "Coverage       : "]
];
let failed = false;
for (const [name, value] of checks) {
  if (!code.includes(value)) { console.error('FAIL:', name); failed = true; }
  else console.log('PASS:', name);
}
if (failed) process.exit(1);
