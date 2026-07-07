# SIMS-Blog-Manager Documentation v3.0

GitHub Pages公開用の修正版です。

## 修正内容

- MkDocs strict buildで失敗していた相対リンクを修正
- nav未登録ページを追加
- `.github/workflows/deploy.yml` を同梱
- GitHub Actionsで公開できる構成に整理

## 注意

GitHubのWebアップロードでは `.github` フォルダが漏れることがあります。
表示されない場合は、`github-workflows-backup/deploy.yml` の内容を `.github/workflows/deploy.yml` として手動作成してください。
