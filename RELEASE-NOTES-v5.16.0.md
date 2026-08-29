# SIMS Blog Manager v5.16.0

## Personal Knowledge runtime bridge

Personal Knowledge Schema v1.0 is now connected to SBM as an internal persistent data layer.

- Creates or reuses a single `SIMS-Personal-Knowledge` folder in the user's Google Drive.
- Automatically creates the canonical empty Personal Knowledge structure when it does not yet exist.
- Creates an immutable UUID-backed Personal Knowledge `site_id` for each registered blog.
- Resolves an existing site by canonical blog URL instead of creating a duplicate.
- Keeps the existing SIMS `SiteID` unchanged for backward compatibility.
- Carries `personal_knowledge_site_id` in Article Doctor and Writer handoff metadata.
- Personal Knowledge failures are non-blocking; normal SBM operation continues.
- No Personal Knowledge import/export UI is exposed in daily operation.
- Backup/restore and legacy-data migration will be implemented as maintenance operations in a later step.

This is a backward-compatible MINOR release. Existing product contracts and physical sheet names are preserved.
