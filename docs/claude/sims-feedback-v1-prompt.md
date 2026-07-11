# Claude向け SIMS改善結果 出力指示

この文書は、SIMS-Blog-Managerの「改善ナビ」からClaudeへ記事改善を依頼するときに、回答の最後へ **SIMS改善結果（JSON）** を付けてもらうための標準指示文です。

利用者はJSONを編集する必要はありません。Claudeの回答末尾に出力されたJSON部分を、そのままSIMS-Blog-Managerの「改善結果を登録」へコピー＆ペーストします。

---

## Claudeへ追加する指示文

以下を、記事改善依頼文の末尾へそのまま追加してください。

```text
==============================
SIMS連携用 出力指示
==============================

記事の改善が完了したら、回答の最後に必ず
「SIMS_FEEDBACK_V1」形式のJSONを1つ出力してください。

【重要】

1. JSONは ```json と ``` で囲んでください。
2. JSONコードブロックの中には、コメントや説明文を入れないでください。
3. true / false は半角小文字で記載してください。
4. 値が不明または該当しない場合は null を使用してください。
5. article_id と article_url は、依頼文に記載された値を変更せず、そのまま返してください。
6. 変更していない項目は false にしてください。
7. new_values には、実際に変更した後の値だけを入れてください。
8. recommended_review_days は 7、14、30 のいずれかにしてください。
9. JSONの前後に「SIMS改善結果」などの見出しを付けても構いませんが、JSON自体は必ず有効なJSONにしてください。

出力形式：

{
  "format": "SIMS_FEEDBACK_V1",
  "article_id": "",
  "article_url": "",
  "completed_at": "YYYY-MM-DD",
  "improvement_type": "minor",
  "changes": {
    "article_title": false,
    "seo_title": false,
    "description": false,
    "introduction": false,
    "headings": false,
    "faq": false,
    "body": false,
    "internal_links": false,
    "images": false
  },
  "new_values": {
    "article_title": null,
    "seo_title": null,
    "description": null,
    "main_query": null
  },
  "estimated_minutes": 0,
  "recommended_review_days": 14,
  "summary": "",
  "warnings": []
}

【improvement_type のルール】

- minor：タイトル、SEOタイトル、メタディスクリプションなどの軽微な改善
- normal：導入文、見出し、FAQなどを含む通常の改善
- major：記事構成や本文を大幅に変更する改善

【recommended_review_days の目安】

- minor：7日
- normal：14日
- major：30日

【summary】

今回行った改善内容を100文字以内で簡潔にまとめてください。

【warnings】

利用者へ伝える注意事項がある場合だけ、文字列の配列で記載してください。
注意事項がない場合は空配列 [] にしてください。

【最終確認】

回答を終了する前に、次を確認してください。

- format が SIMS_FEEDBACK_V1 になっている
- article_id と article_url が依頼文と一致している
- JSONとして構文エラーがない
- 変更していない項目が false になっている
- new_values に変更後の値が正しく入っている
```

---

## Claudeの出力例

```json
{
  "format": "SIMS_FEEDBACK_V1",
  "article_id": "A000123",
  "article_url": "https://example.com/sample-article",
  "completed_at": "2026-07-11",
  "improvement_type": "normal",
  "changes": {
    "article_title": true,
    "seo_title": true,
    "description": true,
    "introduction": true,
    "headings": true,
    "faq": true,
    "body": true,
    "internal_links": false,
    "images": false
  },
  "new_values": {
    "article_title": "変更後の記事タイトル",
    "seo_title": "変更後のSEOタイトル",
    "description": "変更後のメタディスクリプション",
    "main_query": "メインクエリ"
  },
  "estimated_minutes": 25,
  "recommended_review_days": 14,
  "summary": "検索意図に合わせてタイトルと導入文を修正し、見出しとFAQを追加しました。",
  "warnings": [
    "内部リンク候補が見つからなかったため追加していません。"
  ]
}
```

---

## SIMSへ戻す手順

1. Claudeの回答末尾にあるJSONコードブロックだけをコピーします。
2. SIMS-Blog-Managerで「改善結果を登録」を開きます。
3. コピーしたJSONを貼り付けます。
4. 「内容を解析」を押します。
5. 対象記事と変更内容を確認します。
6. 「この内容で登録」を押します。

SIMSは登録後、記事DBの固定情報更新、改善履歴の保存、Beforeデータの保存、作業状態の「モニター中」への変更、効果測定予定日の設定を行います。
