const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}
const stage=fn('sbmDoctorRunHealthStageFromDialog');
for(const k of ['timing.parts.articleInfo','timing.parts.api','timing.parts.snapshot','timing.parts.count']) must(stage.includes(k),'health stage times '+k);
must(code.includes('function sbmDoctorSaveHealthStageTiming_'),'health timings persist in document properties');
const screen=fn('sbmDoctorRunScreeningBatch_');
for(const k of ['perf.read','perf.context','perf.classify','perf.write','perf.save','perf.finalize']) must(screen.includes(k),'screening times '+k);
must(code.includes('id="timings"'),'health dialog has temporary stage timing field');
must(code.includes('工程時間："+timingLines.join(" / ")'),'health dialog accumulates stage times');
console.log('UAT28 health stage profiler: PASS');
