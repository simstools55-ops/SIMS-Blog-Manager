# SIMS-Blog-Manager v5.10.1

## PATCH release

v5.10.1 fixes result registration when users paste an AI response in full.

### Fixed
- Writer result registration extracts `SIMS_WRITER_TREATMENT_RESULT_V1` from the full response.
- Site Diagnosis Writer result registration uses the same contract-specific extraction.
- Site Diagnosis Doctor result registration selects the intended Doctor result contract instead of the first JSON object.
- Merge result registration extracts `SIMS_MERGE_TREATMENT_RESULT_V1` from the full response.
- JSON-only paste remains supported.

### Version consistency
- Product runtime: `5.10.1`
- Home / version dialog: `v5.10.1`
- Root `VERSION`: `5.10.1`
- `PRODUCT_IDENTITY.json.current_version`: `5.10.1`
- Maintained `Code.gs` copies are synchronized.

Shared Editorial Knowledge remains `3.5.0`.
