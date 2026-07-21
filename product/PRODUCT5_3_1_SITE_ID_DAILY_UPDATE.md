# Product 5.3.1 Maintenance

## 目的

複数ブログ運用時のArticleIDスコープを明確化し、日次処理の未実行判定とHomeの最終データ更新表示を同じ基準へ統一する。

## SiteID連携

- ArticleIDの採番方法は変更しない。
- サイト識別には `SiteID + ArticleID` を使用する。
- 記事URLは最終識別子として継続利用する。
- 改善依頼文へ `SiteID`、`SiteName`、`BlogURL` を追加する。
- SIMS_FEEDBACK_V2の例へ `site_id`、`site_name` を任意項目として追加する。
- 既存環境ではブログURLのホスト名からSiteIDを自動補完する。

## 日次処理

- 未実行判定は `LastSuccessfulDailyUpdateEpoch` の日付だけで行う。
- Homeの「最終データ更新」も同じ値を表示する。
- 日本時間 `Asia/Tokyo` で今日の日付と比較する。
- 値は日次処理が最後まで正常終了したときだけ更新する。
- 途中失敗時は更新せず、次回起動時も未実行として案内する。
- Product 5.3.0以前の最終更新日時は初回修復時に安全に移行する。

## 互換性

- 既存ArticleID、記事管理、改善履歴の再採番・修復は不要。
- `site_id` がない従来の依頼・JSONも継続利用できる。
