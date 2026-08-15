# SIMS-Blog-Manager v5.10.2

## Release type
PATCH release from v5.10.1.

## Reason for release
v5.10.1 introduced contract-specific extraction for full AI responses.
A regression was found with valid Doctor V2 JSON because Doctor V2 uses
different values for `format` and `contract_name`.

Example:
- `format`: `SIMS_DOCTOR_CASE_RESULT_V2`
- `contract_name`: `SIMS_DOCTOR_SINGLE_CASE_RESULT_V1`

## Fix
The extractor now treats these fields as independent valid identifiers:
- `format`
- `contract_name`
- `envelope.contract_name`

A target matches when any one of the above equals the requested contract identifier.

## Compatibility
- JSON-only input: supported
- Full Doctor response: supported
- Full Writer response: supported
- Full Merge response: supported
- Unrelated JSON before the target result: supported

## Versioning
Formal product version: `v5.10.2`
Version policy: `vX.Y.Z`
