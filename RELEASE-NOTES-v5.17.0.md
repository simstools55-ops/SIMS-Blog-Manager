# SIMS Blog Manager v5.17.0

## Personal Knowledge Writer

SBM now contains the common writer/gate for Personal Knowledge.

- Accepts standardized `knowledge_candidate` / `knowledge_candidates`.
- Resolves SITE candidates to the current immutable Personal Knowledge site_id.
- Applies conservative AUTO_ACCEPT / CANDIDATE / REJECT admission.
- Rejects empty, low-confidence, transient-metric, and secret-like knowledge.
- Writes OWNER, SITE, and CROSS_SITE knowledge to their correct Google Drive JSON registry.
- Deduplicates by semantic key instead of blindly appending.
- Reconfirmation updates timestamps/counts; a repeated candidate can be promoted to ACCEPTED.
- Writer errors are non-blocking and are logged instead of stopping normal SBM operation.

This release adds the common storage gate only. Product-specific candidate emission is introduced
incrementally so existing Doctor/Writer/Creator/Merge response contracts remain backward compatible.
