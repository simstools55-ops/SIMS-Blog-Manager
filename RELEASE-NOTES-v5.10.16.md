# Release Notes — SIMS Blog Manager v5.10.16

Live testing showed that nine individual Doctor results could keep a single Apps Script
execution running for more than five minutes.

v5.10.16 processes the same Doctor response in two-case chunks. Each chunk is a fresh
google.script.run execution, resetting the Apps Script execution window between chunks.

For nine cases the UI reports:
2/9 -> 4/9 -> 6/9 -> 8/9 -> 9/9.

The v5.10.15 REF-* URL-to-official-ArticleID resolution remains unchanged.
