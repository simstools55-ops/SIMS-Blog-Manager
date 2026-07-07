# Security

SIMS-Blog-Manager は、ユーザー自身のGoogleアカウントでSearch Console APIへアクセスします。

必要なOAuthスコープ:

- `https://www.googleapis.com/auth/spreadsheets.currentonly`
- `https://www.googleapis.com/auth/script.external_request`
- `https://www.googleapis.com/auth/webmasters.readonly`

取得したデータは利用者のスプレッドシート内に保存されます。
