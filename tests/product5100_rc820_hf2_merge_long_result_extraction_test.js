const assert=require('assert');

function contractNameOf(o){
  if(!o||typeof o!=='object')return '';
  return String(o.envelope&&o.envelope.contract_name||o.contract_name||o.format||'');
}
function balancedJsonFrom(text,start){
  var t=String(text||''),depth=0,inString=false,escape=false;
  if(start<0||t.charAt(start)!=='{')return '';
  for(var i=start;i<t.length;i++){
    var ch=t.charAt(i);
    if(inString){
      if(escape){escape=false;continue;}
      if(ch==='\\'){escape=true;continue;}
      if(ch==='"')inString=false;
      continue;
    }
    if(ch==='"'){inString=true;continue;}
    if(ch==='{')depth++;
    else if(ch==='}'){
      depth--;
      if(depth===0)return t.substring(start,i+1);
    }
  }
  return '';
}
function extractContract(text,contractName){
  var t=String(text||'').trim(),want=String(contractName||'').trim();
  function accept(candidate){
    var c=String(candidate||'').trim();if(!c)return '';
    try{var o=JSON.parse(c);return contractNameOf(o)===want?c:'';}catch(ignore){return '';}
  }
  var whole=accept(t);if(whole)return whole;
  var fenceRe=/```(?:json)?\s*([\s\S]*?)```/gi,m;
  while((m=fenceRe.exec(t))!==null){var fenced=accept(m[1]);if(fenced)return fenced;}
  var markerPos=t.indexOf(want);
  while(markerPos>=0){
    var starts=[],p=markerPos;
    while((p=t.lastIndexOf('{',p-1))>=0){starts.push(p);if(starts.length>=80)break;}
    for(var i=0;i<starts.length;i++){
      var objText=balancedJsonFrom(t,starts[i]),hit=accept(objText);
      if(hit)return hit;
    }
    markerPos=t.indexOf(want,markerPos+want.length);
  }
  throw new Error('not found');
}

const longBody = '# 統合後完成原稿\\n' + '本文 "引用" {見た目の中括弧} \\\\ path\\n'.repeat(3000);
const result = {
  envelope:{contract_name:'SIMS_MERGE_TREATMENT_RESULT_V1'},
  payload:{case_id:'SITE-OPP-X',result_status:'SUCCESS',
    merged_article:{content_markdown:longBody,publication_ready:true}}
};
const response = [
  '人間向け説明',
  '```',
  '# 統合後完成原稿',
  'これはJSONではありません。 {本文用の括弧}',
  '```',
  'さらに説明',
  '```json',
  JSON.stringify(result,null,2),
  '```',
  '末尾コメント'
].join('\n');

const extracted=extractContract(response,'SIMS_MERGE_TREATMENT_RESULT_V1');
const parsed=JSON.parse(extracted);
assert.equal(parsed.envelope.contract_name,'SIMS_MERGE_TREATMENT_RESULT_V1');
assert.equal(parsed.payload.merged_article.content_markdown,longBody);

// Direct JSON is also accepted.
assert.equal(JSON.parse(extractContract(JSON.stringify(result),'SIMS_MERGE_TREATMENT_RESULT_V1')).payload.case_id,'SITE-OPP-X');

// A different contract must not be accepted.
let failed=false;
try{extractContract('```json\n{"envelope":{"contract_name":"OTHER"}}\n```','SIMS_MERGE_TREATMENT_RESULT_V1')}catch(e){failed=true}
assert.ok(failed);

console.log('PASS: long Merge response contract extraction');
