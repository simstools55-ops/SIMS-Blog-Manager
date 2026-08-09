# SIMS-Blog-Manager Product 5.10.0-RC8 GSC URL Display Policy

## Purpose
利用者に見える記事URLは、Search Console が取得したページURL表記を優先します。
内部の同一記事判定では末尾スラッシュ有無等を吸収する比較キーを使い、表示URLとは分離します。

## Changes
- Search Console の page URL を表示・保存URLとして保持
- `/1238` と `/1238/` は内部では同一記事として照合
- 日次更新でGSCに確認できたURL表記を記事管理へ反映
- 今日の改善、改善履歴、改善の推移、Doctor運用シートにも同じURL表記を伝播
- GSCで取得できない記事は既存URLを保持し、勝手に末尾スラッシュを変更しない
- 旧RC8の「運用URLを末尾スラッシュなしへ一括書換え」処理を停止

## URL policy
- Identity key: `sbmNormalizeUrl_()`
- User-visible URL: Search Console representation when available
- Fallback: previously stored article URL
