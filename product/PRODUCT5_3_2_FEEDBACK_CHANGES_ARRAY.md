# Product 5.4.0 — Feedback Changes Forward Compatibility

## Purpose

SIMS Writer v1.0.0以降が出力する `changes` 配列形式を受け入れ、従来のオブジェクト形式との後方互換性を維持します。

## Accepted structures

### Legacy object flags

```json
"changes": {
  "seo_title": true,
  "internal_links": false
}
```

### V2 array details

```json
"changes": [
  {
    "target": "internal_link",
    "before": "変更前",
    "after": "変更後",
    "reason": "変更理由",
    "expected_effect": "期待効果"
  }
]
```

`change_flags` が存在する場合は配列から推定した変更フラグと統合します。未知のフィールドと未知の変更対象はエラーにせず、元JSONを改善履歴へ保存します。

## Target aliases

- `internal_link` / `internal_links`
- `meta_description` / `description`
- `heading` / `headings`
- `image` / `images`
- `title` / `article_title`

## Required validation

- `format` が `SIMS_FEEDBACK_V数字`
- `article_id` または記事URL
- `changes` がオブジェクトまたは配列

未知の追加項目は許容します。
