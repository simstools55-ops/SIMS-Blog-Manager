# SIMS-Blog-Manager Product 5.10.0 RC8 — Official Blocker Final

## 修正

- 改善履歴を起動時点から装飾済みにし、選択列をチェックボックスとして固定。
- 現時点で利用しない「使用AI」列を利用者画面では非表示化。
- GSCから取得できなくなった記事でも、Doctor処置履歴が存在する記事は記事管理から消さず復元。
- 復元したDoctor処置済み記事は作業状態を「👀 モニター中」とし、検索露出なしを明示。
- Doctor→Writer / Doctor→Creator / Doctor→Merge の改善経路を改善履歴・改善の推移へ同期。
- Doctor処置結果登録時、記事管理行が欠落していても復元してから共通結果登録フローへ接続。

## QA

- RC8既存回帰テストを継続。
- GSC非取得Doctor記事復元、改善履歴初期装飾、FALSE/TRUE防止、改善経路保持の専用静的回帰テストを追加。
