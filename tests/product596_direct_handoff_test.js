const fs=require('fs');const c=fs.readFileSync('apps-script/Code.gs','utf8');
if(c.includes("6．Doctorの診断結果を登録する")) throw new Error('legacy Doctor registration remains in menu');
if(c.includes(".addItem('8．チェックした記事のWriter依頼文を作る'")) throw new Error('duplicate Writer request remains in menu');
if(!c.includes("6．Writerの処置結果を登録する")) throw new Error('Writer result menu missing');
console.log('PASS product596_direct_handoff');
