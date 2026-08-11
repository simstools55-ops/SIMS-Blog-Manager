const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(c,m){if(!c){console.error('FAIL:',m);process.exit(1)}console.log('PASS:',m)}
ok(code.includes('function sbmRunProgressWorker(workerName){'),'progress dispatcher is public for google.script.run');
ok(code.includes('runner.sbmRunProgressWorker(ws[idx])'),'dialog calls public dispatcher');
ok(!code.includes('function sbmRunProgressWorker_(workerName){'),'private-only dispatcher removed');
