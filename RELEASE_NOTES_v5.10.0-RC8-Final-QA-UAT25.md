# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT25

## UAT24 real-sheet evidence
- STEP1: 16 sec
- STEP2: 42 sec
- STEP3: 46 sec
- Total: 2m18s
- STEP3 details:
  - History before: 1 sec
  - Effectiveness update: 12 sec
  - History after: 1 sec
  - Completion-state save: 12 sec
  - Home refresh: 14 sec
  - Final settings / cleanup: 19 sec

## Root cause targeted
Settings access was row-scanning the Settings sheet for each individual key.
STEP3 completion wrote many keys one-by-one, and Home read multiple keys one-by-one.

## Fix
- Add batch Settings read (`sbmGetSettingsMap_`).
- Add batch Settings write (`sbmSetSettingsBatch_`).
- Completion date/status keys are written in one batch.
- Daily runtime Properties remain atomic, while Settings mirror values are written in one batch.
- STEP3 timing/settings are written in one batch.
- Home loads Settings once and reuses the map for blog identity, daily status, runtime fallback, and rank-arrow baselines.

## Frozen
- STEP1/UAT23 work-sheet reuse
- STEP2 behavior
- Doctor / Health / Today / Trend / History
- onOpen fast menu
- STEP3 measurement logic and output

## Expected target
For the 427-article blog:
- Completion-state save: ideally 1-4 sec
- Home refresh: ideally under 8 sec
- Final settings / cleanup: ideally 2-6 sec
- STEP3 target: about 20-30 sec
- Total daily processing target after this pass: about 1m40s-2m00s
