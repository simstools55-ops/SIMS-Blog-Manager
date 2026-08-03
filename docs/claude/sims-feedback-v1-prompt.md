# SIMS Feedback Protocol（V1以降）

SIMS-Blog-Manager Product 5.3.0は、改善結果JSONを前方互換で受け入れます。

## 受け入れるformat

- `SIMS_FEEDBACK_V1`
- `SIMS_FEEDBACK_V2`
- `SIMS_FEEDBACK_V3` 以降の `SIMS_FEEDBACK_V数字`

`learning`、`swls`、`diagnostics`、`reason_codes`、`warning_codes`、`version_candidate`など、SBMが利用しない新しい項目が追加されてもエラーにはなりません。

## 必須項目

SBMは改善結果登録に必要な最低限だけを検証します。

- `format`：`SIMS_FEEDBACK_V数字`
- `article_id` または `article_url` のどちらか
- `changes`：オブジェクト

その他の項目は、存在する場合だけ取り込みます。

## 推奨出力例（V2）

```json
{
  "format": "SIMS_FEEDBACK_V2",
  "version": "2.0",
  "writer_version": "1.0.0",
  "article_id": "A000123",
  "article_url": "https://example.com/article",
  "completed_at": "2026-07-19",
  "changes": {
    "article_title": false,
    "seo_title": true,
    "description": true,
    "introduction": true,
    "headings": false,
    "faq": true,
    "internal_links": true,
    "body": true,
    "images": false
  },
  "new_values": {
    "article_title": "",
    "seo_title": "変更後SEOタイトル",
    "description": "変更後メタディスクリプション",
    "main_query": "メインクエリ"
  },
  "improvement_type": "normal",
  "confidence": "high",
  "expected_effect": {"ctr": "CTR改善", "clicks": "クリック増加"},
  "next_action": "monitor",
  "summary": "実施した改善の要約",
  "warnings": [],
  "estimated_minutes": 20,
  "recommended_review_days": 14,
  "learning": {},
  "swls": {},
  "diagnostics": {},
  "reason_codes": [],
  "warning_codes": []
}
```

未知フィールドは読み飛ばしますが、元JSONは改善履歴へそのまま保存されます。
