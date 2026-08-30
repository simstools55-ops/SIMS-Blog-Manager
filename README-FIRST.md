# SIMS-Blog-Manager v5.19.0

## 今回の変更

### v5.19.0 Home軽量化・日次状態修正・Personal Knowledge判定精密化
- Homeを開く操作では、Doctor再照合や効果測定の再計算を行わず、保存済みデータから軽量に表示更新します。
- SBM起動時はHome全体を再集計せず、日次処理の状態だけを再判定します。前日の「本日完了」が翌日に残る問題を修正しました。
- 日付比較はSIMS標準タイムゾーン `Asia/Tokyo` を明示使用します。
- Personal Knowledgeは `CTR` や `クリック` という語だけでは拒否せず、現在値・具体数値・直近値など一時情報だけをREJECTします。
- v5.18.3で追加したPersonal Knowledge接続診断・Cloud Logging・非ブロッキング保存診断は維持します。

### Personal Knowledge Separation
- 配布製品から実ブログ名・実サイト識別子・実URL・実記事IDを除去しました。
- 記事タイトル末尾のブログ名除去は、特定ブログ名のハードコードではなく設定済み `BlogName` を使用します。
- 内蔵Shared互換snapshotから、利用者固有のOperational Learning記録を除去しました。
- テスト・fixture・過去の開発例は、必要な構造を保ったまま架空値へ匿名化しました。

### 互換性
- Spreadsheetの既存シート構造・設定キー・保存データは変更しません。
- `SIMS_DOCTOR_*`、Case ID、Batch ID、Writer / Merge / Creator連携Contractは維持します。
- 既存SBMデータの破壊的な移行作業はありません。

## Apps Script適用

`distribution/Code.gs` と `distribution/appsscript.json` をApps Scriptへ同期して保存し、Spreadsheetを再読み込みしてください。Drive権限の承認が表示された場合は許可してください。

## 正式版

**v5.19.0**

## 推奨コミットメッセージ

`fix(sbm): refine knowledge admission and home daily status (v5.19.0)`

## v5.19.0 更新時の注意
`distribution/Code.gs` とあわせて `distribution/appsscript.json` も既存Apps Scriptプロジェクトへ同期してください。Drive権限の再承認が表示された場合は許可してください。
