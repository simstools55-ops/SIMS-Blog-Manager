const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');

function ok(cond,msg){ if(!cond){ console.error('FAIL:',msg); process.exitCode=1; } else console.log('PASS:',msg); }

ok(code.includes("const SBM_VERSION = '5.15.0';"), 'v5.15.0 version');
ok(code.includes('function sbmStripConfiguredBlogSuffix_'), 'configured BlogName suffix normalizer exists');
ok(!/\bA\d{6}\b/.test(code), 'no hard-coded Article IDs in runtime');

const shared=JSON.parse(fs.readFileSync('shared/learning/LEARNING_REGISTRY.json','utf8'));
ok(Array.isArray(shared.records) && shared.records.length===0, 'embedded operational learning records removed');
ok(shared.scope_policy && shared.scope_policy.product_neutral_only===true, 'product-neutral Shared boundary declared');

const boundary=fs.readFileSync('PERSONAL-KNOWLEDGE-BOUNDARY.md','utf8');
ok(boundary.includes('example.com'), 'synthetic example policy documented');
