# Product 5.3.1 SiteID / 日次処理 UAT

## 自動検証

- [x] Apps Script構文検査
- [x] 開発用Code.gsと配布用コード.gsの一致
- [x] 固定されたv5.2.1判定が残っていない
- [x] 依頼文にSiteID、SiteName、SiteURLが含まれる
- [x] JSON例にsite_id、site_name、site_urlが含まれる
- [x] Home表示と未実行判定がLastSuccessfulDailyUpdateEpochを共用する
- [x] 完了時だけsbmMarkDailyUpdateCompleted_を実行する

## 実機確認

1. 前日の最終データ更新日時がある状態で開き、Home表示後に日次更新確認が出る。
2. 「今回は更新しない」で閉じ、手動の日次処理が利用できる。
3. 更新成功後、Homeの最終データ更新が実時刻と一致する。
4. 同日に再度開いた場合、確認画面が出ない。
5. 日次処理を意図的に失敗させた場合、最終データ更新が書き換わらない。
6. 改善ナビの依頼文にサイト情報が表示される。
7. 別ブログで同じArticleIDでもSiteIDが異なることを確認する。
8. シートの作成・修復完了後、Homeが最新表示になり、Homeシートが選択されている。
