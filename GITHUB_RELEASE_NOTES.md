# SIMS-Blog-Manager Product 5.10.0-RC8 URL Canonicalization Fix

- Search Console/CMSの末尾スラッシュ差を同一記事として扱うURL Canonical Keyを強化。
- 記事DB、今日の改善、改善履歴、改善の推移、Doctor系運用シートのURLを共通形式へ一度だけ移行。
- 記事DB・改善ブリーフ・改善完了処理に残っていたURL直接比較をCanonical比較へ修正。
- `/1238/` と `/1238` がDoctor→Writer→SBMの同期で別記事扱いされないことをRC8回帰テストへ追加。
