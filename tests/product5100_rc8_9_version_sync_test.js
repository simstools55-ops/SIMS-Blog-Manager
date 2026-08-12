const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
const dist=fs.readFileSync(path.join(root,'distribution','Code.gs'),'utf8');
const version=fs.readFileSync(path.join(root,'VERSION'),'utf8').trim();
const identity=JSON.parse(fs.readFileSync(path.join(root,'PRODUCT_IDENTITY.json'),'utf8'));
function ok(x,m){if(!x)throw new Error(m);}
ok(version==='5.10.0-RC8.9','VERSION');
ok(identity.current_version===version,'identity version');
ok(app.includes("const SBM_VERSION = '5.10.0-RC8.9';"),'Code version');
ok(app.includes("sbmSetSetting_('Version', SBM_VERSION, 'システムバージョン');"),'Settings version refresh');
ok(app===dist,'distribution Code.gs sync');
ok(app.includes("b.textContent=\"登録中...\""),'registration progress');
ok(app.includes('sbmDoctorIsHealthRunActivelyRunning_'),'health run active guard');
console.log('Product 5.10.0-RC8.9 version/package sync test: PASS');
