# RC8 Regression Test Checklist

## Health Staged Runner UAT6

- [ ] REG-HEALTH-STAGED-RUNNER-004: 開始操作前に重い事前処理を行わず、Runner UIを先に表示する。
- [ ] REG-HEALTH-STAGED-RUNNER-005: 事前確認と180日Search Console取得を別のserver executionに分離する。
- [ ] REG-HEALTH-STAGED-RUNNER-006: 健康状態判定を記事バッチ（既定60件）に分割し、途中状態をDocument Propertiesへ保存する。
- [ ] REG-HEALTH-STAGED-RUNNER-007: 最終判定バッチと健康診断書生成を別server executionに分離する。
- [ ] 中断後は保存済みscreen cursorから再開し、最初から全記事を判定し直さない。

## UAT7 Health Runner / Spreadsheet Load
- [ ] REG-HEALTH-008: 健康診断ダイアログは利用者向け8ステップで処理内容を説明する
- [ ] REG-HEALTH-009: 健康状態分析中の進捗率は処理済み記事数に連動し、94%固定にしない
- [ ] REG-HEALTH-010: 回転表示と最終成功日時を表示し、90秒以上応答待ちならその状態を明示する
- [ ] REG-HEALTH-011: 健康状態分析は軽量な記事管理コンテキストのみ読み、既定40件単位で処理する
- [ ] REG-CONCURRENCY-001: 同一SBM内で健康診断と日次処理を同時実行させない
- [ ] REG-CONCURRENCY-002: 別ブログで重い処理を同時実行しない旨を健康診断UIで案内する

## RC8 Final QA-UAT9 — Doctor candidate handoff integrity
- [ ] REG-DOCTOR-CANDIDATE-HANDOFF-002: checked row ArticleID/URL/title remains identical through Doctor request generation.
- [ ] REG-DOCTOR-CANDIDATE-SNAPSHOT-GUARD-001: candidate row must match latest health snapshot; mismatch fails closed.
- [ ] REG-DOCTOR-CANDIDATE-URGENCY-001: 緊急/重症/中等症 is propagated to Doctor request urgency and health_screening_severity.
- [ ] REG-DOCTOR-CANDIDATE-REMOVE-001: only the successfully requested row is removed from the candidate sheet.
- [ ] REG-UI-DOCTOR-COLOR-BLUE-001: positive metric highlighting uses light blue rather than green.

## QA-UAT10 Final Closure
- [ ] REG-CURRENT-PERFORMANCE-28D-MISMATCH-001: Doctor依頼のcurrent_performance直近28日がEvidence日別28日と一致する。
- [ ] REG-LONG-RUNNING-UX-001: 数秒以上かかる主要処理は早期に進捗ダイアログを表示し、何をしているかを利用者向けに説明する。
- [ ] REG-WORKSTATE-MONITOR-UNIFICATION-001: 利用者向け「改善中」は残らず、処置完了後はモニター中へ統一される。
- [ ] REG-MEASUREMENT-WAITING-LABEL-001: 未測定の利用者表示は「測定待ち」に統一される。
- [ ] REG-HOME-MONITOR-COUNT-002: Homeのモニター中件数が記事管理の対象件数と一致する。


- [ ] REG-LONG-RUNNING-UX-003: HTML progress dialog must call a public Apps Script entrypoint (no trailing underscore); detailed-candidate STEP 1 must advance.

## QA-UAT13 Doctor Candidate Performance
- [ ] REG-DOCTOR-CANDIDATE-PERF-001: 精密診断候補STEP 2では `sbmDoctorReconcileCompletedTreatments_()` を実行しない。
- [ ] REG-DOCTOR-CANDIDATE-PERF-002: 精密診断候補STEP 2では「改善の推移」等の効果測定再計算を行わない。
- [ ] REG-DOCTOR-CANDIDATE-PERF-003: 記事管理・Doctor Cases・最新健康診断を一括読込し、除外ArticleID/正規化URLをSTEP 3へキャッシュする。
- [ ] REG-DOCTOR-CANDIDATE-PERF-004: STEP 3の候補抽出は記事ごとのシート再検索をせず、キャッシュ済み除外集合で判定する。
- [ ] 実機: 427記事ブログでSTEP 1→2→3が順次進み、STEP 2が分単位で停滞しない。

- [ ] REG-HOME-LAYOUT-SCHEMA-001: 同一バージョンでも旧Homeレイアウト（改善中行など）を検出し、新レイアウトへ自動再構築する。
