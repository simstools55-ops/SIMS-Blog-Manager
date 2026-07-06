/** SIMS-Core Production Baseline v1.1 - 06_HistoryManager.gs */
function simsRecordLatestResultToHistory() {
  simsInitializeCoreSheets();
  const results = simsRowsAsObjects_(SIMS_SHEETS.RESULTS);
  if (!results.length) return simsAlert_('記録できません', 'AI_Exchange_Resultsに改善結果がありません。');

  const result = results[results.length - 1];
  const metrics = simsFindMetricsForUrlQuery_(result.URL, result.MainQuery);
  const historyId = simsId_('HIS');
  const completedAt = simsNowText_();
  const due = new Date();
  due.setDate(due.getDate() + Number(simsGetSetting_('MeasurementDaysAfter', SIMS_DEFAULTS.MEASUREMENT_DAYS_AFTER)));

  simsAppendObject_(SIMS_SHEETS.HISTORY, SIMS_HEADERS.HISTORY, {
    HistoryId: historyId,
    ArticleId: result.ArticleId,
    URL: result.URL,
    RequestId: result.RequestId,
    ResultId: result.ResultId,
    MainQuery: result.MainQuery,
    Summary: result.Summary,
    ImprovedH1: result.ImprovedH1,
    ImprovedTitle: result.ImprovedTitle,
    ImprovedDescription: result.ImprovedDescription,
    SEOScore: result.SEOScore,
    QualityScore: result.QualityScore,
    BeforeClicks: metrics.Clicks,
    BeforeImpressions: metrics.Impressions,
    BeforeCTR: metrics.CTR,
    BeforePosition: metrics.Position,
    CompletedAt: completedAt,
    MeasurementDueDate: simsDateText_(due),
    MeasurementStatus: SIMS_STATUS.WAITING_MEASUREMENT
  });

  simsOpenHistory();
  simsAlert_('改善履歴へ記録しました', 'History ID: ' + historyId + '\n効果測定予定日: ' + simsDateText_(due));
}

function simsOpenHistory() {
  simsOpenSheet_(SIMS_SHEETS.HISTORY);
}

function simsFindMetricsForUrlQuery_(url, mainQuery) {
  const queries = simsRowsAsObjects_(SIMS_SHEETS.QUERIES).filter(r => String(r.URL) === String(url));
  let target = null;
  if (mainQuery) target = queries.find(r => String(r.Query) === String(mainQuery));
  if (!target && queries.length) {
    queries.sort((a, b) => simsQueryCandidateScore_(b) - simsQueryCandidateScore_(a));
    target = queries[0];
  }
  return {
    Clicks: target ? target.Clicks : '',
    Impressions: target ? target.Impressions : '',
    CTR: target ? target.CTR : '',
    Position: target ? target.Position : ''
  };
}
