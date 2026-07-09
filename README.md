# SIMS-Blog-Manager Product 5.0.0 Home UI Restore Fast

製品本体は以下です。

- `apps-script/Code.gs`
- `apps-script/appsscript.json`

Search Console取得が高速化したRC8.1系の取得処理を維持し、Home画面の処理中表示と不要タブ整理だけを戻した確認版です。

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


## Product 5.0 RC8.1 Fast Path

- Search Console取得エンジンはRC8.1ベースを維持。
- onOpenはメニュー作成だけに限定。
- STEP AはSearch Consoleデータ取得のみ。
- 日次取得上限 DailyFetchMaxRows の標準値を1500件に設定。
- Homeの処理状況表示を維持しつつ、処理中の注意文を明確化。


## Product 5.0 Home UI Syntax Fix
- Code.gs の構文エラー（Unexpected token）を修正。
- 高速化済みSearch Console取得処理とHome UI復元内容は維持。
- 利用者向けApps Scriptは Code.gs のみ。
