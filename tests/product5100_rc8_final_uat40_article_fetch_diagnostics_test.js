const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}
const batch=fn('sbmFetchArticleMetaInfoBatch_');
must(batch.includes('fetchAllElapsedMs'),'fetchAll全体待機時間を計測');
must(batch.includes("source:'cache'"),'キャッシュ利用を識別');
must(batch.includes("source='fallback'"),'fallbackを識別');
must(batch.includes('status:status'),'HTTP状態を記録');

const diag=fn('sbmShowSetupArticleFetchDiagnostics');
must(diag.includes('各URL単独の通信時間は取得できません'),'fetchAll個別時間を推測しない説明');
must(diag.includes("r.elapsedMs===''?'—'"),'fetchAll個別時間はダッシュ表示');

const supp=fn('sbmSupplementArticleDbSetupChunk_');
must(supp.includes('sbmSetupRecordArticleFetchDiagnostics_(urls,metas)'), 'STEP5実行時に診断を保存');
must(code.includes("STEP5の記事取得診断を確認','sbmShowSetupArticleFetchDiagnostics'"),'診断メニューを追加');
console.log('UAT40 article fetch diagnostics: PASS');
