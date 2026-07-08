# Product 5.0.0 Search Console Fetch Performance Fix

- 日次処理のSearch Console取得を軽量化しました。
- 日次取得では全シート修復・不要シート削除・autoResizeColumnsを実行しません。
- 処理ログに API取得秒数・シート書込秒数・設定更新秒数を記録します。
- Home処理状況エリアは処理中を淡い黄色、完了時を淡い緑に切り替えます。
- 処理中の「完了時刻」表示を廃止し、予測可能な場合だけ「完了予定」を表示します。

# CHANGELOG

## Product 5.0.0 - Daily Fetch Status Fix

- 日次処理を Search Console データ取得のみに変更。
- 日次処理開始前に「本日のデータ収集をスタートします！」ダイアログを表示。
- Homeの処理中表示を赤背景・白文字・太字にし、注意文は処理中のみ赤字表示、完了後は自動消去。
