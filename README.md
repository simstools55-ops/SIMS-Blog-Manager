# SIMS-Blog-Manager Product 5.0 Official Lean Base

SIMS-Blog-Manager は、Google Search Console のデータをもとに、ブログ記事の改善候補を抽出し、今日やる改善を管理する Google スプレッドシート向け製品です。

## Product 5.0 Official の方針

Product 5.0 Official は、RC9 を Single Source of Truth として引き継ぎます。
ただし、RC版で増えた不要なものをそぎ落とし、正式版に必要なものだけに絞ります。

- 新機能追加を目的にしない
- 画面・メニュー・処理を必要最小限にする
- Apps Script は利用者向けに `apps-script/コード.gs` へ一本化する
- スプレッドシートは Home / 今日の改善 / 改善中 / ブログ診断 / 処理ログを中心にする
- docs/ は正式仕様に合わせて更新する

## 配布物

- `spreadsheet/SIMS-Blog-Manager-template-Product5.0-Official-Lean.xlsx`
  - Googleスプレッドシートへインポートするテンプレート
- `apps-script/コード.gs`
  - 利用者が Apps Script の「コード.gs」へ貼り付ける一本化コード
- `docs/`
  - マニュアルサイト用ドキュメント
- `product/`
  - 製品仕様・リリースノート

## 利用者の基本手順

1. Excelテンプレートを Google Drive にアップロードする
2. Googleスプレッドシートとして開く
3. Apps Script を開き、`apps-script/コード.gs` の内容を貼り付ける
4. 初回セットアップを実行する
5. Home から毎日の改善作業を開始する

## 毎日の運用

1. Homeを見る
2. その日最初の起動時のみ、Search Consoleデータ取得と改善候補抽出を行う
3. 今日の改善に表示された上位5件を改善する
4. 改善完了後、改善中へ移動する
5. 週1回、最大2か月の効果測定を行う
