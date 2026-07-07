# SIMS-Blog-Manager Product 5.0 RC2

Search Consoleのデータを、今日やるべきブログ改善タスクへ変換するGoogleスプレッドシートシステムです。

## 今回の変更（3行）

- Search Consoleクエリを「サブクエリ・FAQ・別記事候補・除外クエリ」に分類します。
- 別記事候補を「記事ネタ候補」シートへ自動保存します。
- 改善ブリーフをSIMS-Core / Claudeへ貼り付けやすい改善指示書形式に改善しました。

## 更新

- GitHub：必要
- Apps Script：必要
- シート修復：必要
- スプレッドシート作り直し：不要
- deploy.yml：更新不要

## 更新手順

1. GitHubへZIP内のファイルを上書きアップロードします。
2. Apps Scriptの`Code.js`を貼り替えます。
3. スプレッドシートで「SIMS-Blog-Manager → 管理 → シートを作成・修復」を実行します。
4. 「今日のデータを取得・分析」を実行します。

## 追加された主なシート

- 記事ネタ候補
  - 別記事候補クエリを保存します。
  - SIMS-Core / Claudeへ新記事作成を依頼する材料として使えます。

## 方針

SIMS-Blog-ManagerはSearch Consoleデータの整理・分類・管理までを担当します。SERP分析や競合分析、本文の改善・新記事執筆はSIMS-CoreまたはClaude側で行います。
