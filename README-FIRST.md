# SIMS-Blog-Manager v5.18.0

## 今回の変更

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

`distribution/Code.gs` をApps Scriptへ上書きして保存し、Spreadsheetを再読み込みしてください。

## 正式版

**v5.18.0**

## 推奨コミットメッセージ

`refactor(sbm): separate personal knowledge from distributable product (v5.18.0)`
