const fs=require('fs');
const code=fs.readFileSync(process.argv[2],'utf8');
function must(s,m){if(!code.includes(s)){console.error('FAIL '+m);process.exit(1)}}
must("articleIdIsSurrogate:Boolean(", "surrogate metadata");
must("id.referenceArticleId=suppliedId;", "reference preservation");
must("id.articleId=resolvedId;", "official id resolution");
must("function sbmDoctorExtractCaseResultsFromAnswer_", "multi extractor");
must("function sbmDoctorPreflightCaseResultBatch_", "preflight");
must("function sbmDoctorProcessCaseResultBatch_", "batch processor");
must("if(caseResults.length>1)", "multi dispatch");
must("複数の個別結果を含むDoctor回答全文", "UI note");
console.log("PASS product51015_site_diagnosis_surrogate_batch_test");
