# SIMS-Blog-Manager Product 5.0.0

## ArticleDB Daily Diff Fix

記事DBをSingle Source of Truthとして、日次更新を差分マージ方式へ変更した修正版です。

### 日次操作

`SIMS-Blog-Manager → データ更新 → 記事DBを更新（日次）`

この処理は固定情報を維持し、Search Consoleの数値と記事ステータスだけを更新します。記事DBにないURLだけ新規追加します。

### 更新手順

1. `apps-script/Code.gs` を全置換して保存
2. スプレッドシートを再読み込み
3. `管理 → シートを作成・修復` を1回実行
4. 日次メニューを実行して固定情報が保持されることを確認
