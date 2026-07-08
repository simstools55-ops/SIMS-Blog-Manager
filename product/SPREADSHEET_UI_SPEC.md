# Product 5.0 Spreadsheet UI Specification

## 方針

RC9をベースに、不要なものをそぎ落として必要なものだけに絞る。

## 利用者に表示するタブ

1. Home
2. 今日の改善
3. 改善中
4. ブログ診断
5. 処理ログ

## 非表示にする管理用シート

- 設定
- SearchConsole_Data
- Improvement_Queue
- Improvement_Log

## Home

毎日最初に見る画面。表示内容は次の3点に絞る。

- ブログ全体の状況
- 改善作業の状況
- 今日やること


## データ一覧

Search Consoleで取得したデータを記事単位で一覧表示する利用者向け画面。

表示項目:

- 記事ステータス
- 記事URL
- H1タイトル
- titleタグ
- メインクエリ
- クリック数
- 表示回数
- CTR
- 平均順位
