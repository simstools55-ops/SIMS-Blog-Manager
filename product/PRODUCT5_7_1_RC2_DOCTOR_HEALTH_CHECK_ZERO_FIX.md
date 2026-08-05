# Product 5.7.1 RC2 Doctor Health Check Zero Fix

## 修正

- Health Runシートの日付セルがDate型になっても、Search Console APIへ`yyyy-MM-dd`で渡す。
- 健康診断は単一メニューから自動で全工程を実行する。
- 旧RC1の0件実行を検出し、180日取得から自動再開する。

## 利用者操作

`SIMS Doctor` → `ブログ全体の健康診断を実行` を1回選択する。
通常は一次検査完了まで追加操作不要。処理時間上限が近い場合のみ、同じメニューを再度選択する。
