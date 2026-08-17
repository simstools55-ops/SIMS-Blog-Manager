# SIMS-Blog-Manager v5.10.15

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
