# SIMS-Blog-Manager Product 5.10.0-RC5

## Guided User Confirmation & Automatic Re-referral

Doctor が `USER_CONFIRMATION` を返したケースで、利用者へ確認だけを依頼してワークフローが止まる問題を解消しました。

- Doctor の `user_confirmation_request` を利用者向け手順へ変換
- Search Console URL検査では、正常／canonical不一致／インデックス問題／不明を選択可能
- 確認画面の表示内容を任意で貼り付け可能
- 確認結果を Doctor_Cases に保存
- 確認結果を `follow_up_context` として追加した Doctor 再診依頼JSONを自動生成
- 再診依頼には新しい CaseID を発行し、`previous_case_id` で前回ケースを参照
- `USER_CONFIRMATION` 時は Writer結果欄を表示せず、Writerへ進む場合のみ表示
- 正常・異常の最終判断は利用者ではなく再診Doctorが行う

既存の Doctor / Writer / Evidence Package Contract は維持し、追加フィールドによる前方互換拡張としています。
