# Product Body README

## Update target

- Replace Apps Script with `apps-script/Code.gs`.
- Existing spreadsheet can continue to be used.
- Running sheet creation/repair is not required for this patch.
- deploy.yml update is not required.

## Fix

All `sbmSheetObjects_` references were removed and replaced with the current row-reader helper.

## 今回の製品本体

- `apps-script/Code.gs`
- `apps-script/appsscript.json`

既存スプレッドシートは継続使用できます。管理メニューの「シートを作成・修復」を1回実行し、記事DBの追加列とHomeの進捗欄を反映してください。
