# Changelog

## Product 5.0 RC9

- Fixed analysis range mismatch error caused by row/header width differences.
- Added row width normalization before sheet writes.
- Fixed top page diagnosis article title mapping.
- Improved top page diagnosis status labels for end users.
- Added start/end timestamps to process log.
- Clarified elapsed time as user-facing waiting time.
- Stabilized header repair for existing sheets.


## Product 5.0 RC8.1 Fast Path

- Search Console取得エンジンはRC8.1ベースを維持。
- onOpenはメニュー作成だけに限定。
- STEP AはSearch Consoleデータ取得のみ。
- 日次取得上限 DailyFetchMaxRows の標準値を1500件に設定。
- Homeの処理状況表示を維持しつつ、処理中の注意文を明確化。


## Product 5.0 Home UI Syntax Fix
- Code.gs の構文エラー（Unexpected token）を修正。
- 高速化済みSearch Console取得処理とHome UI復元内容は維持。
- 利用者向けApps Scriptは Code.gs のみ。
