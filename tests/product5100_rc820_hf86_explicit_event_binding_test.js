const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(c.includes('前回の処置を再読み込み（HF8.6）'),'visible HF8.6 fingerprint');
ok(!c.includes('onclick="manualResumeExisting()"'),'inline onclick removed');
ok(c.includes('rb.addEventListener("click"'),'explicit click listener bound');
ok(c.includes('rb.addEventListener("pointerdown"'),'pointerdown diagnostic listener bound');
ok(c.includes('【HF8.6】ボタン入力を検出しました。'),'immediate pointer diagnostic exists');
ok(c.includes('position:relative;z-index:9999'),'button forced in front');
ok(c.includes('HF8.6イベント設定済み。'),'listener setup fingerprint visible');
if(!process.exitCode)console.log('PASS: HF8.6 explicit event binding checks');
