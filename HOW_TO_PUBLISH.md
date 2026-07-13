# Product 5.0 Official 公開手順

## 1. GitHubへ反映

正式版リポジトリZIPの内容を既存リポジトリへ上書きします。

推奨コミットメッセージ：

```text
Release v5.0.0
```

## 2. GitHub Pages

`.github/workflows/deploy.yml` は既存設定と同じ内容です。ファイルの更新は不要ですが、正式版ZIPには正しい配置で収録しています。

GitHubへ反映すると、MkDocsが自動ビルドされます。

## 3. Gitタグ

```text
v5.0.0
```

## 4. GitHub Release

タイトル：

```text
SIMS-Blog-Manager Product 5.0 Official
```

添付ファイル：

```text
SIMS-Blog-Manager-Product-5.0-Official-Distribution.zip
```

Release本文には `GITHUB_RELEASE_NOTES.md` の内容を使用します。
