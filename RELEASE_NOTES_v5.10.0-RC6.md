# SIMS-Blog-Manager Product 5.10.0-RC6

## Theme
SBM UI/UX Refresh and unified Doctor follow-up routing.

## Changes

### Home
- 「改善中の記事｜推移」の判定色を「改善の推移」シートと統一。
- 緑=改善、黄=経過観察、橙=要確認、赤=見直し、紫=データ不足として視認性を改善。

### Doctor 健康診断書
- 長文を1セルに押し込むレイアウトを廃止。
- 「総評」「今回多かった傾向」「Doctor判断」を独立行へ分割。
- 健康度に日本語判定を併記。
- 「次に行うこと」を3 STEPで表示。

### 精密診断紹介状
- 利用者が選択に必要な6列だけを通常表示。
- ArticleID / URL / 数値列はDoctor依頼生成用に保持しつつ非表示。
- 横スクロールを大幅に削減。

### 精密診断ダイアログ
- 5段階の進捗表示を追加。
- 利用者確認後のDoctor再診結果入力欄を追加。
- 再診結果も初診と同じRouterで `WRITER / USER_CONFIRMATION / MONITOR` 等へ分岐。
- 再度 `USER_CONFIRMATION` となった場合も同じループを継続可能。

## Compatibility
- Shared Editorial Knowledge: 3.5.0
- Doctor/Writer referral contracts: backward compatible
