/** SIMS-Core Production Baseline v1.1 - 03_SearchConsole.gs */
function simsGetSearchConsoleProperty_() {
  return simsGetBlogProfile_('SearchConsoleProperty', simsGetBlogProfile_('BlogUrl', ''));
}

function simsSearchConsoleDateRange_() {
  const days = Number(simsGetSetting_('SearchConsoleDays', SIMS_DEFAULTS.SEARCH_CONSOLE_DAYS)) || SIMS_DEFAULTS.SEARCH_CONSOLE_DAYS;
  const end = new Date();
  end.setDate(end.getDate() - SIMS_DEFAULTS.SEARCH_CONSOLE_DELAY_DAYS);
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  return { startDate: simsDateText_(start), endDate: simsDateText_(end) };
}

function simsSearchConsoleApiRequest_(property, body) {
  const endpoint = 'https://www.googleapis.com/webmasters/v3/sites/' + encodeURIComponent(property) + '/searchAnalytics/query';
  const response = UrlFetchApp.fetch(endpoint, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(body),
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true
  });
  const code = response.getResponseCode();
  const text = response.getContentText();
  if (code < 200 || code >= 300) {
    throw new Error('Search Console API error: HTTP ' + code + '\n' + text);
  }
  return JSON.parse(text || '{}');
}

function simsTestSearchConsoleConnection() {
  simsInitializeCoreSheets();
  const property = simsGetSearchConsoleProperty_();
  if (!property) return simsAlert_('接続できません', 'Search Consoleプロパティを登録してください。');
  const range = simsSearchConsoleDateRange_();
  try {
    const data = simsSearchConsoleApiRequest_(property, {
      startDate: range.startDate,
      endDate: range.endDate,
      dimensions: ['page'],
      rowLimit: 1
    });
    simsSetSetting_('SearchConsoleStatus', 'OK', 'Last connection test status');
    simsSetSetting_('LastSearchConsoleTestAt', simsNowText_(), 'Last connection test time');
    simsLog_('SearchConsoleConnectionTest', 'Done', property);
    simsAlert_('接続OK', 'Search Consoleに接続できました。\n期間: ' + range.startDate + '〜' + range.endDate + '\n取得行数: ' + ((data.rows || []).length));
  } catch (e) {
    simsSetSetting_('SearchConsoleStatus', 'Error', String(e));
    simsLog_('SearchConsoleConnectionTest', 'Error', String(e));
    simsAlert_('接続エラー', 'Search Consoleに接続できませんでした。\n\n確認事項:\n・Search Console APIが有効か\n・プロパティ表記が正しいか\n・このGoogleアカウントに権限があるか\n\n詳細:\n' + String(e));
  }
}

function simsFetchSearchConsoleUrls() {
  simsInitializeCoreSheets();
  const property = simsGetSearchConsoleProperty_();
  if (!property) return simsAlert_('取得できません', 'Search Consoleプロパティを登録してください。');
  const range = simsSearchConsoleDateRange_();
  try {
    const data = simsSearchConsoleApiRequest_(property, {
      startDate: range.startDate,
      endDate: range.endDate,
      dimensions: ['page'],
      rowLimit: SIMS_DEFAULTS.MAX_QUERY_ROWS
    });
    const capturedAt = simsNowText_();
    const rows = (data.rows || []).map(r => [range.startDate, range.endDate, r.keys[0], r.clicks || 0, r.impressions || 0, r.ctr || 0, r.position || 0, capturedAt]);
    simsRewriteSheet_(SIMS_SHEETS.SEARCH_CONSOLE_URLS, SIMS_HEADERS.SEARCH_CONSOLE_URLS, rows);
    simsSyncArticlesFromSearchConsoleUrls_(rows);
    simsLog_('FetchSearchConsoleUrls', 'Done', rows.length + ' rows');
    simsAlert_('URLデータ取得完了', '取得件数: ' + rows.length + '件\nArticlesシートにも反映しました。');
  } catch (e) {
    simsLog_('FetchSearchConsoleUrls', 'Error', String(e));
    simsAlert_('URLデータ取得エラー', String(e));
  }
}

function simsFetchSearchConsoleQueries() {
  simsInitializeCoreSheets();
  const property = simsGetSearchConsoleProperty_();
  if (!property) return simsAlert_('取得できません', 'Search Consoleプロパティを登録してください。');
  const range = simsSearchConsoleDateRange_();
  try {
    const data = simsSearchConsoleApiRequest_(property, {
      startDate: range.startDate,
      endDate: range.endDate,
      dimensions: ['query', 'page'],
      rowLimit: SIMS_DEFAULTS.MAX_QUERY_ROWS
    });
    const capturedAt = simsNowText_();
    const rows = (data.rows || []).map(r => [range.startDate, range.endDate, r.keys[0], r.keys[1], r.clicks || 0, r.impressions || 0, r.ctr || 0, r.position || 0, capturedAt]);
    simsRewriteSheet_(SIMS_SHEETS.SEARCH_CONSOLE_QUERIES, SIMS_HEADERS.SEARCH_CONSOLE_QUERIES, rows);
    simsSyncQueriesFromSearchConsole_(rows);
    simsBuildImprovementQueueFromQueries_();
    simsLog_('FetchSearchConsoleQueries', 'Done', rows.length + ' rows');
    simsAlert_('クエリデータ取得完了', '取得件数: ' + rows.length + '件\nQueries / Improvement_Queue に反映しました。');
  } catch (e) {
    simsLog_('FetchSearchConsoleQueries', 'Error', String(e));
    simsAlert_('クエリデータ取得エラー', String(e));
  }
}

function simsRewriteSheet_(sheetName, headers, rows) {
  const sheet = simsGetOrCreateSheet_(sheetName);
  sheet.clear();
  simsEnsureHeaders_(sheet, headers);
  if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  simsStyleDataSheet_(sheet);
}

function simsSyncArticlesFromSearchConsoleUrls_(rows) {
  rows.forEach(row => {
    const url = row[2];
    if (!url) return;
    const existing = simsFindRowByValue_(SIMS_SHEETS.ARTICLES, 'URL', url);
    if (!existing) {
      simsAppendObject_(SIMS_SHEETS.ARTICLES, SIMS_HEADERS.ARTICLES, {
        ArticleId: simsId_('ART'),
        URL: url,
        Status: 'Active',
        LastUpdated: simsNowText_()
      });
    }
  });
}

function simsSyncQueriesFromSearchConsole_(rows) {
  const articles = simsRowsAsObjects_(SIMS_SHEETS.ARTICLES);
  const articleByUrl = {};
  articles.forEach(a => articleByUrl[String(a.URL)] = a.ArticleId);
  const queryRows = rows.map(row => ({
    QueryId: simsId_('QRY'),
    ArticleId: articleByUrl[String(row[3])] || '',
    URL: row[3],
    Query: row[2],
    Clicks: row[4],
    Impressions: row[5],
    CTR: row[6],
    Position: row[7],
    DateRange: row[0] + '〜' + row[1],
    CapturedAt: row[8]
  }));
  const values = queryRows.map(q => SIMS_HEADERS.QUERIES.map(h => q[h] || ''));
  simsRewriteSheet_(SIMS_SHEETS.QUERIES, SIMS_HEADERS.QUERIES, values);
}

function simsBuildImprovementQueueFromQueries_() {
  const queries = simsRowsAsObjects_(SIMS_SHEETS.QUERIES);
  const byUrl = {};
  queries.forEach(q => {
    const url = String(q.URL || '');
    if (!url) return;
    if (!byUrl[url]) byUrl[url] = [];
    byUrl[url].push(q);
  });
  Object.keys(byUrl).forEach(url => {
    const rows = byUrl[url].sort((a, b) => simsQueryCandidateScore_(b) - simsQueryCandidateScore_(a));
    const main = rows[0];
    if (!main) return;
    const existing = simsFindRowByValue_(SIMS_SHEETS.QUEUE, 'URL', url);
    if (existing) return;
    const sub = rows.slice(1, 6).map(r => r.Query).join('\n');
    simsAppendObject_(SIMS_SHEETS.QUEUE, SIMS_HEADERS.QUEUE, {
      QueueId: simsId_('QUE'),
      ArticleId: main.ArticleId,
      URL: url,
      MainQuery: main.Query,
      SubQueries: sub,
      Priority: simsPriorityFromQuery_(main),
      Reason: 'Search Console data candidate',
      Status: SIMS_STATUS.NEW,
      CreatedAt: simsNowText_(),
      UpdatedAt: simsNowText_()
    });
  });
}

function simsPriorityFromQuery_(queryRow) {
  const impressions = simsNumber_(queryRow.Impressions);
  const position = simsNumber_(queryRow.Position);
  if (impressions >= 1000 && position <= 20) return 'A';
  if (impressions >= 200 && position <= 30) return 'B';
  return 'C';
}

function simsQueryCandidateScore_(q) {
  const clicks = simsNumber_(q.Clicks);
  const impressions = simsNumber_(q.Impressions);
  const position = simsNumber_(q.Position) || 99;
  const ctr = simsNumber_(q.CTR);
  const positionScore = Math.max(0, 30 - position);
  return impressions * 0.6 + clicks * 10 + ctr * 100 + positionScore * 3;
}
