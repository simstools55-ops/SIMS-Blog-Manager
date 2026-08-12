const fs = require('fs');
const code = fs.readFileSync('apps-script/Code.gs','utf8');
function ok(cond,msg){ if(!cond){ console.error('FAIL:',msg); process.exit(1);} }
ok(code.includes('[SBM_SHEETS.USER_SETTINGS, SBM_SHEETS.PROCESS_LOG, SBM_SHEETS.PROFILE_LOG]'), 'profile log hidden with optional admin sheets');
ok(code.includes('activeName !== SBM_SHEETS.PROFILE_LOG'), 'profiler preserves active sheet');
ok(code.includes('if (!visibleMatches) sbmWriteTodayRecommendations_(target,targetShown);'), 'today open only redraws on visible diff');
ok(code.includes('var clearRows = Math.max(15, sh.getLastRow() || 0);'), 'today rebuild clears limited working rows');
ok(!code.includes('var maxRows = Math.max(sh.getMaxRows(), 2);\n\n  // 見出し以外を完全に初期化'), 'full-sheet today body clear removed');
console.log('PASS: RC8 Final Hotfix 8 Today/Profile regression');
