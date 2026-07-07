# SIMS-Blog-Manager Product 5.0 RC9

Search Consoleデータを使って、日々のブログ改善を管理するGoogleスプレッドシートシステムです。

## RC9の主な修正

- 改善候補分析の列数不一致エラーを修正
- 上位ページ診断の記事タイトル表示と列マッピングを修正
- 上位ページ診断の状態名を利用者向けに改善
- 処理ログに開始時刻・終了時刻・利用者待ち時間を記録
- 既存シートのヘッダー更新を安定化

## 更新手順

1. GitHubへZIPの中身を上書きアップロード
2. Apps Scriptの `apps-script/Code.js` を貼り替え
3. 保存
4. スプレッドシートで「SIMS-Blog-Manager → 管理 → シートを作成・修復」を実行
5. STEP A / STEP B / STEP Cを順番に確認

## deploy.yml

更新不要です。
