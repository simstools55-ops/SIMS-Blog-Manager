const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(c.includes('前回の処置を再読み込み（HF8.7）'),'visible HF8.7 fingerprint');
ok(c.includes('【HF8.7】ボタン入力を検出しました。'),'pointer diagnostic updated');
ok(c.includes('HF8.7イベント設定済み。'),'script-start diagnostic updated');
ok(!c.includes('自動再開に失敗しました。「前回の処置を再読み込み」を押してください。\\n"+'),'single escaped newline no longer remains in embedded source');
if(!process.exitCode)console.log('PASS: HF8.7 embedded-script escaping checks');