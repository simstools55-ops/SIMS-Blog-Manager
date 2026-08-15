## 5.10.2 - 2026-08-15

- Fixed Doctor V2 contract extraction regression from v5.10.1.
- Result matching now checks `format`, `contract_name`, and `envelope.contract_name` independently.
- Verified JSON-only and full-response registration paths for Doctor / Writer / Merge.
- Formal version advanced from v5.10.1 to v5.10.2.

## 5.10.1 - 2026-08-15

- Doctor V2の `format` と `contract_name` が異なる正式ケースを正しく識別するよう結果抽出を修正。

- Formal product version normalized to `v5.10.1` using the three-number `vX.Y.Z` policy.
- Removed the separate `SBM_DISPLAY_VERSION`; Home and the version dialog now use `SBM_VERSION`.
- Fixed full-response extraction for Writer, Site Diagnosis Doctor, and Merge result registration.
- JSON-only result registration remains backward compatible.
- Synchronized all maintained `Code.gs` copies and current release metadata.

## 5.10.0-RC8.21 - 2026-08-15

- Consolidated Site Diagnosis / Merge hotfixes through HF8.11.
- Fixed stale primary ArticleID in Merge registration completion message.
- Removed internal HF labels from end-user dialog text.
- Home now displays `v5.10.0`; internal build remains `5.10.0-RC8.21`.
- Merge completion uses two user checks: publish merged primary article + configure 301 redirect.
- Merge treatment dialog clearly distinguishes and opens primary vs absorbed articles.
- Preserved automatic Drive artifact storage and safe retry.
- Preserved Site Diagnosis resume recovery.
- Added release QA for generated dialog JavaScript syntax.

## 5.10.0-RC8.14 - 2026-08-14

- Unified Site Diagnosis Doctor intake and Writer return into one treatment-flow dialog.
- Added an article-open action and a persistent Close button for UI consistency.
- Preserved legacy Writer-return entry point as a compatibility wrapper.
- Synchronized VERSION, runtime, distribution, product identity, and current release notes to 5.10.0-RC8.14.

## 5.10.0-RC8.12 - Site Diagnosis Writer Return Hotfix
- Added `6．Site DiagnosisのWriter処置結果を受け取る` to the SIMS Doctor menu.
- Writer responses are received in a non-blocking HTML modal; full Writer output or the result JSON can be pasted.
- The Site Diagnosis CaseID / BatchID stored in `Doctor_Cases` is validated before accepting the Writer result.
- Reused the existing Writer result transaction to update improvement history, article monitoring state, effectiveness tracking, and review schedule.
- Added SiteID / ArticleID mismatch guards and preserved the existing Site Diagnosis trace chain.
- Synchronized the runtime `SBM_VERSION` with RC8.12.

## 5.10.0-RC8.11 - Site Diagnosis Intake Dialog Hotfix

- Site Diagnosis Doctor result intake no longer uses `SpreadsheetApp.getUi().prompt()`.
- Added an HTML modal with a large JSON text area.
- Apps Script runs only after the user clicks the registration button, preventing prompt wait time from consuming the execution limit.
- Registration result and Writer referral are returned to the same dialog.
- Existing Site Diagnosis identity validation, Doctor_Cases trace storage, and Writer handoff behavior remain unchanged.

## 5.10.0-RC8.9
- Version display/identity synchronized across Home, VERSION, product identity, and both Code.gs copies.
- Adopted `major.minor.revision` for stable releases; RC validation uses `-RC<candidate>.<revision>`.
- Preserved Hotfix9 fixes for stale health-run blocking and Writer registration progress feedback.
- Preserved Hotfix8 fixes for internal processing-profile visibility and Today-view redraw reduction.
- Distribution Code.gs is regenerated from apps-script/Code.gs and hash-checked before packaging.

## 5.10.0-RC8 Final QA-UAT13
- 精密診断候補STEP 2から重いDoctor/Writer履歴自己修復・効果測定再計算を分離。
- 記事管理・Doctor Cases・健康診断スナップショットを一括読込し、候補除外をキャッシュ化。
- STEP 3の候補抽出をArticleID/Canonical URLのO(1)判定へ変更し、427記事規模での待ち時間Regressionを修正。


## 5.10.0-RC8 Final Freeze Candidate
- 記事一覧のH1/記事タイトル欠損を相互補完し、日次処理・Doctor一次検査前にも自動修復。
- メインクエリの「取得待ち／検索実績なし」を外部連携用の実クエリと分離。
- Doctor対応一覧を利用者導線から廃止し、改善履歴・改善の推移へ統合。
- Doctor→Writerは記事ランクを変更せず、共通の作業状態で管理。


## 5.10.0-RC8 Unified Improvement Workflow Hotfix
- Doctor対応一覧を廃止し、Doctor経由処置を改善履歴・改善の推移へ統合。
- 改善方法（通常改善 / Doctor→Writer）を履歴・推移へ追加。
- 記事一覧のタイトル・メインクエリ表示の空欄を解消。
- Doctor→Writer処置中は作業状態を「改善中」、結果登録後は「モニター中」として通常改善と共通化。


## 5.10.0-RC8 Doctor Candidate / Worklist UX Hotfix
- Doctor精密診断画面を「候補一覧」に再設計し、記事別の短い選定理由を表示。
- Doctor診断状況を「対応一覧」に簡素化し、一覧性を改善。
- Doctor系シートを1行タイトル + 1行説明へ圧縮。
## 5.10.0-RC8

- RC7で確立したDoctor / Writer / SBM連携ロジックを維持したまま、利用者向けワークフロー表示を最終調整。
- SIMS-Blog-Managerメニューの主要日常操作を「1．Home」「2．日次処理」とし、番号は順番のある操作だけに限定。
- Doctor精密診断ダイアログの進捗表示を、Doctor回答登録・Writer依頼・Writer結果登録まで具体的に表記。
- Doctor診断状況と精密診断紹介状に「現在地」「次に行うこと」を追加。
- 精密診断紹介状と診断状況の列幅を縮小し、横方向の視認性を改善。
- 古いRC12固定のrelease candidate integrity testを現行Product版のVERSION検証へ修正。
- RC8回帰テストを追加し、結果登録メニュー復活、Doctor紹介状退化、配布コード差異を防止。

## 5.10.0-RC7

- 精密診断紹介状を5列Human Viewへ再設計。
- Doctor処置完了記事のグレーアウト・再選択防止。
- Doctor紹介Writer結果を改善履歴・モニタリングへ接続。
- Doctor診断状況画面を追加し、旧Doctor連携状態を置換。
- 独立した結果登録メニューを廃止し、主要メニューへ番号を追加。
- H1 / メインクエリの欠損補完を拡張。

## 5.10.0-RC6

- SBM UI/UX Refresh: Home判定色、健康診断書、精密診断紹介状を読みやすく再設計。
- Doctor再診結果を精密診断ダイアログへ戻せる共通Routerを追加。

# Product 5.10.0-RC1 - Doctor v1.2 Site Impact Evidence

- Doctor Evidence Packageを2.3.0へ更新。
- 直近28日と前28日のサイト全体pageデータを2 API callで集計する `site_impact` を追加。
- Algorithm影響の因果判定はSBMでは行わず、Doctorへ補助Evidenceとして返却。
- Shared Editorial Knowledge 3.4.0のSBM snapshotへ同期。
- 既存のDoctor→SBM→Writer / Creator / Merge routingは変更なし。

---

# Product 5.9.10 - Doctor Routing & Cannibal Evidence Hotfix

- Doctor CASE_RESULT_V2でもworkflow_handoff.next_actionを共通優先し、WRITER紹介状を生成。
- Evidence Package v2.2で主要クエリ最大15件のサイト横断URL比較を追加。
- E009カニバリ候補を対象記事クエリの有無ではなく、実際の他URL表示実績で評価。

# Product 5.9.9 - Doctor Next Action Routing

- `next_action: WRITER`なら、`writer_request_text`がnullでもWriter紹介状を生成。
- 旧形式はreferralsで後方互換。

# Product 5.9.8 - Doctor Workflow Integration

- 精密診断紹介状ダイアログを上下2段化しました。
- Doctor依頼JSONの下に、Doctor診断結果JSONの貼り付け欄を追加しました。
- 診断結果登録直後に、記事本文・GSCクエリ・内部リンク候補・Doctor治療方針を統合したWriter紹介状を自動生成します。
- CaseID・ArticleID・製品別JSON形式を処理開始前に検証し、誤投入を即時停止します。
- Writerが不要な診断では、経過観察または利用者確認の案内へ自動分岐します。
- 大容量のWriter紹介状はセルへ無理に保存せず、同じダイアログ内へ安全に表示します。

# CHANGELOG

## 5.9.6
- Direct Doctor-to-specialist handoff; specialist results return to SBM.

## 5.9.5 - 2026-08-07

- 旧レイアウトの精密診断紹介状を開いた際に「選択」列とチェックボックスを自動追加する互換修正
- Doctor依頼文生成時の列番号固定を廃止し、見出し名から記事ID・記事URLを取得
- 既存シートを継続使用した場合でもチェック選択を認識できるよう改善

# Changelog

## 5.9.4 - 2026-08-07

### Fixed
- ブログ全体の一次検査で、権限不足により `ScriptApp.getProjectTriggers()` が失敗する不具合を修正。
- Doctor健康診断の自動トリガー管理を撤去し、処理時間上限前に安全保存して同じメニューから続行する方式へ変更。
- Apps Scriptで不要なトリガー管理権限を要求しない構成へ復帰。
- Homeに表示される製品バージョンを実際のリリース番号と一致させた。

## 5.9.2 - Doctor Result Registration Compatibility Hotfix

- Doctor v1.0.1 の `SIMS_DOCTOR_SINGLE_CASE_RESULT_V1` を登録可能にしました。
- Doctor回答全文を貼り付けた場合でも、コードブロック内のJSONを自動抽出します。
- 旧 `SIMS_DOCTOR_CASE_RESULT_V2` との後方互換を維持します。
- 登録後に、利用者が次に行う作業を案内します。

## 5.9.1 - Doctor Workflow UX Improvement

- 一次検査完了後に、利用者が次に行う操作を具体的に表示
- 精密診断紹介状から選択記事のDoctor依頼文を直接生成できる導線を追加
- 健康診断書の「次に行うこと」を作業手順形式へ変更
- Doctor_CasesとDoctor治療待ちをシステム専用シートとして非表示化
- 利用者向けの「Doctor_治療案内」シートを追加
- Doctorメニューを実際の作業順に整理

## 5.9.0-rc.1

- Repository IdentityとVersionをProduct 5.9.0 RC1へ整合
- SIMS Shared Editorial Knowledge 3.3.0参照を追加
- Platform_Cases／Platform_Treatments／Platform_Events／Platform_Errorsの非表示シート基盤を追加
- Platform Version／Shared Version／Contract MajorをSettingsへ記録
- Editorial Platform状態確認メニューを追加
- SIMS_FEEDBACK_V2をPlatform Writer Resultへ正規化する後方互換Adapter基盤を追加
- 既存の日次改善、Doctor Case、Writer連携を変更せず維持

## 5.8.0-rc.4

- 従来のトップレベルメニューを完全復元
- 今日の改善・改善の推移・記事一覧・改善履歴を再表示
- Doctor関連機能を独立メニューへ追加
- 全テキストファイルをUTF-8へ再正規化


## 5.8.0-rc.1

- SBM発行CaseIDとDoctor_Casesを追加
- Doctor Case Result V2受付を追加
- Doctor紹介状からWriter治療依頼V1を生成
- Writer治療結果V1のSBM受付を追加
- SBM中心の診断・治療ワークフローを実装



## 5.7.1-rc.10

- Doctor Evidence Package v2へ更新
- Evidence送信前Validationを強化
- RC9までのバージョン表記不整合を修正
- 契約スキーマ、配布コード、静的テストを同期

## 5.7.1 RC9

- Doctor個別診断の180日日別Search Console取得で、ゼロ埋め行を取得成功と誤認する不具合を修正。
- クエリ取得で確認済みの実績URLを日別取得へ引き継ぐよう改善。
- URL候補ごとの取得結果をEvidence Packageへ記録。

## 5.7.1-rc.8

- Doctor Evidence Validation Engineを追加
- Evidence ScoreとDoctor Readinessを追加
- Search Consoleの日別集計不整合とクエリ0件を検出
- URL末尾スラッシュ差異へのフォールバックを追加

## 5.7.1 RC6

- Doctor健康診断書と精密診断紹介状から結合セルを全面廃止
- 既存の結合セルを解除し、固定行・固定列を初期化してから再描画
- 固定行をまたぐ結合による健康診断エラーを根本修正
- 再実行時にも壊れにくい非結合レイアウトへ変更

# Changelog

## 5.9.2 - Doctor Result Registration Compatibility Hotfix

- Doctor v1.0.1 の `SIMS_DOCTOR_SINGLE_CASE_RESULT_V1` を登録可能にしました。
- Doctor回答全文を貼り付けた場合でも、コードブロック内のJSONを自動抽出します。
- 旧 `SIMS_DOCTOR_CASE_RESULT_V2` との後方互換を維持します。
- 登録後に、利用者が次に行う作業を案内します。

## 5.7.1 RC5

- Refined the Doctor health report into a Japanese executive summary.
- Renamed the detailed diagnosis candidate sheet to a referral sheet.
- Added planned examination, user-friendly priorities, and explanatory reasons.
- Preserved compatibility with the previous candidate sheet name.
- Verified repository text files as UTF-8.


## 5.7.1 RC4

- Added a Japanese blog health report sheet.
- Added a reasoned detailed-diagnosis candidate list.
- Separated whole-blog screening from Claude detailed diagnosis.
- Added menu commands to open both result sheets.
- Verified repository text files as UTF-8.


## 5.7.1-rc.3

- Doctor半年健康診断を記事管理の登録URLだけに限定し、未登録URLが件数へ混入する問題を修正。
- モニター中、今日の改善、改善中、SBM改善候補、要確認の記事をDoctor精密診断の対象外に変更。
- 一次検査候補を優先順位順に並べ、精密診断候補を既定10件へ制限。
- 健康診断完了画面を利用者向けの分かりやすい日本語集計へ変更。
- Doctor Health Snapshotの対象選定情報を追加。

# Product 5.7.1 RC2

- Doctor半年健康診断で、シートの日付自動変換によりSearch Console取得が0件になる問題を修正。
- 「開始」「再開」を一本化し、「ブログ全体の健康診断を実行」1回で全区間取得と一次検査まで自動進行。
- RC1で0件のまま進んだ実行は、180日集計から自動的に再取得。
- 進捗表示を「保存済み記事数／登録記事数」に変更。

# 5.7.1 RC1
- Doctor半年健康診断の180日取得・再開・一次検査基盤を追加。
- Doctor専用シートと日本語メニューを追加。

# Changelog

## 5.9.2 - Doctor Result Registration Compatibility Hotfix

- Doctor v1.0.1 の `SIMS_DOCTOR_SINGLE_CASE_RESULT_V1` を登録可能にしました。
- Doctor回答全文を貼り付けた場合でも、コードブロック内のJSONを自動抽出します。
- 旧 `SIMS_DOCTOR_CASE_RESULT_V2` との後方互換を維持します。
- 登録後に、利用者が次に行う作業を案内します。

## 5.7.0-rc.1

- Add manual single-article outpatient request export for SIMS Doctor.
- Keep daily processing, article rank calculation, and improvement workflow unchanged.
- Add JSON Schema and UAT for `SIMS_DOCTOR_SINGLE_CASE_REQUEST_V1`.

## 5.6.12

- 改善の推移の表示指標をCTR・順位からクリック数・表示回数へ変更。
- Homeにモニター中判定別件数と判定説明を追加。
- Homeの縦サイズを維持した横並びレイアウトを採用。

## 5.6.11
- 改善推移の経過日数順、収益重視判定、復元確認、今日の改善表示件数設定を追加。

## 5.6.10

- Search Consoleページ取得行に不足していたH1タイトル列の空欄を追加し、クリック数・表示回数・CTR・掲載順位の列ずれを修正。
- 記事DB書込み前に列数、CTR、掲載順位、クリック数と表示回数の整合性を検査する安全装置を追加。
- 異常値検出時は記事DB更新と記事ランク再計算を中止。

## 5.6.9

- 改善の推移の現在順位を小数第1位表示へ統一
- 文字列として残った順位も数値へ正規化して表示形式を適用
- 判定を大きく改善・改善・横ばい・悪化・測定中・測定待ち別に色分け
- 改善の推移を開くたびに表示書式を再適用

## 5.6.8

- 記事一覧に保存済みH1タイトル列を追加
- H1タイトルをメインクエリとクリック数の間に表示
- 改善の推移で現在順位・判定列を明示的に再表示
- 既存データをヘッダー名で非破壊移行

## 5.6.7

- Writer Contract v4.2 publication_result mapping support
- Preserve legacy changes compatibility
- Save public/user-decision changes and change summary

## Product 5.6.6

- 改善ナビで対象記事のSearch Consoleクエリを最大200件取得するよう変更しました。
- 改善依頼文の末尾に固定列順の `Search Console Query Data` ブロックを追加しました。
- クエリは表示回数降順で、Query / Clicks / Impressions / CTR / Positionを加工せず出力します。
- QueryRows / CapturedImp / TotalImp / Coverage / DataTimestampを追加しました。
- 従来の上位20クエリ表示は後方互換のため維持しています。
- 日次処理およびシート構成は変更していません。

## Product 5.6.5

- 日次処理完了画面の「記事更新」を「記事DB」へ変更しました。
- 「更新記事・更新対象外・新規記事・総記事数」の内訳表示に整理しました。
- 更新対象外の説明を記事DB枠内の下部へ追加しました。
- `更新記事 + 更新対象外 + 新規記事 = 総記事数` となる表示にしました。

## Product 5.6.4

- 日次処理完了ダイアログを4グループに整理
- 「今回の測定記録」「完了処理時間」を削除
- 改善効果を「モニタ中 ○件」で表示
- 件数を3桁区切りにし、スクロールを抑えるレイアウトへ調整
- 日次処理ロジックは変更せずUIをFreeze

## Product 5.6.3

- 日次処理を3段階の自動連鎖へ拡張しました。
- STEP 3で「改善の推移」を更新し、全工程成功後だけ本日完了を確定します。
- 完了ダイアログから固定値の「改善候補」「今日の改善」を削除しました。
- 完了画面をコンパクト化し、工程別・全体の処理時間を表示します。
- Homeの日次処理欄は未実施・実行中・本日完了・エラーの状態表示だけを使用します。

# Product 5.6.2

- 日次処理をSTEP方式へ再構築し、Search Console取得完了後に分析・記事DB更新を自動実行
- ダイアログを「STEP 1 / 2 データ取得中」から「STEP 2 / 2 分析・処理中」へ自動切替
- 記事ランク、改善候補、今日の改善を更新し、完了後に件数と各工程の処理時間を表示
- 定期ポーリングと「次へ」ボタンは使用せず、各STEPを1回だけ連鎖実行

# Product 5.6.0 Stage 1.1

- 日次処理ダイアログの実行ボタンが反応しない問題を修正
- 生成後のクライアントJavaScriptに残っていた引用符・改行の構文エラーを解消
- ダイアログ専用ボタンと重複していた共通の「閉じる」ボタン注入を停止
- 生成HTMLからJavaScriptを抽出して構文・実行動作を検証する回帰テストを追加

# Product 5.6.0 Stage 1

- Rebuild daily processing from a minimal Search Console fetch-only flow.
- Remove progress polling and legacy multi-state dialog behavior from the active entry point.
- Show fetched rows, valid article URLs, exclusions, and elapsed time until the user closes the dialog.

# Product 5.5.4

- 日次処理ダイアログの表示フローを「Search Console取得中」→「データ分析・処理中」→「完了結果」に統一しました。
- 完了画面の自動終了を廃止し、処理件数・今日の改善件数・処理時間を確認してから「閉じる」で終了する仕様に変更しました。
- 日次処理状態をDocument Propertiesにも同期し、進捗確認を軽量化してHomeとダイアログの状態不一致を自己修復します。

# Changelog

## 5.9.2 - Doctor Result Registration Compatibility Hotfix

- Doctor v1.0.1 の `SIMS_DOCTOR_SINGLE_CASE_RESULT_V1` を登録可能にしました。
- Doctor回答全文を貼り付けた場合でも、コードブロック内のJSONを自動抽出します。
- 旧 `SIMS_DOCTOR_CASE_RESULT_V2` との後方互換を維持します。
- 登録後に、利用者が次に行う作業を案内します。

## Product 5.5.4 - Daily Completion UI and Status Consistency

- 日次処理本体の戻り値をダイアログへ直接反映し、完了後のスピナー残留を修正。
- ダイアログに工程・進捗率・更新記事数・今日の改善件数・処理時間を表示し、完了3秒後に自動終了。
- Homeの日次処理欄を「未実施／実行中／本日完了／続行待ち／エラー」の状態表示だけに簡素化。
- 完了日時の保存確認と日次処理設定キーの重複自己修復を追加。

## Product 5.5.2 - Daily Status Polling Fix

- 日次処理ダイアログの `setInterval(..., 2500)` を廃止しました。
- 状態確認は前回の応答完了後、10秒待ってから次の1件だけを実行します。
- 状態確認の同時実行を防止し、Apps Scriptの実行履歴が大量のポーリングで埋まる問題を修正しました。
- ダイアログを閉じたときは保留中の状態確認を停止します。
- 日次処理継続関数に重複していたドキュメントロック取得を修正しました。

## Product 5.5.1 - Daily Dialog Spinner Fix

- Fixed the daily dialog client-side JavaScript newline escaping.
- Restored immediate spinner and progress display after clicking Run.


## Product 5.5.0 - Daily Processing Stability

- 日次処理の応答停止判定を45分から7分へ短縮し、エラーではなく続行待ちへ安全復旧
- 記事ランク計算を二分探索方式へ最適化し、記事数増加時の反復ソートを排除
- FETCH / MERGE / RECOMMEND / FINALIZEの開始・完了を既存System_Logへ記録
- ダイアログの進捗確認失敗を画面表示し、無限に見えるスピナー状態を防止
- 1回の安全実行予算を215秒へ短縮し、後処理とチェックポイント保存時間を確保

## 5.4.2

- 起動時の日次処理確認ダイアログを廃止
- Homeに日次処理の状態（未実施・実行中・本日完了）を表示
- メニューから実行する処理中ダイアログと二重実行防止を追加
- Home旧処理状況欄と関連コードを削除
- 配布ファイル名とZIP構成をWindows互換のUTF-8形式へ整理

## 5.3.2

- SIMS_FEEDBACK_V2の `changes` 配列形式に対応
- 従来のchangesオブジェクト形式を継続サポート
- `change_flags` を変更判定へ統合
- `internal_link`、`meta_description`などの別名を正規化
- 未知フィールドを許容し、元JSONを改善履歴へ保存

## 5.3.1

- Writer依頼文のサイトURL表記を `BlogURL` から `SiteURL` へ統一し、JSONへ `site_url` を追加。
- 「シートの作成・修復」完了時にHomeを再描画し、Homeシートへ戻る終了フローへ変更。
- SiteID/SiteNameをWriter連携へ追加。
- 日次処理の未実行判定とHomeの最終データ更新を同一の正常完了日時へ統一。
- 日本時間での日付比較、旧日時の移行、起動時ログ・通知を改善。

## 5.3.1

- SIMS_FEEDBACK_V1・V2・将来のSIMS_FEEDBACK_V数字を受け入れる前方互換Parserへ変更。
- 必須項目だけを検証し、未知フィールドを許容。
- learning、swls、diagnostics、reason_codes、warning_codes、version_candidateを含むV2を正常登録。
- 改善履歴へFeedback FormatとWriter Versionを保存。
- 改善ナビの出力例をSIMS_FEEDBACK_V2へ更新。

## 5.2.10

- 改善履歴の孤立行が旧「改善ログ」から再取り込みされる経路を修正。
- 記事DBと照合できない短いタイトルだけの旧ログ行を再生成対象から除外。
- 「シートの作成・修復」で復元不能な孤立行をバックアップ後に確実に削除。

# Changelog

## 5.9.2 - Doctor Result Registration Compatibility Hotfix

- Doctor v1.0.1 の `SIMS_DOCTOR_SINGLE_CASE_RESULT_V1` を登録可能にしました。
- Doctor回答全文を貼り付けた場合でも、コードブロック内のJSONを自動抽出します。
- 旧 `SIMS_DOCTOR_CASE_RESULT_V2` との後方互換を維持します。
- 登録後に、利用者が次に行う作業を案内します。

## 5.2.9

- 復元不能な改善履歴の孤立行を、非表示バックアップへ退避後に削除
- 改善履歴IDと同一履歴の重複を整理
- ArticleIDの複数履歴は正常データとして維持し、処理ログへ件数を記録
- 新規履歴登録時にArticleIDまたは記事URLを必須化

## 5.2.7

- 改善ナビのSearch Consoleクエリ取得をURL表記差へ対応。
- メインクエリ未設定時の自動補完を追加。
- 改善関連の日付を時刻なし・ゼロ埋めなしへ統一。
- 記事管理へデータ更新日を追加。

## 5.2.7

- Home表示後に、本日未実行の場合だけ日次処理確認を表示
- 改善ナビの最新クエリ欄へメインクエリと一致状況を追加
- 改善の推移で「選択」の次に改善実施日と経過日数を表示
- 経過日数を日本時間の日付単位で再計算し、時刻によるずれを防止
- SIMS-Coreへ改善レベルを事前指定せず、記事ランク・クエリ・本文からCoreが判断する役割分担を維持

## 5.2.7

- 改善ナビ起動時に、対象URLの最新Search Consoleクエリを毎回取得
- 取得したクエリをSearchConsole_Dataへ保存し、上位20件と内部リンク候補の再計算に使用
- 取得成功・0件・取得失敗を改善ナビと依頼文で区別して表示
- API取得に失敗した場合は保存済みクエリを代替利用

# Product 5.2.1 Official — Internal Link Candidates

- 改善ナビに内部リンク候補の自動抽出を追加
- 記事DBとSearch Console上位クエリから関連度をスコアリング
- 関連性のある記事を3～8件、タイトル・URL・メインクエリ・理由付きで表示
- AI向け改善依頼文へ候補記事と採用ルールを自動挿入
- 検索意図が近い候補にはカニバリ注意を表示
- 関連性の低い記事は件数合わせで追加しない

# Product 5.1.3 Official Release Sync

- Apps Script、docs、distributionを5.1.3で同期
- マニュアルの旧メニュー・旧バージョン表記を整理
- 利用者配布版から開発者用コードを除去
- GitHub Pagesと配布ZIPの公開手順を更新

# Product 5.1.3 修正

- 未取得記事の注意書きを白背景・右寄せに変更
- 日常作業メニューを上部へ独立表示
- 管理機能をSIMS-Blog-Managerメニューへ集約
- 配布版から開発者用メニューを非表示

## 5.1.1 - 2026-07-15

- Home週間集計で未定義関数エラーが発生する不具合を修正
- 今日のメッセージと今週のアドバイスを標準の太さへ変更
- 未取得記事の説明を改善状況の直下へ移動

## 5.1.0 - 2026-07-15

- HomeのUI/UXを再設計
- 今週の取り組みと作業アドバイスを追加
- 改善履歴表示時の再構築・書式反映漏れを修正
- 改善の推移へ名称を統一


## 5.3.1 - Action menu and compact Home

- Reorganized menus around user actions.
- Added manual daily processing under the Management menu.
- Added article-list sorting by rank, work status, clicks, impressions, CTR, position, and last update.
- Changed the Home rank summary to a three-row, two-column layout with missing articles in the lower-right cell.

## Product 5.1 Official Home Compact / Daily URL Review

- Homeへ記事ランク件数と ↗・→・↘ の前回比を追加
- Home下部の処理状況を、処理名・開始時刻・処理結果・お願いの4項目へ簡素化
- 起動時の日次更新確認を、その日の未実行時だけ表示するよう整理
- Search Console未取得URLを、3回連続または14日以上で「要確認」と判定
- データ未取得・要確認の記事を改善候補から除外

## Product 5.1 Official Reset Base - Candidate Limit

- 改善候補の保持上限を10件に固定
- 今日の改善を初期2件・最大6件に固定
- 効果測定を7日・14日・21日・28日の4回測定として仕様統一
- 配布物の文字化けファイル名を修正


## 5.2.1 - Home Dashboard Evolution

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
# Product 5.1 Official RC2

- 改善履歴の詳細画面を、既存の「改善計画・実施した改善・改善の推移」の構成を維持したまま拡張
- 改善の推移を「改善前と現在の比較・4週間の効果測定・最終判定」に分割
- 未測定の週も予定日付きで表示
- 測定済みの週は測定日時・判定・SIMS寸評を表示
- 1～4週目の表示から改善提案を除外し、最終判定時だけ表示
- 記事の全改善履歴の日付表示を日本語形式へ統一

## Product 5.0 Release 1 Sprint 3.3

- 測定延長が改善の推移更新後に元へ戻る根本原因を修正
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

## 5.9.2 - Doctor Result Registration Compatibility Hotfix

- Doctor v1.0.1 の `SIMS_DOCTOR_SINGLE_CASE_RESULT_V1` を登録可能にしました。
- Doctor回答全文を貼り付けた場合でも、コードブロック内のJSONを自動抽出します。
- 旧 `SIMS_DOCTOR_CASE_RESULT_V2` との後方互換を維持します。
- 登録後に、利用者が次に行う作業を案内します。

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

## 5.9.2 - Doctor Result Registration Compatibility Hotfix

- Doctor v1.0.1 の `SIMS_DOCTOR_SINGLE_CASE_RESULT_V1` を登録可能にしました。
- Doctor回答全文を貼り付けた場合でも、コードブロック内のJSONを自動抽出します。
- 旧 `SIMS_DOCTOR_CASE_RESULT_V2` との後方互換を維持します。
- 登録後に、利用者が次に行う作業を案内します。

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

## 5.9.2 - Doctor Result Registration Compatibility Hotfix

- Doctor v1.0.1 の `SIMS_DOCTOR_SINGLE_CASE_RESULT_V1` を登録可能にしました。
- Doctor回答全文を貼り付けた場合でも、コードブロック内のJSONを自動抽出します。
- 旧 `SIMS_DOCTOR_CASE_RESULT_V2` との後方互換を維持します。
- 登録後に、利用者が次に行う作業を案内します。

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
- 効果測定を「改善の推移」へ改称し、モニター中の記事から一覧を再生成。
- 一択チェックボックスの反応速度を改善。
- 修復完了ナビゲーターの画面遷移を修正。

## Product 5.0 RC11 Detail Popup Naming and Metrics Fix

- 効果測定詳細ポップアップを「改善の推移の詳細」へ改称。
- 改善の推移の数値を小数第1位、CTRをパーセント表示へ統一。
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
- Old history rows without an ID are not guessed or searched; they show `対応する改善の推移データはありません。`.
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

## Product 5.1 Official Release 1 Sprint 2 - 2026-07-12

- Apps Scriptの同名関数再定義76件を削除
- `Code.gs`を7,602行から6,056行へスリム化
- 固有関数名348件と配布用単一ファイル構成を維持
- `product/PRODUCT5_SLIM_BASE_AUDIT.md`を追加
- `product/PRODUCT5_SLIM_AUDIT.json`を追加

## Product 5.0 Release 1 Sprint 3

- 初回セットアップ最終STEPの名称・説明を改善
- 今日の改善の最大6件表示文言と上限通知を修正
- 改善の推移詳細に比較日を追加
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
- 延長後に改善履歴と改善の推移の見出し・日付書式を再適用
- 改善履歴を正本として改善の推移を再生成する同期方式へ変更

## Product 5.0 Release 1 Sprint 4

- 効果測定を7・14・21・28日の4回測定へ変更
- 7日延長機能を廃止
- 改善履歴に4回分の測定日時・判定を保存
- 改善の推移の次回予定日を週次で自動更新
- 28日目の測定後に自動完了

## Product 5.0 Release 1 Sprint 5

- 4週間効果測定モデルを正式スキーマとして強制適用。
- 起動時と「シートを作成・修復」実行時に改善履歴・改善の推移を新仕様へ移行。
- 旧「7日間延長」「測定完了」メニューを完全除去。
- 改善履歴の旧「測定予定日」を実測日時へ誤変換しないよう修正。
- バージョン情報メニューを追加。
- 配布パッケージから旧分割ソース `src/` を除外。

## Product 5.1 Official RC1

- 改善履歴一覧から4回分の測定日時を非表示化し、1週～4週の判定欄へ整理
- 測定日時と各週のSIMS寸評を詳細ポップアップへ移動
- 週次寸評から改善提案を除外
- 4週目終了後にのみ最終総括と改善提案を生成
- 旧「1回目判定～4回目判定」「最新判定」から新スキーマへ移行

## Product 5.1 Official RC3 Performance

- 改善履歴の「開く」から全件再構築・再書式設定を除外
- 改善の推移の「開く」から効果測定更新・全体書式設定を除外
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
## 5.2.1

- SIMS-Core向け依頼文にSearch Console上位20クエリを追加
- 改善優先順位、記事ランク、変更方針を追加
- 内部リンク候補を推奨アンカー、関連クエリ、関連度の形式へ変更
- 内部リンク利用ルールとコピペ可能なHTML出力要件を追加
- カニバリ候補表示を今回の仕様から除外

## 5.2.7
- 改善ナビのクエリ取得後に、元の作業シートへ確実に戻るよう修正。
- 内部保存用のSearchConsole_Dataシートを処理後に再非表示化。

## 5.4.2
- 日次処理をフェーズ分割し、実行時間上限前の自動継続に対応。
- 日次処理ダイアログへ回転スピナー、進捗率、操作案内を追加。
- 初回セットアップとブログ情報変更画面からSiteID・SiteName入力を削除。
- Homeの未実施・エラー表示を赤文字化。


## 5.4.3
- 時間主導トリガーによる日次処理の自動継続を廃止。
- `ScriptApp.getProjectTriggers()` / `newTrigger()` / `deleteTrigger()`への依存を削除。
- 安全な実行時間に達した場合は処理位置を保存し、ダイアログに「続きを実行」を表示。
- 続行時は保存済みフェーズから再開し、処理中は回転スピナーと進捗を維持。

## 5.6.11
- 改善推移の経過日数順・収益重視判定・復元確認・今日の改善表示件数設定を追加。

## 5.7.1 RC7

- Doctor個別診断依頼をContract V2へ更新
- Evidence Package v1.0を追加
- 記事本文、180日の日別推移、上位200クエリの期間別推移を添付
- 半年健康診断、改善履歴、Doctor履歴、内部リンク候補を添付
- Evidence Indexと比較期間保護を追加

## 5.7.1-rc.11
- Doctor Evidenceの180日整合性比較を同一条件のページ合計基準へ修正
- 大幅不整合時の限定診断判定を追加
- 本文内の実リンクURL抽出と候補照合を追加
- 内部リンク候補スコア飽和を抑制
- メインクエリ年号の鮮度警告と期間別サンプル品質情報を追加

## 5.9.7
- Added immediate product-format guard to Writer result registration.
- Doctor JSON is rejected before case lookup or sheet processing.
- Clarified the Writer-result-only input prompt.

## 5.10.0-RC4
- Restored the Writer treatment-result JSON input in the precise diagnosis dialog.
- Unified dialog and menu Writer-result registration validation/storage.

## 5.10.0-RC5

- Guided User Confirmation を追加。
- USER_CONFIRMATION の結果登録後、Doctor再診依頼JSONを自動生成。
- Search Console URL検査の結果選択UIを追加。
- Doctor_Casesへ確認結果・再診依頼を記録。
- Writer結果欄はWriterルート時のみ表示。

## 5.10.0-RC8 Final
- Finalized Doctor severity/category UX, quantified health trends, improvement route naming, hidden AI column, and Today query blank handling.

## RC8 URL Canonicalization Fix
- URL末尾スラッシュ差を同一記事として扱う共通Canonical Keyを強化。
- 記事DB等の運用URLを一度だけ正規化し、直接URL文字列比較を除去。

## 5.10.0-RC8 GSC URL Display Policy
- Separate internal URL identity keys from user-visible URLs.
- Prefer Search Console page URL representation for operational sheets.
- Preserve existing URL representation when an article is not present in the current GSC fetch.

## 5.10.0-RC8 Doctor Request UX Fix
- SIMS Doctorメニューから「健康診断の進み具合を見る」を削除し、健康診断→診断書→精密診断候補→Doctor依頼の4ステップへ整理。
- 精密診断候補の記事タイトルを折り返し表示し、一覧性を保つ固定行高へ調整。
- 精密診断候補からDoctor依頼文を作る直前の候補再生成を廃止し、チェックが消える不具合を修正。
- Doctor依頼作成時は現在表示中の候補シートをそのまま読み取り、選択状態を維持。

- RC8 Final QA UAT1: 健康診断完了時の不要な候補/Home遷移を除去。精密診断候補のタイトル折返し、重症度左寄せ、傾向～CTRの状態色を固定。

## 5.10.0-RC8.10 - Site Diagnosis Handoff Hotfix
- Added an SBM intake for Site Diagnosis Doctor results.
- Preserve Site Diagnosis batch/case identity and external Doctor CaseID in Doctor_Cases.
- Validate SiteID, ArticleID and URL before accepting the result.
- Extend SIMS_DOCTOR_CASE_RESULT_V2 normalization for Site Diagnosis case_context/workflow_handoff.
- Generate Writer referral from SBM Evidence while keeping Site Diagnosis traceability.
