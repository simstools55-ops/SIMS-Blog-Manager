# SIMS Blog Manager v5.14.7

- Merge結果の吸収元ArticleIDについて、配列形式 `absorbed_article_ids` だけでなく単数形式 `absorbed_article_id`、`merged_article.absorbed_from_article_ids`、merge_plan側の情報も認識するよう修正。
- v5.14.6以前に保存済みで確認詳細に吸収元が残っていないCaseでも、`Merge結果JSON` から吸収元を再構築して「301統合済み・管理対象外」へ事後補正できるよう修正。
- A900019 → A900022 のような既処置Merge案件を再補正可能。
