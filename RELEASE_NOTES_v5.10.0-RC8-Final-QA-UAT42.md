# UAT42 - STEP5 HTML Post-Processing Profiling

UAT41 proved that 24 HTTP fetches complete in about one second while article retrieval as a whole takes about 38 seconds.

UAT42 measures the local processing performed after fetchAll:
- response getContentText
- title tag extraction
- article title selection
- title cleanup
- meta description extraction/cleanup
- cache write
- total post-processing per article

The diagnostic table is sorted by slowest post-processing URL.

This is measurement-only:
- No Article DB write
- No setup state change
- Retrieval semantics unchanged
