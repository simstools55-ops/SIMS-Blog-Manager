# SIMS-Blog-Manager Product 5.0 RC8.1

RC7をベースに、RC8の「上位ページ診断」を再実装したリポジトリ版です。

## 今回の変更

- RC7の処理ログ・改善中管理・タイムアウト対策を維持
- 上位ページ診断をSTEP Cとして追加
- Homeに上位ページ診断サマリーを追加

## 更新

- GitHub: 必要
- Apps Script: 必要
- シート修復: 必要
- deploy.yml: 更新不要

## 更新手順

1. GitHubへこのZIPの内容を上書きアップロード
2. `apps-script/Code.js` をApps Scriptへ貼り替え
3. 保存
4. スプレッドシートで「SIMS-Blog-Manager → 管理 → シートを作成・修復」
5. 必要に応じて「STEP C 上位ページ診断」を実行
