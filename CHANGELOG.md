# CHANGELOG

## Product 5.0.0 URL Filter Step Split Fix
- STEP AのURL正規化を強化し、はてなブログでは `/entry/` 配下の記事URLのみを対象化。
- category / tag / feed / archive / media / wp-admin 等の非記事URLを除外。
- Homeの総記事数表示を、ブログ総記事数と分析対象数が分かる表記へ改善。


## Product 5.0.0 Page Data Article DB

- 新メニュー「ページデータ収集（記事DB）」を追加。
- Search Console pageデータだけを取得し、URL正規化・ノイズ除去後に記事DBへ保存。
- タイトル取得・改善分析はこの処理では実行しない。
