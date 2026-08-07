# SIMS-Blog-Manager Product 5.10.0-RC1

## Doctor v1.2連携

- `SIMS_DOCTOR_EVIDENCE_PACKAGE_V2` の `package_version` を `2.3.0` へ更新しました。
- 個別Doctor紹介状生成時に、Search Consoleから直近28日と前28日のサイト内pageデータを取得し、`site_impact` を生成します。
- `site_impact` はサイト全体のクリック・表示・CTR・平均順位の変化と、改善／安定／低下／低サンプルの記事数を要約します。
- サイト全体EvidenceはAlgorithm Impact Analyzer向けの補助証拠です。SBMはGoogleアップデートとの因果関係を判定しません。
- Evidence indexに `E011 サイト全体の28日比較` を追加しました。

## Platform

- Shared Editorial Knowledge 3.4.0のSBM snapshot（architecture / contracts / enums / doctor）へ同期しました。
- Doctor → SBM → Writer / Creator / Merge → SBM の既存routingは維持します。

## Performance boundary

- `site_impact` の追加API取得は個別Doctor紹介状生成時のみです。
- Search Console API呼び出しは原則2回（直近28日・前28日）、各page最大25,000行です。日次処理には追加しません。
