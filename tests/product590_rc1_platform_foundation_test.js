const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(cond,msg){if(!cond){throw new Error(msg);}}
ok(code.includes("const SBM_VERSION = '5.9.1';"),'version');
ok(code.includes("const SBM_SHARED_VERSION = '3.4.0';"),'shared version');
ok(code.includes("PLATFORM_CASES: 'Platform_Cases'"),'cases sheet');
ok(code.includes('function sbmPlatformEnsureSheets_()'),'ensure sheets');
ok(code.includes('function sbmPlatformNormalizeLegacyWriterResult_'),'legacy adapter');
ok(code.includes(".addItem('Editorial Platformの状態','sbmPlatformShowStatus')"),'menu');
console.log('Product 5.9.0 RC1 platform foundation static test: PASS');
