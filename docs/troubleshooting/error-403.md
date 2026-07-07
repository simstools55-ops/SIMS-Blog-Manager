# 403エラー

403は、Search Console APIや権限まわりで発生しやすいエラーです。

## SERVICE_DISABLED / API has not been used

Search Console APIがまだ有効化されていません。

対応：

1. Apps Scriptのプロジェクト番号を確認します。
2. Google Cloudで同じ番号のプロジェクトを開きます。
3. Search Console APIを有効化します。
4. 数分待ちます。
5. STEP3を再実行します。

## insufficient authentication scopes

Apps Scriptの承認スコープが不足しています。

対応：

1. `appsscript.json` にSearch Console用スコープがあるか確認します。
2. 保存します。
3. 再度メニューを実行して再認証します。

## Search Console権限不足

対象プロパティにアクセスする権限がない可能性があります。

対応：

Search Consoleで、使用中のGoogleアカウントが対象ブログのプロパティにアクセスできるか確認してください。
