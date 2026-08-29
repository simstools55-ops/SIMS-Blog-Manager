const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'apps-script', 'Code.gs'), 'utf8');
function ok(cond, msg){ if(!cond){ console.error('FAIL:',msg); process.exit(1);} console.log('PASS:',msg); }

const start = code.indexOf('function sbmNormalizeUrl_');
const end = code.indexOf('function sbmIsValidArticleUrl_', start);
ok(start >= 0 && end > start, 'canonical URL helper block exists');
const snippet = code.slice(start, end);
const ctx = {};
vm.createContext(ctx);
vm.runInContext(snippet, ctx);

ok(ctx.sbmNormalizeUrl_('https://example.com/1238/') === 'https://example.com/1238', 'trailing slash canonicalized');
ok(ctx.sbmNormalizeUrl_('https://example.com/1238') === 'https://example.com/1238', 'no-slash URL remains canonical');
ok(ctx.sbmUrlEquals_('https://example.com/1238/', 'https://example.com/1238'), 'slash variants compare equal');
ok(ctx.sbmNormalizeUrl_('EXAMPLE.com/1238/?x=1#part') === 'https://example.com/1238', 'host/query/fragment canonicalized');
ok(ctx.sbmNormalizeUrl_('https://Example.COM:443/') === 'https://example.com/', 'root URL retains slash and default https port removed');
ok(code.includes("if(sbmUrlEquals_(rows[i]['記事URL']||'', url||''))"), 'article DB lookup uses canonical comparison');
ok(code.includes("var shown={}; candidates.slice(0,count).forEach(function(c){var k=sbmNormalizeUrl_(c.url||'')"), 'today work-state map uses canonical URL keys');
ok(code.includes('function sbmEnsureCanonicalOperationalUrlsOnce_'), 'one-time operational URL migration exists');
ok(code.includes("props.setProperty('SBM_CANONICAL_URL_STORAGE_VERSION', version)"), 'URL migration is version guarded');
const initStart=code.indexOf('function sbmInitializeSheets(showAlert)'); const initEnd=code.indexOf('function sbmOpenHome',initStart); ok(code.slice(initStart,initEnd).includes('sbmEnsureCanonicalOperationalUrlsOnce_();'), 'URL migration runs during explicit sheet repair');

const dist = fs.readFileSync(path.join(root, 'distribution', 'Code.gs'), 'utf8');
ok(dist === code, 'distribution mirrors Apps Script');
console.log('PASS product5100_rc8_url_canonicalization_test');
