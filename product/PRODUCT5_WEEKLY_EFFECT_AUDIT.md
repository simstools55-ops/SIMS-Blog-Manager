# Product 5.0 Weekly Effect Audit

## Static checks

- Apps Script syntax: PASS
- Duplicate top-level functions: 0
- History header count: 36
- History append value count: 36
- Effect header count: 31
- Effect row value count: 31
- 7-day extension menu/function: removed
- Manual measurement completion menu/function: removed

## Compatibility

The schema migration preserves existing improvement history fields by header name.
Old `効果判定` is migrated to `最新判定`.
Old `測定予定日` is not used as a future schedule; when legacy log data exists it can be preserved as the first measurement timestamp.
