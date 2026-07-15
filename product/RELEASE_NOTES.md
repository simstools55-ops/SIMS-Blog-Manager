# SIMS-Blog-Manager Product 5.2.1 Official

Product 5.2.1 adds automatic internal-link candidate collection to the Improvement Navigator. Candidates are selected from the article database and Search Console queries and are included in the AI improvement request with URLs and relevance reasons.

# SIMS-Blog-Manager Product 5.1.3 Official

Product 5.1系の正式基準版です。Homeと上部メニューを毎日の作業フローに合わせて再設計し、改善履歴の再構築と書式反映を安定化しました。

## 主な変更

- Homeに記事ランク、今日のメッセージ、改善状況、今週の取り組み、今週のアドバイスを表示
- 上部メニューを「SIMS-Blog-Manager／記事改善スタート／結果登録／推移確認／記事一覧／改善履歴」に統一
- 改善候補は最大10件、今日の改善は初期2件・最大6件
- 効果確認は改善後7日・14日・21日・28日の4回
- 改善履歴を開く際に一覧、書式、チェックボックスを再反映
- 未取得記事を記事DBから自動削除せず、安全に管理
- 配布版から開発者用メニューを除外
- マニュアルサイトと配布版をProduct 5.1.3へ同期

## 更新方法

1. `コード.gs`を全置換して保存
2. スプレッドシートを再読み込み
3. **SIMS-Blog-Manager → シートの作成・修復**を1回実行
4. バージョン情報が`5.1.3`であることを確認

既存スプレッドシートは継続利用できます。
