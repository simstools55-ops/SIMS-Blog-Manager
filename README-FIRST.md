# SIMS-Blog-Manager v5.13.0

改善後モニタリングの「出口」を完成させるMINORアップデートです。

## 今回の主な変更

- 「推移確認」に `4．観察終了後の処置を進める` を追加
- 4回測定後に改善完了した案件は、現役の「改善の推移」から卒業
- 「再改善必要」「確定不能」の案件は、チェックしてDoctor再診へ直接送れる
- Doctorが `WAIT / MONITOR` を返した場合は、正式な「追加経過観察」サイクルを新規開始
- Doctor再診後は Writer / Merge / 追加経過観察 へ既存ルートで自動分岐
- 完了案件の改善履歴・28日成績は削除せず保持
- Homeのモニター件数は現役案件中心になるよう、記事管理状態を同期
- Apps Script / 配布コード / VERSION / PRODUCT_IDENTITY の版数を v5.13.0 に同期

## Apps Scriptで変更するファイル

- `Code.gs`：置換

`appsscript.json` は変更ありません。

## 操作

1. 「推移確認」→「1．改善の推移を開く」
2. 所定期間が終わり、処置が必要な行にチェック
3. 「推移確認」→「4．観察終了後の処置を進める」
4. SBMが状態を判定
   - 改善完了 → 観察完了として卒業
   - 再改善必要 / 確定不能 → Doctor再診依頼
   - Doctor追加観察中 → 次回診察日まで待機
5. Doctorが `WAIT / MONITOR` を返した場合は新しい観察サイクルへ自動登録

## 推奨コミットメッセージ

`feat(sbm): release v5.13.0 post-improvement monitoring lifecycle`
