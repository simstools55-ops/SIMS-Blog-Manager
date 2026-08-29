# SIMS Blog Manager v5.16.1

## Personal Knowledge storage clarification

Personal Knowledge is formally defined as a normal user-visible Google Drive file store.

- `SIMS-Personal-Knowledge` remains in Google Drive and is updated in place by SIMS.
- It is not handled like Claude Shared Knowledge.
- No routine import/export operation is required.
- The entire folder may be copied manually for backup or environment transfer.
- A `README-FIRST.txt` is created inside the live folder so its purpose is clear if the user opens it.
- `MANIFEST.json` now declares `storage_mode: GOOGLE_DRIVE_FILES`, `user_visible: true`, and
  `manual_transfer_supported: true`.
- Product code and live Personal Knowledge remain physically separate.

No existing SIMS SiteID, sheet name, or handoff contract is replaced.
