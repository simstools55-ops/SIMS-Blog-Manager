const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
function fn(name){const s=code.indexOf('function '+name);if(s<0)return '';let b=code.indexOf('{',s),d=0,i=b;for(;i<code.length;i++){if(code[i]==='{')d++;else if(code[i]==='}'&&--d===0){i++;break;}}return code.slice(s,i);}
const stage=fn('sbmDoctorRunHealthStageFromDialog');
must(!stage.includes('sbmEnsureArticleListDisplayCompleteness_'),'健康診断STEP1で外部記事情報補完をしない');
must(stage.includes('sbmDoctorEnsureMedicalSheetStructure_'),'健康診断STEP1は軽量構造確認だけ');
must(!stage.includes('sbmDoctorEnsureMedicalSheets_()'),'健康診断STEP1で全Doctorシート再装飾しない');

const save=fn('sbmDoctorSaveHealthRun_');
must(!save.includes('sbmDoctorEnsureMedicalSheets_'),'進捗保存ごとにDoctor全シート再装飾しない');
must(save.includes('sbmEnsureHeaders_(sh,SBM_HEADERS.DOCTOR_HEALTH_RUN)'),'実行履歴シートの必要構造だけ保証');

const start=fn('sbmDoctorRunHealthCheck');
must(!start.includes('sbmDoctorClearSnapshotForRun_(id)'),'新規健康診断開始前にSnapshot全件再書込しない');

const light=fn('sbmDoctorEnsureMedicalSheetStructure_');
must(!light.includes('sbmStyleDataSheet_'),'軽量構造確認で全範囲装飾しない');
must(!light.includes('autoResizeColumns'),'軽量構造確認で列幅自動調整しない');
console.log('UAT29 health preflight fast path: PASS');
