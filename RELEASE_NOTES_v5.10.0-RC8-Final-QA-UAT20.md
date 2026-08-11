# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT20

## Purpose
日次処理STEP1が約3分かかる原因を、推測ではなく実機計測で特定する診断ビルド。

## STEP1 timing breakdown
- 実行状態保存
- 作業シート初期化
- 取得条件準備
- Search Console API
- URL正規化
- 既存記事状態参照
- 記事行生成
- ソート
- 作業シート保存
- 設定保存

STEP1完了後、STEP2画面上部に主要内訳
「STEP1合計 / API / URL処理 / 保存」を表示します。
詳細値は設定とProcess Log/Profileにも保存します。

## Lock UX
途中でダイアログを閉じてもサーバー処理が継続する場合があることを、
再実行時のエラー文で明示します。

## Important
UAT20はSTEP1の原因特定が目的です。
Search Console取得方式・Doctor・Health・Today fast path・推移/履歴fast viewの機能変更は行いません。
