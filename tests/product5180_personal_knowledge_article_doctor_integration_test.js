const fs=require('fs');
const p=require('path');
const root=p.resolve(__dirname,'..');
const code=fs.readFileSync(p.join(root,'src/apps-script/Code.gs'),'utf8');
function must(x,msg){if(!x)throw new Error(msg)}
must(/const SBM_VERSION = '5\.18\.[012]';/.test(code),'version');
must(code.includes("sbmPersonalKnowledgeIngestPayload_(doctor,'SIMS Article Doctor',source)"),'Article Doctor ingestion missing');
must(code.includes('confirmation_event_ids'),'independent confirmation replay guard missing');
must(code.includes("SIMS Site Doctor　精密診断候補"),'candidate title not Site Doctor');
must(code.includes('SIMS Site Doctorメニューの「4．選択記事をArticle Doctorに診断依頼」'),'candidate instruction not Site Doctor menu');
must(!code.includes(".addItem('5．Site Doctor診断結果の処置を進める'"),'Site Doctor result action must be unnumbered');
must(code.includes(".addItem('Site Doctor診断結果の処置を進める'"),'unnumbered Site Doctor result action missing');
console.log('PASS product5180 Personal Knowledge + Site Doctor UI integration');
