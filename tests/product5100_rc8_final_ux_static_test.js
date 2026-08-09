const fs = require('fs');
const code = fs.readFileSync(require('path').join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(x,msg){ if(!x){ console.error('FAIL:',msg); process.exit(1); } }
must(code.includes("(c.query || (Number(c.impressions||0)>0 ? '取得待ち' : '検索実績なし'))"),'今日の改善のメインクエリ空欄対策');
must(code.includes("FEEDBACK_HISTORY: ['選択','改善日','記事タイトル','改善概要','改善経路','使用AI'"),'改善履歴の改善経路');
must(code.includes("var visibleHeaders = ['選択','改善日','記事タイトル','改善概要','改善経路','1週'"),'使用AIを利用者表示から除外');
must(code.includes("改善管理中 '+Number(counts.excluded||0)+'件"),'健康診断書の改善管理中表示');
must(code.includes("['長期流入低下',Number(issueCounts.LONG_TERM_DECLINE||0)]"),'健康診断傾向の件数・割合');
must(code.includes("※鮮度・競合強化・カニバリ等は精密診断で追加判定します。"),'一次検査と精密診断の責務分離');
must(code.includes("var headers=['選択','重症度','記事タイトル','傾向','クリック','表示','順位','CTR'"),'精密診断候補の8列比較ビュー');
must(code.includes("return '🔴 緊急'"),'重症度 緊急');
must(code.includes("trend:'長期流入低下'"),'傾向の診断カテゴリ');
must(code.includes("setBackground('#eef5ee').setWrap(true).setVerticalAlignment('middle')"),'次に行うことの折り返し');
console.log('PASS product5100_rc8_final_ux_static_test');
