# Search Console取得権限エラー

Search Console取得で `UrlFetchApp.fetch を呼び出せません` と表示された場合は、Apps Scriptの権限が不足しています。

対処方法:

1. `apps-script/Code.gs` を貼り替える
2. `apps-script/appsscript.json` も反映する
3. スクリプトを再読み込みする
4. メニューを再実行し、再承認する

Product 5.0ではSearch Console取得部分はRC9の安定動作を優先し、軽量化は周辺処理だけに限定しています。
