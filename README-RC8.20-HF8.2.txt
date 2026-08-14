SIMS Blog Manager 5.10.0-RC8.20-HF8.2 - Deep Resume Recovery

PURPOSE
Recover Merge cases that are still invisible after HF8.1.

ROOT CAUSE ADDRESSED
The resume loop previously discarded every Doctor_Cases row with an empty SiteDiagnosisCaseID
before it could inspect Merge request data. Older/intermediate Site Diagnosis Merge rows can therefore
be invisible even though Merge依頼JSON is still intact.

HF8.2
- Removes the unconditional "if(!SiteDiagnosisCaseID) return" gate.
- A stored Merge依頼JSON is sufficient evidence to restore an unfinished Merge route.
- Destination text no longer has to contain MERGE when a concrete Merge request exists.
- MONITORING and TREATMENT_FAILED remain excluded.
- Resume message reports scanned rows and Merge candidate counts.
- Rows recovered without SiteDiagnosisCaseID are explicitly identified.

INSTALL
HF8 manifest/Drive authorization must remain installed.
Replace Code.gs only.

CHANGED
REPLACE:
- apps-script/Code.gs
- distribution/Code.gs
ADD:
- tests/product5100_rc820_hf82_deep_resume_recovery_test.js

UNCHANGED
- appsscript.json from HF8
- Drive Artifact logic
- Shared
- Site Diagnosis
- SIMS Merge
- Writer / Creator
