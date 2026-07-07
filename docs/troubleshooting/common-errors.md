# よくあるエラー

## 初回認証が表示される

正常な動作です。SIMS-Blog-Managerがスプレッドシート、画面表示、Search Console APIを利用するためにGoogleの承認が必要です。
承認後、同じSTEPをもう一度実行してください。

## Ui.showModalDialog を呼び出せません

Product 4.1で修正済みです。`appsscript.json` に次のスコープを追加しています。

```json
"https://www.googleapis.com/auth/script.container.ui"
```

Product 4.1を適用後、Googleの再承認画面が出た場合は許可してください。

## Search Console API has not been used

Google Cloud側でSearch Console APIが有効化されていません。
STEP2のGoogle Cloud APIガイドを開き、Google Search Console APIを有効化してください。
有効化後、数分待ってからSTEP3を実行してください。
