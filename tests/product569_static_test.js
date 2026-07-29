const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
const checks=[
 ['version',code.includes("const SBM_VERSION = '5.6.9';")],
 ['current position decimal',code.includes("currentPosRange")&&code.includes("setNumberFormat('0.0')")],
 ['judgment colors',code.includes("value === '大きく改善'")&&code.includes("value === '改善'")&&code.includes("value === '横ばい'")&&code.includes("value === '悪化'")],
 ['open reapplies style',code.includes('function sbmOpenEffectiveness(){')&&code.includes('try{sbmStyleEffectSheetV2_();}catch(e){}')],
 ['code distribution same',fs.readFileSync('distribution/コード.gs','utf8')===code]
];
let ok=true;for(const [n,v] of checks){console.log((v?'PASS ':'FAIL ')+n);if(!v)ok=false;}process.exit(ok?0:1);
