# SIMS Blog Manager v5.19.1

## Changes
- Article Doctor request generation: cache site-wide Search Console impact evidence for 6 hours to avoid identical repeated API calls across article requests.
- Writer improvement-result registration: remove full Article DB/history restyling and full effectiveness recalculation from the synchronous registration path; use light Home refresh.
- History row formatting is copied from the previous row instead of restyling the whole sheet.
- User-facing SBM labels are shortened from “SIMS Article Doctor / SIMS Site Doctor” to “Article Doctor / Site Doctor”. Internal contracts, function names, IDs, source_system/target_system and stored compatibility identifiers are unchanged.
