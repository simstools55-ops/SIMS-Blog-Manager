const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(code.includes('③ Mergeの統合処置結果を登録'),'new Merge treatment-result heading');
ok(!code.includes('③ Mergeの統合設計結果を登録'),'old Merge design-result heading removed');
ok(code.includes('未完了案件を読み込んでいます…'),'resume progress phase 1');
ok(code.includes('紹介状／処置結果を復元しています…'),'resume progress phase 2');
ok(code.includes('画面を前回の続きへ戻しています…'),'resume progress phase 3');
ok(code.includes('clearInterval(timer)'),'resume timer cleanup');
if(!process.exitCode)console.log('PASS: HF4 UI checks');
