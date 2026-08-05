# Product 5.5.2 Daily Status Polling Fix

## 問題

Product 5.5.1の日次処理ダイアログは `setInterval(poll, 2500)` を使用していた。状態確認が2.5秒以内に完了しない場合でも次の要求が送信され、`sbmGetDailyUpdateClientStatus` が多数同時実行される。

## 修正

- 固定間隔の `setInterval` を廃止
- 状態確認の成功・失敗応答を受けてから10秒後に次を実行
- `pollInFlight` で同時実行を禁止
- ダイアログ終了時にタイマーを破棄
- 非実行状態、完了、続行待ち、エラー時はポーリングを停止
- 日次処理本体の成功応答後に状態を再取得

## 非変更範囲

- Search Console取得処理
- 記事管理更新処理
- 改善候補作成処理
- シート構造
- OAuthスコープ
