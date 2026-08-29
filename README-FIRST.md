# SIMS-Blog-Manager v5.18.3

## 今回の変更

### v5.18.3 Personal Knowledge接続診断・可視化
- Personal Knowledge初期化に失敗した場合、候補を無言でREJECTせず `PK_CONTEXT_UNAVAILABLE` として非ブロッキングで報告します。
- `Personal Knowledge接続を確認` を追加し、Drive root・MANIFEST・サイトIDを一度に確認できます。
- Personal Knowledgeの警告をSBMシステムログとApps Script Cloud Loggingの両方へ出力します。
- Article Doctor単票登録後、Personal Knowledgeの候補件数・保存件数または失敗理由をダイアログへ表示します。
- 単票登録完了文を `Article Doctor診断結果` に修正しました。

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

**v5.18.3**

## 推奨コミットメッセージ

`fix(sbm): accept generic article doctor results in site doctor intake (v5.18.3)`

## v5.18.3 更新時の注意
`distribution/Code.gs` とあわせて `distribution/appsscript.json` も既存Apps Scriptプロジェクトへ同期してください。Drive権限の再承認が表示された場合は許可してください。
