# SIMS Blog Manager v5.18.0

## Personal Knowledge 実学習サイクル
- Article Doctor結果の `knowledge_candidates` を診断結果登録時にKnowledge Writerへ渡す。
- Personal Knowledgeへの保存失敗は診断結果登録やWriter/Merge紹介状生成を止めない。
- `confirmation_event_id` を使い、同一Case JSONの再貼付では独立確認回数を増やさない。

## Site Doctor UI整理
- 精密診断候補シートの見出しを「SIMS Site Doctor 精密診断候補」に変更。
- 説明文で「候補抽出=Site Doctor / 1記事の精密診断=Article Doctor」を明示。
- 「Site Doctor診断結果の処置を進める」を番号なしの補助操作へ移動。

## Compatibility
- 既存の `SIMS_DOCTOR_*`、物理シート名、内部関数名、SiteID契約は変更しない。
- `knowledge_candidates` がない従来Doctor結果も従来どおり処理する。
