SBM 5.10.0-RC8.13 Hotfix

Apps Script反映対象:
- Code.gs を既存の Code.gs へ全文上書き

新規追加:
- なし

変更なし:
- その他すべてのApps Scriptファイル

目的:
- Site Diagnosis由来Doctor JSONのIdentity表現揺れに対応
- トップレベルの site_id / article_id / article_url / site_diagnosis_batch_id を受理
- request_id が SDC- で始まる場合のみ Site Diagnosis CaseID として補完
