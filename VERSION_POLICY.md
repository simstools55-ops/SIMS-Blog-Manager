# SIMS Version Policy

SIMS products use `Va.b.c` for stable releases.

- `a`: major generation. Increment for a large product architecture or product-generation change.
- `b`: feature version. Increment for meaningful new capabilities or workflow expansion.
- `c`: revision. Increment for bug fixes, performance improvements, and small UX corrections.

During release-candidate validation, append a prerelease suffix: `Va.b.c-RCx.y`.

- `x`: release-candidate number.
- `y`: revision within that release candidate.

Example: `v5.10.0-RC8.9` means stable target `v5.10.0`, release candidate 8, revision 9. When RC8 is accepted as the stable baseline, the release becomes `v5.10.0`. Subsequent stable bug fixes become `v5.10.1`, `v5.10.2`, and so on.

The complete running version must be synchronized in:

- Home screen
- `VERSION`
- `PRODUCT_IDENTITY.json`
- `apps-script/Code.gs`
- `distribution/Code.gs`
- current release notes

`apps-script/Code.gs` is the source of truth for Apps Script code. `distribution/Code.gs` must be byte-identical at packaging time.
