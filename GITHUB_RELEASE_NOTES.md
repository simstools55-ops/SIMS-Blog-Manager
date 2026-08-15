# SIMS-Blog-Manager v5.10.2

## PATCH release

v5.10.2 corrects the result-contract parser introduced in v5.10.1.

### Fixed
- Doctor V2 results are now identified correctly even when:
  - `format = SIMS_DOCTOR_CASE_RESULT_V2`
  - `contract_name = SIMS_DOCTOR_SINGLE_CASE_RESULT_V1`
- Result matching now accepts any valid identifier from:
  - `format`
  - `contract_name`
  - `envelope.contract_name`
- JSON-only Doctor input remains supported.
- Full Doctor / Writer / Merge responses remain supported.
- Contract-specific extraction still ignores unrelated JSON blocks before the target result.

### Version consistency
- Runtime: `5.10.2`
- Home / version dialog: `v5.10.2`
- Root `VERSION`: `5.10.2`
- `PRODUCT_IDENTITY.json.current_version`: `5.10.2`
- Four maintained `Code.gs` copies are synchronized.
- `SBM_DISPLAY_VERSION` is not used.

Shared Editorial Knowledge remains `3.5.0`.
