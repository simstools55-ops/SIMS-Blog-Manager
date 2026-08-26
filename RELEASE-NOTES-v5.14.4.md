# SIMS Blog Manager v5.14.4

## Changes

- SIMS Doctor 精密診断ダイアログの「この記事を開く」を、Doctor診断結果登録後に Writer / Merge 処置が必要になった場合だけ表示するよう変更。
- Writer / Merge / 利用者確認 / Doctor再診など、新しい入力・選択領域を表示した際、次に押すボタンが見える位置へ自動スクロールするよう改善。
- Writer処置結果登録時の派生シート更新を最適化。改善履歴追加、モニター同期、経路同期で重複していた「改善の推移」再生成を遅延し、Case確定後の1回に集約。
- `sbmRegisterImprovementFeedback` と `sbmAppendImprovementHistory_` に派生画面更新を遅延できる内部オプションを追加。既存呼び出しの動作は維持。
- ZIP内で不一致だった Code.gs（v5.14.2 / v5.14.3）を v5.14.4 の同一内容へ統一。

## Recommended commit message

`fix: optimize Doctor treatment return flow and dialog navigation (v5.14.4)`
