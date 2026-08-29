# SIMS-Blog-Manager v5.18.1

Release date: 2026-08-30

## Fix

This patch completes the automatic Personal Knowledge bootstrap discovered during the first real-article v5.18.0 test.

- `SIMS-Personal-Knowledge` is now initialized before site resolution, so the persistent Drive store is created automatically.
- Article Doctor result ingestion passes the trusted original SBM request as an identity hint. SITE knowledge can therefore resolve the current blog even when the Doctor response has an empty `personal_knowledge_site_id` / candidate `site_id`.
- Existing site folders are matched by canonical blog URL or legacy SIMS `SiteID`; otherwise a new immutable `SITE-<UUID>` is created.
- Candidate confidence labels `HIGH`, `MEDIUM`, and `LOW` are normalized to `0.95`, `0.80`, and `0.55`. This prevents valid `MEDIUM` candidates from being rejected as zero-confidence.
- Replaying the same `confirmation_event_id` does not count as an independent confirmation.

## Compatibility

No existing `SIMS_DOCTOR_*` contract, physical sheet name, or legacy `SiteID` is changed. Personal Knowledge failure remains non-blocking for normal SBM diagnosis/treatment registration.

## Real test target

Re-register the A000076 Article Doctor result after updating to v5.18.1. The expected result is a user-visible `SIMS-Personal-Knowledge` Drive folder with an infohack `SITE-<UUID>` area and the two Doctor findings stored as `CANDIDATE`, without promotion on same-case replay.
