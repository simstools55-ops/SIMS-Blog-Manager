# UAT43 - Cache-Bypass STEP5 Diagnostic

## Why
UAT42 measured 24/24 cache hits, so the previous ~38 second uncached article retrieval could not be reproduced.

## Change
Only the diagnostic-only runner now calls:
`sbmFetchArticleMetaInfoBatch_(urls, {bypassCache:true})`

Normal STEP5 still calls:
`sbmFetchArticleMetaInfoBatch_(urls)`

Therefore production behavior is unchanged.

## Diagnostic result
UAT43 can now measure:
- true fetchAll network wait for uncached articles
- HTML post-processing cost
- article retrieval total
- query retrieval total

## Safety
- Maximum 24 article URLs
- No Article DB writes
- No setup-state changes
- Cache bypass applies only to diagnostic execution
- Responses are still written into the normal cache after successful retrieval
