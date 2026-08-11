const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}
const open=fn('sbmOpenArticleDb');
must(!open.includes('sbmEnsureArticleListDisplayCompleteness_'),'Article list open does not run completeness fetch');
must(!open.includes('sbmFetchArticleMetaInfo_'),'Article list open does not fetch article page metadata');
must(!open.includes('sbmFetchMainQueryForUrl_'),'Article list open does not fetch GSC query data');
must(open.includes('sh.showSheet();ss.setActiveSheet(sh);sh.activate();'),'Article list is direct view-only');
must(code.includes('function sbmEnsureArticleListDisplayCompleteness_'),'Completeness function remains available outside view action');
must(!code.includes('STEP1完了 "+formatTime(fetch&&fetch.elapsedSeconds)'),'Daily progress no longer shows QA STEP1 detail');
must(!code.includes('<div class=groupTitle>STEP3詳細</div>'),'Daily completion no longer shows QA STEP3 detail');
console.log('UAT26 article-list fast view / diagnostic cleanup: PASS');
