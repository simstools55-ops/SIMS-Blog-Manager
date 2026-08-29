# SIMS-Blog-Manager v5.10.3

## Release type
PATCH release from v5.10.2.

## Production issue
A Site Diagnosis Writer referral for A900018 contained a valid Doctor result, but the top-level Writer referral dropped the Doctor's direct `treatment_plan.allowed_scope` and `blocked_scope`. Article metadata in the referral also came from stale Article Master values even though the live article had already changed.

## Fix
1. Direct Doctor V2 scope fields are authoritative and are now mapped.
2. Writer referral metadata is refreshed from the live article when the referral is generated.
3. Live H1/title, title tag, and meta description override stale stored metadata.
4. Both normal Site Diagnosis and backup/manual Writer request paths use the same mapping behavior.
5. SBM no longer emits a Writer referral with an empty `allowed_scope`; it stops safely instead of sending a malformed/unsafe request.

## Versioning
Formal product version: `v5.10.3`.
