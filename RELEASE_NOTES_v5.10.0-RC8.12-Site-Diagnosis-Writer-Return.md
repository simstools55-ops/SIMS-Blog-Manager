# SIMS-Blog-Manager 5.10.0-RC8.12

## Site Diagnosis Writer Return Hotfix

This release completes the return bridge from a Site Diagnosis-originated Writer treatment back to SBM.

### Added

- SIMS Doctor menu: `6．Site DiagnosisのWriter処置結果を受け取る`
- Non-blocking HTML input dialog for Writer output
- Site Diagnosis CaseID / BatchID verification before registration
- SiteID and ArticleID mismatch guards

### Reused existing monitoring transaction

After a compliant `COMPLETED` Writer result is accepted, SBM uses the existing Doctor→Writer registration path to:

- save Writer result JSON to `Doctor_Cases`
- create/update improvement history
- set the article to `👀 モニター中`
- update improvement effectiveness tracking
- schedule the recommended review period (default 28 days)
- keep `SiteDiagnosisBatchID` and `SiteDiagnosisCaseID` attached to the same Doctor case

### Apps Script deployment

Replace only `Code.gs`. No new Apps Script files are required.
