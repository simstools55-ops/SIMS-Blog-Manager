# SIMS Blog Manager v5.14.4 適用案内

## Apps Scriptで入れ替えるファイル

- **置換:** `Code.gs`
  - 利用者のGoogle Apps Scriptでは、現在の `Code.gs` を本ZIPの `apps-script/Code.gs` の内容で全置換してください。

## リポジトリ内の同期

以下4ファイルは v5.14.4 の同一内容に同期済みです。

- `apps-script/Code.gs`
- `distribution/Code.gs`
- `src/apps-script/Code.gs`
- `src/distribution/Code.gs`

## 新規追加

- `RELEASE-NOTES-v5.14.4.md`
- `APPLY-v5.14.4.md`

## 変更なし

- Apps Scriptプロジェクトのその他のファイル・設定
- Spreadsheetの既存データ構造

## 推奨確認

1. 精密診断ダイアログ開始時には「この記事を開く」が表示されないこと。
2. Doctor回答を登録し、WriterまたはMergeルートになった場合、③の直前に「この記事を開く」が表示されること。
3. Writer回答入力欄が表示された際、登録ボタンが見える位置まで自動スクロールすること。
4. Writer処置結果登録時、改善の推移の全再生成が重複して走らず、最終同期時の1回に集約されていること。
5. 登録完了後、記事管理が「モニター中」、改善履歴と改善の推移が正しく作成されること。
