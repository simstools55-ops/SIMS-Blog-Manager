# SIMS-Blog-Manager Product 5.0.0

RC9をベースに、不要なものをそぎ落として必要なものだけに絞る正式版です。

## 製品本体

- `spreadsheet/SIMS-Blog-Manager.xlsx`
- `apps-script/Code.gs`

## 今回の確認ポイント

STEP B「改善候補を分析」を実行しても、記事ネタ候補・カニバリ診断・上位ページ診断・効果測定・測定履歴のシートや処理は起動しません。

更新されるのは、データ一覧、今日の改善、改善中、Home、処理ログです。

### Product 5.0 Topic Sheet Guard & Brief Title Fix

STEP B実行中にRC9由来の `記事ネタ候補` シートが一時的に作成される問題を修正しました。改善ブリーフの記事タイトルはURL表示ではなく、記事タイトル表示に統一しています。
