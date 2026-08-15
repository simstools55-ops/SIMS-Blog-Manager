# SIMS-Blog-Manager v5.10.1

## Purpose

PATCH release based on the v5.10.0 production baseline.

## Fixes

The UI says users may paste the entire Doctor / Writer / Merge response. Some result receivers still parsed the first JSON object or expected JSON-only input.

v5.10.1 uses contract-specific extraction:
- Writer: `SIMS_WRITER_TREATMENT_RESULT_V1`
- Merge: `SIMS_MERGE_TREATMENT_RESULT_V1`
- Site Diagnosis Doctor: `SIMS_DOCTOR_CASE_RESULT_V2` or `SIMS_DOCTOR_SITE_WIDE_PRECISION_RESULT_V1`

JSON-only input remains compatible.

## Version model

The formal product version is managed only as `vX.Y.Z`.
There is no separate display product version or formal RC/HF build number in the release identity.

Current version: `v5.10.1`.

## Final parser correction

Doctor V2 results legitimately contain both:

- `format: SIMS_DOCTOR_CASE_RESULT_V2`
- `contract_name: SIMS_DOCTOR_SINGLE_CASE_RESULT_V1`

The result extractor now treats `format`, `contract_name`, and
`envelope.contract_name` as independent valid identifiers instead of choosing
only one field. This preserves JSON-only input and full-response input.

