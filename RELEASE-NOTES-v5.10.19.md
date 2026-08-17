# Release Notes — SIMS Blog Manager v5.10.19

## Doctor V2 top-level treatment scope compatibility

The Site Diagnosis individual precision Doctor response uses the valid
SIMS_DOCTOR_CASE_RESULT_V2 shape with `allowed_scope` and `blocked_scope`
at the result root.

SBM previously generated Writer referrals from legacy/referral,
workflow_handoff, or treatment_plan scope fields but did not include the
top-level V2 fields. This caused a false safety error claiming that
`allowed_scope` was missing.

v5.10.19 treats the top-level scopes as authoritative input and preserves
them in the Writer treatment referral. Existing supported scope locations
remain backward compatible.
