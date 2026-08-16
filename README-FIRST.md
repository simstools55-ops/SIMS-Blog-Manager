# SIMS-Blog-Manager v5.10.14

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
