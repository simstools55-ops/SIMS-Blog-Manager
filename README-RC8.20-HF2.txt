SIMS Blog Manager 5.10.0-RC8.20-HF2 - Long Merge Result Receiver

PURPOSE
Fix Merge v1.1.0-RC2 result registration when the human-readable response contains:
1) a completed-article Markdown fence first, and
2) the long SIMS_MERGE_TREATMENT_RESULT_V1 JSON later.

CHANGED FILES
- REPLACE: apps-script/Code.gs
- REPLACE: distribution/Code.gs
- ADD: tests/product5100_rc820_hf2_merge_long_result_extraction_test.js

NO CHANGE
- appsscript.json
- Doctor/Writer generic JSON extraction behavior
- Shared contracts / knowledge
- Spreadsheet templates
- Site Diagnosis
- Official Merge v1.1 workflow redesign

FIX
- Adds a Merge-specific contract-targeted extractor.
- Searches all Markdown code fences instead of assuming the first fence is JSON.
- Falls back to a string/escape-aware balanced-object scan around the requested contract marker.
- Long content_markdown values, escaped quotes, backslashes and braces inside JSON strings are safe.
- Error messages distinguish JSON extraction, JSON parse and Contract validation stages.

APPS SCRIPT INSTALL
Replace only Code.gs with apps-script/Code.gs.
