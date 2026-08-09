# SIMS-Blog-Manager Product 5.10.0-RC8 URL Canonicalization Fix

## Purpose
Search Console/CMSで同一記事のURLが末尾スラッシュあり・なしで混在しても、SBM内で別記事として扱わないようURLキーを共通化する。

## Changes
- `sbmNormalizeUrl_()` をURL比較・運用保存の共通Canonical Keyとして強化。
- ルートURL以外は末尾スラッシュなしへ統一。
- scheme/hostを小文字化し、標準ポート（80/443）、query、fragmentを比較キーから除外。
- scheme省略URLも同じルールで正規化。
- `sbmUrlEquals_()` を追加し、記事DBの直接文字列比較を廃止。
- 今日の改善の作業状態照合も正規化URLキーへ変更。
- 記事DB、今日の改善、改善履歴、改善の推移、Doctor系運用シート等を起動時に一度だけCanonical形式へ移行。
- Search Consoleの元データ表記そのものではなく、SBMの運用キーを統一する方針を採用。

## Canonical policy
- `https://example.com/post/` → `https://example.com/post`
- `https://example.com/post` → `https://example.com/post`
- `https://example.com/` → `https://example.com/`

このため、記事DBで末尾スラッシュが表示されないこと自体は正常。重要なのは、GSCの `/post/` とSBMの `/post` が同一記事として照合されること。
