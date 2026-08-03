const fs=require('fs');const c=fs.readFileSync('apps-script/Code.gs','utf8');
if(!c.includes("const SBM_VERSION = '5.6.15'"))throw new Error('version');
if(!c.includes("記事ランクを復旧・再計算"))throw new Error('menu');
if(!c.includes('sbmApplyArticleRanksToObjectMap_(map, SBM_DEFAULTS.MIN_IMPRESSIONS)'))throw new Error('default threshold');
if(!c.includes("nurtureCount >= Math.ceil(keys.length * 0.90)"))throw new Error('mass guard');
console.log('PASS product5615 rank recovery');
