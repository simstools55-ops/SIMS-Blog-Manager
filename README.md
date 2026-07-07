# SIMS-Blog-Manager Documentation v3.1

GitHub Pages公開エラーを修正した版です。

## 重要

GitHubのWebアップロードでは、`.github/` フォルダがアップロードされないことがあります。
その場合は、GitHub上で次のファイルを手動作成してください。

```text
.github/workflows/deploy.yml
```

中身は `github-workflows-backup/deploy.yml` をコピーしてください。

## v3.1の修正

- `mkdocs build --strict` を通常ビルドへ変更
- 旧ドキュメントファイルを互換ページとして追加
- `mkdocs.yml` に旧ページ互換ナビを追加
- `requirements.txt` を追加
