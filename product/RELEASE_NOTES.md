# SIMS-Blog-Manager Product 5.0 Official Release Notes

## Product 5.0 Official

RC9をSingle Source of Truthとして、正式版に向けたReset Baseを実施しました。

### 変更点

- バージョン表記をProduct 5.0 Officialへ統一しました。
- Homeを「ブログ全体の状況」「改善作業の状況」「今日やること」に整理しました。
- 毎日最初の起動時にSearch Console取得と改善候補抽出を自動実行する仕様へ整理しました。
- 改善候補は30件を上限とし、今日の改善は上位5件表示に統一しました。
- 改善中・測定中・良好・改善不要の記事を改善候補から除外する処理を整理しました。
- 効果測定を週1回・最大2か月の正式運用に合わせました。
- 処理ログを開始時刻、終了時刻、利用者待ち時間、件数が分かる形式に整理しました。
- docs/をProduct 5.0 Official仕様に合わせて更新しました。

### 互換性

- セットアップ、ブログ登録、API設定、Search Console接続、初回データ取得の基本仕様は維持しています。
- 管理メニューは基本的に現状維持です。

### deploy.yml

更新不要です。
