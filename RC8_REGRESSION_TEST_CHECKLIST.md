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
