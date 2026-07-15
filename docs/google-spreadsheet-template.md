# Googleスプレッドシートテンプレート公開手順

このページは、Product 5.2.0 Official を公開する管理者向けの手順です。

## 目的

マニュアルサイトから、利用者が **SIMS-Blog-Manager のGoogleスプレッドシートをコピーして使える状態** にします。

## 手順

### 1. テンプレート用スプレッドシートを作成する

1. Product 5.1 のExcelテンプレートをGoogle Driveへアップロードする
2. Googleスプレッドシートとして開く
3. ファイル名を `SIMS-Blog-Manager Product 5.1 Template` にする
4. Apps Scriptを開く
5. `apps-script/コード.gs` の内容を貼り付ける
6. 保存する

### 2. 共有設定を行う

1. スプレッドシート右上の「共有」を開く
2. 一般的なアクセスを「リンクを知っている全員」にする
3. 権限は「閲覧者」にする

### 3. コピー用URLを作成する

通常のURLが次の形式だとします。

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

コピー用URLは次の形式です。

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/copy
```

### 4. docs/download.md を更新する

`docs/download.md` にある次の部分を、正式なスプレッドシートIDに置き換えます。

```text
YOUR_TEMPLATE_SPREADSHEET_ID
```

### 5. マニュアルサイトに反映する

GitHubへコミットすると、GitHub Pagesに反映されます。

## 注意点

- 利用者が直接編集しないよう、元テンプレートは閲覧者権限にします
- 利用者はコピー後、自分のGoogleドライブ内で編集できます
- Apps Scriptの承認は、利用者が自分のコピー上で実行します
