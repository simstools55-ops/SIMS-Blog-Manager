# Product 5.0 Release 1 Sprint 1

## 実装

- STEP1〜STEP6を順番に進む初回セットアップ
- 各STEPに「実行・スキップ・終了」
- 各STEPは対象処理だけを直接実行
- ブログ情報の変更を独立
- 利用者向けトップメニューを最小化
- 処理ログを開発者用メニューへ移動
- 修復完了画面を「初回セットアップ／そのまま使う／閉じる」に整理
- Developer版は内部シートと処理ログを操作可能
- Product版では `SBM_ENABLE_DEVELOPER_MENU = false` で開発者メニューを非表示

## 配布

利用者向けApps Scriptは `apps-script/Code.gs` 1ファイルです。
