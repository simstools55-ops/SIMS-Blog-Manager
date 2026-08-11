const fs=require('fs'), assert=require('assert');
const code=fs.readFileSync(__dirname+'/../apps-script/Code.gs','utf8');
function has(x,msg){assert(code.includes(x),msg);}
has('8つのステップを順番に自動で進めます','user-facing 8-step explanation missing');
has('class="spinner"','health spinner missing');
has('最終更新：','last-success display missing');
has("return Math.min(97,Math.round(82+(p/t)*15));",'dynamic screening progress missing');
assert(!code.includes("SCREENING:94"),'fixed 94% regression remains');
has("STEP 7 / 8　記事ごとの健康状態を分析",'step 7 label missing');
has("STEP 8 / 8　精密診断候補を選定し、健康診断書を作成",'step 8 label missing');
has('sbmDoctorSelectionContextLite_()','lightweight article context missing');
has('if(current.length<=500){','500 articles or fewer should use single-pass screening');
has('ブログ健康診断が進行中です。健康診断が完了してから日次処理を実行してください。','daily/health concurrency guard missing');
has('日次処理が実行中です。日次処理が完了してからブログ健康診断を開始してください。','health/daily concurrency guard missing');
has('サーバーからの応答を待っています。処理は継続中です。','long wait feedback missing');
console.log('PASS UAT7 health progress/load regression');
