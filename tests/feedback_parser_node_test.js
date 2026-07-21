const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const code = fs.readFileSync(require('path').join(__dirname, '..', 'apps-script', 'Code.gs'), 'utf8');

function extractFunction(name) {
  const start = code.indexOf('function ' + name + '(');
  if (start < 0) throw new Error('Function not found: ' + name);
  const brace = code.indexOf('{', start);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = brace; i < code.length; i++) {
    const ch = code[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return code.slice(start, i + 1);
    }
  }
  throw new Error('Unclosed function: ' + name);
}

const names = [
  'sbmIsSupportedFeedbackFormat_',
  'sbmFeedbackProtocolVersion_',
  'sbmExtractWriterVersion_',
  'sbmFeedbackChangeKey_',
  'sbmNormalizeFeedbackChanges_',
  'sbmApplyChangeDetailsToNewValues_',
  'sbmNormalizeImprovementFeedback_'
];
const sandbox = {
  console,
  sbmDateText_: () => '2026/7/21'
};
vm.createContext(sandbox);
vm.runInContext(names.map(extractFunction).join('\n\n'), sandbox);

function parse(obj) {
  return sandbox.sbmNormalizeImprovementFeedback_(JSON.stringify(obj));
}

const v1 = parse({
  format: 'SIMS_FEEDBACK_V1', article_id: 'A000001',
  changes: {seo_title: true, internal_links: false},
  new_values: {seo_title: 'New title'}, summary: 'V1 test'
});
assert.strictEqual(v1.changes.seo_title, true);
assert.strictEqual(v1.new_values.seo_title, 'New title');

const v2 = parse({
  format: 'SIMS_FEEDBACK_V2', version: '2.0', site_id: 'tonbos55',
  article_id: 'A000002', url: 'https://example.com/a',
  changes: [{target:'internal_link', before:'old', after:'new', reason:'reason'}],
  change_flags: {body:true, internal_links:true},
  protected_elements: ['ads'],
  learning: {future:true}, diagnostics: {anything:'allowed'},
  summary: 'V2 array test', swls: {format:'SWLS_LEARNING_RECORD'}
});
assert.strictEqual(v2.changes.internal_links, true);
assert.strictEqual(v2.changes.body, true);
assert.strictEqual(v2.change_details.length, 1);
assert.deepStrictEqual(Array.from(v2.kept_sections), ['ads']);
assert.ok(v2.raw_json.includes('"learning"'));

const future = parse({
  format: 'SIMS_FEEDBACK_V9', article_url: 'https://example.com/future',
  changes: [], change_flags: {faq:false}, unknown_future_field: {x:1}
});
assert.strictEqual(future.protocol_version, 9);
assert.strictEqual(future.changes.faq, false);

const detailedObject = parse({
  format: 'SIMS_FEEDBACK_V2', article_id:'A3',
  changes: {meta_description:{before:'old',after:'new meta'}}
});
assert.strictEqual(detailedObject.changes.description, true);
assert.strictEqual(detailedObject.new_values.description, 'new meta');

assert.throws(() => parse({format:'OTHER_V2', article_id:'A1', changes:{}}), /format/);
assert.throws(() => parse({format:'SIMS_FEEDBACK_V2', article_id:'A1'}), /changes/);

console.log('feedback_parser_node_test: PASS');
