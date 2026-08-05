const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
const checks=[
 ['H1 retained',code.includes("'メインクエリ','H1タイトル','クリック数'")],
 ['Contract v4.2 retained',code.includes('publication_result.public_ok_changes')||code.includes("'public_ok_changes'")],
 ['Query 200 retained',code.includes('QUERY_ROW_LIMIT = 200')],
 ['Effect columns visible',code.includes('sh.showColumns(1, Math.min(11, sh.getMaxColumns()))')],
 ['Current position decimal',code.includes("['順位','現在順位','改善前順位','Position','現在平均順位']")&&code.includes("setNumberFormat('0.0')")],
 ['Judgment colors',code.includes("value === '大きく改善'")&&code.includes("value === '元に戻す検討'")]
];
let ok=true;for(const [n,v] of checks){console.log((v?'PASS ':'FAIL ')+n);if(!v)ok=false;}process.exit(ok?0:1);
