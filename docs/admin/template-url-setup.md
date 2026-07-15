# テンプレートコピーURLの設定

Product 5.1.3 Official では、利用者はマニュアルサイトのボタンから Google スプレッドシートを自分の Drive へコピーします。

ただし、このボタンを有効にするには、管理者が実在する Google スプレッドシートのIDを設定する必要があります。

## 手順

1. Product 5.1.3 Official の完成版スプレッドシートを Google Drive に用意します。
2. 共有設定を「リンクを知っている全員が閲覧可」にします。
3. スプレッドシートのURLからIDをコピーします。

```text
https://docs.google.com/spreadsheets/d/ここがスプレッドシートID/edit
```

4. 次の形式でコピーURLを作ります。

```text
https://docs.google.com/spreadsheets/d/スプレッドシートID/copy
```

5. `docs/download.md` のコピーURLを、この実URLへ置き換えます。
6. GitHubへ反映します。

## 注意

`YOUR_TEMPLATE_SPREADSHEET_ID` のような仮IDを公開ページに残すと、利用者は「ファイルが存在しません」という画面になります。

Product 5.1.3 Official では、仮リンクを利用者向けページに出さない運用にします。
