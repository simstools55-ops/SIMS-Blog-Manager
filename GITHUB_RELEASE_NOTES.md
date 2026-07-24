# Product 5.6.0 Stage 1

- Rebuild daily processing from a minimal Search Console fetch-only flow.
- Remove progress polling and legacy multi-state dialog behavior from the active entry point.
- Show fetched rows, valid article URLs, exclusions, and elapsed time until the user closes the dialog.

# Product 5.5.4

日次処理ダイアログの進行表示と完了確認を安定化しました。Search Console取得中、データ分析・処理中、完了結果を明確に表示し、完了後は利用者が「閉じる」を押すまで結果を保持します。Homeは日次処理の状態のみを表示します。
