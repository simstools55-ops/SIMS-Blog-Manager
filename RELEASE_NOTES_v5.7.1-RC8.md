# SIMS-Blog-Manager Product 5.7.1 RC8

## Doctor Evidence Validation

- Evidenceごとに `VALID / WARNING / ERROR / EMPTY / NOT_SUPPORTED` を付与
- Evidence Score（100点満点）を追加
- Doctor Readiness（診断可能・限定診断・再取得必要）を追加
- 半年健康診断の集計値と180日の日別推移の整合性を自動検査
- 表示実績があるのにクエリが0件の場合を注意として検出
- URL末尾スラッシュの違いを考慮してSearch Consoleを再照会
- 改善履歴がない記事の比較期間を「無効」ではなく「対象外」として扱う
- 利用者向け案内は日本語、内部コードはContract内に限定
