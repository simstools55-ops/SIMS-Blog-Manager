# SIMS-Blog-Manager Product 5.4.2 Official

Google Search Consoleのデータを使い、改善する記事の選定、改善結果の記録、7日・14日・21日・28日の改善推移確認をGoogleスプレッドシートで管理する製品です。

## 正式バージョン

`5.4.2`

## 毎日の基本操作

上部メニューは、左から次の順に並びます。

1. **SIMS-Blog-Manager**：Home、日次処理、セットアップ、修復、設定
2. **記事改善スタート**：今日改善する記事の選択と改善詳細の確認
3. **結果登録**：改善結果JSONの登録
4. **推移確認**：改善中の記事と4週間の測定状況の確認
5. **記事一覧**：全記事の確認と並び替え
6. **改善履歴**：終了済みの改善履歴と詳細の確認

## 利用者向け配布物

`distribution/`には、利用開始に必要なファイルだけを収録しています。

- `コード.gs`
- `appsscript.json`
- `SIMS-Blog-Manager-template-Product5.3-Official.xlsx`
- `はじめにお読みください.md`

## 初回導入

1. テンプレートをGoogleドライブへアップロードし、Googleスプレッドシートとして開きます。
2. Apps Scriptの`コード.gs`を配布版の内容で全置換します。
3. `appsscript.json`を設定します。
4. スプレッドシートを再読み込みします。
5. **SIMS-Blog-Manager → シートの作成・修復**を1回実行します。
6. **SIMS-Blog-Manager → 初回セットアップ**から接続設定を進めます。

## 既存スプレッドシートの更新

既存データはそのまま継続利用できます。`コード.gs`を更新して再読み込みし、**シートの作成・修復**を1回実行してください。

## リポジトリ構成

- `apps-script/`：開発・管理用Apps Script
- `distribution/`：利用者向け配布元ファイル
- `docs/`：GitHub Pagesマニュアル
- `product/`：製品仕様・設計資料
- `spreadsheet/`：テンプレートとシート仕様
- `tests/`：テスト手順

## Product 5.4.2 — changes配列対応

SIMS Writer v1.0.0以降の `changes: []` 配列形式と、従来の `changes: {}` オブジェクト形式の両方を登録できます。`change_flags` と未知フィールドも許容し、元JSONを改善履歴へ保持します。

## Product 5.3.1の改善ナビ

改善ナビは、Search Console上位20クエリ、改善優先順位、記事ランク、変更方針、本文JSON、内部リンク候補をまとめてSIMS-Core向け依頼文へ出力します。内部リンク候補には推奨アンカーテキスト、関連クエリ、関連度が付きます。

改善ナビを開くたびに、選択した記事URLを指定してSearch Consoleから最新クエリを取得します。通常は数秒で完了し、取得した上位20件を依頼文と内部リンク候補の再計算に使用します。

SIMS-Coreは候補を採用・保留・不採用に分類し、テキストリンクはHTMLを埋め込んだコピペ可能な完成形で返します。


## Product 5.3.1 — SIMS Feedback Forward Compatibility

改善結果登録は `SIMS_FEEDBACK_V1`、`SIMS_FEEDBACK_V2` および将来の `SIMS_FEEDBACK_V数字` を受け入れます。SBMが利用する必須項目だけを検証し、`learning`、`swls`、`diagnostics`、`reason_codes`、`warning_codes`、`version_candidate` などの未知フィールドはエラーにしません。

改善履歴には内部管理情報として `Feedback Format` と `Writer Version` を保存します。既存データは「シートの作成・修復」で新しい列構成へ移行できます。

Product 5.3.1では、Writer依頼文のサイト情報を `SiteID / SiteName / SiteURL` に統一しました。また、「シートの作成・修復」の完了後はHomeを更新し、Homeへ戻ります。
