# UrlFetchApp.fetch 権限エラー

Search Consoleデータ取得時に次のようなエラーが出る場合があります。

```text
指定された権限では UrlFetchApp.fetch を呼び出すことができません。
必要な権限: https://www.googleapis.com/auth/script.external_request
```

この場合は、Apps Script の `appsscript.json` に外部リクエスト権限が反映されていません。

## 対応

1. Apps Script画面でプロジェクト設定を開く。
2. 「appsscript.json マニフェスト ファイルをエディタで表示する」をオンにする。
3. ZIP内の `apps-script/appsscript.json` の内容を貼り付ける。
4. スクリプトを保存して再読み込みする。
5. STEP Aを再実行し、Googleの承認画面で許可する。

