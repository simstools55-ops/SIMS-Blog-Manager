# Product 5.7.1 RC10 Doctor Evidence Package v2

RC9を基準にEvidence Packageの外部契約をV2へ確定した。

## 正式識別子

- Request: `SIMS_DOCTOR_SINGLE_CASE_REQUEST_V2`
- Evidence: `SIMS_DOCTOR_EVIDENCE_PACKAGE_V2`
- Evidence version: `2.0.0`

## 保存先

Doctor履歴は既存の `Doctor_Health_Record` を正本とし、重複する `Doctor_History` シートは追加しない。

## 互換性

日次運用、Writer連携、既存シート名、既存スプレッドシートを維持する。
