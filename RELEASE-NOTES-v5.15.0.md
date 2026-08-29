# SIMS Blog Manager v5.15.0

## Personal Knowledge Separation

This MINOR release formalizes the product-neutral distribution boundary.

- Removed owner/blog-specific names and URLs from active runtime examples and regression assets.
- Replaced hard-coded blog-title suffix normalization with the configured `BlogName`.
- Removed tenant/article-specific Operational Learning records from the embedded Shared compatibility snapshot.
- Generalized production-case examples while preserving test intent and machine contracts.
- Preserved existing sheet structures, stored keys, `SIMS_DOCTOR_*` contracts, Case IDs, Batch IDs, and product routing compatibility.
- Product-specific information is expected to live in external Personal Editorial Knowledge or current operational Evidence, not in the distributable product repository.

No destructive migration of existing SBM user data is required.
