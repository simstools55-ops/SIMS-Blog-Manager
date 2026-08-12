const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function m(x,s){if(!x){console.error('FAIL '+s);process.exit(1)}console.log('PASS '+s)}
m(!c.includes('SBM_UAT44_PROFILE_'),'UAT profiler removed');
m(!c.includes('STEP5診断のみ実行'),'STEP5 diagnostic menu removed');
m(!c.includes('STEP5の記事取得診断を確認'),'STEP5 diagnostic report menu removed');
m(!c.includes('初回セットアップの工程時間を確認'),'setup timing menu removed');
m(!c.includes('健康診断の工程時間を確認'),'health timing menu removed');
m(c.includes("var setupSettings=sbmGetSettingsMap_();"),'settings batch optimization retained');
m(c.includes("var batchBlogName=String(setupSettings['BlogName']||'').trim();"),'BlogName memory cache retained');
m(c.includes("sbmPickArticleTitle_(html,titleTag,info.url,batchBlogName)"),'cached BlogName hot path retained');
m(c.includes("fetchAll("),'fetchAll optimization retained');
m(c.includes("sbmDoctorRunHealthCheck"),'Doctor health check retained');
m(c.includes("sbmRunDailyUpdateManual"),'daily processing retained');
m(c.includes("sbmOpenAllBlogArticles"),'article list retained');
console.log('RC8 Final Cleanup PASS');
