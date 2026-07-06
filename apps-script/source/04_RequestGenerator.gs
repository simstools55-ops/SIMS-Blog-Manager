/** SIMS-Core Production Baseline v1.1 - 04_RequestGenerator.gs */
function simsGenerateImprovementRequestV2() {
  simsInitializeCoreSheets();
  const queueRows = simsRowsAsObjects_(SIMS_SHEETS.QUEUE);
  const target = simsPickNextQueueItem_(queueRows);
  if (!target) return simsAlert_('改善対象がありません', 'Improvement_Queueに対象行を追加するか、Search Consoleクエリデータを取得してください。');

  const url = simsSafeText_(target.URL);
  if (!url) return simsAlert_('URLがありません', 'Improvement_QueueのURL列を確認してください。');

  const article = simsFindArticleByUrl_(url);
  const queryRows = simsFindQueriesByUrl_(url).slice(0, SIMS_DEFAULTS.MAX_REQUEST_QUERIES);
  const mainQuery = simsResolveMainQuery_(target, queryRows);
  const subQueries = simsResolveSubQueries_(target, queryRows, mainQuery);
  const requestId = simsId_('REQ');
  const createdAt = simsNowText_();
  const markdown = simsBuildImprovementRequestMarkdown_(requestId, target, article, queryRows, mainQuery, subQueries, createdAt);

  simsAppendObject_(SIMS_SHEETS.REQUESTS, SIMS_HEADERS.REQUESTS, {
    RequestId: requestId,
    QueueId: target.QueueId || '',
    ArticleId: target.ArticleId || (article ? article.ArticleId : ''),
    URL: url,
    MainQuery: mainQuery,
    SubQueries: subQueries.join('\n'),
    TopQueries: queryRows.map(q => q.Query).join('\n'),
    RequestMarkdown: markdown,
    Status: SIMS_STATUS.READY_FOR_CLAUDE,
    CreatedAt: createdAt,
    UserNote: 'RequestMarkdownをコピーし、記事本文と一緒にClaudeへ貼り付けてください。'
  });

  simsUpdateQueueAfterRequest_(target, requestId);
  simsOpenRequests();
  simsAlert_('Claude改善指示書を作成しました', 'AI_Exchange_Requests の RequestMarkdown列をコピーしてClaudeへ貼り付けてください。\n\nRequest ID: ' + requestId);
}

function simsOpenRequests() {
  simsOpenSheet_(SIMS_SHEETS.REQUESTS);
}

function simsPickNextQueueItem_(queueRows) {
  const active = (queueRows || []).filter(r => !['completed', 'done', 'verified', 'archived'].includes(String(r.Status || '').toLowerCase()));
  active.sort((a, b) => simsPriorityWeight_(b.Priority) - simsPriorityWeight_(a.Priority));
  return active[0] || null;
}

function simsPriorityWeight_(priority) {
  const p = String(priority || '').toUpperCase();
  if (['A', 'HIGH', '高'].indexOf(p) >= 0) return 30;
  if (['B', 'MEDIUM', '中'].indexOf(p) >= 0) return 20;
  if (['C', 'LOW', '低'].indexOf(p) >= 0) return 10;
  return 0;
}

function simsFindArticleByUrl_(url) {
  return simsRowsAsObjects_(SIMS_SHEETS.ARTICLES).find(r => String(r.URL) === String(url)) || null;
}

function simsFindQueriesByUrl_(url) {
  return simsRowsAsObjects_(SIMS_SHEETS.QUERIES)
    .filter(r => String(r.URL) === String(url))
    .sort((a, b) => simsQueryCandidateScore_(b) - simsQueryCandidateScore_(a));
}

function simsResolveMainQuery_(queue, queries) {
  const explicit = simsSafeText_(queue.MainQuery);
  if (explicit) return explicit;
  return queries && queries.length ? simsSafeText_(queries[0].Query) : '';
}

function simsResolveSubQueries_(queue, queries, mainQuery) {
  const explicit = simsSafeText_(queue.SubQueries);
  if (explicit) return explicit.split(/\n|,|、/).map(s => s.trim()).filter(Boolean).slice(0, SIMS_DEFAULTS.MAX_SUB_QUERIES);
  return (queries || []).map(q => simsSafeText_(q.Query)).filter(q => q && q !== mainQuery).slice(0, SIMS_DEFAULTS.MAX_SUB_QUERIES);
}

function simsBuildImprovementRequestMarkdown_(requestId, queue, article, queries, mainQuery, subQueries, createdAt) {
  return '# SIMS Improvement Request v2.0\n\n' +
    '## 1. Request Summary\n' +
    '- Request ID: ' + requestId + '\n' +
    '- Created At: ' + createdAt + '\n' +
    '- Status: Ready for Claude\n' +
    '- Goal: Search Consoleデータに基づき、対象記事を改善してください。\n\n' +
    '## 2. Article Information\n' +
    '- URL: ' + simsSafeText_(queue.URL) + '\n' +
    '- Current H1: ' + simsSafeText_(article && article.CurrentH1) + '\n' +
    '- Current Title Tag: ' + simsSafeText_(article && article.CurrentTitle) + '\n' +
    '- Current Meta Description: ' + simsSafeText_(article && article.CurrentDescription) + '\n' +
    '- Slug: ' + simsSafeText_(article && article.Slug) + '\n' +
    '- Category: ' + simsSafeText_(article && article.Category) + '\n' +
    '- Tags: ' + simsSafeText_(article && article.Tags) + '\n' +
    '- Word Count: ' + simsSafeText_(article && article.WordCount) + '\n\n' +
    '## 3. SEO Target\n' +
    '- Main Query: ' + simsSafeText_(mainQuery) + '\n' +
    '- Sub Queries:\n' + (subQueries.length ? subQueries.map(q => '  - ' + q).join('\n') : '  -') + '\n' +
    '- Priority: ' + simsSafeText_(queue.Priority) + '\n' +
    '- Improvement Reason: ' + simsSafeText_(queue.Reason) + '\n\n' +
    '## 4. Search Console Snapshot\n' +
    simsBuildTopQueriesMarkdownTable_(queries) + '\n\n' +
    '## 5. Required Claude Outputs\n' +
    'Return the result using SIMS Improvement Result v2.0 format. Include:\n\n' +
    '1. Executive Summary\n' +
    '2. Search Intent Analysis\n' +
    '3. Improved H1\n' +
    '4. SEO Title Tag\n' +
    '5. Meta Description\n' +
    '6. Smartphone Description\n' +
    '7. H2/H3 Structure\n' +
    '8. Rewrite Plan\n' +
    '9. FAQ\n' +
    '10. Internal Link Suggestions\n' +
    '11. EEAT Improvements\n' +
    '12. WordPress Implementation Checklist\n' +
    '13. Improvement Summary for SIMS\n\n' +
    '## 6. Beginner-Friendly Requirement\n' +
    'H1、titleタグ、meta description、スマホ向けdescriptionについて、WordPress/Cocoonのどこへ反映するかも説明してください。\n\n' +
    '## 7. Article Body\n' +
    'この下に現在の記事本文を貼り付けてください。\n\n' +
    '---\n';
}

function simsBuildTopQueriesMarkdownTable_(queries) {
  if (!queries || !queries.length) return '_No Search Console query data found for this URL._';
  const lines = ['| # | Query | Clicks | Impressions | CTR | Position |', '|---:|---|---:|---:|---:|---:|'];
  queries.slice(0, SIMS_DEFAULTS.MAX_REQUEST_QUERIES).forEach((q, i) => {
    lines.push('| ' + (i + 1) + ' | ' + simsEscapeMd_(q.Query) + ' | ' + simsNumber_(q.Clicks) + ' | ' + simsNumber_(q.Impressions) + ' | ' + simsFormatPercent_(q.CTR) + ' | ' + simsNumber_(q.Position).toFixed(1) + ' |');
  });
  return lines.join('\n');
}

function simsEscapeMd_(value) {
  return simsSafeText_(value).replace(/\|/g, '\\|');
}

function simsUpdateQueueAfterRequest_(queueRow, requestId) {
  if (!queueRow || !queueRow._rowNumber) return;
  const sheet = simsSs_().getSheetByName(SIMS_SHEETS.QUEUE);
  if (!sheet) return;
  simsSetObjectValues_(sheet, queueRow._rowNumber, { Status: SIMS_STATUS.READY_FOR_CLAUDE, RequestId: requestId, UpdatedAt: simsNowText_() });
}
