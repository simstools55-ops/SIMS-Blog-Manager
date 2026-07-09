# Changelog

## Product 5.0.0 URL Fragment Meta Title Fix

- Search Consoleに含まれる `#見出し` 付きURLを、記事本体URLへ統合するよう修正。
- はてなブログ・WordPressの両方を想定し、記事タイトル取得を `og:title`、`entry-title`、`article h1`、titleタグ補正の順で判定。
- データ一覧の列名を利用者向けに整理し、記事タイトル・SEOタイトル・メタディスクリプションを共通マスターとして扱う方針に更新。
