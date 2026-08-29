const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
const version=fs.readFileSync(path.join(root,'VERSION'),'utf8').trim();
function ok(cond,msg){if(!cond){throw new Error(msg)}}
ok(/^5\.18\.[123]$/.test(version),'VERSION must be v5.18.1+ patch');
ok(/const SBM_VERSION = '5\.18\.[123]';/.test(code),'Code version mismatch');
ok(/function sbmPersonalKnowledgeEnsureSite_\(hint\)[\s\S]*?var root = sbmPersonalKnowledgeEnsureRoot_\(\);[\s\S]*?var ident = sbmPersonalKnowledgeIdentityHint_\(hint\)/.test(code),'root must initialize before site identity resolution');
ok(code.includes("legacySiteId = String(hs.site_id || h.site_id || sbmGetSetting_('SiteID','') || '').trim()"),'trusted legacy SiteID hint missing');
ok(code.includes("var pkIngest=sbmPersonalKnowledgeIngestPayload_(doctor,'SIMS Article Doctor',source);"),'Doctor ingestion must pass trusted source request');
ok(code.includes("label === 'HIGH' ? 0.95 : (label === 'MEDIUM' ? 0.80 : (label === 'LOW' ? 0.55 : 0))"),'confidence label normalization missing');
ok(code.includes("var isIndependent=!eventId || existing.confirmation_event_ids.indexOf(eventId)<0;"),'replay-safe confirmation check missing');
const copies=['apps-script/Code.gs','distribution/Code.gs','src/apps-script/Code.gs','src/distribution/Code.gs'].map(p=>fs.readFileSync(path.join(root,p),'utf8'));
ok(copies.every(x=>x===copies[0]),'Code.gs copies are not synchronized');
console.log('product5181_personal_knowledge_autobootstrap_test: PASS');
