const fs=require('fs');
const s=fs.readFileSync(__dirname+'/../apps-script/Code.gs','utf8');
function must(x,m){if(!x)throw new Error(m)}
must(s.includes("const SBM_VERSION = '5.18.3';"),'version');
must(s.includes('function sbmPersonalKnowledgeLog_'),'pk logger');
must(s.includes('console.warn(\'[SIMS Personal Knowledge]'),'cloud warning log');
must(s.includes('PK_CONTEXT_UNAVAILABLE'),'context failure surfaced');
must(s.includes('function sbmPersonalKnowledgeCheckAndInitializeMenu'),'self check menu handler');
must(s.includes(".addItem('Personal Knowledge接続を確認','sbmPersonalKnowledgeCheckAndInitializeMenu')"),'menu item');
must(s.includes("single.message='Article Doctor診断結果をSBMへ登録しました。"),'article doctor label');
must(s.includes('personalKnowledge:pkIngest'),'pk summary returned');
must(s.includes('Personal Knowledge：'),'pk visible result');
console.log('PASS product5183_personal_knowledge_diagnostics_test');
