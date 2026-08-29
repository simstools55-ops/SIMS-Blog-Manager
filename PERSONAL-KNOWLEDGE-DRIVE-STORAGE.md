# SIMS Personal Knowledge — Google Drive File Storage Specification v1.0

## Canonical storage

Personal Knowledge is stored as ordinary, user-visible files in Google Drive.

- Canonical folder name: `SIMS-Personal-Knowledge`
- SIMS reads and updates the files in place.
- The folder is not a Claude Shared Knowledge upload package.
- Users do not import/export it during normal operation.
- A user may manually copy, move, archive, or restore the entire folder when needed.
- Product updates must never overwrite or delete this folder.
- Product repositories and distribution ZIPs must never contain the user's live Personal Knowledge.

## Runtime layout

```text
SIMS-Personal-Knowledge/
├─ README-FIRST.txt
├─ MANIFEST.json
├─ owner/
│  ├─ EDITORIAL_PREFERENCES.json
│  └─ LEARNING.json
├─ sites/
│  ├─ SITE-<uuid>/
│  │  ├─ SITE_PROFILE.json
│  │  ├─ ARTICLE_KNOWLEDGE.json
│  │  ├─ CLUSTERS.json
│  │  └─ LEARNING.json
│  └─ ...
├─ cross-site/
│  └─ LEARNING.json
└─ system/
   └─ MIGRATION_HISTORY.json
```

## Identity and selection

The user selects a blog in the normal SIMS workflow. SBM resolves that blog to the corresponding
immutable `SITE-<uuid>` using the canonical blog URL. The user does not select a Personal Knowledge
file or enter a site ID.

The existing SIMS `SiteID` remains unchanged for backward compatibility.

## Transfer / backup

The whole `SIMS-Personal-Knowledge` folder is the portable unit. Manual copying is supported.
A dedicated daily import/export workflow is intentionally not required.

Before accepting a manually restored store, SIMS must validate `MANIFEST.json`, schema compatibility,
site references, and required files. Restore validation is a maintenance concern, not a daily workflow.

## Knowledge boundary

Store only relatively stable reusable personal/site knowledge. Do not store current GSC/GA4 metrics,
temporary diagnosis packages, current SERP snapshots, or other transient Evidence here.
