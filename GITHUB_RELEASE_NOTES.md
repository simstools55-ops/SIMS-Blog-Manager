# SIMS-Blog-Manager v5.10.3

## PATCH release

v5.10.3 fixes Doctor -> SBM -> Writer referral mapping found during Site Diagnosis production testing.

### Fixed
- `treatment_plan.allowed_scope` is copied into `doctor_referral.allowed_scope`.
- `treatment_plan.blocked_scope` is copied into `doctor_referral.blocked_scope`.
- Doctor diagnosis metadata is preserved more completely.
- Writer referral article metadata is refreshed from the live article at referral generation time:
  - H1/title
  - SEO title
  - meta description
- Live metadata takes priority over stale Article Master metadata.
- Technical flags intended for SBM remain explicitly available as `technical_flags_for_sbm`.
- Both the Site Diagnosis Writer path and the backup/manual Writer-request path use the same mapping rules.

### Compatibility
- Existing Doctor V1/V2 referral shapes remain supported.
- JSON-only and full-response result registration from v5.10.2 remains unchanged.

### Version
- Product: `5.10.3`
- Display: `v5.10.3`
- Shared Editorial Knowledge: `3.5.0`
