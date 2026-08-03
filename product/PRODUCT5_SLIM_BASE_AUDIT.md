# Product 5.0 Official Slim Base コード監査

## 実施日

2026-07-12

## 対象

- `apps-script/Code.gs`
- ベース: Product 5.0 Release 1 Sprint 1

## 監査結果

| 項目 | 整理前 | 整理後 | 差分 |
|---|---:|---:|---:|
| 行数 | 7,602 | 6,056 | -1,546 |
| ファイル容量 | 441,504 bytes | 342,586 bytes | -98,918 bytes |
| 関数定義数 | 424 | 348 | -76 |
| 関数名の種類 | 348 | 348 | 変更なし |
| 同名関数の再定義 | 76 | 0 | -76 |

## 実施内容

RC版で後方へ追加されていた同名関数について、JavaScript / Apps Scriptで実際に有効になる最後の定義だけを残し、上書きされていた旧定義を削除した。

今回の整理では関数名そのものは削除していない。既存のメニュー、ボタン、トリガー、HTMLダイアログから呼び出される可能性がある公開関数・互換関数は維持した。

## 主な整理対象

- `onOpen`: 8定義から1定義へ整理
- `sbmShowRepairCompletionNavigator_`: 6定義から1定義へ整理
- `sbmStyleEffectSheetV2_`: 6定義から1定義へ整理
- `sbmOpenImprovementHistory`: 5定義から1定義へ整理
- `sbmStyleHistorySheetV2_`: 5定義から1定義へ整理
- `sbmInitializeSheets`: 4定義から1定義へ整理
- `sbmArticleDbDetailHtml_`: 4定義から1定義へ整理
- `sbmApplySelectionUi_`: 4定義から1定義へ整理
- その他、同名再定義をすべて整理

詳細な旧定義位置は `PRODUCT5_SLIM_AUDIT.json` を参照。

## 検証

- Node.js `--check` によるJavaScript構文チェック: 合格
- 同名トップレベル関数の再検索: 0件
- 整理前後の固有関数名: 348件で一致
- 配布構成: `apps-script/Code.gs` 1ファイルを維持

## 今回削除していないもの

コード内からの参照が見つからない関数であっても、次の経路から直接呼ばれる可能性があるため、今回は削除していない。

- スプレッドシートの画像・図形ボタン
- カスタムメニュー
- Apps Scriptトリガー
- HTMLダイアログの `google.script.run`
- 旧スプレッドシートとの互換呼び出し

未使用関数候補の削除は、実際のスプレッドシートでボタン・メニュー・トリガーを確認した後の第2段階で行う。
