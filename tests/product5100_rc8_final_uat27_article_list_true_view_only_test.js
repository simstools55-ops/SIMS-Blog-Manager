const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){
  const s=code.indexOf('function '+name); if(s<0)return '';
  let b=code.indexOf('{',s),d=0,i=b;
  for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}
  return code.slice(s,i);
}
const all=fn('sbmOpenAllBlogArticles');
must(all.includes('return sbmOpenArticleDb();'),'記事一覧メニューは表示関数へ直結');
must(!all.includes('sbmDoctorReconcileCompletedTreatments_'),'記事一覧メニューでDoctor全件照合をしない');
const open=fn('sbmOpenArticleDb');
must(!open.includes('sbmEnsureArticleListDisplayCompleteness_'),'記事一覧表示で補完をしない');
must(open.includes('sh.showSheet();ss.setActiveSheet(sh);sh.activate();'),'記事一覧は直接表示');
must(code.includes('function sbmDoctorReconcileCompletedTreatments_()'),'Doctor保守関数自体は削除せず保持');
console.log('UAT27 article list true view-only: PASS');
