# SIMS Blog Manager v5.19.2

## Writer result recovery / idempotent registration

- Added `記事改善スタート → 3．Writer回答を登録・再登録`.
- Writer feedback can be registered after a timeout or an accidentally closed dialog.
- Re-submitting the exact same Writer result is idempotent: an existing improvement-history record is detected and no duplicate history is created.
- If a previous timeout updated only the article note, retry avoids duplicating the same summary note.
- Existing normal improvement flow remains unchanged.
