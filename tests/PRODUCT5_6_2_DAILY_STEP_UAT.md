# Product 5.6.2 日次処理STEP方式 UAT

1. 日次処理を開き、未実施／本日完了の状態が1回だけ表示される。
2. 実行するとSTEP 1の取得中表示とスピナーが出る。
3. STEP 1完了後、操作なしでSTEP 2の分析中表示へ切り替わる。
4. `sbmRunDailyFetchStageFromDialog` と `sbmRunDailyAnalysisStageFromDialog` が各1回だけ実行される。
5. 完了後、取得行、有効URL、既存更新、新規追加、記事DB合計、改善候補、今日の改善、工程別時間、全体時間が表示される。
6. 完了画面は自動で閉じず、「閉じる」で終了する。
7. STEP 1失敗時はSTEP 2を呼ばない。
8. STEP 2失敗時は日次完了日時を保存しない。
9. Homeは全工程成功後のみ本日完了になる。
