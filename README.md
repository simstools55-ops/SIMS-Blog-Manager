# SIMS-Blog-Manager Product 5.0 RC1

Search Consoleのデータから、今日改善すべき記事を抽出し、Claude / ChatGPTへ渡せる改善ブリーフを作成するブログ改善管理システムです。

## Product 5.0 RC1の主な変更

- 改善ブリーフをSEO改善指示書形式へ強化
- Search Consoleクエリ最大50件を分類
  - メインクエリ
  - 本文に使うサブクエリ
  - FAQ候補
  - 別記事候補
  - 改善に使わない除外クエリ
- カニバリ診断シートを追加
- カニバリ発生時の対応アドバイスを追加
  - どちらの記事を主記事にするか
  - もう一方のメインクエリ変更
  - 統合検討
  - 経過観察
- 測定履歴の記事タイトル表示を改善
- 順位・CTR・クリック数・表示回数の数値表示を統一

## 更新方法

既存スプレッドシートはそのまま使用できます。

1. `apps-script/Code.js` の内容をApps Scriptへ貼り替えます。
2. Apps Scriptを保存します。
3. スプレッドシートに戻り、メニューから `SIMS-Blog-Manager → 管理 → シートを作成・修復` を実行します。
4. `今日のデータを取得・分析` を実行します。

## 更新要否

| 項目 | 必要 |
|---|:---:|
| GitHub更新 | ✅ |
| Apps Script更新 | ✅ |
| スプレッドシート作り直し | ❌ |
| シート修復実行 | ✅ |

## Commit

Title:

```text
Release Product 5.0 RC1
```

Description:

```text
- Add Search Console query classification for up to 50 queries
- Add sub query, FAQ, separate article, and noise query grouping
- Add cannibalization diagnosis and action advice
- Improve improvement brief for Claude and ChatGPT
- Fix measurement history article title display
- Standardize position, CTR, clicks, and impressions formats
```
