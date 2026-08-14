const fs=require('fs'),path=require('path');const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(c.includes('mergeCompleteTarget'),'Merge completion target box exists');
ok(c.includes('setMergeCompletionContext'),'target rendering function exists');
ok(c.includes('統合先：'),'primary article is explicitly labeled');
ok(c.includes('吸収：'),'absorbed article is explicitly labeled');
ok(c.includes('方向：'),'merge direction is explicitly labeled');
ok(c.includes('MERGE_COMPLETION_CONTEXT'),'compact completion context is persisted');
ok(c.includes('pendingMergeContext'),'completion target is restored on resume');
ok(c.includes('改善履歴を登録しています…'),'completion progress phase 1');
ok(c.includes('記事管理を「モニター中」へ同期しています…'),'completion progress phase 2');
ok(c.includes('28日後の効果測定を設定しています…'),'completion progress phase 3');
ok(c.includes('改善の推移とHomeを更新しています…'),'completion progress phase 4');
ok(c.includes('clearInterval(timer)'),'completion progress timer is cleared');
if(!process.exitCode)console.log('PASS: HF6 Merge safety UI checks');