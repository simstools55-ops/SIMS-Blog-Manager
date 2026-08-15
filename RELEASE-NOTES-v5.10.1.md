# SIMS-Blog-Manager v5.10.1

## Release type
PATCH release from v5.10.0.

## Fixed
- Writer treatment-result registration now accepts the full Writer response as the UI promises.
- Site Diagnosis Writer-result registration uses the same contract-specific extraction.
- Site Diagnosis Doctor-result registration selects the intended Doctor result contract instead of blindly taking the first JSON object.
- Merge treatment-result registration extracts `SIMS_MERGE_TREATMENT_RESULT_V1` from the full response.
- JSON-only paste remains supported for backward compatibility.
- Markdown fences, explanatory prose, and unrelated JSON before the target result no longer cause the target result to be missed.

## Versioning
Formal product versions use `vX.Y.Z`.
Internal RC-style identifiers are not used as the formal release version.

## Apps Script replacement
Replace `Code.gs` only.
`appsscript.json` is unchanged.
