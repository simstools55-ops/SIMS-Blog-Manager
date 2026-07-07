# Apps Scriptプロジェクト番号の確認

Search Console APIを有効化したのに接続できない場合、Apps Scriptが使っているGoogle Cloudプロジェクト番号が違うことがあります。

## 確認する場所

1. スプレッドシートで **拡張機能 → Apps Script** を開きます。
2. 左側の歯車アイコン **プロジェクトの設定** を開きます。
3. Google Cloud Platform（GCP）プロジェクト番号を確認します。
4. 未設定の場合は、利用するGCPプロジェクト番号を設定します。

## よくある失敗

Google Cloudで見ている番号と、Apps Scriptに紐づいている番号が違うと、何度APIを有効化しても接続できません。

エラー画面に表示される番号と、Google CloudのIAMと管理で表示される番号が一致しているか確認してください。
