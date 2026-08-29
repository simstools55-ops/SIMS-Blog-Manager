# SIMS-Blog-Manager v5.18.1

Personal Knowledge automatic-bootstrap hotfix.

The first real Article Doctor candidate-ingestion test exposed a silent gap: Doctor result registration succeeded, but the persistent `SIMS-Personal-Knowledge` Drive store was not created when site context resolution failed. v5.18.1 initializes the store first, resolves site identity from the trusted SBM Doctor request, and accepts Article Doctor confidence labels such as `MEDIUM`. Same-case replay remains non-promoting.

Recommended commit:
`fix(sbm): initialize personal knowledge store automatically (v5.18.1)`
