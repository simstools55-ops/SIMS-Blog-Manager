# Release Notes — SIMS Blog Manager v5.10.15

## Site Diagnosis individual batch identity bridge

Collector / Diagnosis does not own SBM's internal A000xxx ArticleID. When Diagnosis sends
a URL-surrogate ID such as REF-77A871E500, SBM resolves the matching local article by URL
and substitutes the official local ArticleID before any write.

SiteID and URL checks remain mandatory. If the URL does not resolve safely, registration stops.

## Multi-case Doctor answer import

Doctor prose containing several fenced SIMS_DOCTOR_CASE_RESULT_V2 JSON objects can be
pasted once. SBM extracts all case results, preflights every identity, then registers the
batch and creates Writer/Merge/Creator/Monitor actions.
