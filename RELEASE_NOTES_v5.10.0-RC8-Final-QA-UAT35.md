# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT35

## UAT34 feedback
- 改善履歴表示: 約10秒
- Doctor改善日がISO文字列のまま
- 改善日降順ソートが効かずDoctor系が下部
- 判定状況ごとの文字色が必要

## Fix
- 改善履歴専用ISO8601日時パーサーを追加
- Doctor→Writerは非空の壊れた日付でもWriter結果/Doctor Caseのcompleted_atからDate型へ再構築
- 改善日列だけ更新し、全行全列setValuesを廃止
- Range.sortで改善日降順
- 改善日表示をyyyy/M/dへ統一
- 静的レイアウトはSheetIDごとに一度だけ適用
- 判定/状態の文字色:
  緑=改善方向、黄褐色=経過観察、橙=要確認、赤=見直し/悪化、紫=データ不足、青=測定中、灰=測定待ち/完了
- 完了行の薄いグレー背景を維持

## Performance target
初回5〜8秒、2回目以降は数秒を目標
