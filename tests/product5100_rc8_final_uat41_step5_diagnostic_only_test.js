const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}

const run=fn('sbmRunSetupStep5DiagnosticOnly');
must(run.includes('Math.min(24,urls.length)'), '診断対象を最大24件に制限');
must(run.includes('sbmFetchArticleMetaInfoBatch_(urls)'), '記事HTML一括取得を使用');
must(run.includes('sbmFetchMainQueriesForUrlsBatch_(urls)'), 'GSCクエリ一括取得を使用');
must(run.includes('sbmSetupRecordArticleFetchDiagnostics_(urls,metas)'), 'UAT40診断データを保存');
must(!run.includes('setValues(data)'), '記事DB全体を書き戻さない');
must(!run.includes("row[hm['記事タイトル']]"), '記事タイトルを書き換えない');
must(!run.includes("row[hm['メインクエリ']]"), 'メインクエリを書き換えない');

const dialog=fn('sbmShowSetupStep5DiagnosticOnlyDialog');
must(dialog.includes('記事DBは変更しません'), '利用者へ非更新を明示');
must(dialog.includes('.sbmRunSetupStep5DiagnosticOnly()'), 'ダイアログから診断を実行');

must(code.includes("STEP5診断のみ実行','sbmShowSetupStep5DiagnosticOnlyDialog'"), 'メニュー項目を追加');
console.log('UAT41 STEP5 diagnostic-only: PASS');
