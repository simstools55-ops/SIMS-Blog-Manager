const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const c=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
assert(c.includes("const SBM_VERSION = '5.17.0';"));
[
'function sbmPersonalKnowledgeNormalizeCandidate_',
'function sbmPersonalKnowledgeAdmission_',
'function sbmPersonalKnowledgeWriteCandidate_',
'function sbmPersonalKnowledgeSubmitCandidates_',
'function sbmPersonalKnowledgeExtractCandidates_',
'function sbmPersonalKnowledgeIngestPayload_'
].forEach(x=>assert(c.includes(x),x));
assert(c.includes("INFERENCE_REQUIRES_CONFIRMATION"));
assert(c.includes("REPEATED_INDEPENDENT_CONFIRMATION"));
assert(c.includes("TRANSIENT_OR_SECRET"));
assert(c.includes("PersonalKnowledgeWriter"));
console.log("PASS Personal Knowledge Writer v5.17.0");
