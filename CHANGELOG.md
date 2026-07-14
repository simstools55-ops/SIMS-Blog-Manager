
## 5.3.1 - Action menu and compact Home

- Reorganized menus around user actions.
- Added manual daily processing under the Management menu.
- Added article-list sorting by rank, work status, clicks, impressions, CTR, position, and last update.
- Changed the Home rank summary to a three-row, two-column layout with missing articles in the lower-right cell.

## Product 5.0 Official Home Compact / Daily URL Review

- Homeへ記事ランク件数と ↗・→・↘ の前回比を追加
- Home下部の処理状況を、処理名・開始時刻・処理結果・お願いの4項目へ簡素化
- 起動時の日次更新確認を、その日の未実行時だけ表示するよう整理
- Search Console未取得URLを、3回連続または14日以上で「要確認」と判定
- データ未取得・要確認の記事を改善候補から除外

## Product 5.0 Official Reset Base - Candidate Limit

- 改善候補の保持上限を10件に固定
- 今日の改善を初期2件・最大6件に固定
- 効果測定を7日・14日・21日・28日の4回測定として仕様統一
- 配布物の文字化けファイル名を修正

# Changelog

## 5.2.0 - Home Dashboard Evolution

- Homeの「ブログの現在地」コメント欄と「今日の改善状況」件数欄をコンパクト化し、画面全体を見渡しやすく調整
- Search Consoleと重複するクリック数・表示回数・平均掲載順位・推移グラフをHomeから削除
- 記事DBの記事ランク分布を基準に、ブログ全体の現在地を判定
- 内部の記事ランク名を画面に出さず、自然で短い日本語に変換
- 現在地、次に目指す地点、今日のブログメッセージを記事の育ち方と改善状況から生成
- アクセスのあるブログに初期段階向けの表現が出にくい判定へ改善
- 今日の改善状況に励みになるコメントを表示
- 改善候補が不足する場合も最大2件まで補充する既存ロジックを維持

## 5.1.0

- 改善ナビを開く際に記事URLから本文を自動取得
- 導入文・見出し・本文を `SIMS_ARTICLE_SOURCE_V1` JSONへ構造化
- 自動取得できない場合の本文貼り付け解析を追加
- Claude向け依頼文へ現在の記事本文データを埋め込み
- 本文データを最大50,000文字に制限し、過大な依頼文を防止


## 5.0.2

- 今日の改善の追加表示が実際の表示件数を参照するよう修正
- 完了登録後に表示件数がずれる問題を修正
- 「初期表示に戻す」が確実に初期件数へ戻るよう修正

## 5.0.0-official-rc3.1-feedback-menu-fix

- 改善結果JSON登録機能へのメニュー入口を復元。
- 今日の改善操作・記事操作・記事DBツールバーからJSON登録画面を開けるよう修正。
# Product 5.0 Official RC2

- 改善履歴の詳細画面を、既存の「改善計画・実施した改善・改善効果」の構成を維持したまま拡張
- 改善効果を「改善前と現在の比較・4週間の効果測定・最終判定」に分割
- 未測定の週も予定日付きで表示
- 測定済みの週は測定日時・判定・SIMS寸評を表示
- 1～4週目の表示から改善提案を除外し、最終判定時だけ表示
- 記事の全改善履歴の日付表示を日本語形式へ統一

## Product 5.0 Release 1 Sprint 3.3

- 測定延長が改善効果更新後に元へ戻る根本原因を修正
- 推奨確認日数を延長後の日数へ同期
- 見出し直接上書きによる列ずれリスクを除去

# Product 5.0 RC11 History Detail Readability Fix

- 改善履歴詳細の変更後データをAI改善結果JSONから補完
- 欠損項目を「ー」で統一表示
- 改善前指標を項目別カードで表示し、クリック・表示回数は整数カンマ、CTR・順位は小数第1位で表示
- 改善履歴一覧の記事タイトル・改善概要を折り返し表示


## 5.0.0 RC11 Today Default Fix

- 今日の改善2件が起動時に表示されない問題を修正
- シート作成・修復後と記事DB日次更新後にも初期2件を再生成
- 厳格条件で候補不足の場合の補欠選定を追加
# Changelog

## Product 5.0 RC11 Startup Today & Work Colors

- シート作成・修復完了ダイアログの3ボタンが動作しない問題を修正。
- 起動時に記事DBの保存済み数値から「今日の改善」上位2件を自動作成。
- 記事DBのモニター中行を淡い青、今日の改善行を淡い黄色で表示。
- 外部ページ取得を行わず、起動時の処理負荷を抑制。

# Product 5.0 RC11 Startup Prompt / Flat Menu Refactor

- スプレッドシートを開くたびに記事DB更新確認を表示
- 最終更新日時を確認画面へ表示
- 「更新する」「今回は更新しない」を利用者が毎回選択
- 日付による1日1回の確認制御を廃止
- 手動の記事DB更新メニューを維持
- 主要メニューをサブメニューなしの1階層表示へ整理
- 記事DB操作へ手動並べ替えを追加
- シート作成・修復後と日次更新後に記事DBを正式順で並べ替え

# Product 5.0 SIMS Feedback Protocol v1

- 改善ナビのClaude依頼文末尾に `SIMS_FEEDBACK_V1` JSON出力ルールを追加
- 「改善結果を登録」ダイアログを追加
- JSON解析・記事照合・登録前確認を実装
- 記事DBの固定情報更新、作業状態のモニター中移行、改善前指標保存を実装
- 新シート「改善履歴」を追加
- 7日・14日・30日の効果確認予定日に対応

# Changelog

## 5.0.0 Today Improvement V1

- 「改善ブリーフ」を利用者向け名称「改善ナビ」へ変更
- 記事DBだけから「今日の改善」を作成する新方式を実装
- 即効性上位3件とCTR改善上位3件を重複なしで選抜
- 初期2件、メニュー操作で4件・6件へ段階表示
- 改善理由と期待効果、予想時間をコンパクト表示
- 選択記事の改善ナビをHTMLポップアップで表示
- 旧改善ブリーフ・旧ブログ診断・別ブログデータは参照しない


## 5.0.0-operation-refactoring-stage1

- 旧「今日の改善」「改善ブリーフ」「ブログ診断」のメニューと自動生成を停止
- 旧シート（今日の改善、改善ブリーフ、ブログ診断、データ一覧、SearchConsole_Data）を修復時に削除
- Homeの旧おすすめ表示を停止し、記事DB直結版の再構築中表示へ変更
- 記事ランク再判定で不足していた `sbmPercentileRank_` を追加
- 別ブログの旧データやサンプル情報がHomeに表示される経路を遮断
# Changelog

## 5.0.0 Article Rank / Work State

- 記事DBの評価と作業状況を分離
- 「記事ランク」と「作業状態」を追加
- 旧記事ステータスからの安全な移行処理を追加
- 日次更新後に記事ランクを再計算
- 作業状態は日次更新で保持
- Home集計を記事ランク・作業状態ベースへ変更
- 記事ランク再判定メニューを追加

## Product 5.0 Home / Daily Management State

- Homeを記事DB基準の「記事ランク」と「作業状態」集計へ変更
- Home上部へブログ名・ブログURL・総記事数・最終日次更新を追加
- 1日の最初の起動時に日次更新の実行／見送りを選択するダイアログを追加
- 日次更新に現れない既存URLは削除せず、連続未取得日数を内部管理
- 30日以上データ未取得の記事数をHomeへ表示
- 新規記事を記事DBへ追加した際、記事情報補完を促すダイアログを追加
- 管理用列（最終確認日・連続未取得日数・管理フラグ）は記事DB上で非表示

## Product 5.0 ArticleDB Compact & Home Insight

- 日次更新開始ダイアログを現行の記事DB差分更新仕様に修正
- 記事DBを「エース → 安定 → 成長 → 育成 → 低迷」の順に整理
- 記事DBを日常確認項目だけのコンパクト表示へ変更
- SEOタイトル、メタディスクリプション、最終取得日時、備考、ArticleID、補完管理情報を記事詳細ポップアップへ移動
- Homeに前回日次更新との差分と「ブログの現在地」コメントを追加

## 5.0.0 Operation Refactoring Stage 2 UI Fix

- シート作成・修復中に旧「今日の改善」「改善ブリーフ」「ブログ診断」を一時生成しないよう修正
- 記事DBの列幅・行高・折り返しを日常閲覧向けに調整
- 記事詳細を確実に開けるプルダウン式ボタンへ変更
- onSelectionChangeによるワンクリック表示も補助動作として維持

## Product 5.0 ArticleDB One-Click Detail

- 記事DBの詳細列をプルダウンから「🔍 記事詳細」のボタン風セルへ変更
- 詳細セルを選択したときに記事詳細ポップアップを表示
- 選択トリガーが利用できない場合に備え、「データ更新 → 選択記事の詳細を開く」を追加
- 記事DBの詳細列に残っていたデータ入力規則を削除

## Product 5.0 ArticleDB Selected Row Detail

- 不安定なセルクリック・プルダウン起動を廃止
- 記事DBで対象行を選択し、上部メニュー「記事DB → 選択記事の詳細を開く」から確実に表示する方式へ統一
- 記事詳細ポップアップの作業状態コメントを、記事ランクと組み合わせた着手判断へ強化
- 記事DBの詳細列は操作手順を示す案内表示へ変更

## Product 5.0 ArticleDB Toolbar

- 記事DB専用の常設サイドバーツールバーを追加
- 選択記事の詳細表示と記事URL表示をボタン操作に統一
- 上部メニューにも同じ操作を残し、二つの操作経路を併用
- 改善ブリーフ・効果測定・改善完了は今後の実装位置としてツールバーに準備中表示

## Product 5.0 ArticleDB Action Dropdown

- 記事DBの「詳細」列を操作プルダウンへ変更
- インストール型 onEdit トリガーで「記事DB詳細を開く」を確実に実行
- 「記事を開く」を実装
- 改善ブリーフ・効果測定・改善完了は将来用の名称のみ追加
- 操作後は自動的に「操作を選択」へ戻す

## Product 5.0 ArticleDB Menu Only

- 記事DBの操作プルダウンを廃止
- インストール型編集トリガーと ScriptApp 権限を削除
- 記事DBの対象行を選択して上部メニューから操作する方式へ統一
- 記事DB詳細と記事を開く機能を維持
- 改善ブリーフ・効果測定・改善完了の将来メニューを追加
- 詳細列を非表示化し、記事DB一覧を簡潔化

## Product 5.0 ArticleDB Operation Menu Fix

- Google Sheets上部に独立したトップメニュー「記事DB操作」を追加。
- 選択記事の詳細表示で発生していた `sh.getLastColumn is not a function` を修正。
- 記事DB詳細関数の重複定義を整理し、選択中の「記事DB」シートと行を正しく渡す方式へ統一。
- 旧セルプルダウン・編集トリガーには依存しない安定操作へ統一。
- 改善ブリーフ、効果測定、改善完了は将来実装用メニューとして名称を維持。

## 5.0.0 RC10 Reset Base

- Home・今日の改善・改善ナビのメニュー呼び出し先を再統合
- `sbmOpenHome` など未定義参照を解消
- 旧互換呼び出しを現行の記事DB直結処理へ接続
- 関数監査を追加し、`sbm...` 未定義参照 0件を確認
- 新機能は追加せず、既存基盤の安定化に限定

## Product 5.0 RC11 — 実運用フィードバック反映

- 改善ナビ内の名称を「AIでリライトするための依頼文」へ変更。
- SIMS AI Protocol v1.1に対応し、改善規模・確信度・期待効果・次のアクションを改善履歴へ保存。
- Claude、ChatGPT、Gemini、Copilotなど任意のAIで共通利用できる依頼文へ更新。
- 改善結果登録後に、記事DB更新・改善履歴作成・モニター開始・効果確認予定を明示。
- 記事DBの並び順を、モニター中、改善中、今日の改善、通常記事の順に変更。
- 記事DB操作メニューへ「選択記事の改善履歴を見る」を追加。
- 空の「改善中」シートを廃止し、作業状態を記事DBへ一本化。
- 旧改善中シートを再生成する互換処理を停止。


## Product 5.0 RC11 — Repair Navigator / Hidden Admin Sheets

- 「シートの作成・修復」完了画面を、実施内容と現在状況を示すナビゲーターへ変更。
- 完了画面から「ブログのセットアップ」「記事DBを更新」「そのまま使う（HOMEへ）」を選択可能。
- 記事DBのURL列を折り返し表示へ変更し、長いURLの見切れを防止。
- 設定・処理ログは通常時非表示とし、上部メニューから開いた時だけ表示。

## Product 5.0 RC11 History & Effectiveness V1

- 改善履歴シートをコンパクト一覧へ再構成
- 改善履歴の詳細ポップアップを追加
- 記事単位の全改善履歴表示を追加
- 効果測定シートを新規実装
- 改善前と現在のCTR・順位・クリック・表示回数を比較
- 大きく改善／改善／横ばい／悪化／測定待ちを自動判定
- モニター7日延長と測定完了操作を追加
- 詳細項目を非表示列に保持し、上部メニューから表示

## 5.0.0 RC11 Selection Workflow

- 「記事DB」を利用者向け名称「記事管理」へ変更
- 一択チェックボックスによる一覧操作を追加
- シート・メニューの利用順を整理
- 新規記事の初回強調表示を追加
- 効果測定予定日の補完処理を追加
- 修復完了ナビゲーターの画面遷移を修正

## Product 5.0.0 RC11 - History / Effectiveness Reliability Fix

- 改善履歴の非破壊修復と旧改善ログからの復元を追加。
- 効果測定を「改善効果」へ改称し、モニター中の記事から一覧を再生成。
- 一択チェックボックスの反応速度を改善。
- 修復完了ナビゲーターの画面遷移を修正。

## Product 5.0 RC11 Detail Popup Naming and Metrics Fix

- 効果測定詳細ポップアップを「改善効果の詳細」へ改称。
- 改善効果の数値を小数第1位、CTRをパーセント表示へ統一。
- 記事管理の詳細ポップアップを「選択記事の詳細」へ改称。
- 選択記事の詳細から改善ナビを開くボタンを追加。
- 詳細表示の空欄は「ー」で統一。


## RC11 Japanese Date Time / Dialog Close Fix
- Date objects and long GMT strings are displayed in Japanese user-friendly format.
- Example: `2026年7月25日（土）朝9:00`.
- Added a visible `閉じる` button to modal dialogs, while retaining the top-right close icon.
- Article, history, and effectiveness detail views use the same date formatter.

## RC11 Improvement History / Effect Link
- New improvement registrations receive a unique `改善履歴ID` such as `H000001`.
- The same ID is written into the corresponding improvement-effect record.
- Improvement-history detail now includes a button to open the exact linked improvement-effect detail.
- Old history rows without an ID are not guessed or searched; they show `対応する改善効果データはありません。`.
- The link is one improvement event to one effect record, enabling future analysis of which changes produced results.


## RC11 Improvement Plan / Result / Effect Unified History
- Added hidden `改善計画JSON` and kept `改善履歴ID`.
- New registrations save an Improvement Navi plan snapshot.
- History detail now combines plan, actual changes, and effect in one dialog.
- Old data is not guessed; unavailable sections show an explicit message.
- Renamed menu item to `改善詳細（改善ナビ）`.


## RC11 Today checkbox / Article header / History refresh fix
- Removed checkboxes from blank rows in Today Improvement.
- Article Management header changed to navy background with white text.
- Repair now explicitly refreshes Improvement History and Improvement Effect.
- Added SpreadsheetApp.flush() after repair to commit the refreshed display.


## RC11 Improvement History List Rebuild After Repair
- Rebuilds the Improvement History list after sheet repair without deleting saved history.
- Reapplies visible columns, widths, wrapping, row heights, checkboxes, and newest-first order.
- Refreshes effect judgement by Improvement History ID.
- Rebuilds the list again whenever the Improvement History sheet is opened.


## RC11 UI / Effect / Article navigation reliability fix
- Added the missing Article Management row-color function.
- Wrapped Improvement History dates and measurement dates.
- Restored Improvement Effect header styling and corrected numeric formats.
- Changed Home label to `最終更新日時` and unified Japanese date/time display.
- Fixed Article Detail to Improvement Navi transition.
- Removed Article menu items: sort, browser open, and all history.


## RC11 Article detail HTML / Repair navigator time fix
- Rebuilt Article Detail as a complete HTML document.
- Removed unsafe inline URL embedding that caused malformed HTML errors.
- Fixed the Article Detail to Improvement Navi action.
- Repair completion navigator now uses the same Japanese date/time format as Improvement History.


## RC11 Improvement Effect checkbox / Repair close button fix
- Recreated Improvement Effect selection cells as standard boolean checkboxes.
- Removed legacy invalid validation and string TRUE/FALSE values.
- Added an explicit Close button to the repair completion navigator.


## RC11 Repair navigator immediate close / Measurement time fix
- Repair navigator closes immediately after any action button is clicked.
- Measurement review times are standardized to 09:00 JST.
- Existing date-only measurement dates are displayed as 09:00 JST to prevent timezone drift.


## RC11 Today Improvement checkbox cleanup fix
- Today Improvement checkboxes are now created only on rows with an article title.
- Removed lingering checkboxes from blank rows, formatted rows, and rows with hidden internal values only.


## RC11 Today Improvement strict rebuild fix
- Clears all body cells, formats, and validations before rebuilding Today Improvement.
- Creates checkboxes only for displayed recommendation rows.
- Removes stale blank-row checkboxes permanently.


## RC11 Setup wizard restore fix
- Restored a complete STEP1-STEP5 setup navigator.
- `ブログをセットアップ` now launches the setup workflow instead of only opening the Setup sheet.
- Repair completion setup button now opens the same setup navigator.


## RC11 Developer hidden-sheets menu
- Added a Developer menu to show, hide, and list internal sheets.
- Added one-line switch `SBM_ENABLE_DEVELOPER_MENU`.
- Set the switch to `false` for the Product distribution build.


## Product 5.0 Release 1 Sprint 1
- Replaced the setup list with a sequential STEP1-STEP6 wizard.
- Added Execute, Skip, and End actions to every setup step.
- Removed setup-sheet switching from the wizard flow.
- Added a dedicated Blog Information Change dialog.
- Reduced the main user menu to Home, Initial Setup, Blog Information Change, and Repair.
- Moved Process Log actions into the Developer menu.

## Product 5.0 Official Release 1 Sprint 2 - 2026-07-12

- Apps Scriptの同名関数再定義76件を削除
- `Code.gs`を7,602行から6,056行へスリム化
- 固有関数名348件と配布用単一ファイル構成を維持
- `product/PRODUCT5_SLIM_BASE_AUDIT.md`を追加
- `product/PRODUCT5_SLIM_AUDIT.json`を追加

## Product 5.0 Release 1 Sprint 3

- 初回セットアップ最終STEPの名称・説明を改善
- 今日の改善の最大6件表示文言と上限通知を修正
- 改善効果詳細に比較日を追加
- 7日延長の日付書式と改善履歴同期を修正
- Home処理状況へ今日の改善・測定延長を反映
- 記事の全改善履歴へ閉じるボタンを追加

## Product 5.0 Release 1 Sprint 3.1

- 7日延長後に改善履歴の測定予定日が更新されない問題を修正。
- 履歴ID不一致時のArticleID・URL・改善日フォールバック照合を追加。
- 延長後の改善履歴再構築関数名を修正。
- 履歴同期失敗時の通知を正確化。

## Product 5.0 Release 1 Sprint 3.2

- 7日延長後に改善履歴の測定予定日が戻る問題を修正
- 延長後に改善履歴と改善効果の見出し・日付書式を再適用
- 改善履歴を正本として改善効果を再生成する同期方式へ変更

## Product 5.0 Release 1 Sprint 4

- 効果測定を7・14・21・28日の4回測定へ変更
- 7日延長機能を廃止
- 改善履歴に4回分の測定日時・判定を保存
- 改善効果の次回予定日を週次で自動更新
- 28日目の測定後に自動完了

## Product 5.0 Release 1 Sprint 5

- 4週間効果測定モデルを正式スキーマとして強制適用。
- 起動時と「シートを作成・修復」実行時に改善履歴・改善効果を新仕様へ移行。
- 旧「7日間延長」「測定完了」メニューを完全除去。
- 改善履歴の旧「測定予定日」を実測日時へ誤変換しないよう修正。
- バージョン情報メニューを追加。
- 配布パッケージから旧分割ソース `src/` を除外。

## Product 5.0 Official RC1

- 改善履歴一覧から4回分の測定日時を非表示化し、1週～4週の判定欄へ整理
- 測定日時と各週のSIMS寸評を詳細ポップアップへ移動
- 週次寸評から改善提案を除外
- 4週目終了後にのみ最終総括と改善提案を生成
- 旧「1回目判定～4回目判定」「最新判定」から新スキーマへ移行

## Product 5.0 Official RC3 Performance

- 改善履歴の「開く」から全件再構築・再書式設定を除外
- 改善効果の「開く」から効果測定更新・全体書式設定を除外
- 起動時のシート移行をスキーマバージョン判定方式へ変更
- 起動時の「今日の改善」再計算を、保存済み表示がある場合は省略
- 記事管理更新時の重複並べ替えを1回へ統合
- Home処理状況のセル書込みを一括更新へ変更
- 記事管理の行背景色を行単位書込みから一括書込みへ変更
- 処理プロファイル追記時の全列自動調整を廃止

## Product 5.0.1

- 改善結果登録（JSON）の入口をメニューと記事DBツールバーに統一
- 改善ナビ下部に「改善完了を登録」ボタンを追加
- 完了登録後の「今日の改善」を選択不可・グレー表示へ変更