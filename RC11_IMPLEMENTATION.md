# Product 5.0 RC11 実装概要

RC11は、初回の実運用テストで判明した改善点を反映したリリースです。

## 主な変更

1. 改善ナビの依頼文名称を「AIでリライトするための依頼文」へ統一。
2. SIMS AI Protocol v1.1を採用。
3. 記事DBでモニター中の記事を最上位に表示。
4. 選択記事の改善履歴をポップアップで確認可能。
5. 改善結果登録完了時の処理内容を明示。
6. 「改善中」シートを廃止し、記事DBの作業状態へ統合。

## AI改善結果の追加項目

- `version`
- `improvement_type`
- `confidence`
- `expected_effect`
- `next_action`
- `kept_sections`

旧SIMS_FEEDBACK_V1のJSONも引き続き受け付けます。
