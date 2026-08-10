const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL '+m);process.exit(1)}console.log('PASS '+m)}
ok(code.includes("articleId&&targetNorm?(id===articleId&&url===targetNorm)"),'candidate requires ID+URL agreement when both exist');
ok(code.includes("visibleTitle&&dbTitleCol"),'candidate visible title cross-check exists');
ok(code.includes("誤診断防止のため依頼を作成しません"),'identity mismatch fails closed');
