# SIMS-Blog-Manager Product 4.5 RC3

Google Search Consoleのデータを使い、毎日のブログ改善タスクを提示するGoogleスプレッドシートシステムです。

## Product 4.5 RC3の主な変更

- URLがドメイン以下だけになり、記事が開けない問題を修正
- 今日の改善・改善ログで記事タイトルを分かりやすく表示
- 改善ログの見やすさを改善
- 効果測定をRCテスト用に7日間の毎日確認へ対応
- 測定履歴シートを追加

## 更新方法

既存スプレッドシートはそのまま利用できます。

1. `apps-script/Code.js` をApps Scriptへ貼り替える
2. 保存する
3. スプレッドシートを再読み込みする
4. メニュー「SIMS-Blog-Manager」→「管理」→「シートを作成・修復」を実行する
5. 「今日のデータを取得・分析」または「効果測定を更新」を実行する

## Commit message

```text
Release Product 4.5 RC3
```

```text
- Fix URL normalization and article link handling
- Improve article title display in logs
- Redesign improvement log layout
- Add 7-day daily measurement mode for RC testing
- Add measurement history sheet
- Improve effectiveness sheet readability
```
