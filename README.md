# SIMS-Blog-Manager Product 5.0.0 Article DB Status Classify

この版では、新メニュー「ページデータ収集（記事DB）」で記事DBへ記事ステータスを追加します。

## 製品本体

- `apps-script/Code.gs`
- `apps-script/appsscript.json`

## 変更点

- 記事DBの先頭列に「記事ステータス」を追加
- ページデータ収集ではタイトル取得・改善分析を行わない
- Search Consoleのページ指標のみでステータス分類
- 数値列の表示形式を維持
