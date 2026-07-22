# SIMS-Blog-Manager Product 5.4.0 Maintenance

SIMS Writer v1.0.0以降の `changes` 配列形式を登録できるようにし、V1オブジェクト形式との後方互換を維持しました。`change_flags` と未知フィールドも許容します。

- SiteURL命名統一と、シート修復後のHome自動復帰を追加。
# SIMS-Blog-Manager Product 5.3.1 Official

SIMS Writer v1.0.0のSIMS_FEEDBACK_V2へ対応し、将来のProtocolにも追従しやすい前方互換Parserへ更新しました。

## 主な変更

- SIMS_FEEDBACK_V1・V2・V3以降を受け入れ
- 未知フィールドをエラーにしない
- 必須項目のみ厳密チェック
- Feedback FormatとWriter Versionを改善履歴に保存
- V1/V2/未知フィールド付きV2/将来V形式の回帰テスト追加
