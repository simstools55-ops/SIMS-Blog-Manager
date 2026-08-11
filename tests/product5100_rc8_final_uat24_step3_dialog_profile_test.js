const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
must(!code.includes('<div class=groupTitle>STEP3詳細</div>'),'Final UI does not expose QA-only STEP3 details');
must(!code.includes('<span>STEP3・完了処理</span>'),'Final UI does not expose QA-only STEP3 total');
must(code.includes('<span>全体所要時間</span><b>"+formatTime(r.totalElapsedSeconds)+"</b>'),'Final UI retains user-facing total time');
must(code.includes('summary.step3Timing'),'Internal STEP3 timing remains available for regression diagnosis');
console.log('UAT24 diagnostic UI cleanup superseded by UAT26: PASS');
