# SIMS-Blog-Manager Product 5.10.0-RC8 Final Hotfix 5

## Purpose
Doctor精密診断候補を「未処理記事だけの入口」に戻し、Doctor処置完了後のデータを通常改善と同じ改善履歴・改善の推移・記事管理へ確実に移行する。

## Changes
- 精密診断候補は現在の健康診断でDoctorへ未送信の記事だけを表示。
- Doctor依頼文を作成した記事は候補ビューから即時除外。
- Doctor→Writer処置完了後は候補から除外し、記事管理を「👀 モニター中」へ同期。
- Doctor_Casesの改善履歴IDを正本として、改善履歴の「改善経路」を Doctor→Writer / Doctor→Creator / Doctor→Merge に復元。
- 改善の推移を生成するたびに改善経路を再同期し、Hotfix途中の退化でDoctor経路が消える問題を防止。
- 過去のDoctorケースは、現在の健康診断より前のものなら将来の再診断候補を永久に遮断しない。

## Migration
シートの再作成・修復は不要。候補シートは派生ビューとして開くたびに再構築される。
