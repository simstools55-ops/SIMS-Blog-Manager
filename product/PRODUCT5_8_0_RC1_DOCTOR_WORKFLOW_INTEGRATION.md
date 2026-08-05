# Product 5.8.0 RC1 Doctor Workflow Integration

## 目的

SBMを唯一のワークフロー管理者として、Doctor診断からWriter治療までの最小循環を実装する。

## 正式経路

SBM → Doctor → SBM → Writer → SBM

## 実装

- SBM発行CaseID
- Doctor_Casesシート
- SIMS_DOCTOR_CASE_RESULT_V2受付
- SIMS_WRITER_TREATMENT_REQUEST_V1生成
- SIMS_WRITER_TREATMENT_RESULT_V1受付
- Workflow Lock、利用者判断、公開待ち状態

## 後方互換

従来のSBM→Writer改善依頼、改善履歴、効果測定を維持する。
