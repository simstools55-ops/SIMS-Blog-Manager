const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'apps-script', 'Code.gs'), 'utf8');
const dist = fs.readFileSync(path.join(root, 'distribution', 'Code.gs'), 'utf8');
const required = [
  "SIMS_DOCTOR_SINGLE_CASE_REQUEST_V2",
  "SIMS_DOCTOR_EVIDENCE_PACKAGE_V2",
  "sbmDoctorBuildEvidencePackage_",
  "sbmDoctorFetchLongTermPerformance_",
  "sbmDoctorFetchLongTermQueries_",
  "comparison_window_complete",
  "next_measurement_date"
];
required.forEach(token => { if (!code.includes(token)) throw new Error('missing: ' + token); });
if (code !== dist) throw new Error('Code.gs and distribution/Code.gs differ');
JSON.parse(fs.readFileSync(path.join(root, 'contracts', 'schemas', 'SIMS_DOCTOR_SINGLE_CASE_REQUEST_V2.schema.json'), 'utf8'));
console.log('Doctor Evidence Package v2 static test: PASS');
