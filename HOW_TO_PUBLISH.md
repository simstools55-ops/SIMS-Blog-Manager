# GitHub Pages 公開手順

## 1. ZIPを展開してGitHubへアップロード
以下を必ずアップロードしてください。

- `docs/`
- `mkdocs.yml`
- `.github/workflows/deploy.yml`
- `README.md`

特に `.github/` は隠しフォルダ扱いになることがあります。アップロード後、GitHubのファイル一覧で `.github/workflows/deploy.yml` が見えるか確認してください。

## 2. GitHub Pages設定
`Settings` → `Pages` を開きます。

- Source：`GitHub Actions`

にします。

## 3. Actions確認
`Actions` を開きます。

正常なら `Deploy MkDocs site` が表示されます。

`Get started with GitHub Actions` が表示される場合は、`.github/workflows/deploy.yml` がアップロードされていません。

## 4. 公開URL
数分後に以下で確認します。

https://simstools55-ops.github.io/SIMS-Blog-Manager/

## 5. ワークフローが見えない場合
`github-workflows-backup/deploy.yml` の内容を、GitHub上で次の場所に新規作成してください。

`.github/workflows/deploy.yml`
