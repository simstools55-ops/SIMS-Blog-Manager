const fs = require('fs');
const code = fs.readFileSync('apps-script/Code.gs', 'utf8');
const checks = [
  ['version', "const SBM_VERSION = '5.9.1';"],
  ['publication result', "obj.publication_result"],
  ['public ok priority', "hasPublicOkChanges ? publicationResult.public_ok_changes : obj.changes"],
  ['user decision save', "'利用者判断変更JSON'"],
  ['change summary save', "'変更サマリーJSON'"],
  ['legacy fallback', "hasLegacyChanges"],
  ['v42 prompt', "SIMS Writer Contract v4.2準拠"]
];
let failed = false;
for (const [name, needle] of checks) {
  if (!code.includes(needle)) { console.error('FAIL:', name); failed = true; }
  else console.log('PASS:', name);
}
if (failed) process.exit(1);
