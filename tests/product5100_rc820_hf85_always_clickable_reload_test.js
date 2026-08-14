const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(c.includes('前回の処置を再読み込み（HF8.5）'),'visible HF8.5 fingerprint');
ok(c.includes('class="outline"'),'reload button is not gray secondary style');
ok(c.includes('type="button"'),'explicit button type');
ok(c.includes('pointer-events:auto;opacity:1'),'pointer events forced on');
ok(c.includes('manualResumeBusy=false'),'internal busy flag exists');
ok(c.includes('if(manualResumeBusy)'),'double click guarded without disabling button');
ok(!c.includes('resumeReloadButton");if(b){b.disabled=true'),'manual reload no longer disables button');
ok(c.includes('【HF8.5】前回の処置を再読み込み中…'),'click firing has explicit fingerprint');
if(!process.exitCode)console.log('PASS: HF8.5 always-clickable reload button checks');