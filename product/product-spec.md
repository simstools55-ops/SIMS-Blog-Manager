# Product Specification: SIMS-Blog-Manager Product 2.2

## Goal

Google Search Consoleデータから、ブログ改善に必要なURL、メインクエリ、参考クエリ、改善候補を提示する。

## Scope

- Search Console integration
- Article cards
- Query analysis
- Diagnosis codes
- Today's improvement
- Improvement log
- Effectiveness measurement

## Out of Scope

- Claude integration
- AI Exchange
- Knowledge Engine
- Learning Engine


## Setup UX

Product 2.2では、ブログ名とSearch Console Propertyをポップアップで入力し、Google Cloud API設定後は専用メニューから接続テストへ進みます。
## Product 5.0 Official 固定仕様

- 改善候補は最大10件保持する。
- 「今日の改善」は初期2件を表示し、2件ずつ最大6件まで追加表示できる。
- 改善の推移は改善後7日・14日・21日・28日の4回測定する。
- 28日目の測定後に最終判定を記録し、通常運用へ戻す。

