# SIMS-Blog-Manager Product 5.0.0

今回の版は大規模サイト検証用です。

- STEP A: ページ一覧を先に取得し、上位50ページだけクエリ詳細を取得
- STEP B: 工程別の処理時間を `処理プロファイル` に記録
- 利用者向けApps Scriptは `apps-script/Code.gs` のみ


## Product 5.0.0 DataList Detail Status UI Fix

- データ一覧の詳細列を操作しやすいチェック式に変更しました。
- チェックすると詳細ポップアップが開き、SEOタイトル・メタディスクリプション・URLを確認できます。
- 記事ステータスは先頭マークと背景色で一目で判断できるようにしました。
