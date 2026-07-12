# SIMS-Blog-Manager Product 5.0 Official

Google Search Consoleのデータを使い、ブログ記事の改善候補、改善作業、4週間の効果測定をGoogleスプレッドシートで管理する製品です。

## 現在の版

`5.0.0-official-r1-s5`

## 配布用Apps Script

利用者へ渡すApps Scriptは次の1ファイルです。

```text
apps-script/Code.gs
```

Apps Scriptプロジェクトの「コード.gs」へ全内容を貼り付けて使用します。

## 更新後の適用手順

1. `apps-script/Code.gs` を「コード.gs」へ全置換して保存
2. スプレッドシートを再読み込み
3. `SIMS-Blog-Manager → バージョン情報` を開く
4. `5.0.0-official-r1-s5` と表示されることを確認
5. `SIMS-Blog-Manager → シートを作成・修復` を1回実行

## 4週間効果測定

記事改善後、7日・14日・21日・28日の4回測定します。

- 改善効果シート：次回予定日、測定回数、最新判定を表示
- 改善履歴シート：4回分の測定日時と判定を保存
- 旧「7日間延長」「測定完了」操作：廃止
- 4回目の記録後：自動的に測定完了

## 主なフォルダ

- `apps-script/`：配布用Apps Script
- `docs/`：GitHub Pages用マニュアル原稿
- `site/`：今回ビルドしたマニュアル確認用HTML
- `.github/workflows/`：GitHub Pages自動デプロイ
- `product/`：製品仕様・監査資料
- `spreadsheet/`：スプレッドシート関連資料
- `tests/`：動作確認手順
