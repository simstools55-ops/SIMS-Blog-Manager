# SIMS-Blog-Manager v5.14.8

## 今回の修正

### 精密診断候補 STEP 3 のタイムアウト対策
- `Doctor_精密診断候補` を毎回削除・新規作成せず、既存シートを再利用します。
- 重症度・指標色のセル単位更新を廃止し、一括 `setBackgrounds` / `setFontColors` に変更しました。
- 候補作成直後のチェックボックス再読込・再設定を省略しました。
- `autoResizeRows` を固定行高へ変更し、Spreadsheetサービス負荷を削減しました。
- STEP 3失敗時にSpreadsheetログ書込みを重ねないようにし、二次タイムアウトを防ぎます。

### バージョン同期
- 正式版: **v5.14.8**
- `Code.gs` / `Code.base.gs` / `VERSION` / `PRODUCT_IDENTITY.json` / `shared/PRODUCT_IDENTITY.json` / READMEを同期しました。
- `Code.gs` 内の旧5.14.x版番号付き履歴コメントを整理し、現行版との誤認を防止しました。
- `distribution/SIMS-Blog-Manager-v5.14.4/` の旧配布物を削除しました。

## Apps Script適用
`Code.gs` を差し替えて保存し、Spreadsheetを再読み込みしてください。

## 確認
「SIMS Doctor → 精密診断候補を準備」を実行し、STEP 3が完了して `Doctor_精密診断候補` が表示されることを確認してください。

## 推奨コミットメッセージ
`fix(sbm): optimize Doctor candidate rebuild and synchronize release version to v5.14.8`
