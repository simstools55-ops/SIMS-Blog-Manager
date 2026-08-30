const fs=require('fs'); const s=fs.readFileSync(process.argv[2]||'Code.base.gs','utf8');
function ok(x,m){if(!x){console.error('FAIL '+m);process.exit(1)}console.log('PASS '+m)}
ok(s.includes('5.19.0'),'version 5.19.0');
ok(s.includes("knowledge_candidates: Array.isArray(obj.knowledge_candidates)"),'normal feedback preserves knowledge candidates');
ok(s.includes("sbmPersonalKnowledgeIngestPayload_(data,'SIMS Writer'"),'normal Writer feedback ingests PK candidates');
ok(s.includes("sbmPersonalKnowledgeIngestPayload_(o,'SIMS Writer'"),'Doctor Writer result ingests PK candidates');
ok(s.includes('Personal Knowledge：候補'),'registration reports PK counts');
ok(s.includes("if (!raw.length) return [];"),'legacy no-candidate remains compatible');
