const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'apps-script','Code.gs'),'utf8');
const dist=fs.readFileSync(path.join(root,'distribution','Code.gs'),'utf8');
const required=[
  "const SBM_VERSION = '5.9.1'",
  'SIMS_DOCTOR_EVIDENCE_PACKAGE_V2',
  "package_version:'2.1.0'",
  'compatible_with',
  'validation_version',
  'allowedClicks',
  'allowedImpressions',
  'positionMismatch'
];
required.forEach(x=>{if(!code.includes(x))throw new Error('missing '+x);});
if(code!==dist)throw new Error('Code.gs and distribution/Code.gs differ');
const schema=JSON.parse(fs.readFileSync(path.join(root,'contracts','schemas','SIMS_DOCTOR_SINGLE_CASE_REQUEST_V2.schema.json'),'utf8'));
if(schema.properties.evidence_package.properties.package_format.const!=='SIMS_DOCTOR_EVIDENCE_PACKAGE_V2')throw new Error('schema package format mismatch');
console.log('Product 5.7.1 RC10 Evidence Package v2 static test: PASS');
