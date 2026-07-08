# 製品本体

このZIPの製品本体は次の2つです。

- `spreadsheet/SIMS-Blog-Manager.xlsx`
- `apps-script/Code.gs`

利用者はスプレッドシートをGoogle Driveへアップロードし、Apps Scriptに `Code.gs` の中身を貼り付けて使います。

## 今回の確認ポイント

- データ一覧のステータスが「良好/様子見」ではなく、どちらか一方で表示されること
- H1タイトルは記事本文のH1を表示すること
- titleタグはHTMLの `<title>` を表示すること
- 一覧が `良好 → 改善中 → 改善候補 → 様子見 → 管理対象外` の順に並ぶこと
- Search Console取得だけではデータ一覧が更新されず、改善候補分析後に更新されること
