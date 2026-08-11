const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}
const merge=fn('sbmDoctorMergeSnapshotMetrics_');
must(!merge.includes('existing=existing.filter'),'180日統合で過去Snapshotを保持しながら再構成しない');
must(!merge.includes('sh.clearContents()'),'Snapshotシート全体clearContentsをしない');
must(merge.includes("if(oldBody) sh.getRange(2,1,oldBody,width).clearContent();"),'180日はデータ本文だけを消去');
must(merge.includes("if(out.length) sh.getRange(2,1,out.length,width).setValues(out);"),'180日は現行記事を一括保存');
must(merge.includes("var current=sh.getRange(2,1,last-1,width).getValues();"),'後続期間は現行Snapshotだけを読込');
must(merge.includes("sh.getRange(2,1,current.length,width).setValues(current);"),'後続期間は現行Snapshotだけを一括更新');
must(merge.includes("var articles=sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB), siteId=sbmGetSetting_('SiteID','');"),'SiteIDは記事ごとに設定シートを読まない');
console.log('UAT31 current-run snapshot optimization: PASS');
