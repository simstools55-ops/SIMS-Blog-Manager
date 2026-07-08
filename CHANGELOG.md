# Changelog

## Product 5.0.0 - Search Console RC9 Fetch Restore

- Search Console取得エンジンをRC9安定動作優先へ戻しました。
- 日次取得の軽量化は周辺処理のみに限定しました。
- Advanced Serviceが使える場合はSearchConsoleサービス、未設定時はRC9同等のUrlFetch方式へフォールバックします。
