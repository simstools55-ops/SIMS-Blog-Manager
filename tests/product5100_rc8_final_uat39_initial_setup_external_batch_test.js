const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}
const meta=fn('sbmFetchArticleMetaInfoBatch_');
must(meta.includes('UrlFetchApp.fetchAll(requests)'),'記事HTML取得をfetchAllで並列化');
must(meta.includes('cache.get(key)'),'既存メタキャッシュを維持');
must(meta.includes('sbmFetchArticleMetaInfo_(info.url)'),'個別取得フォールバックを維持');

const query=fn('sbmFetchMainQueriesForUrlsBatch_');
must(query.includes('UrlFetchApp.fetchAll(requests)'),'Search Consoleクエリ取得をfetchAllで並列化');
must(query.includes("rowLimit:10"),'既存の1記事10クエリ条件を維持');
must(query.includes("operator:'equals',expression:url"),'既存のpage equals条件を維持');
must(query.includes('sbmFetchMainQueryForUrl_(urls[originalIndex])'),'API失敗時の個別取得フォールバックを維持');

const supp=fn('sbmSupplementArticleDbSetupChunk_');
must(supp.includes('sbmFetchArticleMetaInfoBatch_(urls)'),'STEP5は記事HTML一括取得を利用');
must(supp.includes('sbmFetchMainQueriesForUrlsBatch_(urls)'),'STEP5はメインクエリ一括取得を利用');
must(!supp.includes('sbmFetchArticleMetaInfo_(url)'), 'STEP5ループ内の逐次HTML取得を廃止');
must(!supp.includes('sbmFetchMainQueryForUrl_(url)'), 'STEP5ループ内の逐次GSC取得を廃止');
must(supp.includes("' / 記事取得 '+metaSeconds+'秒 / クエリ取得 '+querySeconds+'秒'"),'工程時間に外部通信内訳を記録');
console.log('UAT39 external batch: PASS');
