# ダウンロード

Product 5.0 Official は、マニュアルサイトから **Googleスプレッドシートのテンプレートをコピーして使う方式** を標準にします。

Product 5.0 の方針は、RC9 を踏襲しながら、不要なものをそぎ落として必要なものだけに絞ることです。

## 一番かんたんな始め方

### 1. Googleスプレッドシートをコピーする

下のボタンから、SIMS-Blog-Manager のテンプレートを自分の Google ドライブへコピーします。

[SIMS-Blog-Manager テンプレートをコピー](https://docs.google.com/spreadsheets/d/YOUR_TEMPLATE_SPREADSHEET_ID/copy)

> 公開前に `YOUR_TEMPLATE_SPREADSHEET_ID` を正式なテンプレートのスプレッドシートIDへ置き換えてください。

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

## Product 5.0 の配布方針

- 通常利用者は、GoogleスプレッドシートのコピーURLから始める
- ZIPは、GitHub Releases で正式配布する
- Apps Scriptは、利用者向けには `コード.gs` へ一本化する
- 過去RC由来の不要なファイルや分割ソースは、通常利用者向けには出さない
