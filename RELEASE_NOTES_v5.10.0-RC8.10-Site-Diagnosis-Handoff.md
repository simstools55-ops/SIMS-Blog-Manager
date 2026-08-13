# SIMS-Blog-Manager 5.10.0-RC8.10 — Site Diagnosis Handoff Hotfix

- Added `SIMS Doctor > 5．Site Diagnosisの診断結果を受け取る`.
- Accepts Site Diagnosis Doctor results using `SIMS_DOCTOR_CASE_RESULT_V2`.
- Preserves `site_diagnosis_batch_id`, `site_diagnosis_case_id`, external `case_id`, `site_id`, ArticleID and URL in SBM.
- Adds `SiteDiagnosisBatchID` and `SiteDiagnosisCaseID` to `Doctor_Cases` as append-only columns.
- Validates SiteID, ArticleID and URL before registration.
- Extends V2 normalization for `case_context`, `workflow_handoff`, `review_schedule` and current Site Diagnosis treatment shapes.
- Generates the Writer referral from SBM Evidence while keeping the Site Diagnosis traceability chain.
- Existing SBM -> Doctor individual diagnosis flow is unchanged.
