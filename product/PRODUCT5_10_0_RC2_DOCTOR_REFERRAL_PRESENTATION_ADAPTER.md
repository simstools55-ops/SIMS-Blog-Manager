# Product 5.10.0-RC2 Doctor Referral Presentation Adapter

- Normalize Doctor v1.2 `treatment_plan.actions_permitted` into Writer `allowed_scope`, `instructions`, `candidate_urls`, and structured `treatment_tasks`.
- Normalize `actions_prohibited` into Writer `blocked_scope`.
- Forward Doctor `presentation` as Human Layer metadata while retaining the complete machine-facing Doctor result.
- Preserve Doctor → SBM → Writer routing and Evidence Package v2.3.0.
- Sync Shared Editorial Knowledge 3.5.0 Presentation Framework snapshot.
