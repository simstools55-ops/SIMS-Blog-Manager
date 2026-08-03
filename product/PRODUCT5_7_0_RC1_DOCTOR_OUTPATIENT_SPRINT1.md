# Product 5.7.0 RC1 — SIMS Doctor 外来診療 Sprint 1

## 目的

SBMから独立製品SIMS Doctorへ、選択した1記事の診断依頼JSONを手動で出力します。

## 安全境界

- 日次処理からDoctor処理を呼び出しません。
- 記事ランク計算を変更しません。
- 記事管理、改善履歴、改善の推移、作業状態を変更しません。
- トリガーを追加しません。
- DoctorやWriterを自動起動しません。

## 利用方法

- 記事一覧でチェックを1件付け、`SIMS Doctor > 記事一覧の選択記事を診断依頼`
- 改善の推移で1行選び、`SIMS Doctor > 改善の推移の選択記事を診断依頼`

JSONはGoogle Driveの `SIMS-Doctor/Requests` に保存されます。
