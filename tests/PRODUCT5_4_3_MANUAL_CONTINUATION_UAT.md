# Product 5.4.3 日次処理 UAT

1. 日次処理開始後、回転スピナーと進捗率が表示される。
2. 通常処理が完了した場合は、本日完了になる。
3. 安全な実行時間に達した場合、処理位置を保存して「続きを実行」が表示される。
4. 「続きを実行」を押すと、FETCHへ戻らず保存済みフェーズから再開する。
5. 続行完了時だけ `LastSuccessfulDailyUpdateEpoch` が更新される。
6. `ScriptApp.getProjectTriggers()`、`ScriptApp.newTrigger()`、`ScriptApp.deleteTrigger()`を呼び出さない。
7. Search Console認証など利用者の確認が必要な場合は、具体的な操作案内を表示する。
8. 正常完了後、`__Daily_Update_Work` が削除される。
