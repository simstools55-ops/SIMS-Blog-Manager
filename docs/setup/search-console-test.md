# Search Console接続テスト

STEP3では、入力したSearch Console Propertyに接続できるか確認します。

## 成功した場合

「接続OK」と表示されます。その後、STEP4で初回データ取得を実行します。

## 失敗した場合

主な原因は次の通りです。

- Search Console APIが未有効
- Apps Scriptのプロジェクト番号が違う
- Search Console PropertyのURLが違う
- Search Console側の権限がない
- OAuthスコープ不足

詳しくは[403エラー](../troubleshooting/error-403.md)を確認してください。
