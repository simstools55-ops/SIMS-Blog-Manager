## 5.2.9

- 改善履歴データの整合性クリーンアップを追加
- 復元不能行を非表示バックアップへ退避後に削除
- 重複履歴IDを情報量に基づいて整理

- 記事管理・改善履歴・改善の推移の列参照をヘッダー名基準で再点検。
- 記事情報補完時に既存列を壊す旧配列書き込みを修正。
- 改善履歴の孤立した不完全行を除外し、記事管理とAI返却JSONから不足項目を補完。
- 改善関連の日付表示を時刻なしの `yyyy/M/d` へ統一。

# Product 5.2.1 新機能

- 改善ナビへ内部リンク候補の自動抽出を追加
- 記事DBとSearch Consoleクエリを組み合わせて関連度を判定
- AI向け依頼文へ候補URLと関連理由を追加

# Product 5.1.3 修正

- 上部メニューを「SIMS-Blog-Manager／記事改善スタート／結果登録／推移確認／記事一覧／改善履歴」に再構成
- SIMS-Blog-Managerを最左翼へ移動
- 改善中の記事と4週間測定を「推移確認」へ統合
- 改善履歴の再構築・書式・チェックボックス処理を一本化
- シートの作成・修復と改善履歴を開く操作で同じ更新処理を使用
- 配布版の開発者用メニュー生成を削除

# CHANGELOG

## Product 2.2

- Rebuild setup flow as SIMS-Core Slim Edition UX
- Add popup input for blog name and Search Console Property
- Stop wizard after opening Google Cloud API guide and resume via menu
- Add menu item: API設定後に接続テストへ進む
- Block daily GSC fetch until connection test status is OK
- Add connection test status to Settings sheet
- Improve Google Cloud API guidance and troubleshooting

## Product 2.1

- Improve setup wizard with popup input
- Prevent daily fetch until Search Console connection test succeeds

## 5.2.7

- 改善ナビの対象URL別クエリ取得を、URL表記差・末尾スラッシュ・canonical差に対応。
- メインクエリ未設定時は最新クエリの最上位を候補として記事管理へ補完。
- 改善関連の日付表示を `2026/7/16` 形式へ統一し、時刻表示を除去。
- 記事管理へ「データ更新日」を追加し、Search Console数値の最終正常更新日を表示。

## 5.2.7

- 改善ナビの最新クエリ取得を軽量化
- SearchConsole_Data全件再書き込みを廃止
- 最新クエリを内部リンク候補へ直接反映
- 改善の推移の次回測定予定日を中央揃え
