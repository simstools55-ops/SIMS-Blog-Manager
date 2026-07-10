# Product Body README

## Update target

- Replace Apps Script with `apps-script/Code.gs`.
- Existing spreadsheet can continue to be used.
- Running sheet creation/repair is not required for this patch.
- deploy.yml update is not required.

## Fix

All `sbmSheetObjects_` references were removed and replaced with the current row-reader helper.
