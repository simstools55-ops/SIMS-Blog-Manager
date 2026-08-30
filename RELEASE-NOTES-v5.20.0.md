# SIMS Blog Manager v5.20.0

## Registration performance audit

- Extended the v5.19.x fast-registration design to Doctor/Writer, Merge completion, and Creator direct registration paths.
- Removed synchronous full effectiveness recalculation and Doctor route-wide synchronization from treatment-result registration.
- Replaced full Home rebuilds after registration with light Home refreshes.
- Removed full Article DB restyling from Creator direct publication registration.
- Registration still commits the authoritative Article DB, history, Case state, monitoring state, and Personal Knowledge writes before reporting success.
- Derived views are recalculated by normal daily/explicit refresh paths instead of blocking the registration button.

No contracts, sheet names, Case IDs, or Personal Knowledge admission rules were changed.
