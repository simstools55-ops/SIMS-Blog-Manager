# トラブルシューティング

## insufficient authentication scopes

`appsscript.json` に `https://www.googleapis.com/auth/webmasters.readonly` が入っているか確認し、保存後に再承認してください。

## Search Console API has not been used in project

Google Cloud側でSearch Console APIを有効化してください。

## 403 insufficientPermissions

Search Console側で、利用中のGoogleアカウントに対象Propertyの閲覧権限があるか確認してください。

## Propertyが見つからない

URLプレフィックスでは末尾スラッシュまで一致させてください。
