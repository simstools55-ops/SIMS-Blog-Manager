const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(c.includes("const SBM_VERSION = '5.10.0-RC8.21'"),'internal build version');
ok(c.includes("const SBM_DISPLAY_VERSION = '5.10.0'"),'three-part display version');
ok(c.includes("setValue('v' + SBM_DISPLAY_VERSION)"),'Home uses display version');
ok(!c.includes('A900059への本文反映'),'no stale hard-coded Merge ArticleID');
ok(c.includes("finalized.articleId?finalized.articleId+'への'"),'Merge completion message uses dynamic primary ArticleID');
ok(!c.includes('④ Merge処置を完了する（HF8.9）'),'no visible HF suffix in Merge completion heading');
ok(c.includes('2項目すべてを実施・確認してから登録してください。'),'two-check Merge completion preserved');
ok(c.includes('統合先記事を開く'),'primary article navigation preserved');
ok(c.includes('吸収記事を開く'),'absorbed article navigation preserved');
ok(c.includes('function sbmDoctorResumeMergeRoleInfo_'),'compact Merge role recovery preserved');
ok(c.includes('function sbmArtifactStoreMergeResult_'),'Drive artifact storage preserved');
if(!process.exitCode)console.log('PASS: RC8.21 release regression checks');