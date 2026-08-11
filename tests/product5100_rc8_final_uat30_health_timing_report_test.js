const fs=require('fs'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function must(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
must(code.includes('function sbmDoctorGetLatestHealthTimingReport_()'),'保存済みタイミング読込関数を追加');
must(code.includes("SBM_DOCTOR_HEALTH_TIMINGS_"),'UAT29保存キーを利用');
must(code.includes('function sbmDoctorShowLatestHealthTimingReport()'),'工程時間ダイアログを追加');
must(code.includes("健康診断の工程時間を確認','sbmDoctorShowLatestHealthTimingReport'"),'Doctorメニューへ追加');
must(code.includes('最長工程'),'最長工程を表示');
must(code.includes("finalize:'診断書作成'"),'判定最終工程の内訳を表示');
must(code.includes('健康診断やSearch Console取得は実行していません。'),'読み取り専用であることを表示');
console.log('UAT30 saved health timing report: PASS');
