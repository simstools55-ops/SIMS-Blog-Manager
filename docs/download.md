# ダウンロード

Product 5.0 Official は、マニュアルサイトから **Googleスプレッドシートをコピーして使う方式** を標準にします。

Product 5.0 の方針は、RC9 を踏襲しながら、不要なものをそぎ落として必要なものだけに絞ることです。

## 利用者の始め方

### 1. Googleスプレッドシートをコピーする

下のボタンから、SIMS-Blog-Manager のテンプレートを自分の Google ドライブへコピーします。

> 正式公開時に、ここへ実在する GoogleスプレッドシートのコピーURLを入れます。
> 仮URLは利用者向けページには出しません。

<!--
正式公開時だけ有効化：
[SIMS-Blog-Manager テンプレートをコピー](https://docs.google.com/spreadsheets/d/正式なスプレッドシートID/copy)
-->

現在は確認用として、ZIP内のExcelテンプレートを使います。

### 2. Apps Script を貼り付ける

利用者向け Apps Script は、次の1ファイルだけです。

`apps-script/コード.gs`

Googleスプレッドシートの **拡張機能 → Apps Script** を開き、既存の `コード.gs` に貼り付けます。

### 3. 初回セットアップを実行する

メニューから次の順に進めます。

1. ブログ情報を登録
2. Google Cloud APIを設定
3. Search Console接続テスト
4. 初回データ取得

## ZIPで配布するもの

GitHub Releases では、次の最小構成を ZIP として配布します。

```text
SIMS-Blog-Manager-Product-5.0.0.zip
├─ spreadsheet/
│  └─ SIMS-Blog-Manager-template-Product5.0-Official-Lean.xlsx
├─ apps-script/
│  └─ コード.gs
├─ docs/
├─ product/
├─ README.md
├─ CHANGELOG.md
└─ LICENSE
```

## Excelテンプレートを使う場合

GoogleスプレッドシートのコピーURLがまだ使えない場合は、ZIP内のExcelテンプレートを使います。

1. `spreadsheet/SIMS-Blog-Manager-template-Product5.0-Official-Lean.xlsx` をダウンロード
2. Google Driveへアップロード
3. Googleスプレッドシートとして開く
4. `apps-script/コード.gs` を貼り付ける
5. 初回セットアップを実行する

## 管理者向け

GoogleスプレッドシートのコピーURLを公開する手順は、次のページで管理します。

- [テンプレートコピーURLの設定](admin/template-url-setup.md)
