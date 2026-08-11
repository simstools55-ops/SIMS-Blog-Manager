# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT22

## Real-sheet evidence from UAT21
- STEP1 total: 1m53s
- Search Console API: 1s
- URL processing: 1m44s
- Work-sheet save: 1s
- STEP2 ended around 3m24s from start
- STEP3 completed around 4m00s from start

## Root cause targeted
`sbmClassifyArticleDbStatus_()` read `MinImpressions` from the Settings sheet once per article.
With about 426 valid article URLs, the same Settings lookup was repeated hundreds of times.

## Fix
- Read MinImpressions once at STEP1 preparation.
- Pass the cached value to every article classification.
- Keep fallback Settings lookup only for callers that do not provide the cached value.
- Split STEP1 display into:
  API / URL normalization / existing-state read / article classification / sort / work-sheet save.
- Add STEP2 internal timing for the next performance pass:
  progress-state write / work read / DB merge / candidate selection / Today sheet / work-state write.
- No changes to Doctor, Health, UAT17 Today-open fast path, UAT18 views, or UAT21 onOpen.

## Target for ~427 articles
- STEP1 target after this fix: 20-40 seconds.
- If article classification remains over ~20 seconds, continue profiling inside classification.
- STEP2 remains a profiling target; no broad behavior change in UAT22.
