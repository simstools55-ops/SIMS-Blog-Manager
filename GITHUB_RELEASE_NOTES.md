## Product 5.7.0 RC1 — SIMS Doctor 外来診療 Sprint 1

Product 5.6.12を安定基盤として、独立製品SIMS Doctor向けの手動JSON連携を追加しました。

### 追加

- 記事一覧の選択記事から外来診療依頼JSONを生成
- 改善の推移の選択行から外来診療依頼JSONを生成
- `SIMS_DOCTOR_SINGLE_CASE_REQUEST_V1`
- Google Drive `SIMS-Doctor/Requests` への保存
- Doctor連携状態の確認

### 非変更

- 日次処理
- Search Console取得
- 記事ランク判定
- 今日の改善
- 改善履歴・改善の推移
- Writer連携

### RC確認事項

Apps Script実機で、通常の日次処理と外来診療JSON生成の回帰確認を行ってください。
