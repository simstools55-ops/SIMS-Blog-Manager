# GitHub Pages公開手順

## 重要

GitHubのWebアップロードでは、`.github` のようなドットから始まる隠しフォルダが一括アップロードされない場合があります。

その場合は、次のファイルだけ手動で作成してください。

```text
.github/workflows/deploy.yml
```

## 手順

1. ZIPを展開します。
2. 通常のファイルをGitHubへアップロードします。
3. GitHub上で `Add file` → `Create new file` を選びます。
4. ファイル名に `.github/workflows/deploy.yml` と入力します。
5. ZIP内の `.github/workflows/deploy.yml` の内容を貼り付けます。
6. Commitします。
7. `Settings` → `Pages` → `Source` を `GitHub Actions` にします。
8. `Actions` が成功したら公開完了です。

公開URLの例：

```text
https://simstools55-ops.github.io/SIMS-Blog-Manager/
```

## Actionsが失敗した場合

`Actions` → 失敗した実行 → `build` → `Build site` の赤いエラーを確認してください。
