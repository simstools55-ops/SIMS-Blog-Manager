# Google Cloud API有効化ガイド

次のエラーが出る場合、Google Cloud側でSearch Console APIが無効です。

```text
Google Search Console API has not been used in project...
SERVICE_DISABLED
```

## 手順

1. Apps Script画面左側の歯車「プロジェクトの設定」を開く
2. Google Cloud Platformプロジェクト番号を確認
3. Google Cloud Consoleで「Google Search Console API」を開く
4. APIを有効化
5. 数分待つ
6. スプレッドシートのメニュー「API設定後に接続テストへ進む」を実行

APIページ:

```text
https://console.cloud.google.com/apis/library/searchconsole.googleapis.com
```
