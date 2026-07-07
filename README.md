# SIMS-Blog-Manager Product 5.0 RC4

Search Consoleデータをもとに、今日改善すべき記事、改善ブリーフ、改善ログ、効果測定を管理するGoogleスプレッドシートシステムです。

## RC4の主な変更

- 効果測定に「SIMS評価」を追加
- 効果測定に「次のアクション」を追加
- 7日間の日次測定結果から、改善成功・様子見・再改善の判断をしやすく改善

## 更新

- GitHub：必要
- Apps Script：必要
- シート修復：必要
- deploy.yml：更新不要

## 更新手順

1. GitHubへZIP内容を上書きアップロード
2. `apps-script/Code.js` をApps Scriptへ貼り替え
3. 保存
4. スプレッドシートで「SIMS-Blog-Manager → 管理 → シートを作成・修復」を実行
5. 「効果測定を更新」または「テスト用：今日の測定を記録」を実行
