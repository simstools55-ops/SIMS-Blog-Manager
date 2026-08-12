const fs=require('fs'),p=require('path');
const root=p.join(__dirname,'..');
const code=fs.readFileSync(p.join(root,'apps-script','Code.gs'),'utf8');
function ok(v,m){if(!v)throw new Error(m);}
ok(code.includes("const SBM_VERSION = '5.10.0-RC8.9';"),'version');
ok(code.includes("const SBM_SHARED_VERSION = '3.5.0';"),'shared');
ok(code.includes("package_version:'2.3.0'"),'evidence 2.3');
ok(code.includes('function sbmDoctorFetchSiteImpactSummary_()'),'site impact function');
ok(code.includes("dimensions:['page'],rowLimit:limit"),'page dimension');
ok(code.includes("evidence_role:'SITE_WIDE_CONTEXT_ONLY'"),'evidence boundary');
ok(code.includes("site_impact:siteImpact"),'payload site impact');
ok(code.includes("'E011','サイト全体の28日比較'"),'evidence index');
ok(code.includes('Googleアップデートとの時期一致だけで因果関係を確定せず'),'causation guard');
const schema=JSON.parse(fs.readFileSync(p.join(root,'contracts','schemas','SIMS_DOCTOR_SINGLE_CASE_REQUEST_V2.schema.json'),'utf8'));
ok(schema.properties.schema_version.const==='2.3.0','schema version');
ok(schema.properties.evidence_package.properties.package_version.const==='2.3.0','schema evidence version');
ok(!!schema.properties.evidence_package.properties.site_impact,'site impact schema');
console.log('pass');
