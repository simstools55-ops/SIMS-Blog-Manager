# Product 5.3.0 — SIMS Feedback Forward Compatibility

## 目的

SIMS WriterのJSON Protocol更新に対し、SIMS-Blog-Manager側の改修頻度を下げる。

## Format判定

`^SIMS_FEEDBACK_V[1-9]\d*$` に一致するformatを受け入れる。

## Validation

厳密に確認するのは次だけ。

- format
- article_id または article_url
- changesオブジェクト

未知フィールドは許容し、元JSONを保存する。

## V2追加項目

`learning`、`swls`、`diagnostics`、`reason_codes`、`warning_codes`、`version_candidate`は存在しても正常登録する。現時点では業務処理に利用しない。

## 履歴メタデータ

改善履歴の内部列へ次を保存する。

- Feedback Format
- Writer Version

Writer Versionは `writer_version`、`sims_writer_version`、`version_candidate`、writer/generator/product/SWLS/diagnostics内のバージョン候補から取得する。
