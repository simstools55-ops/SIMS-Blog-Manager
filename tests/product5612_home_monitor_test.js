const fs = require('fs');
const code = fs.readFileSync('apps-script/Code.gs', 'utf8');
const must = [
  "const SBM_VERSION = '5.10.0-RC8.9'",
  "'改善前クリック','現在クリック','改善前表示回数','現在表示回数','判定'",
  'function sbmHomeMonitorJudgmentCounts_()',
  "sh.getRange('E14:H14').merge().setValue('改善中の記事｜推移')",
  "sh.getRange('A20:H21').merge().setValue('右側の色は「改善の推移」と同じ判定色です。",
  "setNumberFormat('#,##0')"
];
for (const token of must) {
  if (!code.includes(token)) throw new Error('missing: ' + token);
}
const visibleHeader = code.match(/const SBM_EFFECT_HEADERS_V2 = \[([\s\S]*?)\];/)[1];
const firstLine = visibleHeader.split('\n').slice(0,2).join(' ');
if (firstLine.includes('改善前CTR') || firstLine.includes('改善前順位')) throw new Error('old visible metrics remain');
console.log('product5612_home_monitor_test: PASS');
