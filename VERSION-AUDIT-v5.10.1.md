# Version Audit — SIMS-Blog-Manager v5.10.1

## Formal current version

The single formal product version is:

`v5.10.1`

Runtime constant:

`const SBM_VERSION = '5.10.1';`

`SBM_DISPLAY_VERSION` has been removed.

## Current-version sources synchronized

- `apps-script/Code.gs`
- `distribution/Code.gs`
- `src/apps-script/Code.gs`
- `src/distribution/Code.gs`
- `VERSION`
- `PRODUCT_IDENTITY.json`
- `README.md`
- `GITHUB_RELEASE_NOTES.md`
- `APPLY-INSTRUCTIONS.md`
- `RELEASE_NOTES-v5.10.1.md`

## Historical version strings

Older `5.10.0-RC*` text remains only where it describes historical release notes,
test artifacts, changelog history, or implementation provenance comments.
Those strings are not used as the current runtime/display/release identity.

## Validation

- JavaScript syntax: PASS
- Duplicate top-level functions: 0
- Four maintained `Code.gs` copies: identical
- Separate display-version constant: absent
- Root `VERSION`: `5.10.1`
- Product identity current version: `5.10.1`

## Result-extraction regression verification

Validated against actual production-style responses:

- A900018 Doctor JSON only: PASS
- A900018 Doctor full response: PASS
- A900019 Writer full response: PASS
- Merge full response with unrelated JSON before the target result: PASS
- Doctor one-of-contract routing: PASS

The extractor now accepts a target identifier if it matches any of:
- `format`
- `contract_name`
- `envelope.contract_name`

This is required because Doctor V2 legitimately uses
`format = SIMS_DOCTOR_CASE_RESULT_V2` while
`contract_name = SIMS_DOCTOR_SINGLE_CASE_RESULT_V1`.

