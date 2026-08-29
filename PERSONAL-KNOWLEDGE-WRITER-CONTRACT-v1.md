# Personal Knowledge Writer Contract v1

Products may optionally return:

```json
{
  "knowledge_candidates": [
    {
      "candidate_id": "KCAN-...",
      "scope": "SITE",
      "site_id": "SITE-...",
      "knowledge_type": "ARTICLE_RELATIONSHIP",
      "statement": "Reusable, stable knowledge statement",
      "confidence": 0.82,
      "source_product": "SIMS Article Doctor",
      "source_type": "INFERENCE",
      "evidence_refs": ["CASE-..."]
    }
  ]
}
```

`knowledge_candidate` (single object) is also accepted.

SBM owns admission and persistence. Products must not directly edit live Personal Knowledge files.
Legacy responses without these fields remain valid and simply produce no Personal Knowledge update.
