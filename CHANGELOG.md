# CHANGELOG

## 5.20.0
- Personal Knowledgeの過剰なCTR/クリック拒否を修正。
- Home表示時の重いDoctor/効果測定再計算を省略。
- 起動時の日次処理状態を軽量再判定し、翌日の「本日完了」残留を修正。


## 5.18.3
- Personal Knowledge bootstrap errors are surfaced to the registration dialog and Cloud Logging.
- Added a non-routine Personal Knowledge connection/self-check command.
- Prevent silent SITE candidate rejection when PK context initialization itself fails.
- Correct single Article Doctor result completion label in the Site Doctor intake dialog.

## v5.18.2 - 2026-08-30

- Article Doctor単票結果をSite Doctor追跡IDなしで安全に受理する回帰修正。
- Site Doctor追跡案件の厳格なCase/Batch ID検証は維持。
- Site Doctor処置ダイアログ経由でもPersonal Knowledge候補を取り込む。

# v5.18.1 - 2026-08-30

- Fix Personal Knowledge root initialization so `SIMS-Personal-Knowledge` is created even when the spreadsheet site context must be resolved from the active Doctor request.
- Resolve SITE-scoped Personal Knowledge using trusted SBM request identity (`site_id`, site name, blog/article URL) before accepting AI output site identifiers.
- Accept `HIGH` / `MEDIUM` / `LOW` confidence labels from Article Doctor candidates and normalize them to numeric admission values.
- Keep candidate ingestion non-blocking and preserve replay-safe `confirmation_event_id` handling.

## v5.13.0

## v5.14.10
- 「選択」チェックボックスを単一選択へ統一。Doctor精密診断候補など見出し行が1行目以外の派生シートにも対応。
- 記事一覧からnoindex・非公開等を管理対象外へ変更し、後から通常管理へ復帰できる可逆な管理UIを追加。
- 管理対象外状態を日次更新で保持し、改善・Doctor・内部リンク候補への再混入を防止。
- 301非対応ブログのMerge吸収記事を「統合済み（リダイレクト不可）」として管理対象外へ移すルートを追加。

- 改善の推移に「観察終了後の処置を進める」を追加。
- 改善完了案件を現役推移一覧から卒業し、履歴は保持。
- 再改善必要／確定不能案件をDoctor再診へ接続。
- Doctor WAIT / MONITOR を正式な追加経過観察サイクルとして登録。
- Apps Script・配布コード・VERSION・PRODUCT_IDENTITYをv5.13.0へ同期。

## v5.12.1

- Creator回答に公開記事URLが含まれない通常運用でも登録できるよう、Creator新規記事登録ダイアログに「公開した記事のURL」補完欄を追加。
- Creator回答内にURLがある場合は従来どおり自動取得し、URL欄は空欄のままで登録可能。
- 回答内にURLがない場合だけ利用者入力URLをフォールバックとして使用。SiteID・Creator case・ブログホスト・重複URL等の既存安全検証は維持。
- ダイアログのボタン領域を固定し、長いCreator回答を貼り付けても登録ボタンが見失われにくいレイアウトへ改善。

# CHANGELOG

## v5.12.0

- Added a user-facing "Creatorで作った新記事を登録" flow that accepts the full Creator response and registers the published article before GSC exposure.
- Reused the existing Creator publication pipeline so ArticleID, monitoring state, review schedule, improvement history, and later GSC URL reconciliation remain consistent.
- Added guards for SiteID mismatch, invalid/missing published URLs, unknown Creator cases, and invalid workflow state.
- Prevented numeric-only URL slugs such as WordPress `/1223/` from being used as H1/article-title fallbacks; unresolved titles remain `タイトル取得待ち`.

## v5.10.22

- Normalized the product header/version metadata against the currently deployed Code.gs.
- Re-synchronized all distributed Code.gs runtime mirrors from the current deployed script.
- No functional workflow change from the currently deployed v5.10.21 behavior.

## v5.10.21

- Removed manual "前回の処置を再読み込み" UI from Site Diagnosis treatment dialog.
- Preserved automatic resume of unfinished treatment state.
- Clear Writer result input and previous registration status when switching referrals.

## v5.10.20

- Site-wide Precision ResultのSBM登録を1案件ずつ分割実行。
- ブラウザ側で登録対象件数を先に確定し、進捗 `0/N → 1/N → ...` を即時表示。
- 現在処理中の診断テーマ/CaseIDを進捗表示へ反映。
- Writer処置結果登録成功後に③入力欄を自動クリア。
- v5.10.19までのREF URL解決・Doctor V2 scope互換を維持。

## v5.10.19

- `SIMS_DOCTOR_CASE_RESULT_V2` のトップレベル `allowed_scope` / `blocked_scope` を受理。
- Site Diagnosis個別精密診断からWriter紹介状を生成する際の治療範囲欠落を修正。
- `treatment_plan.actions` をWriter紹介状のinstructions / treatment_tasksへ引き継ぎ。
- v5.10.18までのREF URL照合・複数CASE_RESULT抽出・1件ずつ分割登録・進捗UIは維持。

## v5.10.18

- Site Diagnosis処置ダイアログのsubmitDoctor()差し替え不具合を修正。
- 進捗オーバーレイがクリック直後に表示されない問題を修正。
- 外側Code.gsに加え、ブラウザ側submitDoctor()単体の構文チェックを追加。

## v5.10.17

- Doctor複数個別結果を1件ずつの分割実行へ変更。
- 登録ボタン押下直後に専用進捗オーバーレイを表示。
- `0/9 → 1/9 → ... → 9/9` の進捗とプログレスバーを表示。
- エラー時に処理済み件数を表示し、待ち続ける状態を解消。
- v5.10.15/v5.10.16のREF URL照合・複数CASE_RESULT抽出は維持。

## v5.10.16

- Doctor個別精密診断の複数結果登録を2件ずつの分割実行へ変更。
- 1回で9件処理する長時間実行を廃止。
- 進捗を2/9、4/9、6/9、8/9、9/9のように画面表示。
- 「ボタン入力を検出しました」のまま長時間待つUIを改善。
- v5.10.15のREF URL照合・複数CASE_RESULT抽出は維持。

## v5.10.15

- Site DiagnosisのURL surrogate ArticleID (`REF-*`) を記事URLでSBM正式ArticleIDへ解決。
- `REF-*` はDoctorケース追跡用として許容するが、SBMの記事管理IDとして保存しない。
- 複数の `SIMS_DOCTOR_CASE_RESULT_V2` を含むDoctor回答全文を一括取込。
- 一括登録前に全件のSiteID・URL・正式ArticleIDをpreflight。
- 単件結果、Site-wide precision、Writer/Merge/Creator/Monitorの既存経路は互換維持。

## v5.10.14

- Site Diagnosis v0.7.3 Creator handoff semanticsをSBM内で欠落なく保持。
- `new_article_target` / `reference_articles` / `article_identity_semantics` を一括診断展開後の単案件JSONへ引き継ぐよう修正。
- Creator紹介状にも上記3項目を保持し、新規記事対象と既存関連記事（参照専用）の境界を明示。
- Writer / Merge / Monitor / Creator公開登録など既存フローは変更なし。


## v5.10.13
- Site Diagnosis由来のCreator案件に「新記事の公開を登録」を追加。
- 公開URLを新規記事として記事管理へ登録し、ArticleIDを採番。
- Creator案件をモニター中へ移行し、Creator planのmonitor_daysを再診予定日に反映。
- 既存記事の内部リンク候補URLを新記事URLとして扱わない。
- apps-script/Code.gs と distribution/Code.gs を同一内容で同期。
