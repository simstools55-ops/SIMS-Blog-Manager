# CHANGELOG

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
