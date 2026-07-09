# SIMS-Blog-Manager Product 5.0.0

製品本体は以下です。

- `spreadsheet/SIMS-Blog-Manager.xlsx`
- `apps-script/Code.gs`
- `apps-script/appsscript.json`

今回の版では、データ一覧の表示品質を修正しています。


## Product 5.0.0 URL Fragment Meta Title Fix

Search Consoleに含まれるページ内リンク（`#見出し`付きURL）を記事本体URLに統合します。
また、はてなブログ・WordPressの両方に対応しやすい記事タイトル取得ルールへ変更しました。

- `#` 以降を削除して同一記事に統合
- `og:title`、`entry-title`、`article h1`、titleタグ補正の順で記事タイトルを判定
- STEP Bでは外部取得せず、データ一覧の保存済み情報を利用
