# SIMS-Blog-Manager Product 5.10.0-RC8

## 目的

RC7で実運用レベルに達したDoctor・Writer・SBM連携ロジックを変更せず、利用者が「今どこにいて、次に何をするか」を迷わず判断できるUI/UXへ仕上げるリリースです。

## 主な変更

- 基本メニューの日常導線を「1．Homeを確認する」「2．日次処理を実行」として明示。
- 番号は手順を表す項目だけに使用し、設定・並べ替え・個別診断などの単独操作には付与しないルールへ整理。
- Doctor精密診断ダイアログの5段階表示を具体化。
  1. Doctorへ依頼
  2. Doctor回答を登録
  3. 確認・再診
  4. Writerへ依頼
  5. Writer結果を登録
- `Doctor_精密診断紹介状` に「現在地」を追加し、「次に行うこと」と分離。
- `Doctor_診断状況` に「現在地」と次工程の案内を追加。
- Human Viewの主要列幅を縮小し、横スクロール量を抑制。
- RC7で実装済みの5列表示、内部列非表示、処置完了グレーアウト、モニター中遷移、独立結果登録メニュー廃止はそのまま維持。

## QA / Repository Cleanup

- `tests/release/test_release_candidate_integrity.py` の旧 `1.0.0-RC12` 固定判定を、現在のProductリポジトリVERSION形式に追従する検証へ変更。
- RC8専用の静的回帰テストを追加。
- `apps-script/Code.gs` と `distribution/コード.gs` の完全一致を検証。

## 非対象

- Doctor診断アルゴリズムの変更
- Writer処置契約の変更
- Creator / Mergeへの自動ルーティング拡張
- 効果測定ロジックの変更

RC8は新機能追加ではなく、RC7の実運用導線を安全に仕上げるUI/UX・QAリリースです。
