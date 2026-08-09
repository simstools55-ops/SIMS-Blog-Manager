const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(cond,msg){ if(!cond){ console.error('FAIL:',msg); process.exit(1); } }
ok(code.includes('function sbmGscDisplayUrl_('),'GSC display URL helper exists');
ok(code.includes('function sbmPropagatePreferredDisplayUrls_('),'preferred display URL propagation exists');
ok(code.includes("var version = 'RC8_URL_DISPLAY_POLICY_V2'"),'old destructive canonical storage migration disabled');
ok(code.includes("if (displayUrl) old['記事URL'] = displayUrl;"),'existing Article DB adopts current GSC representation');
ok(code.includes("preferredDisplayUrls[url] = displayUrl"),'daily merge remembers GSC representation');
ok(code.includes('sbmPropagatePreferredDisplayUrls_(preferredDisplayUrls)'),'GSC representation propagated to operational sheets');
ok(code.includes("return [range.startDate, range.endDate, r.keys[0], sbmGscDisplayUrl_(r.keys[1])"),'query-page data preserves GSC URL representation');
ok(code.includes('urlKey:sbmNormalizeUrl_(url)'),'page-first keeps separate internal comparison key');
console.log('PASS product5100_rc8_gsc_display_url_policy_test');
