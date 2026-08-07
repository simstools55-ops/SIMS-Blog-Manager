const fs=require('fs'),p=require('path');
const code=fs.readFileSync(p.join(__dirname,'..','apps-script','Code.gs'),'utf8');
if(!code.includes("const SBM_VERSION = '5.10.0-RC2';")) throw Error('version');
if(!code.includes("explicitNextActionV2==='WRITER'")) throw Error('V2 next_action routing missing');
if(!code.includes('sbmDoctorFetchCannibalizationEvidence_')) throw Error('cannibal evidence missing');
if(!code.includes("package_version:'2.3.0'")) throw Error('evidence version');
if(!code.includes("dimensions:['page']") || !code.includes("dimension:'query',operator:'equals'")) throw Error('query-page cross-site lookup missing');
console.log('pass');
