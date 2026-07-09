# Changelog

## Product 5.0.0 STEP A Setup Guard Fix

- STEP Aで `sbmIsSetupComplete_ is not defined` が発生する問題を修正
- Search Console高速取得処理とHome UIは維持
- Code.gsのみ差し替えで適用可能

## Product 5.0.0 STEP B Slim DataList Fix
- STEP B分析中に記事ネタ候補・カニバリ診断などの不要シートを生成しないよう修正。
- Search Consoleの生データは内部シート `SearchConsole_Data` に保存し、利用者向け `データ一覧` は記事管理一覧として表示。
- データ一覧の見出しを、記事ステータス・記事URL・H1タイトル・titleタグ・メインクエリ・クリック数・表示回数・CTR・平均順位へ統一。
