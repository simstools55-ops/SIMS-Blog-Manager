# SIMS-Blog-Manager Product 5.9.10

## Hotfix
- Doctor結果形式に依存せず `workflow_handoff.next_action=WRITER` を優先し、Writer紹介状を自動生成します。
- Doctor Evidence Packageをv2.2.0へ更新し、主要クエリ最大15件について同一サイト内の他URL表示実績を取得します。
- カニバリ判定のE009はサイト横断証拠に基づいてVALID/WARNINGを判定します。

既存スプレッドシートは継続利用できます。

## Final rebuild / Home regression fix
- Product 5.9.9 を土台に、5.9.10 の Doctor routing / cannibal evidence 差分だけを再適用しました。
- Home更新時にメッセージ欄と「今週のアドバイス」欄の結合状態を自己修復し、旧レイアウトでも文章が横方向に複製されないようにしました。
- 配布前にUTF-8とU+FFFD置換文字の監査を実施します。
