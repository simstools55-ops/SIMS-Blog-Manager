const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(c.includes('onclick="manualResumeExisting()"'),'button uses manual resume only');
ok(c.includes('function autoResumeExisting()'),'auto resume is separate');
ok(c.includes('function manualResumeExisting()'),'manual resume is separate');
ok(c.includes('document.addEventListener("DOMContentLoaded",autoResumeExisting)'),'DOMContentLoaded invokes auto resume');
ok(c.includes('自動再開に時間がかかっています。'),'slow auto-resume guidance exists');
ok(c.includes('if(b){b.disabled=true;b.textContent="読み込み中…"}'),'manual click alone disables button');
ok(!c.includes('document.addEventListener("DOMContentLoaded",resumeExisting)'),'old self-disabling hook removed');
ok(c.includes('走査：'),'HF8.2 diagnostics preserved');
if(!process.exitCode)console.log('PASS: HF8.4 auto/manual resume separation checks');
