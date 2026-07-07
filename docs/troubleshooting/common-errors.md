# よくあるエラーと対処

## Search Console API has not been used in project... と表示される

主な原因は、Search Console APIが有効化されていないか、Apps Scriptのプロジェクト番号とGoogle Cloud側のプロジェクト番号が違うことです。

### 確認手順

1. Apps Scriptを開く
2. 左側の「プロジェクトの設定」を開く
3. Google Cloudプロジェクト番号を確認する
4. Google Cloud Consoleで同じ番号のプロジェクトを開く
5. 「Google Search Console API」を有効化する
6. 数分待ってからSTEP3接続テストを再実行する

番号が違う場合、30分待っても接続できません。

## APIを有効化したのに接続できない

次を確認してください。

- Apps Scriptのプロジェクト番号とGoogle Cloudのプロジェクト番号が一致しているか
- Search Console APIが有効化されているか
- Search Consoleプロパティの表記が正しいか
- 使用中のGoogleアカウントにSearch Console権限があるか
- appsscript.jsonに `webmasters.readonly` が含まれているか

## Googleの承認画面が出る

正常な動作です。初回のみ、Googleが「このスクリプトを実行してよいか」を確認します。

承認後に処理が止まったように見える場合は、同じSTEPをもう一度実行してください。

## 詳細チェックを入れても改善ブリーフが出ない

Apps Scriptの実行状態によって、チェック操作からダイアログが出ない場合があります。

その場合は、対象行を選択して、メニューから「選択行の改善ブリーフを開く」を実行してください。

## 完了チェックを入れてもログに入らない

対象行のURLが空欄の可能性があります。今日のデータを再取得してから再度試してください。
