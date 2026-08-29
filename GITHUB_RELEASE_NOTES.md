# SIMS-Blog-Manager v5.18.2

Article Doctor単票結果を「Site Doctor診断結果の処置を進める」ダイアログへ貼り付けた際、`site_diagnosis_case_id` / `site_diagnosis_batch_id` を誤って必須要求する回帰を修正しました。

Site Doctor由来の案件では従来の追跡ID検証を維持し、通常Article Doctor単票ではCaseID・SiteID・ArticleID・URLをSBM側で照合して登録します。この取込経路でもPersonal Knowledge候補をKnowledge Writerへ渡します。

Recommended commit:
`fix(sbm): accept generic article doctor results in site doctor intake (v5.18.2)`
