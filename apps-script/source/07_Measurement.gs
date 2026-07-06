/** SIMS-Core Production Baseline v1.1 - 07_Measurement.gs */
function simsCreateMeasurementForSelectedHistory() {
  simsInitializeCoreSheets();
  const sheet = simsSs_().getActiveSheet();
  if (sheet.getName() !== SIMS_SHEETS.HISTORY) return simsAlert_('効果測定できません', 'Improvement_Historyで測定したい行を選択してから実行してください。');
  const rowNumber = sheet.getActiveRange().getRow();
  if (rowNumber <= 1) return simsAlert_('効果測定できません', 'ヘッダー行ではなく、履歴行を選択してください。');

  const history = simsRowObject_(sheet, rowNumber);
  const after = simsFindMetricsForUrlQuery_(history.URL, history.MainQuery);
  const measurementId = simsId_('MEA');
  const beforeClicks = simsNumber_(history.BeforeClicks);
  const afterClicks = simsNumber_(after.Clicks);
  const beforeImpressions = simsNumber_(history.BeforeImpressions);
  const afterImpressions = simsNumber_(after.Impressions);
  const beforeCtr = simsNumber_(history.BeforeCTR);
  const afterCtr = simsNumber_(after.CTR);
  const beforePosition = simsNumber_(history.BeforePosition);
  const afterPosition = simsNumber_(after.Position);
  const deltaClicks = afterClicks - beforeClicks;
  const deltaImpressions = afterImpressions - beforeImpressions;
  const deltaCtr = afterCtr - beforeCtr;
  const deltaPosition = beforePosition - afterPosition;
  const outcome = simsJudgeMeasurementOutcome_(deltaClicks, deltaCtr, deltaPosition);
  const summary = 'Clicks ' + beforeClicks + '→' + afterClicks + ', CTR ' + beforeCtr + '→' + afterCtr + ', Position ' + beforePosition + '→' + afterPosition;

  simsAppendObject_(SIMS_SHEETS.MEASUREMENTS, SIMS_HEADERS.MEASUREMENTS, {
    MeasurementId: measurementId,
    HistoryId: history.HistoryId,
    ArticleId: history.ArticleId,
    URL: history.URL,
    MainQuery: history.MainQuery,
    BeforeClicks: beforeClicks,
    AfterClicks: afterClicks,
    DeltaClicks: deltaClicks,
    BeforeImpressions: beforeImpressions,
    AfterImpressions: afterImpressions,
    DeltaImpressions: deltaImpressions,
    BeforeCTR: beforeCtr,
    AfterCTR: afterCtr,
    DeltaCTR: deltaCtr,
    BeforePosition: beforePosition,
    AfterPosition: afterPosition,
    DeltaPosition: deltaPosition,
    Outcome: outcome,
    Summary: summary,
    MeasuredAt: simsNowText_()
  });

  simsSetObjectValues_(sheet, rowNumber, { MeasurementStatus: SIMS_STATUS.MEASURED });
  simsOpenMeasurements();
  simsAlert_('効果測定を作成しました', 'Outcome: ' + outcome + '\n' + summary);
}

function simsOpenMeasurements() {
  simsOpenSheet_(SIMS_SHEETS.MEASUREMENTS);
}

function simsRowObject_(sheet, rowNumber) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const row = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0];
  const obj = { _rowNumber: rowNumber };
  headers.forEach((h, i) => obj[h] = row[i]);
  return obj;
}

function simsJudgeMeasurementOutcome_(deltaClicks, deltaCtr, deltaPosition) {
  if (deltaClicks > 0 && (deltaCtr > 0 || deltaPosition > 0)) return 'Improved';
  if (deltaClicks > 0 || deltaCtr > 0 || deltaPosition > 0) return 'Partially Improved';
  if (deltaClicks === 0 && deltaCtr === 0 && deltaPosition === 0) return 'No Change';
  return 'Needs Review';
}
