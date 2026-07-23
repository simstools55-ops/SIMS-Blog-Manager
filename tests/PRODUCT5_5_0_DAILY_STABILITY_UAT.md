# Product 5.5.0 Daily Stability UAT

1. 日次処理を開始し、ダイアログに工程と進捗率が表示されること。
2. 正常完了時にHomeが「本日完了」になること。
3. System_LogにDailyPhaseのFETCH/MERGE/RECOMMEND/FINALIZEが記録されること。
4. 応答停止後7分以内に「続きを実行」へ切り替わること。
5. 続行後、保存済みフェーズから再開すること。
6. ScriptAppトリガー権限を要求しないこと。
7. 約420記事環境で記事ランク計算が完了すること。
