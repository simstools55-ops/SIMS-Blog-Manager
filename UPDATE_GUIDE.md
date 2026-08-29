## Product 5.7.0 RC2への更新

1. `apps-script/Code.gs` または `distribution/Code.gs` を既存Apps Scriptへ上書きします。
2. `apps-script/appsscript.json` または `distribution/appsscript.json` も同期します。Drive権限の再承認が表示された場合は許可してください。
2. スプレッドシートを再読み込みします。
3. メニューに `SIMS Doctor` が追加されたことを確認します。

### スプレッドシート

既存のスプレッドシートを継続使用できます。新規スプレッドシートは不要です。

### シートの作成・修復

今回の更新では新しいシートを追加しないため、実行不要です。

### 権限

初回の依頼JSON生成時にGoogle Driveへのファイル作成権限を求められる場合があります。

### deploy.yml

更新不要です。
