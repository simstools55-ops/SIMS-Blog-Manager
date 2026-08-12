const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(x,m){if(!x){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
must(c.includes("var setupSettings=sbmGetSettingsMap_();"),'STEP5 batch reads settings map once');
must(c.includes("var batchBlogName=String(setupSettings['BlogName']||'').trim();"),'BlogName cached in memory');
must(c.includes("sbmPickArticleTitle_(html,titleTag,info.url,batchBlogName)"),'article title receives cached BlogName');
must(c.includes("sbmCleanDataListText_(articleTitle||'',info.url,batchBlogName)"),'H1 cleanup uses cached BlogName');
must(c.includes("sbmCleanDataListText_(titleTag||'',info.url,batchBlogName)"),'title cleanup uses cached BlogName');
must(c.includes("sbmCleanDataListText_(sbmExtractDescription_(html)||'',info.url,batchBlogName)"),'description cleanup uses cached BlogName');
must(c.includes('blogNameOverride!==undefined&&blogNameOverride!==null'),'cleanup accepts cached override');
must(c.includes("sbmGetSetting_('BlogName','')"),'backward-compatible fallback remains');
must(c.includes('UAT45・整形内部'),'UAT45 diagnostic label');
console.log('UAT45 BlogName cache optimization: PASS');
