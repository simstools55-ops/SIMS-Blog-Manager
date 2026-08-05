# Product 5.3.0 Feedback Protocol UAT

## 必須テスト

1. `SIMS_FEEDBACK_V1`を登録できる。
2. `SIMS_FEEDBACK_V2`を登録できる。
3. V2に`learning`、`swls`、`diagnostics`、`reason_codes`、`warning_codes`、`version_candidate`を追加しても登録できる。
4. `SIMS_FEEDBACK_V7`など将来formatも登録できる。
5. 未知formatは拒否される。
6. article_idとarticle_urlの両方がない場合は拒否される。
7. changesがない場合は拒否される。
8. 改善履歴へFeedback FormatとWriter Versionが保存される。
9. V1登録、V2登録とも記事管理・改善履歴・モニター状態の更新が完了する。
