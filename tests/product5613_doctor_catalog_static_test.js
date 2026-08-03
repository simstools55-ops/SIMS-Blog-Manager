const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(x,m){if(!x)throw new Error(m)}
ok(code.includes("const SBM_VERSION = '5.6.13'"),'version');
ok(code.includes("ui.createMenu('SIMS Doctor連携')"),'menu');
ok(code.includes('function sbmDoctorGenerateArticleCatalogManual()'),'export function');
ok(code.includes("format: SBM_DOCTOR_CATALOG_FORMAT"),'catalog format');
ok(code.includes('if (runtime && runtime.running)'),'daily conflict guard');
ok(!/function onOpen\(\)[\s\S]{0,2500}sbmDoctorGenerateArticleCatalogManual\(/.test(code),'must not auto-run from onOpen');
ok(!/function sbmRunDaily[\s\S]{0,1500}sbmDoctorGenerateArticleCatalogManual\(/.test(code),'must not run from daily flow');
console.log('Product 5.6.13 Doctor catalog static test: PASS');
