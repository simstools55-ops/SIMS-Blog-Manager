# SIMS-Blog-Manager Product 5.10.0-RC8 Unified Improvement Workflow Hotfix

## Purpose
実機検証で確認した「Doctor専用の一時一覧が利用者フローと重複する」「記事一覧にタイトル・メインクエリの空欄が残る」問題を解消し、通常改善とDoctor経由処置を同じ改善履歴・改善推移へ統合します。

## Changes
- Doctor対応一覧メニューを廃止。旧シートは削除せず非表示化して後方互換を維持。
- Doctor→Writerの処置結果を `改善方法=Doctor→Writer` として改善履歴へ保存。
- 通常改善は `改善方法=通常改善` として扱う。
- 改善履歴と改善の推移に「改善方法」を追加し、同じモニタリング基盤で比較可能にした。
- DoctorからWriter処置へ進んだ記事は記事ランクを変更せず、作業状態を `✏️ 改善中` にする。
- 処置結果登録後は従来どおり `👀 モニター中`、28日測定完了後は `✔️ 完了`。
- 記事一覧を開いた際、利用者向けのタイトル・メインクエリ表示に空欄を残さない。
  - タイトル取得不能時はURLスラッグ等から表示名を補完。
  - 表示回数0の記事は「検索実績なし」。
  - 表示実績があるがクエリ未取得の記事は「取得待ち」。
- 「検索実績なし」「取得待ち」は表示専用値として扱い、Doctor/Writer等へ実クエリとして渡さない。

## Migration
既存シートの削除・再作成は不要です。改善履歴・改善の推移はヘッダー名ベースの既存マイグレーションで「改善方法」列を追加します。

## QA
- Apps Script syntax check: PASS
- RC8 unified improvement workflow test: PASS
- RC8 Doctor candidate UI tests: PASS
- RC8 typed-column hotfix regression: PASS
- RC7 human-view regression: PASS
- RC6 UI/UX regression: PASS
- Home layout regression: PASS
- RC5 guided confirmation regression: PASS
- apps-script/Code.gs and distribution/Code.gs byte-identical: PASS
