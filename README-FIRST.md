# SIMS-Blog-Manager v5.10.19

Site Diagnosis → SBM → Creator → SBM の新記事公開後の戻り導線を追加したPATCHです。

## Apps Scriptで変更するファイル
- `Code.gs`：置換

## GitHubで変更するファイル
- `apps-script/Code.gs`：置換
- `distribution/Code.gs`：置換
- `VERSION`：更新
- `PRODUCT_IDENTITY.json`：更新
- `CHANGELOG.md`：更新

Creator紹介状画面で「新記事の公開を登録」を押し、公開済み新記事URLを入力すると、記事管理へ新規記事を登録し、モニター中へ移します。

## v5.10.15

- Site DiagnosisのREF-*をURLでSBM正式ArticleIDへ安全に解決します。
- Doctor回答全文に複数のSIMS_DOCTOR_CASE_RESULT_V2が含まれる場合、1回の貼り付けで一括登録します。
- 一括登録前に全件のSiteID・URL・ArticleIDを事前照合します。

## v5.10.16

- 複数の個別Doctor結果を2件ずつ別Apps Script実行で登録します。
- 9件の場合は 2/9 → 4/9 → 6/9 → 8/9 → 9/9 と進捗を表示します。
- v5.10.15のREF→正式ArticleID URL照合と複数CASE_RESULT抽出を維持します。

## v5.10.17

- Doctor複数個別結果を1件ずつ別Apps Script実行で登録します。
- 登録開始直後に専用の進捗オーバーレイを表示します。
- 9件の場合は 0/9 → 1/9 → 2/9 … → 9/9 と画面中央で進捗を表示します。
- エラー時は何件まで処理済みかを進捗画面に表示します。

## v5.10.18

- v5.10.17の進捗オーバーレイが表示されなかったブラウザ側JavaScript不具合を修正。
- submitDoctor() の差し替え境界と文字列生成を修正。
- リリース検証に submitDoctor() 単体のブラウザJavaScript構文チェックを追加。

## v5.10.19

- Site Diagnosis個別精密診断の `SIMS_DOCTOR_CASE_RESULT_V2` がトップレベルに持つ
  `allowed_scope` / `blocked_scope` を正式な治療範囲として受理します。
- Writer紹介状へDoctorの治療範囲を欠落なく引き継ぎます。
- `treatment_plan.actions` もWriterへの具体的な処置指示として保持します。
