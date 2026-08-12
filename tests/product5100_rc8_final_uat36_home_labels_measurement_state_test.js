const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}

const home=fn('sbmBuildHomeSheet_');
must(home.includes("var left = [['改善候補','0件'],['モニター中','0件'],['改善確認完了','0件'],['未取得記事','0件'],['','']];"),'Home左欄の名称と順序');

const need=fn('sbmHomeLayoutNeedsRebuild_');
must(need.includes("['A15','改善候補']"),'旧HomeをUAT36レイアウトへ再構築');
must(need.includes("['A17','改善確認完了']"),'改善確認完了は3番目');
must(need.includes("['A18','未取得記事']"),'未取得記事は改善確認完了の下');

const refresh=fn('sbmRefreshHome_');
must(refresh.includes("sh.getRange('C17:D17').setValue(weekly.completed + '件')"),'改善確認完了件数をC17へ');
must(refresh.includes("sh.getRange('C18:D18').setValue(missingCount + '件')"),'未取得記事件数をC18へ');

const migrate=fn('sbmMigrateLegacyMonitoringLabels_');
must(migrate.includes("if(v==='未測定'||v==='測定中'){r[0]='測定待ち'"),'判定系の測定中を測定待ちへ移行');
must(migrate.includes("if(v==='未測定'||v==='測定待ち'||v==='測定中'){r[0]='モニター中'"),'状態系をモニター中へ移行');

const weekly=fn('sbmRecordWeeklyMeasurement_');
must(weekly.includes("n>=4?'完了':'モニター中'"),'途中状態はモニター中');
must(weekly.includes("setValue('経過観察中')"),'途中の最終判定は経過観察中');
must(!weekly.includes("setValue('測定中')"),'新規処理で測定中を生成しない');

must(code.includes("'最終判定':'経過観察中','状態':'モニター中'"),'新規履歴の最終判定は経過観察中');
must(code.includes("h['最終判定']=sbmFinalImprovementOutcome_(currentJudgment,rec.complete);h['状態']=rec.complete?'完了':'モニター中';"),'測定同期も正本最終判定へ統一');
console.log('UAT36 Home labels / measurement-state semantics: PASS');
