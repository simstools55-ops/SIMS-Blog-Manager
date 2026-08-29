# SIMS Blog Manager v5.14.13

## Naming completion
- Completed the user-facing terminology migration to **SIMS Article Doctor** and **SIMS Site Doctor** in active workflow messages.
- Precision-diagnosis progress now says `Article Doctorへ依頼` / `Article Doctor回答を登録`.
- Site-wide Writer/Merge completion messages now identify the route as `Site Doctor経路`.
- Error guidance now distinguishes `Site Doctor経路` from normal `Article Doctor` treatment.
- Improvement history text for Merge now records `Article Doctor診断に基づく記事統合`.

## Compatibility
- Existing `sbmDoctor...` function names, `Doctor結果JSON`, `SiteDiagnosisCaseID`, `SIMS_DOCTOR_*` contracts, and physical sheet names remain unchanged.
- These legacy identifiers are implementation contracts, not the user-facing product names.
