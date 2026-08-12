# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT34

## UAT33 real-sheet feedback
- 改善履歴の表示に約30秒。
- Doctor改善日は復元されたが、他の改善日と書式が不統一。
- 改善概要を約30%広げたい。
- Doctor系が末尾にまとまっており、全履歴を改善日降順にしたい。
- 完了済みを一覧で見分けたい。

## Fix
- 改善履歴を開く時の処理を一括化。
  - ヘッダーは1回取得。
  - Doctor Caseは1回取得。
  - 日付補完・日付型統一・降順ソートをメモリ上で処理。
  - 履歴本文は1回だけsetValues。
- 全履歴を改善日降順に統一。通常改善 / Doctor→Writerを分離しない。
- 改善日は全行 Date 型 + yyyy/M/d 表示に統一。
- 改善概要: 300px → 390px（約30%拡大）。
- 状態=完了の行を薄いグレーで表示。
- 1〜4週 / 最終判定 / 状態の表示を維持。
- 全履歴再構築、効果再計算、autoResizeRowsは行わない。

## Performance target
改善履歴表示: UAT33 約30秒 → 数秒〜10秒未満を目標。
