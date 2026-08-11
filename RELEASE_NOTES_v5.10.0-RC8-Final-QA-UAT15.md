# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT15

## Scope
表示メニューの軽量化と「今日の改善」完了済み残留の回帰修正。

## Fixes
- 「改善の推移を開く」は既存シート表示だけに変更。開くたびの履歴修復・全件再計算を廃止。
- 「改善履歴を開く」は既存シート表示だけに変更。Doctor過去案件自己修復・履歴修復・一覧再構築を廃止。
- シート未作成の初回だけ正規生成処理を実施。
- 日次処理で記事管理が「モニター中」の記事を「今日の改善」候補JSON・表示シートから明示的に除外。
- 「今日の改善」候補上限の内部実装をUI仕様どおり最大10件へ統一。
- 健康診断は427記事で実機完走済みのため、RC8 Finalでは変更せず凍結。

## Regression IDs
- REG-VIEW-EFFECT-LIGHTWEIGHT-001
- REG-VIEW-HISTORY-LIGHTWEIGHT-001
- REG-TODAY-COMPLETED-CLEANUP-001
- REG-TODAY-MAX10-001
