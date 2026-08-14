const fs=require('fs'), path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
function ok(cond,msg){if(!cond){console.error('FAIL:',msg);process.exitCode=1}else console.log('PASS:',msg)}
ok(code.includes('id="treatmentArticleTitle"'),'target article title display exists');
ok(code.includes('"対象記事："+displayTitle'),'UI shows human-readable article title');
ok(code.includes('articleTitle:r.articleTitle||""'),'new actions retain article title');
ok(code.includes('articleTitle:articleTitle,resume:true'),'resume actions retain article title');
ok(code.includes('a.articleTitle=r.articleTitle||a.articleTitle||""'),'rebuilt referrals refresh article title');
if(!process.exitCode) console.log('RC8.20 title visibility regression checks passed.');
