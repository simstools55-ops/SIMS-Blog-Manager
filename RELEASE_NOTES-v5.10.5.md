# SIMS-Blog-Manager v5.10.5

## Purpose

Safe exit for Site Diagnosis referrals when real-site verification shows that no treatment should be applied.

## New behavior

The Site Diagnosis treatment dialog now provides `処置せず終了`.

Use it when, for example:

- the diagnosed problem is not present on the live page,
- the diagnosis premise is inconsistent with the current article,
- the diagnosed URL is an old URL that already redirects,
- a canonical/redirect issue is disproved by live-site verification.

The user records a reason and optional memo. SBM closes only that Site Diagnosis case.

## Safety

- No fake Writer/Merge result is created.
- No new improvement history is created for a treatment that did not occur.
- No new effectiveness measurement is scheduled.
- Completed/monitoring cases are not reopened.
- Existing Writer/Merge workflows are unchanged.

## Canonical metadata safeguard

SBM no longer fills `article.canonical_url` with the Article DB URL unless the canonical has actually been verified. This prevents downstream tools from mistaking an assumed self-canonical for observed evidence.

## Files to replace

- `apps-script/Code.gs`
- `distribution/Code.gs`
- `VERSION`
- `PRODUCT_IDENTITY.json`
- `README.md`
- `distribution/README-FIRST.md`
- `CHANGELOG.md`

New file:
- `RELEASE_NOTES-v5.10.5.md`
