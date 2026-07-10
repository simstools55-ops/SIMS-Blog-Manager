# Product 5.0 Data Flow

## STEP A
Search Consoleからページ一覧を取得し、記事URLとして有効なURLだけを残す。

- `#` 以降は削除
- `?` 以降は削除
- はてなブログは `/entry/` 配下のみを記事URLとして扱う
- category / tag / feed / archive / media 等は除外

## STEP A-2
記事タイトル・SEOタイトル・メタディスクリプションを分割補完する。

## STEP B
保存済みのデータ一覧を参照して改善候補を分析する。
