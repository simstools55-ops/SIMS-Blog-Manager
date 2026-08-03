const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
for (const token of ['sbmGuardDailyPerformanceCollapse_','sbmGuardMassNurtureRankResult_','表示回数合計が既存値の2%未満','90%以上が育成']) {
  if(!code.includes(token)) throw new Error('missing: '+token);
}
console.log('Product 5.6.14 rank guard static test: PASS');
