# Product 5.6.6 Search Console Query Data 200

## 目的

改善対象記事のSearch Consoleクエリを最大200件、加工せずSIMS Writerへ渡し、検索意図クラスタリングやQUERY_MIX分析の精度を高める。

## 実装

- `QUERY_ROW_LIMIT = 200` を定数化
- 改善ナビ起動時のみ対象URLのクエリを取得
- 表示回数降順
- 固定列: `Query|Clicks|Impressions|CTR|Position`
- 依頼文末尾に詳細データブロックを追加
- QueryRows / CapturedImp / TotalImp / Coverage / DataTimestampを出力
- 従来の上位20件ブロックを維持

## 非対象

- 日次処理の変更
- 類義語統合
- ノイズ除去
- 検索意図分類
- AI要約
- シート構成変更
