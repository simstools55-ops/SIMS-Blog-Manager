const fs = require('fs');
const code = fs.readFileSync('apps-script/Code.gs','utf8');
function must(x,msg){ if(!x) throw new Error(msg); }
must(code.includes("const SBM_VERSION = '5.12.0';"),'version');
must(code.includes(".addItem('Creatorで作った新記事を登録','sbmOpenCreatorPublicationRegisterDialog')"),'creator menu');
must(code.includes('function sbmRegisterCreatorPublicationResponse(raw)'),'creator full-response registration backend');
must(code.includes('function sbmCreatorExtractJsonObject_(text)'),'creator JSON extraction');
must(code.includes("sbmDoctorCreatorPublishedArticle_(caseId,url,title)"),'reuse existing creator publication pipeline');
must(code.includes("if (/^\\d+(?:[.,]\\d+)?$/.test(last)) return '';"),'numeric slug guard');
must(code.includes("obj['記事ステータス']='検索露出待ち'"),'GSC waiting state preserved');
must(code.includes("obj['作業状態']='👀 モニター中'"),'monitoring state preserved');
must(code.includes("Creator回答のSiteIDがこのSBMと一致しません"),'site identity guard');
must(code.includes("Creator案件をSBMで見つけられません"),'case identity guard');
console.log('product5120_creator_registration_and_title_guard_test: PASS');
