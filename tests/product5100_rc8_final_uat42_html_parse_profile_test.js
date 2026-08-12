const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}
const b=fn('sbmFetchArticleMetaInfoBatch_');
['contentTextMs','titleTagMs','pickTitleMs','cleanTitleMs','descriptionMs','cachePutMs','parseMs'].forEach(k=>must(b.includes(k),k+' を計測'));
must(b.includes('parseTotals:totals'),'集計値を保存');
const r=fn('sbmSetupRecordArticleFetchDiagnostics_');
must(r.includes('pickTitleMs:Number(d.pickTitleMs||0)'), 'URL別プロファイルを保存');
const sh=fn('sbmShowSetupArticleFetchDiagnostics');
must(sh.includes('HTML後処理 合計'),'HTML後処理集計を表示');
must(sh.includes('sort(function(a,b){return Number(b.parseMs||0)-Number(a.parseMs||0);})'),'遅いURL順に表示');
const run=fn('sbmRunSetupStep5DiagnosticOnly');
must(!run.includes('setValues('),'診断のみ実行は記事DBへ書き戻さない');
console.log('UAT42 HTML parse profiling: PASS');
