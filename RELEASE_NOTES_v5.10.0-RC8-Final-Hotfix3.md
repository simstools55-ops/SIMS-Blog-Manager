# SIMS-Blog-Manager Product 5.10.0-RC8 Final Hotfix 3

## Fixes
- 精密診断候補ビューは最新の健康診断1回分だけを表示するよう修正。
- ArticleID / URL 単位で重複排除し、同一記事の複数表示を防止。
- 重症度を変化率だけでなくクリック数・表示回数の母数と絶対量も加味して判定。
- 1クリック→0クリック等の小標本を過度に「重症」と判定しないよう調整。
- 候補シート再生成、チェックボックス、モニター中グレーアウトの既存仕様を維持。

## QA
- Hotfix 3専用回帰テスト追加。
- RC8 Hotfix 2 / Unified Workflow / Final UX / RC7 Human View / RC6 UI UX 回帰PASS。
- apps-script/Code.gs と distribution/Code.gs の一致確認済み。
