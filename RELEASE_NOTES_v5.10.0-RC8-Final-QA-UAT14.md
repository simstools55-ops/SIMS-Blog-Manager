# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT14

## Scope
Homeの状態表示・モニター件数だけを最小修正。既にPASSしたDoctor/Health/Candidate処理には変更を加えない。

## Fixes
- 同一Product Version内で旧Homeレイアウトが残る問題を修正。
- Homeのレイアウト署名を検査し、旧「改善中」行や期待ラベル不一致を検出した場合は一度だけHomeを再構築。
- Homeの「モニター中」件数は記事管理の作業状態「モニター中」を直接正本として集計。
- 「改善中」をHome集計の別状態として扱わない。

## Regression
- REG-HOME-MONITOR-UNIFICATION-001
- REG-HOME-LAYOUT-SCHEMA-001
