# Product 5.6.13 — SIMS Doctor記事カタログ連携

## 目的
SBMとSIMS Doctorを横並びの独立製品として接続する最初の縦断スライス。

## 安全境界
- Doctor連携は手動メニューからのみ実行する。
- `onOpen`・日次処理・改善効果測定から自動実行しない。
- Search Console APIを呼び出さない。
- 記事管理の行・作業状態・改善候補を変更しない。
- 日次処理中は出力を拒否する。
- 時間主導トリガーを作成しない。

## 出力
`SIMS_DOCTOR_ARTICLE_CATALOG_V1` JSONをDriveの`SIMS-Doctor-Exports`フォルダへ保存する。
