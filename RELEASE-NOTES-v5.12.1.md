# Release Notes — SIMS Blog Manager v5.12.1

## Creator publication URL fallback

- Adds a **公開した記事のURL** field to the Creator new-article registration dialog.
- Creator responses that already contain the published URL continue to register with no extra input.
- When the Creator response was produced before publication and therefore has no live URL, the user can paste the published URL once and register the article immediately.
- The manual URL is only a fallback; existing SiteID, Creator-case, blog-host, duplicate-URL, and workflow-state validation remains unchanged.
- The dialog footer is fixed so the registration button remains accessible with long Creator responses.

## Versioning

PATCH release from v5.12.0. No `appsscript.json` change. Apps Script replacement file: `Code.gs` only.
