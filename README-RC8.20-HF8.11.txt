SIMS Blog Manager 5.10.0-RC8.20-HF8.11 - Compact Merge Role Recovery

ROOT CAUSE
Long Merge Packages are stored in Doctor_Cases as compact summary JSON when they exceed
the Google Sheets single-cell limit. HF8.10 attempted to derive primary/absorbed URLs from
that compact JSON, so Step 2 could not show the two role-specific article buttons.

HF8.11
- Server-side resume logic reconstructs Merge role information from:
  1. full Merge request if available, otherwise
  2. stored Doctor result + Article DB.
- Resume actions explicitly carry mergeRoleInfo (primary + absorbed).
- Client also understands the real Merge request fields:
  primary_article_candidate and target_articles.
- For every Merge action, the role navigation area is always visible.
- Generic "記事を開く" is hidden for Merge to avoid ambiguity.
- Role buttons:
  統合先記事 Axxxxx を開く
  吸収記事 Axxxxx を開く
  are enabled when URLs are recovered and visibly disabled only if a URL truly cannot be recovered.
- Writer/single-article flows retain the ordinary "記事を開く".

PRESERVED
- HF8.9 two-check Merge completion
- Drive Artifact storage
- Resume recovery
- generated-dialog JavaScript syntax fix

QA PASSED
- Code.gs syntax
- actual generated Site Diagnosis dialog JavaScript syntax
- HF8.11 compact-request role recovery regression test

REPLACE
- apps-script/Code.gs
- distribution/Code.gs

ADD
- tests/product5100_rc820_hf811_compact_merge_role_recovery_test.js

UNCHANGED
- appsscript.json from HF8
- Shared / Site Diagnosis / SIMS Merge / Writer / Creator

INSTALL
Keep HF8 appsscript.json.
Replace Code.gs only.
Close the current dialog and open a new Site Diagnosis treatment dialog after saving.
