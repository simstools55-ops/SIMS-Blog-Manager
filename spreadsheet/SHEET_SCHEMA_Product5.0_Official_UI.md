# SIMS-Blog-Manager Product 5.0 Official UI Spreadsheet Schema

## Purpose
Product 5.0 Official の確認用スプレッドシート本体です。
Google スプレッドシートへインポートして、Home / 今日の改善 / 改善中 / ブログ診断 / 処理ログを実際に確認できます。

## Visible user sheets
- Home: 毎日最初に見る画面。ブログ全体の状況、改善作業の状況、今日やることに限定。
- 今日の改善: 上位5件のみ表示。改善完了後は改善中へ移動する前提。
- 改善中: 改善実施日、次回測定日、測定終了予定日、経過週を管理。
- ブログ診断: 良好記事数、改善中記事数、改善候補数を表示。
- 処理ログ: 開始時刻、終了時刻、利用者待ち時間、件数を記録。
- セットアップ: ブログ名、サイトURL、API接続状態などを確認。

## System sheets
- SearchConsole_Data
- Improvement_Queue
- Improvement_Log
- Settings

## Product 5.0 Rules
- 改善候補は30件で停止。
- 今日の改善は5件のみ表示。
- 改善中・測定中・良好・改善不要は候補抽出から除外。
- 改善中は週1回、最大2か月測定。
- 再修正時は改善実施日を更新し、そこから再度2か月測定。
