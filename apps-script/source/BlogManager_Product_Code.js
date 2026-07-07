/**
 * SIMS-Blog-Manager Product 2.1
 * User-install single-file Apps Script.
 *
 * Product 2.1 changes:
 * - Setup wizard now collects Blog Name and Search Console Property by popup prompts.
 * - Daily update no longer runs until setup is complete AND Search Console connection test is OK.
 * - SERVICE_DISABLED errors open a project-specific Google Cloud API activation guide.
 * - Keeps all end-user code in one Code.js / Code.gs file.
 */

var SBM = {
  SHEETS: {
    HOME: 'ホーム',
    TODAY: '今日の改善',
    LOG: '改善ログ',
    SETTINGS: '設定',
    CARDS: '記事カルテ',
    QUERY_DATA: 'クエリデータ',
    DIAGNOSIS: '記事診断',
    EFFECTIVENESS: '効果測定',
    HELP: 'ヘルプ',
    CONNECTION: '接続テスト',
    ERROR_LOG: 'エラーログ'
  },
  SETTINGS_ROW: {
    BLOG_NAME: 4,
    PROPERTY: 5,
    SETUP_STATUS: 6,
    MANAGED_RATIO: 9,
    DAILY_MINUTES: 10,
    QUEUE_LIMIT: 11,
    RELATED_QUERIES: 12,
    MIN_IMPRESSIONS: 13,
    MIN_CLICKS: 14,
    ONCE_PER_DAY: 15,
    LAST_FETCH_DATE: 16,
    MEASURE_DAYS: 17,
    CONNECTION_STATUS: 18
  },
  DEFAULTS: {
    MANAGED_RATIO: '30%',
    DAILY_MINUTES: 30,
    QUEUE_LIMIT: 20,
    RELATED_QUERIES: 20,
    MIN_IMPRESSIONS: 50,
    MIN_CLICKS: 1,
    ONCE_PER_DAY: 'ON',
    MEASURE_DAYS: '14,30'
  }
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('SIMS-Blog-Manager')
    .addItem('セットアップウィザード開始', 'startSetupWizard')
    .addItem('初期セットアップ', 'setupWorkbook')
    .addItem('初期設定を完了', 'completeInitialSetup')
    .addItem('サンプルデータを生成', 'generateSampleData')
    .addSeparator()
    .addItem('Search Console接続テスト', 'testSearchConsoleConnection')
    .addItem('承認スコープ設定の確認', 'showOAuthScopeHelp')
    .addItem('Google Cloud API有効化ガイド', 'showGoogleCloudApiHelp')
    .addItem('API設定後に接続テストへ進む', 'continueAfterApiSetup')
    .addItem('接続テスト結果を開く', 'openConnectionTest')
    .addItem('今日のデータを取得・分析', 'runDailyUpdate')
    .addItem('今日の改善を更新', 'buildTodayQueue')
    .addItem('ホームを更新', 'refreshHome')
    .addItem('管理対象割合を広げる', 'expandManagedRatio')
    .addSeparator()
    .addItem('改善ログを記録', 'recordSelectedImprovement')
    .addItem('効果測定を更新', 'updateEffectiveness')
    .addSeparator()
    .addItem('ヘルプを開く', 'openHelp')
    .addItem('エラーログを開く', 'openErrorLog')
    .addToUi();

  try {
    promptDailyUpdateIfNeeded_();
  } catch (e) {
    console.error(e);
  }
}

function setupWorkbook(silent) {
  var ss = SpreadsheetApp.getActive();
  var names = sheetNames_();
  for (var i = 0; i < names.length; i++) getOrCreateSheet_(ss, names[i]);

  setupHome_(ss.getSheetByName(SBM.SHEETS.HOME));
  setupSettings_(ss.getSheetByName(SBM.SHEETS.SETTINGS));
  setupToday_(ss.getSheetByName(SBM.SHEETS.TODAY));
  setupLog_(ss.getSheetByName(SBM.SHEETS.LOG));
  setupArticleCards_(ss.getSheetByName(SBM.SHEETS.CARDS));
  setupQueryData_(ss.getSheetByName(SBM.SHEETS.QUERY_DATA));
  setupDiagnosis_(ss.getSheetByName(SBM.SHEETS.DIAGNOSIS));
  setupEffectiveness_(ss.getSheetByName(SBM.SHEETS.EFFECTIVENESS));
  setupHelp_(ss.getSheetByName(SBM.SHEETS.HELP));
  setupConnectionTest_(ss.getSheetByName(SBM.SHEETS.CONNECTION));
  setupErrorLog_(ss.getSheetByName(SBM.SHEETS.ERROR_LOG));
  markSetupStatus_();
  refreshHome();

  if (!silent) {
    var settings = getSettingsSafe_();
    if (!settings.property) {
      SpreadsheetApp.getUi().alert('初期セットアップが完了しました。次に「セットアップウィザード開始」でブログ名とSearch Console Propertyを入力してください。');
    } else {
      SpreadsheetApp.getUi().alert('初期セットアップが完了しました。設定値は保持されています。次にSearch Console接続テストを実行してください。');
    }
  }
}

function completeInitialSetup() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.SETTINGS);
  if (!sh) {
    SpreadsheetApp.getUi().alert('設定シートがありません。先に「初期セットアップ」を実行してください。');
    return;
  }
  var blog = String(sh.getRange(SBM.SETTINGS_ROW.BLOG_NAME, 2).getValue() || '').trim();
  var prop = String(sh.getRange(SBM.SETTINGS_ROW.PROPERTY, 2).getValue() || '').trim();
  if (!blog) {
    SpreadsheetApp.getUi().alert('設定シート B4 にブログ名を入力してください。');
    return;
  }
  if (!prop) {
    SpreadsheetApp.getUi().alert('設定シート B5 にSearch Console Propertyを入力してください。例: https://example.com/');
    return;
  }
  sh.getRange(SBM.SETTINGS_ROW.SETUP_STATUS, 2).setValue('完了');
  sh.getRange(SBM.SETTINGS_ROW.CONNECTION_STATUS, 2).setValue('未テスト');
  refreshHome();
  SpreadsheetApp.getUi().alert('初期設定が完了しました。次に「API設定後に接続テストへ進む」または「Search Console接続テスト」を実行してください。');
}

function promptDailyUpdateIfNeeded_() {
  var ss = SpreadsheetApp.getActive();
  var settings = ss.getSheetByName(SBM.SHEETS.SETTINGS);
  if (!settings) return;

  // 初回利用時は、GSC取得を絶対に走らせない。
  // 1. 初期設定完了
  // 2. Search Console接続テストOK
  // この2条件がそろってから、その日の初回起動時取得を案内する。
  if (!isInitialSetupComplete_()) {
    refreshHome();
    return;
  }
  if (!isConnectionTestOk_()) {
    refreshHome();
    return;
  }
  if (getLastConnectionStatus_() !== 'OK') {
    refreshHome();
    return;
  }

  var once = String(settings.getRange(SBM.SETTINGS_ROW.ONCE_PER_DAY, 2).getValue() || '').toUpperCase();
  var last = settings.getRange(SBM.SETTINGS_ROW.LAST_FETCH_DATE, 2).getValue();
  if (once === 'ON' && sameDate_(last, new Date())) return;
  var ui = SpreadsheetApp.getUi();
  var res = ui.alert('本日のSearch Consoleデータを取得して、改善候補を更新しますか？', ui.ButtonSet.YES_NO);
  if (res === ui.Button.YES) runDailyUpdate();
}

function runDailyUpdate() {
  try {
    requireInitialSetup_();
    requireConnectionTestOk_();
    requireConnectionOk_();
    var ss = SpreadsheetApp.getActive();
    var settings = getSettings_();
    var rows = fetchSearchConsoleRows_(settings);
    writeQueryData_(rows);
    var articles = analyzeQueries_(rows, settings);
    writeDiagnosisAndCards_(articles);
    buildTodayQueue();
    ss.getSheetByName(SBM.SHEETS.SETTINGS).getRange(SBM.SETTINGS_ROW.LAST_FETCH_DATE, 2).setValue(new Date());
    refreshHome();
    SpreadsheetApp.getUi().alert('本日のデータ取得・分析が完了しました。');
  } catch (e) {
    handleError_(e);
  }
}

function generateSampleData() {
  try {
    setupWorkbook(true);
    var settings = getSettingsSafe_();
    var pages = [
      ['https://example.com/windows11-tpm/', 'Windows11 TPM エラー対処', 4200, 80, 7.2],
      ['https://example.com/bios-update/', 'BIOSアップデート手順', 3100, 62, 12.4],
      ['https://example.com/edge-heavy/', 'Edgeが重い時の対処', 2400, 70, 5.8],
      ['https://example.com/onedrive-sync/', 'OneDrive同期エラー', 1800, 30, 18.1],
      ['https://example.com/windows-update/', 'Windows Update失敗', 1500, 22, 28.5]
    ];
    var suffixes = ['原因','対処','設定','確認方法','有効化','できない','初心者','BIOS','手順','注意点','2026','修復','チェック','再起動','FAQ','どこ','消えた','エラー','直し方','解決'];
    var rows = [];
    for (var p = 0; p < pages.length; p++) {
      for (var i = 0; i < suffixes.length; i++) {
        var impressions = Math.max(10, Math.round(pages[p][2] / (i + 2)));
        var clicks = Math.max(0, Math.round(impressions * (pages[p][3] / pages[p][2]) * (1 - i * 0.02)));
        var pos = pages[p][4] + i * 0.35;
        rows.push({date: new Date(), url: pages[p][0], query: pages[p][1] + ' ' + suffixes[i], clicks: clicks, impressions: impressions, ctr: clicks / impressions, position: pos, title: pages[p][1]});
      }
    }
    writeQueryData_(rows);
    var effectiveSettings = {
      managedRatio: parseRatio_(settings.managedRatio || SBM.DEFAULTS.MANAGED_RATIO),
      relatedQueries: settings.relatedQueries || 20,
      minImpressions: settings.minImpressions || 50,
      minClicks: settings.minClicks || 0,
      dailyMinutes: settings.dailyMinutes || 30,
      queueLimit: settings.queueLimit || 20
    };
    var articles = analyzeQueries_(rows, effectiveSettings);
    writeDiagnosisAndCards_(articles);
    buildTodayQueue();
    refreshHome();
    SpreadsheetApp.getUi().alert('サンプルデータを生成しました。Search Console接続前の動作確認に利用できます。');
  } catch (e) {
    handleError_(e);
  }
}

function testSearchConsoleConnection() {
  try {
    requireInitialSetup_();
    var settings = getSettings_();
    var request = {
      startDate: formatDate_(daysAgo_(10)),
      endDate: formatDate_(daysAgo_(3)),
      dimensions: ['page', 'query'],
      rowLimit: 1
    };
    var response = callSearchConsoleApi_(settings.property, request);
    var count = response && response.rows ? response.rows.length : 0;
    writeConnectionResult_('OK', '接続成功。取得テスト件数: ' + count, '今日のデータを取得・分析を実行してください。');
    setConnectionStatus_('OK');
    SpreadsheetApp.getUi().alert('Search Console接続テストに成功しました。次に「今日のデータを取得・分析」を実行できます。');
  } catch (e) {
    writeConnectionResult_('ERROR', e.message || String(e), getNextActionForError_(e.message || String(e)));
    setConnectionStatus_('ERROR');
    handleError_(e);
  }
}

function fetchSearchConsoleRows_(settings) {
  var endDate = formatDate_(daysAgo_(3));
  var startDate = formatDate_(daysAgo_(31));
  var all = [];
  var startRow = 0;
  var pageSize = 25000;
  while (true) {
    var request = {
      startDate: startDate,
      endDate: endDate,
      dimensions: ['page', 'query'],
      rowLimit: pageSize,
      startRow: startRow
    };
    var response = callSearchConsoleApi_(settings.property, request);
    var rows = response.rows || [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      all.push({
        date: new Date(),
        url: r.keys[0],
        query: r.keys[1],
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: r.ctr || 0,
        position: r.position || 0,
        title: ''
      });
    }
    if (rows.length < pageSize) break;
    startRow += pageSize;
    if (startRow > 100000) break;
  }
  return all;
}

function callSearchConsoleApi_(siteUrl, payload) {
  var encoded = encodeURIComponent(siteUrl);
  var url = 'https://www.googleapis.com/webmasters/v3/sites/' + encoded + '/searchAnalytics/query';
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    headers: {Authorization: 'Bearer ' + ScriptApp.getOAuthToken()}
  });
  var code = res.getResponseCode();
  var text = res.getContentText();
  if (code < 200 || code >= 300) throw new Error(formatApiError_(code, text));
  return JSON.parse(text || '{}');
}

function writeQueryData_(rows) {
  var sh = SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.QUERY_DATA);
  clearBody_(sh, 3);
  if (!rows || rows.length === 0) return;
  var values = [];
  for (var i = 0; i < rows.length; i++) {
    values.push([rows[i].date, rows[i].url, rows[i].query, rows[i].clicks, rows[i].impressions, rows[i].ctr, rows[i].position]);
  }
  sh.getRange(3, 1, values.length, 7).setValues(values);
  sh.getRange(3, 6, values.length, 1).setNumberFormat('0.00%');
  sh.getRange(3, 7, values.length, 1).setNumberFormat('0.0');
}

function analyzeQueries_(rows, settings) {
  var byUrl = {};
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (!byUrl[r.url]) byUrl[r.url] = {url: r.url, title: r.title || '', clicks: 0, impressions: 0, weightedPos: 0, queries: []};
    var a = byUrl[r.url];
    a.clicks += Number(r.clicks || 0);
    a.impressions += Number(r.impressions || 0);
    a.weightedPos += Number(r.position || 0) * Number(r.impressions || 0);
    a.queries.push(r);
  }
  var articles = [];
  for (var url in byUrl) {
    if (!byUrl.hasOwnProperty(url)) continue;
    var a = byUrl[url];
    a.ctr = a.impressions ? a.clicks / a.impressions : 0;
    a.position = a.impressions ? a.weightedPos / a.impressions : 0;
    a.queries.sort(function(x, y) { return (y.impressions - x.impressions) || (y.clicks - x.clicks); });
    a.mainQuery = a.queries.length ? a.queries[0].query : '';
    a.related = [];
    for (var q = 0; q < a.queries.length && q < settings.relatedQueries; q++) a.related.push(a.queries[q].query);
    if (a.impressions >= settings.minImpressions && a.clicks >= settings.minClicks) articles.push(a);
  }
  articles.sort(function(a, b) { return b.impressions - a.impressions; });
  var managedCount = Math.max(1, Math.ceil(articles.length * settings.managedRatio));
  for (var j = 0; j < articles.length; j++) articles[j].managed = j < managedCount;
  return articles;
}

function writeDiagnosisAndCards_(articles) {
  var ss = SpreadsheetApp.getActive();
  var diag = ss.getSheetByName(SBM.SHEETS.DIAGNOSIS);
  var cards = ss.getSheetByName(SBM.SHEETS.CARDS);
  clearBody_(diag, 4);
  clearBody_(cards, 4);
  var logMap = getLastImprovementMap_();
  var diagRows = [];
  var cardRows = [];
  for (var i = 0; i < articles.length; i++) {
    var a = articles[i];
    var d = diagnoseArticle_(a, logMap[a.url]);
    if (!a.managed) d.status = '管理対象外';
    var related = splitRelated_(a.related);
    diagRows.push([a.url, a.title || guessTitleFromUrl_(a.url), a.mainQuery, related.important.join('\n'), related.body.join('\n'), related.faq.join('\n'), a.clicks, a.impressions, a.ctr, a.position, d.code, d.diagnosis, d.recommendation, d.minutes, d.effect, d.score, d.reason]);
    cardRows.push([makeArticleId_(a.url), a.url, a.title || guessTitleFromUrl_(a.url), a.mainQuery, a.clicks, a.impressions, a.ctr, a.position, a.managed ? '○' : '×', d.status, d.score, d.recommendation, d.lastDate || '', d.count || 0, new Date()]);
  }
  if (diagRows.length) {
    diag.getRange(4, 1, diagRows.length, 17).setValues(diagRows);
    diag.getRange(4, 9, diagRows.length, 1).setNumberFormat('0.00%');
    diag.getRange(4, 10, diagRows.length, 1).setNumberFormat('0.0');
  }
  if (cardRows.length) {
    cards.getRange(4, 1, cardRows.length, 15).setValues(cardRows);
    cards.getRange(4, 7, cardRows.length, 1).setNumberFormat('0.00%');
    cards.getRange(4, 8, cardRows.length, 1).setNumberFormat('0.0');
  }
}

function diagnoseArticle_(a, last) {
  var lastDate = last ? last.date : null;
  var protected14 = lastDate && daysBetween_(lastDate, new Date()) < 14;
  var d = {code:'', diagnosis:'', recommendation:'', minutes:15, effect:'★★★☆☆', status:'改善候補', reason:'', lastDate:lastDate, count:last ? last.count : 0};
  if (protected14) {
    d.code = 'D00'; d.diagnosis = '改善直後'; d.recommendation = '効果測定待ち'; d.minutes = 0; d.effect = '対象外'; d.status = '効果測定中'; d.reason = '前回改善から14日以内のため、再提案を防止しています。';
  } else if (a.position <= 5 && a.ctr < 0.04) {
    d.code = 'D01'; d.diagnosis = '上位表示だがCTR不足'; d.recommendation = 'タイトル・ディスクリプション・導入文確認'; d.minutes = 10; d.effect = '★★★★★'; d.reason = '順位は高い一方でCTRが低いため、クリック率に改善余地があります。';
  } else if (a.position <= 10 && a.ctr < 0.05) {
    d.code = 'D02'; d.diagnosis = '1ページ目でCTR不足'; d.recommendation = 'タイトル・導入文確認'; d.minutes = 20; d.effect = '★★★★☆'; d.reason = '1ページ目に表示されているため、クリック率改善で流入増加が期待できます。';
  } else if (a.position <= 20) {
    d.code = 'D03'; d.diagnosis = '1ページ目目前'; d.recommendation = 'H2・本文補強・FAQ追加'; d.minutes = 30; d.effect = '★★★★★'; d.reason = '平均順位が11〜20位のため、本文補強で1ページ目入りを狙える可能性があります。';
  } else if (a.position <= 40) {
    d.code = 'D04'; d.diagnosis = '順位改善余地あり'; d.recommendation = '本文補強・検索意図確認'; d.minutes = 40; d.effect = '★★★☆☆'; d.reason = '表示回数があり順位も改善余地があるため、内容の補強を検討してください。';
  } else {
    d.code = 'D05'; d.diagnosis = '優先度低'; d.recommendation = '時間がある日に確認'; d.minutes = 60; d.effect = '★☆☆☆☆'; d.status = '低優先'; d.reason = '平均順位が低いため、短時間改善の優先度は高くありません。';
  }
  var impScore = Math.min(40, Math.log(Math.max(a.impressions, 1)) / Math.LN10 * 10);
  var posScore = 0;
  if (a.position <= 3) posScore = 8;
  else if (a.position <= 10) posScore = 22;
  else if (a.position <= 20) posScore = 30;
  else if (a.position <= 40) posScore = 18;
  else posScore = 5;
  var ctrScore = Math.min(20, Math.max(0, (0.08 - a.ctr) / 0.08 * 20));
  var value = impScore + posScore + ctrScore + 10;
  var coeff = d.minutes <= 5 ? 0.8 : d.minutes <= 10 ? 1.0 : d.minutes <= 15 ? 1.1 : d.minutes <= 20 ? 1.2 : d.minutes <= 30 ? 1.4 : d.minutes <= 40 ? 1.6 : 2.0;
  d.score = d.minutes === 0 ? 0 : Math.min(100, Math.round(value / coeff));
  return d;
}

function buildTodayQueue() {
  try {
    var ss = SpreadsheetApp.getActive();
    var settings = getSettings_();
    var diag = ss.getSheetByName(SBM.SHEETS.DIAGNOSIS);
    var today = ss.getSheetByName(SBM.SHEETS.TODAY);
    var lastRow = diag.getLastRow();
    clearBody_(today, 4);
    if (lastRow < 4) { refreshHome(); return; }
    var data = diag.getRange(4, 1, lastRow - 3, 17).getValues();
    var tasks = [];
    for (var i = 0; i < data.length; i++) {
      var r = data[i];
      var score = Number(r[15] || 0);
      var minutes = Number(r[13] || 0);
      if (score > 0 && minutes > 0) {
        tasks.push({row:r, score:score, minutes:minutes});
      }
    }
    tasks.sort(function(a, b) { return b.score - a.score || a.minutes - b.minutes; });
    var selected = [];
    var used = 0;
    for (var t = 0; t < tasks.length; t++) {
      if (selected.length >= settings.queueLimit) break;
      if (used + tasks[t].minutes <= settings.dailyMinutes || selected.length === 0) {
        selected.push(tasks[t]);
        used += tasks[t].minutes;
      }
    }
    var rows = [];
    for (var s = 0; s < selected.length; s++) {
      var x = selected[s].row;
      rows.push([priorityStars_(Number(x[15] || 0)), Number(x[15] || 0), Number(x[13] || 0) + '分', '未着手', x[1], x[0], x[2], x[3], x[4], x[5], x[9], x[8], x[7], x[16] + ' 推奨確認項目：' + x[12]]);
    }
    if (rows.length) {
      today.getRange(4, 1, rows.length, 14).setValues(rows);
      today.getRange(4, 12, rows.length, 1).setNumberFormat('0.00%');
      today.getRange(4, 11, rows.length, 1).setNumberFormat('0.0');
    }
    refreshHome();
  } catch (e) {
    handleError_(e);
  }
}

function recordSelectedImprovement() {
  try {
    var ss = SpreadsheetApp.getActive();
    var sh = ss.getActiveSheet();
    if (sh.getName() !== SBM.SHEETS.TODAY) throw new Error('「今日の改善」シートで記録したい行を選択してください。');
    var row = sh.getActiveRange().getRow();
    if (row < 4) throw new Error('記録したい改善タスクの行を選択してください。');
    var v = sh.getRange(row, 1, 1, 14).getValues()[0];
    var log = ss.getSheetByName(SBM.SHEETS.LOG);
    log.appendRow([new Date(), v[5], v[4], v[6], v[13], v[2], '', v[11], v[10], '', v[12], daysAfter_(14), daysAfter_(30)]);
    sh.getRange(row, 4).setValue('完了');
    SpreadsheetApp.getUi().alert('改善ログに記録しました。');
  } catch (e) {
    handleError_(e);
  }
}

function updateEffectiveness() {
  try {
    var ss = SpreadsheetApp.getActive();
    var log = ss.getSheetByName(SBM.SHEETS.LOG);
    var eff = ss.getSheetByName(SBM.SHEETS.EFFECTIVENESS);
    var last = log.getLastRow();
    clearBody_(eff, 4);
    if (last < 4) return;
    var rows = log.getRange(4, 1, last - 3, 13).getValues();
    var today = new Date();
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var status = daysBetween_(r[0], today) >= 30 ? '測定可' : daysBetween_(r[0], today) >= 14 ? '14日測定可' : '測定待ち';
      out.push([r[1], r[2], r[0], r[4], r[7], '', '', r[8], '', '', '', '', status, 'Search Console反映後に比較します。']);
    }
    if (out.length) eff.getRange(4,1,out.length,14).setValues(out);
    refreshHome();
  } catch (e) {
    handleError_(e);
  }
}

function refreshHome() {
  var ss = SpreadsheetApp.getActive();
  var home = ss.getSheetByName(SBM.SHEETS.HOME);
  if (!home) return;
  var settings = getSettingsSafe_();
  var today = ss.getSheetByName(SBM.SHEETS.TODAY);
  var rows = [];
  if (today && today.getLastRow() >= 4) {
    var raw = today.getRange(4, 1, today.getLastRow() - 3, 14).getValues();
    for (var i = 0; i < raw.length; i++) if (raw[i][0]) rows.push(raw[i]);
  }
  var best = rows.length ? rows[0] : [];
  home.getRange('B6').setValue(settings.blogName || '未設定');
  home.getRange('B7').setValue(settings.setupStatus || '未完了');
  home.getRange('B8').setValue(settings.lastFetchDate || '未取得');
  home.getRange('B9').setValue(settings.lastFetchDate && sameDate_(settings.lastFetchDate, new Date()) ? 'はい' : 'いいえ');
  home.getRange('B10').setValue((settings.dailyMinutes || 30) + '分');
  home.getRange('B11').setValue(rows.length);
  home.getRange('B12').setValue(countTasksUnderMinutes_(rows, 10));
  home.getRange('B13').setValue(countTasksUnderMinutes_(rows, 30));
  home.getRange('B14').setValue(settings.managedRatio || SBM.DEFAULTS.MANAGED_RATIO);
  home.getRange('B15').setValue(rows.length < 3 ? '候補が少ない場合は管理対象を広げてください。' : '現在の範囲で改善を進めてください。');

  home.getRange('E6').setValue(best[0] || '-');
  home.getRange('E7').setValue(best[13] ? String(best[13]).split(' 推奨確認項目：')[1] || '-' : '-');
  home.getRange('E8').setValue(best[4] || '-');
  home.getRange('E9').setValue(best[6] || '-');
  home.getRange('E10').setValue(best[2] || '-');
  home.getRange('E11').setValue(best[13] || '-');
  home.getRange('E12').setValue(best[5] || '-');
}

function expandManagedRatio() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.SETTINGS);
  if (!sh) return;
  var current = String(sh.getRange(SBM.SETTINGS_ROW.MANAGED_RATIO, 2).getValue() || SBM.DEFAULTS.MANAGED_RATIO);
  var order = ['30%', '50%', '70%', '100%'];
  var idx = 0;
  for (var i = 0; i < order.length; i++) if (order[i] === current) idx = i;
  var next = order[Math.min(idx + 1, order.length - 1)];
  sh.getRange(SBM.SETTINGS_ROW.MANAGED_RATIO, 2).setValue(next);
  SpreadsheetApp.getUi().alert('管理対象割合を ' + next + ' に変更しました。');
}

function openConnectionTest() { SpreadsheetApp.setActiveSheet(SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.CONNECTION)); }
function openErrorLog() { SpreadsheetApp.setActiveSheet(SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.ERROR_LOG)); }
function openHelp() { SpreadsheetApp.setActiveSheet(SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.HELP)); }

function getLastConnectionStatus_() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.CONNECTION);
  if (!sh) return '';
  var last = sh.getLastRow();
  if (last < 3) return '';
  var values = sh.getRange(3, 2, Math.max(1, last - 2), 1).getValues();
  for (var i = values.length - 1; i >= 0; i--) {
    var v = String(values[i][0] || '').trim().toUpperCase();
    if (v) return v;
  }
  return '';
}

function requireConnectionOk_() {
  var status = getLastConnectionStatus_();
  if (status !== 'OK' || !isConnectionTestOk_()) {
    throw new Error('Search Console接続テストが未完了です。メニュー「API設定後に接続テストへ進む」または「Search Console接続テスト」を実行し、接続OKを確認してからデータ取得してください。');
  }
}

function requireInitialSetup_() {
  if (!isInitialSetupComplete_()) throw new Error('初期設定が未完了です。設定シート B4 にブログ名、B5 にSearch Console Propertyを入力し、「初期設定を完了」を実行してください。');
}

function isConnectionTestOk_() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.SETTINGS);
  if (!sh) return false;
  return String(sh.getRange(SBM.SETTINGS_ROW.CONNECTION_STATUS, 2).getValue() || '').trim() === 'OK';
}

function requireConnectionTestOk_() {
  if (!isConnectionTestOk_()) throw new Error('Search Console接続テストが未成功です。先にメニュー「API設定後に接続テストへ進む」または「Search Console接続テスト」を実行してください。');
}

function setConnectionStatus_(status) {
  var sh = SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.SETTINGS);
  if (sh) sh.getRange(SBM.SETTINGS_ROW.CONNECTION_STATUS, 2).setValue(status);
}

function continueAfterApiSetup() {
  SpreadsheetApp.getUi().alert('接続テストへ進みます', 'Google CloudでSearch Console APIを有効化済みであれば、このあと接続テストを実行します。未設定の場合はエラー案内が表示されます。', SpreadsheetApp.getUi().ButtonSet.OK);
  testSearchConsoleConnection();
}

function isInitialSetupComplete_() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.SETTINGS);
  if (!sh) return false;
  var blog = String(sh.getRange(SBM.SETTINGS_ROW.BLOG_NAME, 2).getValue() || '').trim();
  var prop = String(sh.getRange(SBM.SETTINGS_ROW.PROPERTY, 2).getValue() || '').trim();
  var status = String(sh.getRange(SBM.SETTINGS_ROW.SETUP_STATUS, 2).getValue() || '').trim();
  return !!(blog && prop && status === '完了');
}

function getSettings_() {
  var s = getSettingsSafe_();
  if (!s.blogName) throw new Error('設定シート B4 にブログ名を入力してください。');
  if (!s.property) throw new Error('設定シート B5 にSearch Console Propertyを入力してください。例: https://example.com/');
  return s;
}

function getSettingsSafe_() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.SETTINGS);
  if (!sh) return defaultSettings_();
  return {
    blogName: String(sh.getRange(SBM.SETTINGS_ROW.BLOG_NAME, 2).getValue() || '').trim(),
    property: String(sh.getRange(SBM.SETTINGS_ROW.PROPERTY, 2).getValue() || '').trim(),
    setupStatus: String(sh.getRange(SBM.SETTINGS_ROW.SETUP_STATUS, 2).getValue() || '未完了').trim(),
    managedRatio: String(sh.getRange(SBM.SETTINGS_ROW.MANAGED_RATIO, 2).getValue() || SBM.DEFAULTS.MANAGED_RATIO),
    dailyMinutes: Number(sh.getRange(SBM.SETTINGS_ROW.DAILY_MINUTES, 2).getValue() || SBM.DEFAULTS.DAILY_MINUTES),
    queueLimit: Number(sh.getRange(SBM.SETTINGS_ROW.QUEUE_LIMIT, 2).getValue() || SBM.DEFAULTS.QUEUE_LIMIT),
    relatedQueries: Number(sh.getRange(SBM.SETTINGS_ROW.RELATED_QUERIES, 2).getValue() || SBM.DEFAULTS.RELATED_QUERIES),
    minImpressions: Number(sh.getRange(SBM.SETTINGS_ROW.MIN_IMPRESSIONS, 2).getValue() || SBM.DEFAULTS.MIN_IMPRESSIONS),
    minClicks: Number(sh.getRange(SBM.SETTINGS_ROW.MIN_CLICKS, 2).getValue() || SBM.DEFAULTS.MIN_CLICKS),
    oncePerDay: String(sh.getRange(SBM.SETTINGS_ROW.ONCE_PER_DAY, 2).getValue() || SBM.DEFAULTS.ONCE_PER_DAY),
    lastFetchDate: sh.getRange(SBM.SETTINGS_ROW.LAST_FETCH_DATE, 2).getValue(),
    measureDays: String(sh.getRange(SBM.SETTINGS_ROW.MEASURE_DAYS, 2).getValue() || SBM.DEFAULTS.MEASURE_DAYS),
    connectionStatus: String(sh.getRange(SBM.SETTINGS_ROW.CONNECTION_STATUS, 2).getValue() || '未テスト'),
    managedRatioNumber: parseRatio_(sh.getRange(SBM.SETTINGS_ROW.MANAGED_RATIO, 2).getValue() || SBM.DEFAULTS.MANAGED_RATIO)
  };
}

function defaultSettings_() {
  return {managedRatio: SBM.DEFAULTS.MANAGED_RATIO, dailyMinutes: 30, queueLimit: 20, relatedQueries: 20, minImpressions: 50, minClicks: 1, managedRatioNumber: 0.3};
}

function setupHome_(sh) {
  sh.clear();
  sh.setFrozenRows(3);
  sh.getRange('A1:G1').merge().setValue('SIMS-Blog-Manager').setFontSize(18).setFontWeight('bold').setFontColor('#ffffff').setBackground('#1f4e79').setHorizontalAlignment('center');
  sh.getRange('A2:G2').merge().setValue('ブログ改善で迷わない。今日やることが30秒で決まる。').setFontColor('#1f4e79').setHorizontalAlignment('center');
  sh.getRange('A4:B4').merge().setValue('今日の状態').setFontWeight('bold').setBackground('#d9eaf7');
  sh.getRange('D4:E4').merge().setValue('今日のおすすめ改善').setFontWeight('bold').setBackground('#d9eaf7');
  var left = [['ブログ名',''],['初期設定ステータス',''],['最終データ取得日',''],['本日取得済み',''],['今日の改善時間',''],['今日の改善候補数',''],['10分以内',''],['30分以内',''],['管理対象割合',''],['管理対象拡大提案',''],['14日後成功件数',''],['30日後成功件数','']];
  var right = [['優先度',''],['改善タスク',''],['対象記事',''],['メインクエリ',''],['推定時間',''],['改善理由',''],['URL','']];
  sh.getRange(6,1,left.length,2).setValues(left);
  sh.getRange(6,4,right.length,2).setValues(right);
  sh.getRange('A6:A17').setFontWeight('bold').setBackground('#f3f6fa');
  sh.getRange('D6:D12').setFontWeight('bold').setBackground('#f3f6fa');
  sh.setColumnWidths(1, 7, 160);
  sh.setColumnWidth(2, 260);
  sh.setColumnWidth(5, 420);
  sh.getRange('A1:G30').setWrap(true).setVerticalAlignment('top');
}

function setupSettings_(sh) {
  var preserved = readSettingsByLabel_(sh);
  sh.clear();
  sh.getRange('A1:D1').merge().setValue('設定').setFontSize(16).setFontWeight('bold').setFontColor('#ffffff').setBackground('#1f4e79').setHorizontalAlignment('center');
  var rows = [
    ['項目','値','説明','編集'],
    ['ブログ名', preserved['ブログ名'] || '', '管理するブログ名。ホーム表示に使います。', '要設定'],
    ['Search Console Property', preserved['Search Console Property'] || '', '例：https://example.com/ または sc-domain:example.com', '要設定'],
    ['初期設定ステータス', preserved['初期設定ステータス'] || '未完了', 'ブログ名とProperty入力後に「初期設定を完了」で完了にします。', '自動'],
    ['', '', '', ''],
    ['管理対象割合', preserved['管理対象割合'] || SBM.DEFAULTS.MANAGED_RATIO, '表示回数上位の何％を管理対象にするか。', '編集可'],
    ['今日の改善時間', preserved['今日の改善時間'] || SBM.DEFAULTS.DAILY_MINUTES, '分単位。Queue生成時に利用します。', '編集可'],
    ['Queue最大件数', preserved['Queue最大件数'] || SBM.DEFAULTS.QUEUE_LIMIT, '今日の改善に表示する最大件数。', '編集可'],
    ['関連クエリ数', preserved['関連クエリ数'] || SBM.DEFAULTS.RELATED_QUERIES, '改善ブリーフに出す参考クエリ数。', '固定推奨'],
    ['最低表示回数', preserved['最低表示回数'] || SBM.DEFAULTS.MIN_IMPRESSIONS, '少なすぎる記事を除外します。', '編集可'],
    ['最低クリック数', preserved['最低クリック数'] || SBM.DEFAULTS.MIN_CLICKS, 'クリックゼロの扱い調整用。', '編集可'],
    ['1日1回取得制限', preserved['1日1回取得制限'] || SBM.DEFAULTS.ONCE_PER_DAY, '初期設定完了後、その日に初めて開いた時だけ取得確認します。', '編集可'],
    ['最終取得日', preserved['最終取得日'] || '', '自動記録。', '自動'],
    ['効果測定日数', preserved['効果測定日数'] || SBM.DEFAULTS.MEASURE_DAYS, '改善後の比較日数。', '固定推奨'],
    ['サンプルデータ', preserved['サンプルデータ'] || 'OFF', 'GSC接続前の動作確認用。メニューから生成。', 'メニューから生成'],
    ['接続テストステータス', preserved['接続テストステータス'] || '未テスト', 'Search Console接続テストが成功するとOKになります。OKになるまで日次取得は動きません。', '自動']
  ];
  sh.getRange(3,1,rows.length,4).setValues(rows);
  sh.getRange('A3:D3').setFontWeight('bold').setBackground('#1f4e79').setFontColor('#ffffff');
  sh.setColumnWidth(1, 180); sh.setColumnWidth(2, 260); sh.setColumnWidth(3, 430); sh.setColumnWidth(4, 140);
  sh.getRange('A1:D25').setWrap(true).setVerticalAlignment('top');
  setValidation_(sh.getRange(SBM.SETTINGS_ROW.MANAGED_RATIO,2), ['30%','50%','70%','100%']);
  setValidation_(sh.getRange(SBM.SETTINGS_ROW.ONCE_PER_DAY,2), ['ON','OFF']);
}

function setupToday_(sh) {
  sh.clear();
  sh.getRange('A1:N1').merge().setValue('今日の改善').setFontSize(16).setFontWeight('bold').setFontColor('#ffffff').setBackground('#1f4e79').setHorizontalAlignment('center');
  var headers = ['優先','Score','時間','状態','記事タイトル','URL','メインクエリ','重要クエリ5件','本文補強クエリ10件','FAQ候補5件','順位','CTR','表示回数','改善ブリーフ'];
  sh.getRange(3,1,1,headers.length).setValues([headers]).setFontWeight('bold').setBackground('#d9eaf7');
  sh.setFrozenRows(3);
  var widths = [90,70,70,90,220,260,180,220,260,220,70,80,90,420];
  for (var i=0;i<widths.length;i++) sh.setColumnWidth(i+1,widths[i]);
  sh.getRange('A1:N200').setWrap(true).setVerticalAlignment('top');
  setValidation_(sh.getRange('D4:D200'), ['未着手','作業中','完了','保留']);
}

function setupLog_(sh) {
  sh.clear();
  sh.getRange('A1:M1').merge().setValue('改善ログ').setFontSize(16).setFontWeight('bold').setFontColor('#ffffff').setBackground('#1f4e79').setHorizontalAlignment('center');
  sh.getRange(3,1,1,13).setValues([['改善日','URL','タイトル','Main Query','改善タスク','実際の作業時間','改善内容メモ','改善前CTR','改善前順位','改善前クリック','改善前表示回数','14日測定予定日','30日測定予定日']]).setFontWeight('bold').setBackground('#d9eaf7');
  sh.setFrozenRows(3);
  sh.getRange('A1:M200').setWrap(true).setVerticalAlignment('top');
}

function setupArticleCards_(sh) {
  sh.clear();
  sh.getRange('A1:O1').merge().setValue('記事カルテ').setFontSize(16).setFontWeight('bold').setFontColor('#ffffff').setBackground('#1f4e79').setHorizontalAlignment('center');
  sh.getRange(3,1,1,15).setValues([['Article_ID','URL','タイトル','Main Query','現在クリック数','現在表示回数','現在CTR','現在平均順位','管理対象','記事状態','Opportunity Score','推奨改善','前回改善日','改善回数','最終分析日']]).setFontWeight('bold').setBackground('#d9eaf7');
  sh.setFrozenRows(3);
}

function setupQueryData_(sh) {
  sh.clear();
  sh.getRange('A1:G1').merge().setValue('クエリデータ').setFontSize(16).setFontWeight('bold').setFontColor('#ffffff').setBackground('#1f4e79').setHorizontalAlignment('center');
  sh.getRange(2,1,1,7).setValues([['取得日','URL','Query','Clicks','Impressions','CTR','Position']]).setFontWeight('bold').setBackground('#d9eaf7');
  sh.setFrozenRows(2);
}

function setupDiagnosis_(sh) {
  sh.clear();
  sh.getRange('A1:Q1').merge().setValue('記事診断').setFontSize(16).setFontWeight('bold').setFontColor('#ffffff').setBackground('#1f4e79').setHorizontalAlignment('center');
  sh.getRange(3,1,1,17).setValues([['URL','タイトル','Main Query','重要クエリ5件','本文補強クエリ10件','FAQ候補5件','Clicks','Impressions','CTR','Position','診断コード','診断','推奨改善','推定作業時間','期待効果','Opportunity Score','改善理由']]).setFontWeight('bold').setBackground('#d9eaf7');
  sh.setFrozenRows(3);
  sh.getRange('A1:Q200').setWrap(true).setVerticalAlignment('top');
}

function setupEffectiveness_(sh) {
  sh.clear();
  sh.getRange('A1:N1').merge().setValue('効果測定').setFontSize(16).setFontWeight('bold').setFontColor('#ffffff').setBackground('#1f4e79').setHorizontalAlignment('center');
  sh.getRange(3,1,1,14).setValues([['URL','タイトル','改善日','改善タスク','改善前CTR','14日CTR','30日CTR','改善前順位','14日順位','30日順位','クリック増減','表示回数増減','成功判定','コメント']]).setFontWeight('bold').setBackground('#d9eaf7');
  sh.setFrozenRows(3);
}

function setupHelp_(sh) {
  sh.clear();
  sh.getRange('A1:D1').merge().setValue('ヘルプ').setFontSize(16).setFontWeight('bold').setFontColor('#ffffff').setBackground('#1f4e79').setHorizontalAlignment('center');
  var rows = [
    ['最初にやること', '1. セットアップウィザード開始 2. ポップアップでブログ名とSearch Console Propertyを入力 3. Google Cloud API有効化 4. API設定後に接続テストへ進む'],
    ['Search Console Property', 'URLプレフィックスなら https://example.com/、ドメインプロパティなら sc-domain:example.com'],
    ['毎日の使い方', 'その日に初めて開いた時、初期設定完了済みならデータ取得確認が出ます。'],
    ['構文エラーが出る場合', 'Product 1.6以降のCode.jsを全文貼り直してください。古いコードが残っていないか確認してください。'],
    ['改善ログ', '今日の改善シートで行を選択し、メニューから改善ログを記録します。']
  ];
  sh.getRange(3,1,rows.length,2).setValues(rows);
  sh.setColumnWidth(1, 200); sh.setColumnWidth(2, 700);
  sh.getRange('A1:D50').setWrap(true).setVerticalAlignment('top');
}

function setupConnectionTest_(sh) {
  sh.clear();
  sh.getRange('A1:D1').merge().setValue('接続テスト').setFontSize(16).setFontWeight('bold').setFontColor('#ffffff').setBackground('#1f4e79').setHorizontalAlignment('center');
  sh.getRange(3,1,1,4).setValues([['日時','結果','メッセージ','次にすること']]).setFontWeight('bold').setBackground('#d9eaf7');
}

function setupErrorLog_(sh) {
  sh.clear();
  sh.getRange('A1:D1').merge().setValue('エラーログ').setFontSize(16).setFontWeight('bold').setFontColor('#ffffff').setBackground('#1f4e79').setHorizontalAlignment('center');
  sh.getRange(3,1,1,4).setValues([['日時','エラー','次にすること','詳細']]).setFontWeight('bold').setBackground('#f4cccc');
}

function markSetupStatus_() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.SETTINGS);
  if (!sh) return;
  var blog = String(sh.getRange(SBM.SETTINGS_ROW.BLOG_NAME, 2).getValue() || '').trim();
  var prop = String(sh.getRange(SBM.SETTINGS_ROW.PROPERTY, 2).getValue() || '').trim();
  sh.getRange(SBM.SETTINGS_ROW.SETUP_STATUS, 2).setValue((blog && prop) ? '完了' : '未完了');
}

function getLastImprovementMap_() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.LOG);
  var map = {};
  if (!sh || sh.getLastRow() < 4) return map;
  var rows = sh.getRange(4,1,sh.getLastRow()-3,13).getValues();
  for (var i = 0; i < rows.length; i++) {
    var url = rows[i][1];
    if (!url) continue;
    if (!map[url]) map[url] = {date:null,count:0};
    map[url].count++;
    if (!map[url].date || rows[i][0] > map[url].date) map[url].date = rows[i][0];
  }
  return map;
}

function splitRelated_(queries) {
  var q = queries || [];
  return {important: q.slice(0, 5), body: q.slice(5, 15), faq: q.slice(15, 20)};
}

function countTasksUnderMinutes_(rows, minutes) {
  var count = 0;
  for (var i = 0; i < rows.length; i++) {
    var m = parseInt(String(rows[i][2] || '').replace('分',''),10);
    if (m <= minutes) count++;
  }
  return count;
}

function sheetNames_() {
  var arr = [];
  for (var key in SBM.SHEETS) if (SBM.SHEETS.hasOwnProperty(key)) arr.push(SBM.SHEETS[key]);
  return arr;
}

function getOrCreateSheet_(ss, name) { return ss.getSheetByName(name) || ss.insertSheet(name); }
function clearBody_(sh, startRow) { if (sh && sh.getLastRow() >= startRow) sh.getRange(startRow, 1, sh.getLastRow() - startRow + 1, Math.max(1, sh.getLastColumn())).clearContent(); }
function daysAgo_(n) { var d = new Date(); d.setDate(d.getDate() - n); return d; }
function daysAfter_(n) { var d = new Date(); d.setDate(d.getDate() + n); return d; }
function sameDate_(a,b) { if (!a || !b) return false; var da = new Date(a), db = new Date(b); return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate(); }
function formatDate_(d) { return Utilities.formatDate(new Date(d), Session.getScriptTimeZone(), 'yyyy-MM-dd'); }
function daysBetween_(a,b) { return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000); }
function parseRatio_(v) { var n = parseFloat(String(v).replace('%','')); return n > 1 ? n / 100 : (n || 0.3); }
function priorityStars_(score) { if (score >= 90) return '★★★★★'; if (score >= 75) return '★★★★☆'; if (score >= 60) return '★★★☆☆'; if (score >= 40) return '★★☆☆☆'; return '★☆☆☆☆'; }
function makeArticleId_(url) { var s = Utilities.base64EncodeWebSafe(String(url)).replace(/=/g,''); return 'A-' + s.substring(0,10); }
function guessTitleFromUrl_(url) { return String(url || '').replace(/^https?:\/\//,'').replace(/\/$/,'').split('/').pop() || url; }
function setValidation_(range, values) { var rule = SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build(); range.setDataValidation(rule); }

function readSettingsByLabel_(sh) {
  var map = {};
  if (!sh || sh.getLastRow() < 1) return map;
  var values = sh.getRange(1, 1, sh.getLastRow(), Math.min(2, sh.getLastColumn())).getValues();
  for (var i=0;i<values.length;i++) {
    var key = String(values[i][0] || '').trim();
    if (key) map[key] = values[i][1];
  }
  return map;
}

function writeConnectionResult_(result, message, next) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SBM.SHEETS.CONNECTION) || ss.insertSheet(SBM.SHEETS.CONNECTION);
  if (sh.getLastRow() < 3) setupConnectionTest_(sh);
  sh.appendRow([new Date(), result, message, next]);
}

function handleError_(e) {
  var message = e && e.message ? e.message : String(e);
  var next = getNextActionForError_(message);
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SBM.SHEETS.ERROR_LOG) || ss.insertSheet(SBM.SHEETS.ERROR_LOG);
  if (sh.getLastRow() < 3) setupErrorLog_(sh);
  sh.appendRow([new Date(), message, next, e && e.stack ? e.stack : '']);
  SpreadsheetApp.getUi().alert('Error: ' + message + '\n\n次にすること: ' + next);
  if (message.indexOf('SERVICE_DISABLED') >= 0 || message.indexOf('has not been used in project') >= 0 || message.indexOf('accessNotConfigured') >= 0) { showGoogleCloudApiHelp(extractGoogleCloudProjectId_(message)); }
  if (message.indexOf('ACCESS_TOKEN_SCOPE_INSUFFICIENT') >= 0 || message.indexOf('insufficient authentication scopes') >= 0) { showOAuthScopeHelp(); }
}

function getNextActionForError_(message) {
  var m = String(message || '');
  if (m.indexOf('Search Console接続テストが未完了') >= 0 || m.indexOf('接続テストが未成功') >= 0) return 'メニュー「API設定後に接続テストへ進む」または「Search Console接続テスト」を先に実行してください。接続OKになるまでデータ取得は行いません。';
  if (m.indexOf('初期設定') >= 0 || m.indexOf('B4') >= 0 || m.indexOf('B5') >= 0) return 'メニュー「セットアップウィザード開始」でブログ名とSearch Console Propertyを入力してください。';
  if (m.indexOf('SERVICE_DISABLED') >= 0 || m.indexOf('accessNotConfigured') >= 0 || m.indexOf('has not been used in project') >= 0 || m.indexOf('disabled') >= 0) return 'Google Cloud側で Search Console API が有効化されていません。Apps Scriptのプロジェクト設定からGoogle Cloudプロジェクトを開き、Search Console APIを有効化してください。';
  if (m.indexOf('ACCESS_TOKEN_SCOPE_INSUFFICIENT') >= 0 || m.indexOf('insufficient authentication scopes') >= 0) return 'Apps Scriptのappsscript.jsonにSearch Console読み取りスコープを追加し、保存後に再承認してください。';
  if (m.indexOf('403') >= 0) return 'Search Consoleの権限、Google Cloud API有効化、またはApps Scriptの承認を確認してください。';
  if (m.indexOf('404') >= 0) return 'Search Console PropertyのURL表記が正しいか確認してください。';
  if (m.indexOf('401') >= 0) return 'Apps Scriptを再承認してください。';
  if (m.indexOf('Syntax') >= 0) return 'Product 1.6以降のCode.jsを全文貼り直し、古いコードが残っていないか確認してください。';
  return 'エラーログを確認してください。';
}

function formatApiError_(code, text) {
  var message = 'Search Console API error ' + code + ': ' + text;
  if (String(text).indexOf('ACCESS_TOKEN_SCOPE_INSUFFICIENT') >= 0 || String(text).indexOf('insufficient authentication scopes') >= 0) {
    message += '\n\n【原因】Apps Script のOAuthスコープに Search Console 読み取り権限が反映されていません。';
    message += '\n【対応】apps-script/appsscript.json の内容を Apps Script の appsscript.json に貼り付けて保存し、再度承認してください。';
    message += '\n必要なスコープ: https://www.googleapis.com/auth/webmasters.readonly';
    message += '\nメニュー「承認スコープ設定の確認」も参照してください。';
  }
  if (code === 403 && String(text).indexOf('insufficientPermissions') >= 0) {
    message += '\n\n【確認】Search Console側で、このGoogleアカウントに対象プロパティの閲覧権限があるか確認してください。';
  }
  if (code === 404) {
    message += '\n\n【確認】設定シートB5のProperty表記がSearch Consoleの登録表記と一致しているか確認してください。URLプレフィックスの場合は末尾の / も含めます。';
  }
  return message;
}




function startSetupWizard() {
  var ui = SpreadsheetApp.getUi();

  var step1 = ui.alert(
    'セットアップウィザード 1/4',
    '初期シートを作成・修復します。既に入力済みの値は保持します。\n\n続行しますか？',
    ui.ButtonSet.OK_CANCEL
  );
  if (step1 !== ui.Button.OK) return;
  setupWorkbook(true);

  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SBM.SHEETS.SETTINGS);
  if (!sh) {
    ui.alert('設定シートを作成できませんでした。もう一度「初期セットアップ」を実行してください。');
    return;
  }
  SpreadsheetApp.setActiveSheet(sh);

  var currentBlog = String(sh.getRange(SBM.SETTINGS_ROW.BLOG_NAME, 2).getValue() || '').trim();
  var blogPrompt = ui.prompt(
    'セットアップウィザード 2/4：ブログ名',
    '管理するブログ名を入力してください。\n例：人生いろいろ\n\n現在の値：' + (currentBlog || '未入力'),
    ui.ButtonSet.OK_CANCEL
  );
  if (blogPrompt.getSelectedButton() !== ui.Button.OK) return;
  var blogName = String(blogPrompt.getResponseText() || '').trim();
  if (!blogName && currentBlog) blogName = currentBlog;
  if (!blogName) {
    ui.alert('ブログ名が空です。セットアップを中断しました。');
    return;
  }
  sh.getRange(SBM.SETTINGS_ROW.BLOG_NAME, 2).setValue(blogName);

  var currentProp = String(sh.getRange(SBM.SETTINGS_ROW.PROPERTY, 2).getValue() || '').trim();
  var propPrompt = ui.prompt(
    'セットアップウィザード 3/4：Search Console Property',
    'Search Consoleのプロパティを入力してください。\n\nURLプレフィックス例： https://example.com/\nドメインプロパティ例： sc-domain:example.com\n\n現在の値：' + (currentProp || '未入力'),
    ui.ButtonSet.OK_CANCEL
  );
  if (propPrompt.getSelectedButton() !== ui.Button.OK) return;
  var property = String(propPrompt.getResponseText() || '').trim();
  if (!property && currentProp) property = currentProp;
  if (!property) {
    ui.alert('Search Console Propertyが空です。セットアップを中断しました。');
    return;
  }
  sh.getRange(SBM.SETTINGS_ROW.PROPERTY, 2).setValue(property);
  sh.getRange(SBM.SETTINGS_ROW.SETUP_STATUS, 2).setValue('完了');
  sh.getRange(SBM.SETTINGS_ROW.CONNECTION_STATUS, 2).setValue('未テスト');
  refreshHome();

  var apiGuide = ui.alert(
    'セットアップウィザード 4/4：Google Cloud API',
    'ブログ名とSearch Console Propertyを登録しました。\n\n次はGoogle Cloud側で「Google Search Console API」が有効になっているか確認します。\nAPI有効化ガイドを開きますか？',
    ui.ButtonSet.YES_NO
  );
  if (apiGuide === ui.Button.YES) {
    showGoogleCloudApiHelp();
    ui.alert('API設定ガイドを開きました', 'Google CloudでAPIを有効化した後、数分待ってからメニュー「API設定後に接続テストへ進む」を実行してください。\n\n※このウィザードはここで一度終了します。', ui.ButtonSet.OK);
    return;
  }

  ui.alert(
    'セットアップ登録完了',
    '次に行うこと：\n1. 必要に応じてメニュー「Google Cloud API有効化ガイド」を開く\n2. API有効化後、メニュー「API設定後に接続テストへ進む」を実行\n3. 接続OK後、「今日のデータを取得・分析」を実行\n\n※接続テストがOKになるまで、1日1回の自動取得は走りません。',
    ui.ButtonSet.OK
  );
}

function openSettings_() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SBM.SHEETS.SETTINGS);
  if (sh) SpreadsheetApp.setActiveSheet(sh);
}

function showLinkDialog_(title, message, url) {
  var safeTitle = String(title).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  var safeMessage = String(message).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  var safeUrl = String(url).replace(/"/g,'%22');
  var html = '<div style="font-family:Arial,sans-serif;line-height:1.7;padding:16px;">'
    + '<h2 style="margin-top:0;">' + safeTitle + '</h2>'
    + '<p>' + safeMessage + '</p>'
    + '<p><a href="' + safeUrl + '" target="_blank" style="display:inline-block;padding:10px 14px;background:#0b57d0;color:white;text-decoration:none;border-radius:6px;">Google Cloudで開く</a></p>'
    + '<p style="font-size:12px;color:#555;word-break:break-all;">' + safeUrl + '</p>'
    + '</div>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(520).setHeight(360), title);
}

function showGoogleCloudApiHelp(projectId) {
  var pid = projectId || '';
  var url = 'https://console.cloud.google.com/apis/library/searchconsole.googleapis.com' + (pid ? '?project=' + encodeURIComponent(pid) : '');
  var text = '今回のエラーが「Search Console API has not been used in project」または「SERVICE_DISABLED」の場合、コードではなくGoogle Cloud側のAPI有効化が必要です。\n\n'
    + (pid ? '検出したGoogle Cloudプロジェクト番号：' + pid + '\n\n' : '')
    + '手順:\n'
    + '1. 下のボタンからGoogle Cloud Consoleを開く\n'
    + '2. 画面上部のプロジェクトが、このApps ScriptのGCPプロジェクトになっているか確認する\n'
    + '3. 「Google Search Console API」を有効化する\n'
    + '4. 数分待ってから、スプレッドシートのメニュー「API設定後に接続テストへ進む」を実行する\n\n'
    + '補足: これはappsscript.jsonのOAuthスコープ設定とは別作業です。Search Console側の閲覧権限も必要です。';
  showLinkDialog_('Google Cloud API有効化ガイド', text, url);
}

function extractGoogleCloudProjectId_(message) {
  var m = String(message || '');
  var patterns = [/project=(\d+)/, /projects\/(\d+)/, /consumer\"\s*:\s*\"projects\/(\d+)\"/, /project_number\"\s*:\s*\"(\d+)\"/];
  for (var i = 0; i < patterns.length; i++) {
    var hit = m.match(patterns[i]);
    if (hit && hit[1]) return hit[1];
  }
  return '';
}

function showOAuthScopeHelp() {
  var text = 'Search Console連携には、Code.gsだけでなく appsscript.json のOAuthスコープ設定が必要です。\n\n' +
    'Apps Script左側の「プロジェクトの設定」→「appsscript.json マニフェスト ファイルをエディタで表示」をONにします。\n' +
    '左側に表示された appsscript.json を開き、配布ZIP内 apps-script/appsscript.json の内容に貼り替えて保存してください。\n\n' +
    '必要なスコープ:\n' +
    '・https://www.googleapis.com/auth/spreadsheets.currentonly\n' +
    '・https://www.googleapis.com/auth/script.external_request\n' +
    '・https://www.googleapis.com/auth/webmasters.readonly\n\n' +
    '保存後、Search Console接続テストを実行し、Google承認画面で許可してください。';
  SpreadsheetApp.getUi().alert('承認スコープ設定の確認', text, SpreadsheetApp.getUi().ButtonSet.OK);
}
