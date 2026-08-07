# Product 5.10.0-RC4 — Writer Result Dialog Hotfix

## Problem
The precise diagnosis modal retained the backend Writer result registration API and the Doctor menu command, but the in-dialog textarea/button for returning `SIMS_WRITER_TREATMENT_RESULT_V1` had been removed during the RC2/RC3 presentation work.

## Fix
- Restore step ④ `Writer処置結果をSBMへ返す` in the precise diagnosis modal.
- Keep the field visible so the complete Doctor → SBM → Writer → SBM workflow can be completed from one dialog.
- Reuse one validation/storage path for both the modal and the fallback menu command.
- Reject Doctor JSON and non-Writer result formats exactly as before.

## Regression contract
The precise diagnosis modal must contain all four human workflow steps:
1. Doctor request copy
2. Doctor result registration
3. Next referral copy
4. Writer treatment result registration
