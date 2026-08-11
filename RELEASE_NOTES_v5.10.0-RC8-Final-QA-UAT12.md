# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT12

- Fixed the long-running progress dialog server entrypoint.
- `google.script.run` now calls public `sbmRunProgressWorker`, not private `sbmRunProgressWorker_`.
- Detailed diagnosis candidate progress can advance from STEP 1/3 to STEP 2/3 and STEP 3/3.
- No changes to already-passed Health Staged Runner or Doctor candidate identity logic.
