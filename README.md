# SIMS-Blog-Manager Product 5.0.0

Product 5.0 Officialは、不要なものをそぎ落として必要なものだけに絞る方針で開発しています。

## 今回の版

`Legacy Feature Removal`

旧SIMS由来の以下4機能を現行実装から除去しました。

- 記事カルテ
- カニバリ診断
- 記事ネタ候補
- 上位ページ診断

## 利用者向けApps Script

`apps-script/Code.gs` をApps Scriptの `Code.gs` に貼り付けてください。

必要に応じて `apps-script/appsscript.json` も反映してください。

### 開発用: STEP B処理プロファイル

STEP B改善候補分析を実行すると、`処理プロファイル` シートに工程別の所要時間が記録されます。ボトルネック分析用です。

STEP Aの取得結果には、取得件数が `DailyFetchMaxRows` に到達したかどうかも処理ログへ出力します。
