# Product 5.5.0

日次処理の長時間スピナー、応答停止判定、記事ランク計算性能を改善しました。既存System_Logへ工程ログを追加し、追加権限なしで手動続行できます。

# SIMS-Blog-Manager Product 5.4.3 Maintenance

日次処理の自動継続で発生したScriptApp権限エラーを修正しました。時間主導トリガーを使用せず、安全時間に達した場合は処理位置を保存して、ダイアログの「続きを実行」から再開します。

## 主な変更

- `ScriptApp.getProjectTriggers()` / `newTrigger()` / `deleteTrigger()`への依存を削除
- 日次処理のフェーズと一時データを保存し、「続きを実行」で再開
- 処理中は回転スピナー、進捗率、現在工程を表示
- 認証やSearch Console設定が必要な場合は具体的な操作案内を表示
- 初回セットアップのSiteID・SiteName非表示、Home未実施の赤文字表示を維持
