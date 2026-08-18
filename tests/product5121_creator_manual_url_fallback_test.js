const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'apps-script', 'Code.gs'), 'utf8');
function must(re, label){ if(!re.test(code)){ console.error('FAIL:', label); process.exit(1); } }
must(/const SBM_VERSION = '5\.12\.1';/, 'version');
must(/id="publishedUrl"/, 'manual URL field');
must(/sbmRegisterCreatorPublicationResponse\(raw,manualUrl\)/, 'client sends manual URL');
must(/function sbmRegisterCreatorPublicationResponse\(raw,manualPublishedUrl\)/, 'server accepts manual URL');
must(/if\(manualUrl\)url=manualUrl;/, 'manual URL has explicit priority');
must(/setWidth\(740\)\.setHeight\(620\)/, 'dialog size');
must(/\.footer\{flex:none;/, 'fixed footer layout');
console.log('PASS: v5.12.1 Creator manual URL fallback static test');
