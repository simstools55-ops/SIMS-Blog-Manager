const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(c.includes('id="resumeReloadButton"'),'reload button has stable id');
ok(c.includes('b.textContent="読み込み中…"'),'button text changes immediately');
ok(c.includes('前回の処置を再読み込み中…'),'status changes immediately on click');
ok(c.includes('b.disabled=true'),'button disables while loading');
ok(c.includes('b.disabled=false;b.textContent="前回の処置を再読み込み"'),'button restores');
ok(c.includes('再読み込みに失敗しました。\\n'),'failure feedback exists');
ok(c.includes('走査：'),'HF8.2 diagnostics preserved');
if(!process.exitCode)console.log('PASS: HF8.3 reload feedback checks');