# よくあるエラーと対処

## Search Console API has not been used in project... と表示される

原因は主に2つです。

1. Google CloudでSearch Console APIが有効化されていない
2. Apps Scriptに設定されているGoogle Cloudプロジェクト番号と、APIを有効化したGoogle Cloudプロジェクト番号が違う

### 対処

1. Apps Scriptの設定画面を開く
2. Google Cloudプロジェクト番号を確認する
3. Google Cloud Consoleで同じプロジェクト番号を開く
4. Search Console APIを有効化する
5. 数分待ってからSTEP3接続テストを再実行する

## Googleの承認画面が出る

正常な動作です。許可後、同じSTEPをもう一度実行してください。

## Search Console APIを有効化したのに接続できない

まずプロジェクト番号の不一致を確認してください。番号が違う場合、30分待っても接続できません。
