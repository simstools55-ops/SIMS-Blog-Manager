# SIMS-Blog-Manager Product 5.0.0

このパッケージは、STEP A / STEP A-2 / STEP B の処理分離を前提にした開発確認版です。

## 製品本体
- `apps-script/Code.gs`
- `apps-script/appsscript.json`

## 今回の主な修正
- Search Consoleから取得したURLのうち、記事URLだけを残す正規化を強化しました。
- はてなブログでは `/entry/` を含むURLを記事URLとして扱い、`#見出し`、カテゴリ、タグ、フィードなどを除外します。
- Homeの総記事数には、分析対象数と混同しにくい表示を追加しました。


## Product 5.0 Page Data Collection

新メニュー「ページデータ収集（記事DB）」を追加しました。Search Consoleからpage単位でURL・クリック数・表示回数・CTR・掲載順位だけを取得し、URL正規化とノイズ除去後に「記事DB」シートへ保存します。タイトル取得・改善分析は行いません。
