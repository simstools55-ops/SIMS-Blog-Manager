# SIMS-Blog-Manager Product 5.10.0-RC8 Final QA UAT1

## Purpose
RC8 Final UATで確認された表示回帰だけを最小修正し、新機能は追加しない。

## Fixes
- SIMS Doctorメニューの「健康診断の進み具合を見る」は廃止状態を維持。
- 健康診断完了時に精密診断候補→Home→精密診断候補と画面が切り替わる回帰を修正。完了後は健康診断書のみ表示。
- 精密診断候補はメニュー「3．精密診断候補を見る」を開いた時だけ最新スナップショットから再生成。
- 精密診断候補の記事タイトルを折り返し表示（固定2行相当）。
- 重症度を左寄せ。
- 傾向～CTRを状態別の薄い背景色で表示（流入低下/急減、停滞、改善余地、要確認）。
- SHARED_VERSIONを同梱Shared 3.5.0と整合。

## Regression IDs
- REG-HEALTH-003: 健康診断完了時の不要なシート遷移
- REG-UI-DOCTOR-CANDIDATE-001: 候補タイトル見切れ
- REG-UI-DOCTOR-CANDIDATE-002: 重症度配置・状態色
