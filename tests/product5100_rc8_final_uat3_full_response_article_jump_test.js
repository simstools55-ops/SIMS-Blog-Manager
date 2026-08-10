const fs = require('fs');
const assert = require('assert');
const code = fs.readFileSync('apps-script/Code.gs','utf8');

assert(code.includes('Doctorの回答を最初から最後まで、そのまま貼り付けてください。'), 'Doctor full-response guidance missing');
assert(code.includes('Writerの回答を最初から最後まで、そのまま貼り付けてください。'), 'Writer full-response guidance missing');
assert(code.includes('JSON部分だけを貼り付けても登録できます。'), 'JSON-only compatibility guidance missing');
assert(code.includes('>この記事を開く</a>'), 'article jump button/link missing');
assert(code.includes("payload.article && payload.article.url"), 'article jump must use current payload article URL');
assert(code.includes('target="_blank"'), 'article jump must open a new tab');
assert(code.includes('function sbmDoctorExtractJsonText_(text)'), 'full-response JSON extractor missing');
assert(!code.includes('Doctor回答の最後にある「SBM登録用診断結果JSON」を貼り付けてください。'), 'obsolete Doctor JSON-only guidance remains');
assert(!code.includes('回答の最後にある結果JSON（SIMS_WRITER_TREATMENT_RESULT_V1）をここへ貼り付けて登録してください。'), 'obsolete Writer JSON-only guidance remains');
console.log('PASS product5100_rc8_final_uat3_full_response_article_jump_test');
