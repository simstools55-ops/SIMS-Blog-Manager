# SIMS-Blog-Manager v5.14.0

## Monitoring cycle lifecycle

改善後モニタリングを「日付やタイトルから最新行を推測する方式」から、
明示的なサイクル状態で管理する方式へ変更しました。

追加状態:
- ACTIVE
- REVIEW_REQUIRED
- SUPERSEDED
- COMPLETED

新しい改善またはDoctor追加経過観察を開始した時点で、
同一記事の旧ACTIVE/REVIEW_REQUIREDサイクルをSUPERSEDEDへ変更します。

「改善の推移」はACTIVEとREVIEW_REQUIREDだけを表示します。
過去のSUPERSEDED/COMPLETEDは改善履歴に保持されます。

これにより、同一記事の旧「見直し候補」と新「測定待ち」が
同時に現役一覧へ残る問題を解消します。
