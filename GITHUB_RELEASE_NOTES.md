# SIMS-Blog-Manager v5.18.3

実記事A000076のPersonal Knowledge試験で、Article Doctor結果登録は成功する一方、`SIMS-Personal-Knowledge` がDriveへ作成されない状態を追跡できなかった問題を修正しました。

- Personal Knowledge context初期化エラーを `PK_CONTEXT_UNAVAILABLE` として明示化。
- 初期化失敗を候補の通常REJECTとして隠さないよう修正。
- SBM System Logに加えてApps Script Cloud LoggingへPersonal Knowledge警告を出力。
- 「Personal Knowledge接続を確認」を追加し、Drive root / MANIFEST / site_id を検証可能に。
- Article Doctor単票登録画面へ候補件数・保存件数または失敗理由を表示。
- 単票完了ラベルを「Article Doctor診断結果」に修正。
- 更新時は `appsscript.json` のDrive OAuth scopeも同期することを明記。

Recommended commit:
`fix(sbm): surface personal knowledge bootstrap failures (v5.18.3)`
