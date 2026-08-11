# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT21

## Root cause
onOpenがメニュー生成だけでなく、以下の重い処理を毎回実行していた。
- 公式スキーマ修復
- Canonical URL全体整合
- Doctor UI移行
- 改善履歴・改善の推移の全装飾
- Home全再集計
- 今日の改善候補生成
- Spreadsheet flush

Apps Script実行履歴ではonOpenが約30秒でタイムアウトし、SIMSメニュー自体が表示されないケースを確認。

## Fix
onOpenの責務を以下だけに限定。
1. 利用者向けメニュー生成
2. 既存Homeの表示

修復・再計算・候補生成・装飾は各機能の正規操作時に実行する。

## Expected real-sheet behavior
- 再読み込み後、SIMSメニューが数秒以内に表示される。
- onOpenはApps Script実行履歴で数秒以内に「完了」する。
- Homeは既存表示をそのまま開き、日次処理等で最新化される。
