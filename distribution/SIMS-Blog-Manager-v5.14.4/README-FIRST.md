# SIMS Blog Manager v5.14.4

SIMS Blog Manager (SBM) は、ブログ記事のSearch Consoleデータ取得、
記事管理、改善候補、改善履歴、Doctor / Writer / Merge / Creator連携、
改善後モニタリングを一元管理するSIMSシリーズの中核システムです。

## 配布物

- `README-FIRST.md`
- `Code.gs`
- `appsscript.json`
- `Spreadsheet-Template.xlsx`

## Spreadsheet Template

現行の実運用SBMを基に、最新のシート構成・書式・入力規則を保持しながら、
利用者固有のブログ情報、Search Consoleデータ、記事情報、改善履歴、
Doctor / Writer / Merge / Creator関連データ、ログ、内部ケース情報を除去しています。

配布テンプレートのタイムゾーンは `Asia/Tokyo` です。

初回起動時に `Code.gs` が設定・Home等を初期状態へ再構築します。

## 導入

1. `Spreadsheet-Template.xlsx` をGoogle Driveへアップロードします。
2. Googleスプレッドシートとして開きます。
3. 「拡張機能」→「Apps Script」を開きます。
4. `Code.gs` の内容をApps Scriptの `Code.gs` へ反映します。
5. マニフェストを表示し、`appsscript.json` を反映します。
6. スプレッドシートへ戻って再読み込みします。
7. SBMメニューから初回セットアップを開始します。
8. ブログ名・ブログURL・Search Consoleプロパティを登録します。
9. Search Console APIを有効化し、接続テストを行います。
10. 初回記事DB作成と記事情報補完を実行します。

## Version

SIMS Blog Manager v5.14.4
