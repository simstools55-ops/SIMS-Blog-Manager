const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
ok(code.includes("1．ブログ健康診断を実行") && code.includes("2．健康診断書を開く") && code.includes("3．精密診断候補を見る") && code.includes("4．チェックした記事のDoctor依頼文を作る"),'Doctor menu uses compact 4-step flow');
ok(!code.includes(".addItem('2．健康診断の進み具合を見る'"),'health progress menu removed');
const fn=(code.match(/function sbmDoctorCreateRequestFromDetailedCandidate\(\)\{[\s\S]*?\n\}/)||[''])[0];
ok(fn.includes("getSheetByName('Doctor_精密診断候補')"),'request reads current candidate sheet');
ok(!fn.includes('sbmDoctorRebuildCandidateViewFromSnapshot_'),'request does not rebuild candidate sheet before reading checkbox');
ok(code.includes("cand.getDataRange().setWrap(true)") && code.includes("autoResizeRows(7,out.length)"),'candidate cells wrap with automatic row height');
