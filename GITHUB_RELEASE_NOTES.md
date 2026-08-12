# SIMS-Blog-Manager Product 5.10.0-RC8.9

- Version management now uses `major.minor.revision`; RC validation adds a prerelease suffix such as `RC8.9`.
- Home displays the complete running version (`v5.10.0-RC8.9`).
- `VERSION`, `PRODUCT_IDENTITY.json`, `apps-script/Code.gs`, and `distribution/Code.gs` are synchronized.
- Stale health-check runs no longer block daily processing; only a genuinely active recent run does.
- Writer result registration shows `登録中...` immediately and prevents duplicate clicks.
- The processing profile sheet remains internal, and Today view avoids unnecessary redraws when there is no change.
