# APPLY v5.14.13

Replace the deployed `Code.gs` with `distribution/Code.gs`, save, and reload the spreadsheet.

Confirm the following user-facing terminology:
1. `SIMS Site Doctor` menu is shown for site-wide health diagnosis.
2. Article-level precision diagnosis uses `Article Doctor`.
3. Precision-diagnosis dialog progress says `Article Doctorへ依頼` and `Article Doctor回答を登録`.
4. Site-wide Writer/Merge result messages say `Site Doctor経路`.

No sheet migration is required. Existing data and JSON contracts remain compatible.
