# 公開手順

## 1. GitHub Pages

1. ZIPを展開します。
2. ファイル一式をGitHubへアップロードします。
3. `.github/workflows/deploy.yml` が反映されていることを確認します。
4. `Settings` → `Pages` → `Source` を `GitHub Actions` にします。
5. `Actions` が成功したら公開完了です。

## 2. Googleスプレッドシートテンプレート

1. `spreadsheet/` 内のテンプレートをGoogle Driveへアップロードします。
2. Googleスプレッドシートとして開きます。
3. 書式・シート構成を確認します。
4. 共有設定を「リンクを知っている全員が閲覧可」にします。
5. URLからスプレッドシートIDを取得します。
6. 次の形式でコピーURLを作ります。

```text
https://docs.google.com/spreadsheets/d/スプレッドシートID/copy
```

7. `docs/download.md` のコメントアウトされたボタンを有効化します。
8. GitHubへ反映します。

## 3. 重要

`YOUR_TEMPLATE_SPREADSHEET_ID` のような仮URLは、利用者向けページに残さないでください。
