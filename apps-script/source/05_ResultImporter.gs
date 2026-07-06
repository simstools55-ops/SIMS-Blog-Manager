/** SIMS-Core Production Baseline v1.1 - 05_ResultImporter.gs */
function simsImportClaudeImprovementResultV2() {
  simsInitializeCoreSheets();
  const active = simsSs_().getActiveRange();
  const markdown = active ? simsSafeText_(active.getValue()) : '';
  if (!markdown) {
    return simsAlert_('取り込めません', 'ClaudeのImprovement_Result全文を任意のセルへ貼り付け、そのセルを選択してから実行してください。');
  }

  const request = simsFindLatestRequestForResult_(markdown);
  const parsed = simsParseImprovementResultMarkdown_(markdown);
  const resultId = simsId_('RES');
  const importedAt = simsNowText_();

  simsAppendObject_(SIMS_SHEETS.RESULTS, SIMS_HEADERS.RESULTS, {
    ResultId: resultId,
    RequestId: parsed.RequestId || (request ? request.RequestId : ''),
    ArticleId: request ? request.ArticleId : '',
    URL: parsed.URL || (request ? request.URL : ''),
    MainQuery: parsed.MainQuery || (request ? request.MainQuery : ''),
    ResultMarkdown: markdown,
    ImprovedH1: parsed.ImprovedH1,
    ImprovedTitle: parsed.ImprovedTitle,
    ImprovedDescription: parsed.ImprovedDescription,
    SmartphoneDescription: parsed.SmartphoneDescription,
    Summary: parsed.Summary,
    SEOScore: parsed.SEOScore,
    QualityScore: parsed.QualityScore,
    Status: SIMS_STATUS.COMPLETED,
    ImportedAt: importedAt
  });

  simsOpenResults();
  simsAlert_('Claude改善結果を取り込みました', 'AI_Exchange_Resultsへ保存しました。\n\nResult ID: ' + resultId + '\n次に「最新結果を改善履歴へ記録」を実行してください。');
}

function simsOpenResults() {
  simsOpenSheet_(SIMS_SHEETS.RESULTS);
}

function simsFindLatestRequestForResult_(markdown) {
  const requestId = simsExtractValue_(markdown, 'Request ID') || simsExtractValue_(markdown, 'RequestId');
  const requests = simsRowsAsObjects_(SIMS_SHEETS.REQUESTS);
  if (requestId) {
    const found = requests.find(r => String(r.RequestId) === String(requestId));
    if (found) return found;
  }
  return requests.length ? requests[requests.length - 1] : null;
}

function simsParseImprovementResultMarkdown_(markdown) {
  return {
    RequestId: simsExtractValue_(markdown, 'Request ID') || simsExtractValue_(markdown, 'RequestId'),
    URL: simsExtractValue_(markdown, 'URL'),
    MainQuery: simsExtractValue_(markdown, 'Main Query'),
    ImprovedH1: simsExtractSectionOrValue_(markdown, 'Improved H1') || simsExtractSectionOrValue_(markdown, 'H1'),
    ImprovedTitle: simsExtractSectionOrValue_(markdown, 'SEO Title Tag') || simsExtractSectionOrValue_(markdown, 'Title Tag') || simsExtractSectionOrValue_(markdown, 'Title'),
    ImprovedDescription: simsExtractSectionOrValue_(markdown, 'Meta Description'),
    SmartphoneDescription: simsExtractSectionOrValue_(markdown, 'Smartphone Description') || simsExtractSectionOrValue_(markdown, 'Mobile Description'),
    Summary: simsExtractSectionOrValue_(markdown, 'Executive Summary') || simsExtractSectionOrValue_(markdown, 'Improvement Summary for SIMS') || simsExtractSectionOrValue_(markdown, 'Summary'),
    SEOScore: simsExtractValue_(markdown, 'SEO Score'),
    QualityScore: simsExtractValue_(markdown, 'Quality Score')
  };
}

function simsExtractValue_(markdown, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp('^-\\s*' + escaped + '\\s*:\\s*(.+)$', 'im'),
    new RegExp('^' + escaped + '\\s*:\\s*(.+)$', 'im'),
    new RegExp('^\\|\\s*' + escaped + '\\s*\\|\\s*([^|]+)\\|', 'im')
  ];
  for (let i = 0; i < patterns.length; i++) {
    const m = markdown.match(patterns[i]);
    if (m && m[1]) return simsSafeText_(m[1]);
  }
  return '';
}

function simsExtractSectionOrValue_(markdown, label) {
  const value = simsExtractValue_(markdown, label);
  if (value) return value;
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('^#{2,4}\\s*' + escaped + '\\s*$([\\s\\S]*?)(?=^#{2,4}\\s+|\\z)', 'im');
  const m = markdown.match(re);
  if (!m || !m[1]) return '';
  return m[1].trim().split('\n').slice(0, 8).join('\n').trim();
}
