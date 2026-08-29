# SIMS Blog Manager v5.14.12

## Product naming / role separation
- **SIMS Article Doctor**: one-article detailed diagnosis and treatment-routing decision.
- **SIMS Site Doctor**: site-wide periodic health check, cross-article screening, detailed-diagnosis candidate selection, and Site Doctor result intake.
- **SIMS Site Collector**: evidence collection for site-wide diagnosis.

## UI changes
- The top-level site-wide diagnosis menu is now `SIMS Site Doctor`.
- Health-check dialogs/reports are branded as Site Doctor.
- Referral/copy instructions for one-article diagnosis are branded as Article Doctor.
- Detailed diagnosis candidates remain a Site Doctor output, with the selected article handed to Article Doctor.

## Compatibility
- Internal function names (`sbmDoctor...`), JSON formats (`SIMS_DOCTOR_*`), settings keys, and physical sheet names (`Doctor_*`) are intentionally unchanged.
- Historical release-note files are not rewritten.
