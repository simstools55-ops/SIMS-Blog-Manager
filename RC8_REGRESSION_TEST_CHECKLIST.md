# RC8 Regression Test Checklist

## Health Staged Runner UAT6

- [ ] REG-HEALTH-STAGED-RUNNER-004: 開始操作前に重い事前処理を行わず、Runner UIを先に表示する。
- [ ] REG-HEALTH-STAGED-RUNNER-005: 事前確認と180日Search Console取得を別のserver executionに分離する。
- [ ] REG-HEALTH-STAGED-RUNNER-006: 健康状態判定を記事バッチ（既定60件）に分割し、途中状態をDocument Propertiesへ保存する。
- [ ] REG-HEALTH-STAGED-RUNNER-007: 最終判定バッチと健康診断書生成を別server executionに分離する。
- [ ] 中断後は保存済みscreen cursorから再開し、最初から全記事を判定し直さない。
