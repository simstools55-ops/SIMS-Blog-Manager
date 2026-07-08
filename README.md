# SIMS-Blog-Manager Product 5.0 Official

Product 5.0 Official は、RC9をベースに、不要なものをそぎ落として必要なものだけに絞る正式版です。

## 配布方針

- Googleスプレッドシートは、マニュアルサイトからコピーして使う方式を標準とします。
- 利用者向けApps Scriptは `apps-script/コード.gs` へ一本化します。
- コピーURLが未設定の間は、ZIP内のExcelテンプレートを確認用に使います。
- 仮のGoogleスプレッドシートURLは、利用者向けページへ出しません。

## 主な構成

```text
spreadsheet/   Googleスプレッドシート確認用テンプレート
apps-script/   利用者向けコード.gs
現docs/         マニュアルサイト
product/       仕様書
```

## 公開前に行うこと

1. 完成版GoogleスプレッドシートをGoogle Driveへ作成
2. 共有設定を「リンクを知っている全員が閲覧可」に変更
3. コピーURLを作成
4. `docs/download.md` のボタンを有効化
5. GitHub Pagesへ反映
