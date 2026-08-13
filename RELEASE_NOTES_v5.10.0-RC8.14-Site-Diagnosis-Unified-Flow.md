# SIMS-Blog-Manager v5.10.0-RC8.14

## Site Diagnosis Unified Treatment Flow

### Purpose
Site Diagnosis案件の利用者操作を、分離していたメニュー5/6から1つのダイアログへ統合する。

### Changes
- SIMS Doctorメニューを `5．Site Diagnosisの処置を進める` に統合。
- 1つのダイアログで以下を順番に実行可能。
  1. Doctor診断結果をSBMへ登録
  2. 対象記事を開く
  3. SBM生成のWriter紹介状をコピー
  4. Writer処置結果をSBMへ登録
  5. モニター状態へ同期
- ダイアログ下部に `閉じる` ボタンを常設。
- 旧 `sbmDoctorRegisterSiteDiagnosisWriterResult` は後方互換ラッパーとして残し、統合ダイアログを開く。
- Doctor結果登録・Writer結果登録・改善履歴同期の既存トランザクションは変更しない。

### Version / Revision Management
- Runtime version: `5.10.0-RC8.14`
- `apps-script/Code.gs` と `distribution/Code.gs` を同一内容・同一バージョンへ同期。
- `PRODUCT_IDENTITY.json` の `current_version` を `5.10.0-RC8.14` へ同期。

### Regression Boundary
- Doctor Identity validation
- Site Diagnosis CaseID / BatchID traceability
- Writer referral generation
- Writer treatment result registration
- Monitoring/history synchronization

