# SIMS-Blog-Manager Product 5.10.0-RC8 Doctor Candidate / Worklist UX Hotfix

## Purpose
RC8実機確認で判明したDoctor系シートの役割不明瞭・一覧性低下を修正する。

## Changes
- `Doctor_精密診断紹介状` を利用者向けの `Doctor_精密診断候補` として扱う。
- 候補一覧を「選択 / 優先 / 記事タイトル / 選定理由 / 状態」の5列Human Viewへ整理。
- `診断理由` の長い定型文を廃止し、記事ごとのSearch Console推移から短い `選定理由` を生成。
  - クリック減少率
  - 表示回数減少率
  - CTR
  - 平均順位
  - 長期停滞
- 記事タイトル・選定理由は一覧表示では折り返さず、行高を固定して一覧性を優先。セル値の全文は保持する。
- `Doctor_診断状況` は `Doctor_対応一覧` へ移行し、利用者が次に行う作業を確認する一覧として簡素化。
- Doctor系シート上部の「現在地」「次に行うこと」の多段説明を廃止し、1行タイトル + 1行説明へ圧縮。
- 旧シート名は開いた際に可能なら新シート名へ移行し、コード側は後方互換を維持。
- メニューを `4．精密診断候補を見る` / `6．Doctor対応一覧を確認する` に変更。

## Compatibility
- Doctor / Writer / SBM連携ロジックは変更しない。
- シート列6以降の内部管理データは維持し、非表示のまま使用する。
- 型付き列への `setNumberFormat()` は使用しない。
- シート再作成やデータ移行は不要。

## QA
- Product 5.10.0 RC1-RC8 JavaScript regression tests PASS.
- Apps Script syntax check PASS.
- `apps-script/Code.gs` and `distribution/Code.gs` are identical.
