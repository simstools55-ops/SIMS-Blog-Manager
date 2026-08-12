# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT38

## Objective
直近の日次処理・健康診断高速化で得た知見を初回セットアップへ適用する。
外部取得内容やセットアップ仕様は変更せず、Spreadsheetアクセスの無駄を削減する。

## Static audit findings
### Wizard/status
- セットアップ画面表示のたび、Settingsを複数回全件読込。
- 記事情報補完件数の確認で記事DB全列を読込。

### STEP1 / STEP3
- 複数の設定値を1件ずつ検索・書込み。

### STEP4
- Search Console取得後、記事DBを全装飾。
- 続けてHomeも再描画。
- 次STEP表示のため再び状態を全件確認。

### STEP5 (largest internal I/O bottleneck)
- 1記事につき記事情報7〜8項目をセル単位でsetValue。
- 50記事なら数百回のSpreadsheet書込み。
- チャンク終了ごとに記事DB全件を再読込して補完件数を集計。
- チャンク終了ごとにHomeを再描画。
- ArticleInfoBatchを読むだけでもSettingsへ再保存。

## UAT38 changes
- Settings status read: one map read per wizard screen.
- Setup settings writes: bulk setValues.
- Completion counts: read only 記事情報補完済み column.
- STEP4: use Article DB fast write; skip full restyle.
- STEP4/STEP5: do not refresh Home mid-setup; refresh once in STEP6.
- STEP5: update article metadata in memory and write Article DB once per chunk.
- STEP5: calculate completion counts from in-memory rows.
- ArticleInfoBatch read no longer writes back to Settings.
- Add saved setup timing diagnostics menu.

## Intentionally not changed in UAT38
- Article HTML fetch remains one URL at a time.
- Main-query Search Console lookup remains one article at a time.
Those are external-I/O changes and should be measured after Spreadsheet-I/O improvements before introducing batching.

## Expected effect
- STEP1/2/3: noticeably faster transitions.
- STEP4: remove unnecessary sheet restyle + Home refresh.
- STEP5: remove hundreds of Spreadsheet writes per chunk.
- If STEP5 is still slow after UAT38, the next target is external I/O:
  UrlFetchApp.fetchAll for metadata and batched Search Console query mapping.
