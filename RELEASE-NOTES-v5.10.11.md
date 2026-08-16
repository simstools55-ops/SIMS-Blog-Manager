# SIMS-Blog-Manager v5.10.11 Release Notes

Site Diagnosisの処置画面で「診断結果を登録」がクリックできない／反応が確認できない問題への最小PATCHです。

ボタン入力をブラウザ側で明示検出し、クリックイベントから既存の `submitDoctor()` を呼び出す構造へ変更しました。Creator連携ロジック自体は変更していません。
