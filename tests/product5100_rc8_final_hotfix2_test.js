const fs=require('fs');
const assert=require('assert');
const code=fs.readFileSync(__dirname+'/../apps-script/Code.gs','utf8');
function has(s){assert(code.includes(s), 'missing: '+s);}
has('RC8 Final Hotfix 2');
has("clearDataValidations().clearContent().setBackground('#eeeeee')");
has("selectCell.insertCheckboxes().setValue(current)");
has("st.code==='DOCTOR_DIAGNOSIS_PENDING'||st.code==='TREATMENT_FAILED'||st.code==='READY'");
has("bg='#fce8e6'");
has("bg='#fff2cc'");
has("bg='#e8f0fe'");
assert(!code.includes("clearDataValidations().setValue(false).setBackground('#eeeeee')"), 'FALSE regression still present');
console.log('product5100_rc8_final_hotfix2_test: PASS');
