const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'apps-script', 'Code.gs'), 'utf8');
const dist = fs.readFileSync(path.join(root, 'distribution', 'Code.gs'), 'utf8');
const required = [
  '④ Writer処置結果をSBMへ返す',
  'id="writerResult"',
  'Writer処置結果を登録',
  'function registerWriterResult()',
  'sbmDoctorRegisterWriterTreatmentResultFromDialog',
  'function sbmDoctorStoreWriterTreatmentResult_'
];
for (const token of required) {
  if (!code.includes(token)) throw new Error('missing token: ' + token);
}
if (code !== dist) throw new Error('apps-script/Code.gs and distribution/Code.gs differ');
if (!code.includes("format!=='SIMS_WRITER_TREATMENT_RESULT_V1'")) throw new Error('writer result format guard missing');
if (!code.includes("format.indexOf('SIMS_DOCTOR_')===0")) throw new Error('doctor JSON guard missing');
console.log('PASS product5100_rc4_writer_result_dialog_hotfix_test');
