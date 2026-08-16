# SIMS-Blog-Manager v5.10.12

## Fix
The Site Diagnosis treatment dialog contained one newline sequence that was escaped for the outer Apps Script string but not for the JavaScript embedded inside that string. At runtime it became a literal line break inside a quoted JavaScript string, causing the entire dialog script to fail parsing.

As a result, event handlers including the “診断結果を登録” button never loaded. v5.10.12 double-escapes that newline sequence so the embedded JavaScript parses and the existing v5.10.11 click diagnostics and Creator routing can run.

## Files to replace
- `apps-script/Code.gs`
- `distribution/Code.gs`

Both files are byte-identical.
