const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
const checks=[
 ['version',code.includes("const SBM_VERSION = '5.9.1';")],
 ['position data retained',code.includes("'改善前順位','現在順位','順位変化'")],
 ['judgment colors',code.includes("value === '大きく改善'")&&code.includes("value === '改善'")&&code.includes("value === '改善傾向'")&&code.includes("value === '元に戻す検討'")],
 ['open reapplies style',code.includes('function sbmOpenEffectiveness(){')&&code.includes('try{sbmStyleEffectSheetV2_();}catch(e){}')],
 ['code distribution same',fs.readFileSync('distribution/Code.gs','utf8')===code]
];
let ok=true;for(const [n,v] of checks){console.log((v?'PASS ':'FAIL ')+n);if(!v)ok=false;}process.exit(ok?0:1);
