# SIMS Feedback Format v1

`SIMS_FEEDBACK_V1` は、AIで記事改善を行った結果をSIMS-Blog-Managerへ戻すための標準JSON形式です。

利用者はJSONを編集せず、AI回答の末尾からコピーして「改善結果を登録」へ貼り付けます。

## 必須項目

- `format`: `SIMS_FEEDBACK_V1`
- `article_id` または `article_url`
- `changes`
- `summary`

## 推奨項目

- `completed_at`
- `new_values`
- `warnings`
- `estimated_minutes`
- `recommended_review_days`（7、14、30）

## 登録時の処理

1. ArticleIDまたはURLで記事DBと照合
2. 選択中の記事と不一致なら登録停止
3. 変更内容を確認表示
4. 記事DBのタイトル等を必要な項目だけ更新
5. 改善前指標を改善履歴へ保存
6. 作業状態を「モニター中」に変更
7. 効果測定予定日を登録
