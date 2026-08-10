# SIMS-Blog-Manager Product 5.10.0-RC8 Final QA-UAT3

## Quality assurance changes

- Doctor精密診断ダイアログの標準操作を「Doctor回答全文をそのまま貼付」に統一。
- Writer処置結果も「Writer回答全文をそのまま貼付」に統一。
- JSON部分だけの貼付は後方互換として継続サポート。
- Doctor再診結果の案内も回答全文貼付へ統一。
- 精密診断ダイアログ上部に「この記事を開く」を追加し、現在Caseのarticle_urlを新しいタブで開く。
- RC8 Final UAT3 regression testを追加。

## Regression IDs

- REG-DOCTOR-FULL-RESPONSE-001
- REG-WRITER-FULL-RESPONSE-001
- REG-DOCTOR-ARTICLE-JUMP-001

機能範囲・Doctor/Writer契約・ルーティング仕様の変更はありません。
