const fs=require('fs');
const path=require('path');
function ok(v,m){if(!v){console.error('FAIL '+m);process.exit(1)}console.log('PASS '+m)}
const allowed=['Code.gs','README-FIRST.md','SIMS-Blog-Manager-template-Product5.0-Official.xlsx','SIMS-Blog-Manager-template-Product5.4.3-Official.xlsx','appsscript.json'].sort();
const actual=fs.readdirSync('distribution').filter(n=>fs.statSync(path.join('distribution',n)).isFile()).sort();
ok(JSON.stringify(actual)===JSON.stringify(allowed),'REG-DIST-CLEAN-001: distribution contains only allowlisted files');
ok(actual.every(n=>/^[\x20-\x7E]+$/.test(n)),'REG-DIST-FILENAME-001: distribution filenames are ASCII');
const readme=fs.readFileSync('distribution/README-FIRST.md','utf8');
ok(readme.includes('distribution` フォルダーを一度削除'),'overlay extraction cleanup is explicitly required');
ok(fs.readFileSync('apps-script/Code.gs','utf8')===fs.readFileSync('distribution/Code.gs','utf8'),'distribution Code.gs mirrors source');
console.log('PASS product5100_rc8_final_uat5_distribution_clean_test');
