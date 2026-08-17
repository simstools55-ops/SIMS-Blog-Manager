# Release Notes — SIMS Blog Manager v5.10.17

## Visible one-case staged Doctor import

v5.10.16 split multi-case Doctor imports but field testing showed that users still could
not see progress reliably.

v5.10.17 processes one case per Apps Script execution and displays a fixed modal progress
overlay immediately after the registration button is pressed.

For nine cases the visible sequence is:
0/9 -> 1/9 -> 2/9 -> ... -> 9/9.

The overlay includes a progress bar and shows how many records were completed if an error
occurs. REF-* URL resolution and multi-CASE_RESULT extraction remain unchanged.
