# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT19

## Scope
日次処理の高速化のみ。Doctor / Health / UAT17 Today fast refresh / UAT18 view speedは変更しない。

## Fast-path changes
- STEP1開始時のHome全件再描画を削除。
- STEP2の記事DB更新は既存書式を維持し、全体再装飾を省略。
- STEP2のHomeは件数設定だけ更新し、画面再描画はSTEP3の1回だけ。
- 今日の改善作成前の旧キュー掃除を削除。新しい候補シートで置換。
- 今日の改善の作業状態反映は記事DB全件書き戻しではなく「作業状態」1列だけ更新。
- 数値書式と状態色は日次更新時に一括更新して表示崩れを防止。

## Expected timing for ~427 articles
- STEP1 Search Console fetch: 20–60 sec typical; 60–120 sec may occur due to API latency.
- STEP2 analysis / Article DB / Today queue: 10–30 sec target.
- STEP3 effectiveness / completion / Home: 5–20 sec target.
- Total: ~35–110 sec target.
- STEP2 or STEP3 taking multiple minutes is considered abnormal.

## Regression
- REG-DAILY-NO-HOME-START-001
- REG-DAILY-ARTICLEDB-FAST-WRITE-001
- REG-DAILY-WORKSTATE-COLUMN-WRITE-001
- REG-DAILY-HOME-FINAL-ONLY-001
