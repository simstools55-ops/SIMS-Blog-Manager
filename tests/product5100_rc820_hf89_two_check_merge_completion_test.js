const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(c.includes('④ Merge処置を完了する（HF8.9）'),'HF8.9 fingerprint');
ok(!c.includes('id="mergeAbsorbed"'),'third checkbox removed');
ok(!c.includes('mergeAbsorbedLabel'),'third label removed');
ok(c.includes('2項目すべてを実施・確認してから登録してください。'),'two-check validation');
ok(c.includes("change_summary:['Merge統合原稿を公開','301リダイレクト設定']"),'feedback summary simplified');
ok(c.includes('統合先記事を開く'),'HF8.8 primary article navigation preserved');
ok(c.includes('吸収記事を開く'),'HF8.8 absorbed article navigation preserved');
if(!process.exitCode)console.log('PASS: HF8.9 two-check Merge completion tests');