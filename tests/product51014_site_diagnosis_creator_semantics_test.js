const fs = require('fs');
const code = fs.readFileSync('apps-script/Code.gs','utf8');
function must(x,msg){ if(!x) throw new Error(msg); }
must(code.includes("const SBM_VERSION = '5.10.14';"),'version');
must(code.includes("new_article_target:unit.new_article_target||cr.new_article_target||null"),'new_article_target expansion');
must(code.includes("reference_articles:Array.isArray(unit.reference_articles)?unit.reference_articles:(Array.isArray(cr.reference_articles)?cr.reference_articles:[])"),'reference_articles expansion');
must(code.includes("article_identity_semantics:unit.article_identity_semantics||cr.article_identity_semantics||null"),'identity semantics expansion');
must(code.includes("new_article_target:o&&o.new_article_target||null,reference_articles:Array.isArray(o&&o.reference_articles)?o.reference_articles:[],article_identity_semantics:o&&o.article_identity_semantics||null"),'creator referral preservation');
must(code.includes("function sbmDoctorProcessSiteDiagnosisCreator_(o)"),'existing creator route preserved');
must(code.includes("function sbmDoctorCreatorPublishedArticle_(caseId,articleUrl,articleTitle)"),'existing creator publish flow preserved');
console.log('product51014_site_diagnosis_creator_semantics_test: PASS');
