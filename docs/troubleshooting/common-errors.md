# よくあるエラー

## OAuthスコープ不足

表示例：

```text
Request had insufficient authentication scopes
```

対応：

`appsscript.json` に以下が含まれているか確認してください。

```text
https://www.googleapis.com/auth/webmasters.readonly
```

## Search Console API未有効

表示例：

```text
Search Console API has not been used or is disabled
```

対応：

STEP2 Google Cloud API設定ガイドからSearch Console APIを有効化してください。

## 403 Permission

原因：

- Search Consoleプロパティ表記が違う
- GoogleアカウントにSearch Console権限がない

対応：

Search Consoleに表示されるプロパティ表記をそのまま入力してください。
