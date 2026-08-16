# SIMS-Blog-Manager v5.10.7

## Purpose

Make Site Diagnosis Merge result registration accept both forms users actually paste:

1. the complete SIMS Merge response, or
2. the standalone `SIMS_MERGE_TREATMENT_RESULT_V1` JSON.

## Fixed defect

The v5.10.6 Merge registration path successfully extracted the result JSON, then failed during contract validation because it called an undefined helper: `sbmDoctorContractNameOf_`.

## Behavior

- Full Merge response: SBM searches all Markdown code fences and free-form text and extracts the object whose contract is `SIMS_MERGE_TREATMENT_RESULT_V1`.
- JSON only: SBM accepts the object directly.
- Other JSON/code blocks in the Merge response are ignored unless they match the requested contract.
- Contract validation accepts the contract name from `envelope.contract_name`, top-level `contract_name`, or `format`.

## Files to replace

- `apps-script/Code.gs`
- `distribution/Code.gs`
- `VERSION`
- `PRODUCT_IDENTITY.json`
- `README.md`
- `distribution/README-FIRST.md`
- `CHANGELOG.md`

New file:
- `RELEASE_NOTES-v5.10.7.md`
