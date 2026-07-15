# Product 5.2.0 Official 公開手順

## 1. mainへ反映

maintenanceブランチで実機確認後、mainへマージします。

推奨コミットタイトル：

```text
Release Product 5.2.0 Official
```

## 2. GitHub Pages

`docs/`、`mkdocs.yml`、`requirements.txt`をmainへ反映すると、既存のGitHub Actions設定でマニュアルサイトが更新されます。`deploy.yml`自体の変更は不要です。

## 3. タグ

```text
v5.2.0
```

## 4. GitHub Release

タイトル：

```text
SIMS-Blog-Manager Product 5.2.0 Official
```

添付ファイル：

```text
SIMS-Blog-Manager-Product-5.2.0-Distribution.zip
```

## 5. 公開後確認

- マニュアルサイトのバージョンが5.2.0
- ダウンロードファイルの展開が正常
- `コード.gs`と`apps-script/Code.gs`が一致
- テンプレート名がProduct 5.1 Official
