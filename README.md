# SIMS-Blog-Manager Product 5.0 Official

SIMS-Blog-Manager は、Google Search Consoleのデータをもとに、ブログ記事の改善候補を抽出し、今日やる改善を管理するGoogleスプレッドシート向けApps Script製品です。

## Product 5.0 Official

RC9をSingle Source of Truthとして、正式版に向けたReset Baseを実施しています。
この版の目的は新機能追加ではなく、コード整理、UI整理、処理速度改善、安定性向上、マニュアル整備です。

## 毎日の運用

1. Homeを見る
2. その日最初の起動時にSearch Consoleデータ取得と改善候補抽出が自動実行される
3. 今日の改善に表示された上位5件を改善する
4. 改善完了後、改善中へ移動する
5. 週1回、最大2か月の効果測定を行う

## 主な仕様

- セットアップ仕様はRC9を維持
- 管理メニューは基本的に現状維持
- 改善候補は最大30件
- 今日の改善は上位5件
- 改善中、測定中、良好、改善不要は候補から除外
- 処理ログに開始時刻、終了時刻、利用者待ち時間、件数を記録

## ファイル構成

- `apps-script/Code.js`：Google Apps Script本体
- `docs/`：マニュアルサイト
- `product/`：製品仕様・リリースノート
- `spreadsheet/`：スプレッドシート仕様・テンプレート

## Product 5.0 Spreadsheet Confirmation Base

既存のRC9スプレッドシートで確認する場合は、Apps Scriptを更新したあと、メニュー `SIMS-Blog-Manager` → `管理` → `シートを作成・修復` を実行してください。

その後、`ホーム`、`今日の改善`、`改善中`、`処理ログ` を確認します。
