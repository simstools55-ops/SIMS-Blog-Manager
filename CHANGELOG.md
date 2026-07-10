# CHANGELOG

## Product 5.0 ArticleDB One-Pass Page Fetch

- STEP4を100件ずつの繰り返し取得からページ単位の一括取得へ変更
- Search Consoleの `dimensions: [page]`、最大25,000行で実行
- URL正規化・ノイズ除外後の記事DB作成完了時にSTEP5を解放
- 同じURLの既存タイトル・SEOタイトル・メタ情報・ArticleIDは保持
