const fs = require('fs');
const code = fs.readFileSync('apps-script/Code.gs', 'utf8');
const must = [
  "const SBM_VERSION = '5.9.0-rc.1'",
  "'改善前クリック','現在クリック','改善前表示回数','現在表示回数','判定'",
  'function sbmHomeMonitorJudgmentCounts_()',
  "sh.getRange('E14:H14').merge().setValue('改善中の記事（モニター中）')",
  "sh.getRange('A20:H21').merge().setValue('判定はクリック数を最優先に",
  "setNumberFormat('#,##0')"
];
for (const token of must) {
  if (!code.includes(token)) throw new Error('missing: ' + token);
}
const visibleHeader = code.match(/const SBM_EFFECT_HEADERS_V2 = \[([\s\S]*?)\];/)[1];
const firstLine = visibleHeader.split('\n').slice(0,2).join(' ');
if (firstLine.includes('改善前CTR') || firstLine.includes('改善前順位')) throw new Error('old visible metrics remain');
console.log('product5612_home_monitor_test: PASS');
