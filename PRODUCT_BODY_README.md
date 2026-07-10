# 製品本体

更新対象は `apps-script/Code.gs` です。

今回、記事DBの列構成が変わるため、Code.gs更新後に管理メニューの「シートを作成・修復」を実行してください。

## Product 5.0 ArticleDB Meta Helper Fix

- `sbmSheetObjects_ is not defined` エラーを修正。
- 記事DBタイトル情報補完で既存シート読み込みヘルパーを安定化。
- Code.gsのみ更新、スプレッドシートは継続使用可。
