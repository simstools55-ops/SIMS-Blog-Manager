# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT28

## Purpose
ブログ健康診断の高速化前に、8工程のどこが遅いかを実機で特定する計測ビルド。

## Measured
- 開始準備
  - 記事情報補完
  - 安全確認
  - Doctorシート準備
  - 実行状態保存
- 各Search Console期間
  - API
  - 健康診断スナップショット統合
  - 対象件数確認
  - 実行状態保存
- 記事健康状態判定
  - スナップショット読込
  - 記事状態コンテキスト
  - 判定計算
  - バッチ書込
  - 状態保存
  - 最終診断書生成

## Temporary UAT UI
健康診断ダイアログに「工程時間」を一時表示し、完了済み工程の所要秒数を蓄積する。
高速化完了後にこのQA表示は撤去する。

## Known suspect
開始準備には `sbmEnsureArticleListDisplayCompleteness_(20,40)` が残っており、
記事一覧で判明したものと同系統の外部取得処理。実測で確認して次UATで除去判断する。

## No optimization yet
UAT28では健康診断ロジック・判定基準・候補選定・帳票内容を変更しない。
