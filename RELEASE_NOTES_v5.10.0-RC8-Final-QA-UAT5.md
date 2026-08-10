# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT5

## QA fixes

- REG-DOCTOR-CANDIDATE-BACKFILL-001
  - 精密診断候補を健康診断時の固定上位10件ではなく、未処理の全精密診断対象から再順位付けして最大10件まで補充するよう変更。
- REG-HEALTH-SUMMARY-MISMATCH-001
  - 健康診断のページ集計で、クエリパラメータ等のURLバリアントをCanonical Keyへ合算しないよう変更。
  - 同一Canonical Keyの複数行は合算せず代表行を採用し、表示回数だけが膨張する不整合を防止。
- REG-DIST-CLEAN-001
  - distributionを5ファイルの許可リストで固定。
  - 既存distributionへ上書きせず、フォルダー削除後に丸ごと置換する手順をREADME-FIRSTへ明記。

## Scope

新機能追加ではなくRC8 Final品質保証修正のみ。
