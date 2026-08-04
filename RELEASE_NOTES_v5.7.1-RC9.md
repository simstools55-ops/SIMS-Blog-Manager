# SIMS-Blog-Manager Product 5.7.1 RC9

## Doctor Evidence daily data fix

- 180日の日別取得で、全件0の疑似日付行を成功扱いしないよう修正
- クエリ取得で実績のあったURLを日別取得の第一候補として再利用
- 末尾スラッシュ有無を実績合計で判定
- URL候補ごとの行数・クリック・表示回数をcandidate_traceへ記録
- 日別実績が取得できない場合はmatched_urlをnullにし、再取得判定を維持
