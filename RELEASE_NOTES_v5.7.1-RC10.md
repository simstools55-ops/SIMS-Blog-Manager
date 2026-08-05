# SIMS-Blog-Manager Product 5.7.1 RC10

## Doctor Evidence Package v2

- Evidence Package識別子を `SIMS_DOCTOR_EVIDENCE_PACKAGE_V2` へ更新
- package_versionを `2.0.0` へ更新
- V1互換情報、依頼ID、サイト識別情報、記事タイトル、メインクエリを追加
- Evidence Validationへ検証バージョンと検証日時を追加
- 半年サマリーと日別推移の整合性検査を強化
  - クリック数: 1件または5%
  - 表示回数: 2件または5%
  - 平均順位: 差1.0
- コード、配布用コード、契約スキーマ、静的テストを同期
- バージョン表記を5.7.1 RC10へ統一

## 互換性

既存の日次処理、今日の改善、Writer連携、既存Doctorシートは変更しません。
`compatible_with` にV1を明示し、移行期間の互換性を保持します。
