# SIMS-Blog-Manager Product 5.0.0 ArticleDB Status Sort Meta

Product 5.0の積み上げ方式に対応した記事DB更新版です。

## 製品本体

- `apps-script/Code.gs`
- `apps-script/appsscript.json`

## 今回の変更

記事DBを記事ステータス順に整理し、良好・改善候補の記事だけタイトル情報を補完します。

## Product 5.0 ArticleDB Meta Helper Fix

- `sbmSheetObjects_ is not defined` エラーを修正。
- 記事DBタイトル情報補完で既存シート読み込みヘルパーを安定化。
- Code.gsのみ更新、スプレッドシートは継続使用可。
