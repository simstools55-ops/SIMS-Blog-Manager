# SIMS-Blog-Manager Product 4.4 RC2

Google Search Consoleのデータから、今日改善すべき記事を整理するGoogleスプレッドシートシステムです。

## この版の位置づけ

Product 4.4 RC2は、Product 4.3 RC1にGitHub Pages公開用のマニュアルサイト設定を追加したリリース候補版です。

## 主な内容

- Product 4.3 RC1のスプレッドシート・Apps Script
- MkDocs + Material for MkDocsの公式マニュアルサイト
- GitHub ActionsによるGitHub Pages自動公開設定
- 初回セットアップ・Search Console接続・403エラーの説明強化

## GitHub Pages公開手順

1. ZIPを展開します。
2. リポジトリへ中身を上書きアップロードします。
3. Commitします。
4. GitHubの Settings → Pages で Source が GitHub Actions になっていることを確認します。
5. Actionsで Deploy MkDocs site が成功するのを待ちます。
6. `https://simstools55-ops.github.io/SIMS-Blog-Manager/` を開きます。
