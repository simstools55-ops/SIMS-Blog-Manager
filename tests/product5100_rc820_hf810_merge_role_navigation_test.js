const fs=require('fs'),path=require('path');
const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(c.includes('>前回の処置を再読み込み</button>'),'reload button has no HF suffix');
ok(!c.includes('前回の処置を再読み込み（HF8.7）'),'old visible HF suffix removed');
ok(c.includes('id="mergeArticleNavStep2"'),'Step2 Merge article navigation exists');
ok(c.includes('renderMergeStep2Navigation_(a)'),'Step2 renderer is called');
ok(c.includes('統合先記事を開く'),'primary role button exists');
ok(c.includes('吸収記事を開く'),'absorbed role button exists');
ok(c.includes('openMergePrimaryStep2'),'primary Step2 action exists');
ok(c.includes('openMergeAbsorbedStep2'),'absorbed Step2 action exists');
ok(c.includes('④ Merge処置を完了する（HF8.9）'),'two-check Merge completion preserved');
if(!process.exitCode)console.log('PASS: HF8.10 Merge role navigation checks');