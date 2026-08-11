# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT16

## Scope
UAT15の実機FAILを修正。表示速度・装飾・今日の改善の完了済み残留に限定。

## Root causes
- 「改善の推移」「改善履歴」の軽量化対象が本体関数だけで、互換メニュー入口にDoctor全件修復・効果測定再計算が残っていた。
- 軽量化時に表示用スタイル適用まで外したため、シートが無装飾で表示された。
- 「今日の改善」のクリーンアップが記事管理の「モニター中」だけを見ており、旧「完了」状態やシート上の「完了」行を取り切れなかった。

## Fixes
- 改善の推移/改善履歴のメニュー入口からDoctor全件修復・全件再計算を完全分離。
- 表示時はデータを再計算せず、装飾だけ再適用。
- 今日の改善は「モニター中」「完了」およびシート上の「完了」行を除外。
- 今日の改善を開いた時にも古い完了行を掃除し、設定件数まで候補を補充。
- Health Staged Runnerは変更なし。

## Regression IDs
- REG-VIEW-WRAPPER-LIGHTWEIGHT-001
- REG-VIEW-STYLE-PRESERVE-001
- REG-TODAY-COMPLETED-CLEANUP-002
