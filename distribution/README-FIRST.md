# SIMS-Blog-Manager v5.14.12

## 今回の修正

### 精密診断候補 STEP 3 のタイムアウト対策
- `Doctor_精密診断候補` を毎回削除・新規作成せず、既存シートを再利用します。
- 重症度・指標色のセル単位更新を廃止し、一括 `setBackgrounds` / `setFontColors` に変更しました。
- 候補作成直後のチェックボックス再読込・再設定を省略しました。
- `autoResizeRows` を固定行高へ変更し、Spreadsheetサービス負荷を削減しました。
- STEP 3失敗時にSpreadsheetログ書込みを重ねないようにし、二次タイムアウトを防ぎます。


### 選択・記事管理・Merge運用
- 「選択」チェックボックスは単一選択へ統一し、新しくチェックした行以外は自動解除します。
- 記事一覧から、noindex・非公開等を「管理対象外」にし、必要時には通常管理へ戻せます。
- 管理対象外状態は日次処理でも保持し、改善・Doctor・内部リンク候補へ混入させません。
- 301非対応ブログでは、Merge吸収記事を「統合済み（リダイレクト不可）」として管理対象外へ移せます。

### バージョン同期
- 正式版: **v5.14.12**
- `Code.gs` / `Code.base.gs` / `VERSION` / `PRODUCT_IDENTITY.json` / `shared/PRODUCT_IDENTITY.json` / READMEを同期しました。
- `Code.gs` 内の旧5.14.x版番号付き履歴コメントを整理し、現行版との誤認を防止しました。
- `distribution/SIMS-Blog-Manager-v5.14.4/` の旧配布物を削除しました。

## Apps Script適用
`Code.gs` を差し替えて保存し、Spreadsheetを再読み込みしてください。

## 確認
「SIMS Site Doctor → 精密診断候補を見る」を実行し、STEP 3が完了して `Doctor_精密診断候補` が表示されることを確認してください。

## 推奨コミットメッセージ
`refactor(sbm): clarify Article Doctor and Site Doctor roles (v5.14.12)`
