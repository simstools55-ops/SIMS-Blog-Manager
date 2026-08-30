# SIMS-Blog-Manager

> **Current product:** SIMS-Blog-Manager v5.19.0  
> **Version policy:** `vX.Y.Z` (major.minor.patch)  
> **Shared Editorial Knowledge:** v3.5.0

## Current release

- Product Version: `5.19.0`
- Shared Version: `3.5.0`
- Repository Type: `Product`
- Release type: `PATCH`
- Main feature: Home表示を軽量化し、起動時の日次処理状態を日付境界で正しく更新。Personal Knowledgeの一時指標フィルターも精密化します。

> Current release: SIMS-Blog-Manager Product v5.19.0

## Product 5.6.12 — 改善推移指標・Homeモニター表示

- 改善の推移はクリック数と表示回数を比較表示します。
- Homeにモニター中の記事の判定別件数をコンパクトに表示します。
- Homeの高さは従来どおり24行に維持します。

## Product 5.6.11 — 運用改善

- 改善の推移を経過日数の多い順に表示
- クリック重視・経過日数考慮の段階判定へ更新
- 保存済みBefore／Afterの「修正前を確認」を追加
- 今日の改善は候補10件を保持し、初期5件・1～10件で表示設定

## Product 5.6.10 — Search Console列マッピング緊急修正

Search Consoleのページデータを記事DBへ渡す配列にH1タイトル用の空欄を追加し、数値4項目の列ずれを修正しました。異常値を検出した場合はDB更新を停止します。

# SIMS-Blog-Manager v5.19.0

Google Search Consoleのデータを使い、改善する記事の選定、改善結果の記録、7日・14日・21日・28日の改善推移確認をGoogleスプレッドシートで管理する製品です。

## 正式バージョン

`5.18.2`

## Creatorで作った新記事の登録

Creatorで新記事を公開したら、`SIMS-Blog-Manager` → `Creatorで作った新記事を登録` を開き、Creatorの回答全文（JSONを含む）を貼り付けて登録します。SBMは公開URL・Creator案件・SiteIDを検証し、Search Consoleにまだ現れていない記事も `検索露出待ち` / `👀 モニター中` として管理します。後日GSCに同じURLが現れたときは、既存ArticleIDへ実績を合流させます。

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

- `Code.gs`
- `appsscript.json`
- `SIMS-Blog-Manager-template-Product5.3-Official.xlsx`
- `README-FIRST.md`

## 初回導入

1. テンプレートをGoogleドライブへアップロードし、Googleスプレッドシートとして開きます。
2. Apps Scriptの`Code.gs`を配布版の内容で全置換します。
3. `appsscript.json`を設定します。
4. スプレッドシートを再読み込みします。
5. **SIMS-Blog-Manager → シートの作成・修復**を1回実行します。
6. **SIMS-Blog-Manager → 初回セットアップ**から接続設定を進めます。

## 既存スプレッドシートの更新

既存データはそのまま継続利用できます。`Code.gs`を更新して再読み込みし、**シートの作成・修復**を1回実行してください。

## リポジトリ構成

- `apps-script/`：開発・管理用Apps Script
- `distribution/`：利用者向け配布元ファイル
- `docs/`：GitHub Pagesマニュアル
- `product/`：製品仕様・設計資料
- `spreadsheet/`：テンプレートとシート仕様
- `tests/`：テスト手順


## Product 5.6.9 — 改善の推移の表示強化

- 現在順位と改善前順位を小数第1位で表示
- 判定をステータス別に色分けして視認性を改善
- シートを開くたびに書式を再適用


## Product 5.6.8 — 記事一覧H1表示・改善の推移表示修正

- 記事一覧で、保存済みH1タイトルをメインクエリとクリック数の間に表示
- 改善の推移で現在順位と判定まで必ず表示
- 日次処理や外部取得処理は変更なし

## Product 5.6.7 — SIMS Writer Contract v4.2対応

改善結果登録は `publication_result.public_ok_changes` を最優先で解析し、存在しない場合のみ旧 `changes` を利用します。`publication_result.user_decision_changes` と `publication_result.change_summary` は改善履歴へ保存します。過去のWriter JSONとの後方互換性を維持しています。

## Product 5.4.3 — changes配列対応

SIMS Writer v1.0.0以降の `changes: []` 配列形式と、従来の `changes: {}` オブジェクト形式の両方を登録できます。`change_flags` と未知フィールドも許容し、元JSONを改善履歴へ保持します。

## Product 5.3.1の改善ナビ

改善ナビは、Search Console上位20クエリ、改善優先順位、記事ランク、変更方針、本文JSON、内部リンク候補をまとめてSIMS-Core向け依頼文へ出力します。内部リンク候補には推奨アンカーテキスト、関連クエリ、関連度が付きます。

改善ナビを開くたびに、選択した記事URLを指定してSearch Consoleから最新クエリを取得します。通常は数秒で完了し、取得した上位20件を依頼文と内部リンク候補の再計算に使用します。

SIMS-Coreは候補を採用・保留・不採用に分類し、テキストリンクはHTMLを埋め込んだコピペ可能な完成形で返します。


## Product 5.3.1 — SIMS Feedback Forward Compatibility

改善結果登録は `SIMS_FEEDBACK_V1`、`SIMS_FEEDBACK_V2` および将来の `SIMS_FEEDBACK_V数字` を受け入れます。SBMが利用する必須項目だけを検証し、`learning`、`swls`、`diagnostics`、`reason_codes`、`warning_codes`、`version_candidate` などの未知フィールドはエラーにしません。

改善履歴には内部管理情報として `Feedback Format` と `Writer Version` を保存します。既存データは「シートの作成・修復」で新しい列構成へ移行できます。

Product 5.3.1では、Writer依頼文のサイト情報を `SiteID / SiteName / SiteURL` に統一しました。また、「シートの作成・修復」の完了後はHomeを更新し、Homeへ戻ります。


## SIMS Article Doctor 記事診断連携（5.7.0 RC2）

選択した1記事について、独立製品SIMS Article Doctor向けの診断依頼JSONを手動生成できます。日次処理や記事ランクには接続していません。