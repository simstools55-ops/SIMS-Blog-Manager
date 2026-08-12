const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}

const batch=fn('sbmFetchArticleMetaInfoBatch_');
must(batch.includes('var bypassCache=options.bypassCache===true'), 'optional cache bypass');
must(batch.includes('if(!bypassCache){'), 'normal path still uses cache');
must(batch.includes("source=bypassCache?'fetchAll-bypass-cache':'fetchAll'"), 'diagnostic source is explicit');
must(batch.includes('cacheHits:bypassCache?0:'), 'bypass diagnostics report zero cache hits');

const run=fn('sbmRunSetupStep5DiagnosticOnly');
must(run.includes("sbmFetchArticleMetaInfoBatch_(urls,{bypassCache:true})"), 'diagnostic-only runner bypasses cache');
must(run.includes('診断のみ（キャッシュ無視）'), 'timing record identifies bypass');
must(!run.includes('setValues('), 'diagnostic runner remains read-only');

const dialog=fn('sbmShowSetupStep5DiagnosticOnlyDialog');
must(dialog.includes('この診断だけキャッシュを無視します'), 'user is told bypass is diagnostic-only');

const supp=fn('sbmSupplementArticleDbSetupChunk_');
must(supp.includes('sbmFetchArticleMetaInfoBatch_(urls);'), 'normal STEP5 still uses cache normally');
must(!supp.includes('bypassCache:true'), 'production STEP5 does not bypass cache');

console.log('UAT43 cache bypass diagnostic: PASS');
