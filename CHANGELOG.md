# Changelog

## Product 5.0.0 - Legacy Feature Removal

- Product 5.0 Officialのスリム化方針に合わせ、記事カルテ・カニバリ診断・記事ネタ候補・上位ページ診断を現行コードから除去しました。
- STEP B改善候補分析は、データ一覧・ブログ診断・今日の改善・改善ブリーフ・改善中・Home・処理ログのみを対象にします。
- 効果測定・測定履歴は次フェーズ実装予定として保留し、現段階では自動生成・自動実行の対象外にしました。

## Product 5.0.0 STEP B Profiling Dev

- STEP B改善候補分析に開発用の処理プロファイルを追加。
- 処理プロファイルシートに工程別の所要秒を記録。
- STEP Aの取得件数がDailyFetchMaxRows上限に到達したかをログへ記録。
