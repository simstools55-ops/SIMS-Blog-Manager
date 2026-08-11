# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT10

RC8 Finalの最終修正バッチ。新機能追加ではなく、実機QAで残った表示・状態・データ整合性を閉じるための品質保証修正。

## 修正
- Doctor依頼の `current_performance` 直近28日値を、Evidence Packageの日別28日集計へ統一。
- 長時間処理向け共通進捗ダイアログを追加。
  - 精密診断候補：3工程を実際のサーバー処理単位で順次表示。
  - 記事情報取得：処理内容と回転インジケーターを表示。
  - 改善の推移更新：処理内容と回転インジケーターを表示。
- 利用者向け作業状態の「改善中」を廃止。
  - 既存の「改善中」は「モニター中」へ移行。
  - DoctorからWriterへ渡した処置中の記事は「処置中」と表示。
  - Writer結果登録後は従来どおり「モニター中」。
- 「未測定」と「測定待ち」の利用者表示を「測定待ち」へ統一。
- Homeの改善状況を「今日の改善 / モニター中 / 未取得記事 / 改善確認完了」に整理し、モニター件数を一本化。

## Regression IDs
- REG-CURRENT-PERFORMANCE-28D-MISMATCH-001
- REG-LONG-RUNNING-UX-001
- REG-WORKSTATE-MONITOR-UNIFICATION-001
- REG-MEASUREMENT-WAITING-LABEL-001
- REG-HOME-MONITOR-COUNT-002

## Freeze
Health Staged Runner、Doctor候補記事同一性、候補最大10件補充、Canonical URL、Doctor/Writer全文JSON抽出は既存PASS仕様を変更していない。
