# SIMS-Blog-Manager v5.14.6

## 修正内容
「観察終了後の処置を進める」で、4回/4回・見直し候補の案件が
「まだ経過観察中です」と誤判定される問題を修正しました。

### 原因
処置可否の判定に、画面表示用の「測定状態」文字列を使用していました。
4回/4回終了後の見直し案件は「処置待ち」等になるため、
`測定状態 != 測定完了` と誤認されていました。

### v5.14.4
観察終了判定の正本を次へ変更しました。
- 測定回数 4回/4回
- 改善履歴のモニター状態
- 改善履歴の最終判定

4回/4回で「見直し候補」「要確認」「変化小」の案件は、
経過観察中で止めずDoctor再診へ進みます。

Doctorがすでに追加経過観察を指示している案件は、
従来どおり追加経過観察として止めます。

## Apps Script
Code.gs のみ置換してください。

## 推奨コミットメッセージ
`fix(sbm): use measurement completion state for review routing in v5.14.4`


## GitHubリポジトリの配布用ディレクトリー

利用者向け配布物は `distribution/SIMS-Blog-Manager-v5.14.4/` に集約しています。

- `README-FIRST.md`
- `Code.gs`
- `appsscript.json`
- `Spreadsheet-Template.xlsx`

Spreadsheet Template は現行実運用SBMを基に、ブログ固有情報、GSCデータ、
記事DB、改善履歴、Doctor/Writer/Merge/Creator連携データ、ログ等を除去した
配布専用テンプレートです。タイムゾーンは Asia/Tokyo に統一しています。

## v5.14.6 追加
- Merge完了時、吸収元記事を「301統合済み」「管理対象外」として自動整理します。
- 統合先記事だけをモニター対象に残します。
- 既にMerge完了済みの案件は「SIMS Doctor → Merge済み吸収記事を補正」で事後補正できます。
