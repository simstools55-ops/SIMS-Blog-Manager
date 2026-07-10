## ArticleDB Settings & Continuation

初回セットアップの記事情報補完件数は、利用者向け「設定」シートで30件・50件・70件から選択できます。
補完後に残件がある場合は、完了ダイアログの「続けてN件処理」からそのまま次の処理へ進めます。

# SIMS-Blog-Manager Product 5.0

## ArticleDB One-Pass Page Fetch

STEP4はSearch Consoleからページ単位データを1回で取得し、記事URLを正規化して記事DBを作成します。

### 実行順
1. Code.gsを更新
2. スプレッドシートを再読み込み
3. セットアップ → STEP4 記事DBを一括作成（初回）
4. 完了後、STEP5 記事情報補完を実行

通常規模のブログでは1回で完了します。Search Consoleのページ行が25,000件に達した場合のみ追加対応が必要です。
