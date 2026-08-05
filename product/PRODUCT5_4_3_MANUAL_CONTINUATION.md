# Product 5.4.3 日次処理の手動継続

## 変更概要

- Product 5.4.2で追加した時間主導トリガーによる自動継続を廃止した。
- `ScriptApp`のトリガー管理権限を要求せず、既存のOAuthスコープだけで動作する。
- 日次処理は `FETCH → MERGE → RECOMMEND → FINALIZE` のフェーズ構造を維持する。
- 安全な実行時間に達した場合は、現在フェーズと一時データを保存して正常に一時停止する。
- ダイアログに「続きを実行」を表示し、利用者が1回押すと保存済みフェーズから再開する。
- 処理中は回転スピナー、進捗率、現在工程を表示する。
- 認証やSearch Console設定の確認が必要な場合は、再開とは区別して具体的な操作手順を表示する。

## 権限方針

`ScriptApp.getOAuthToken()`はSearch Console API呼び出しに引き続き使用する。
一方、次のトリガー管理APIは使用しない。

- `ScriptApp.getProjectTriggers()`
- `ScriptApp.newTrigger()`
- `ScriptApp.deleteTrigger()`

## 完了条件

`LastSuccessfulDailyUpdateEpoch`は全フェーズ完了時だけ更新する。途中停止中はHomeに「続行待ち」を表示する。
