const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'apps-script', 'Code.gs'), 'utf8');

function must(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    process.exit(1);
  }
  console.log('PASS:', msg);
}

must(code.includes('function sbmHomeLayoutNeedsRebuild_(sh)'), 'Homeレイアウト署名ガードが存在する');
must(code.includes("['A16','モニター中']"), 'Homeの第2状態行はモニター中');
must(code.includes("['A18','未取得記事']"), 'Homeの第3状態行は未取得記事');
must(code.includes("['A17','改善確認完了']"), 'Homeの第4状態行は改善確認完了');
must(code.includes("indexOf('改善中') >= 0) return true"), '旧改善中ラベルを検出するとHomeを再構築する');
must(code.includes("|| sbmHomeLayoutNeedsRebuild_(sh))"), '同一バージョンでもHomeレイアウト不一致を再構築する');
must(code.includes("else if (w.indexOf('モニター中') >= 0) work.monitor++;"), 'Home件数は記事管理のモニター中だけを数える');
must(!code.includes("else if (w.indexOf('改善中') >= 0 || w.indexOf('モニター中') >= 0) work.monitor++;"), 'Home集計に旧改善中の二重定義が残っていない');

console.log('UAT14 Home monitoring regression: PASS');
