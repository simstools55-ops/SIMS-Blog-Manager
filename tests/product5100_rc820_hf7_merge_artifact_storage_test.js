const fs=require('fs'),path=require('path');const c=fs.readFileSync(path.join(__dirname,'..','apps-script','Code.gs'),'utf8');
function ok(x,m){if(!x){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(c.includes("sbmArtifactChildFolder_(parent,'SIMS-Artifacts')"),'automatic artifact root');
ok(c.includes("'Merge-Results'"),'Merge artifact folder');
ok(c.includes("'-result.json'"),'full result JSON file');
ok(c.includes("'-merged-article.md'"),'merged article Markdown file');
ok(c.includes('artifact_url:artifact.resultFileUrl'),'cell summary contains artifact reference');
ok(c.includes('ctx.artifact=artifact'),'completion context carries artifact reference');
ok(c.includes('Merge完成原稿を開く'),'artifact open button exists');
ok(c.includes('openMergeArtifact()'),'artifact open action exists');
ok(!c.includes('Drive保存先を選択'),'no user folder-selection step');
if(!process.exitCode)console.log('PASS: HF7 artifact storage checks');