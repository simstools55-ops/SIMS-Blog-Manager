## Product 5.0 ArticleDB Settings Continuation

- 利用者向け「設定」シートを追加し、記事情報補完件数を30/50/70件から選択可能に変更
- 記事情報補完の完了画面に「続けてN件処理」「ここで終了」を追加
- 継続処理はメニューへ戻らず、同じダイアログから未補完記事を続けて処理

# CHANGELOG

## Product 5.0 ArticleDB One-Pass Page Fetch

- STEP4を100件ずつの繰り返し取得からページ単位の一括取得へ変更
- Search Consoleの `dimensions: [page]`、最大25,000行で実行
- URL正規化・ノイズ除外後の記事DB作成完了時にSTEP5を解放
- 同じURLの既存タイトル・SEOタイトル・メタ情報・ArticleIDは保持
