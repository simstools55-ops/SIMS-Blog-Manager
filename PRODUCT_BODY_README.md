# SIMS-Blog-Manager Product 5.0.0

## 製品本体

- スプレッドシート：`spreadsheet/` 内のテンプレート
- Apps Script：`apps-script/Code.gs`
- Manifest：`apps-script/appsscript.json`

## 今回の確認ポイント

1. `Code.gs` をApps Scriptへ貼り替える。
2. 必要に応じて `appsscript.json` も反映する。
3. STEP AでSearch Consoleデータ取得を実行する。
4. STEP Bで改善候補分析を実行する。
5. 分析中に `記事ネタ候補`、`カニバリ診断`、`上位ページ診断`、`効果測定`、`測定履歴` が作成されないことを確認する。
6. `データ一覧` が次の見出しで表示されることを確認する。
   - 記事ステータス
   - 記事URL
   - H1タイトル
   - titleタグ
   - メインクエリ
   - クリック数
   - 表示回数
   - CTR
   - 平均順位

Search Console取得処理は高速化済みの動作実績版を維持しています。
