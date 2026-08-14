SIMS Blog Manager 5.10.0-RC8.18 - Site Diagnosis Resume

CHANGED FILES
- REPLACE: apps-script/Code.gs
- REPLACE: distribution/Code.gs
- ADD: tests/product5100_rc818_site_diagnosis_resume_test.js

NO CHANGE
- appsscript.json
- Shared contracts / knowledge
- Spreadsheet templates
- Site Diagnosis HF4/HF5

APPS SCRIPT INSTALL
Replace only Code.gs with apps-script/Code.gs.

RC8.18
- Reopening "Site Diagnosisの処置を進める" reads unfinished Site Diagnosis cases from Doctor_Cases.
- MERGE_IN_PROGRESS / MERGE_RESULT_RECEIVED reopen the Merge result-registration path.
- WRITER_IN_PROGRESS / MERGE_WRITER_IN_PROGRESS reopen the Writer result-registration path.
- Both result forms are hidden until SBM resolves the current route, preventing the misleading Writer-only initial screen.
- Doctor JSON does not need to be registered again merely to continue an existing case.
