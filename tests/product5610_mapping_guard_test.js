const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function must(re,msg){if(!re.test(code)){throw new Error(msg)}}
must(/const SBM_VERSION = '5\.9\.0-rc\.1'/,'version');
must(/url, '', '', m\.clicks, m\.impressions, ctr, pos/,'H1 placeholder missing');
must(/function sbmValidateFreshArticleDbRows_/,'validator missing');
must(/row\.length !== headers\.length/,'width guard missing');
must(/ctr > 1\.000001/,'CTR guard missing');
must(/clicks > imps/,'click-impression guard missing');
must(/sbmValidateFreshArticleDbRows_\(freshRows \|\| \[\]\)/,'merge guard missing');
console.log('product5610_mapping_guard_test: PASS');
