/** SIMS-Core Spreadsheet UX v2 - 02_SheetSetup.gs */
function simsInitializeCoreSheets() {
  Object.keys(SIMS_HEADERS).forEach(key => {
    const sheetName = SIMS_SHEETS[key] || key;
    const sheet = simsGetOrCreateSheet_(sheetName);
    simsEnsureHeaders_(sheet, SIMS_HEADERS[key]);
    simsStyleDataSheet_(sheet);
  });

  simsEnsureUserSheets_();
  simsEnsureDefaultSettings_();
  simsApplySpreadsheetUxV2_();
  simsLog_('InitializeCoreSheets', 'Done', 'Core sheets initialized with Spreadsheet UX v2');
  simsRefreshDashboard();
  simsAlert_('初期化完了', 'SIMS-Core v1.1 の基本シートと利用者向け画面を作成・整理しました。');
}

function simsEnsureUserSheets_() {
  simsEnsureHomeSheet_();
  simsEnsureSetupSheet_();
  simsEnsureTodaySheet_();
  simsEnsureMeasurementViewSheet_();
  simsEnsureHistoryViewSheet_();
}

function simsEnsureHomeSheet_() {
  return simsGetOrCreateSheet_(SIMS_SHEETS.HOME);
}

function simsEnsureSetupSheet_() {
  const sheet = simsGetOrCreateSheet_(SIMS_SHEETS.SETUP);
  sheet.clear();
  const rows = [
    ['SIMS セットアップ', '最初にここだけ確認してください'],
    ['1', 'ブログURLを登録する'],
    ['2', 'Search Consoleプロパティを登録する'],
    ['3', 'Search Console接続テストを実行する'],
    ['4', 'URLデータ・クエリデータを取得する'],
    ['5', 'ホームに戻って「次にやること」を確認する'],
    ['', ''],
    ['現在のブログURL', simsGetBlogProfile_('BlogUrl', '未登録')],
    ['現在のSearch Consoleプロパティ', simsGetBlogProfile_('SearchConsoleProperty', '未登録')]
  ];
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  simsStyleUserSheet_(sheet, '#fbbc04');
  sheet.setColumnWidths(1, 1, 180);
  sheet.setColumnWidths(2, 1, 620);
  return sheet;
}

function simsEnsureTodaySheet_() {
  const sheet = simsGetOrCreateSheet_(SIMS_SHEETS.TODAY);
  sheet.clear();
  const rows = [
    ['今日の改善', 'ここからClaudeへ送る改善指示書を作成します'],
    ['手順1', 'SIMS → AI Exchange → Claude改善指示書を作成'],
    ['手順2', 'AI_Exchange_Requests の RequestMarkdown をコピー'],
    ['手順3', '記事本文と一緒にClaudeへ貼り付け'],
    ['手順4', 'Claudeの改善結果をSIMSへ取り込む'],
    ['手順5', '改善履歴と効果測定を確認']
  ];
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  simsStyleUserSheet_(sheet, '#4285f4');
  sheet.setColumnWidths(1, 1, 180);
  sheet.setColumnWidths(2, 1, 620);
  return sheet;
}

function simsEnsureMeasurementViewSheet_() {
  const sheet = simsGetOrCreateSheet_(SIMS_SHEETS.MEASUREMENT_VIEW);
  sheet.clear();
  const rows = [
    ['効果測定', '改善後の順位・CTR・クリック数を確認します'],
    ['見るポイント', '順位が上がったか'],
    ['見るポイント', 'CTRが上がったか'],
    ['見るポイント', 'クリック数が増えたか'],
    ['注意', '公開・更新直後はSearch Consoleの反映に時間がかかります']
  ];
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  simsStyleUserSheet_(sheet, '#a142f4');
  sheet.setColumnWidths(1, 1, 180);
  sheet.setColumnWidths(2, 1, 620);
  return sheet;
}

function simsEnsureHistoryViewSheet_() {
  const sheet = simsGetOrCreateSheet_(SIMS_SHEETS.HISTORY_VIEW);
  sheet.clear();
  const rows = [
    ['改善履歴', 'どの記事をいつ改善したかを確認します'],
    ['使い方', 'SIMS → 改善管理 → 改善履歴を開く で詳細を確認できます'],
    ['補足', 'このタブは利用者向けの入口です。詳細データはシステムタブに保存されます']
  ];
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  simsStyleUserSheet_(sheet, '#795548');
  sheet.setColumnWidths(1, 1, 180);
  sheet.setColumnWidths(2, 1, 620);
  return sheet;
}

function simsEnsureDefaultSettings_() {
  simsSetSetting_('CoreVersion', SIMS_CORE_VERSION, 'SIMS-Core runtime version');
  simsSetSetting_('SearchConsoleDays', SIMS_DEFAULTS.SEARCH_CONSOLE_DAYS, 'Default Search Console date range');
  simsSetSetting_('MeasurementDaysAfter', SIMS_DEFAULTS.MEASUREMENT_DAYS_AFTER, 'Days after improvement to measure results');
  simsSetSetting_('SpreadsheetUxMode', 'Beginner', 'Beginner mode hides system sheets by default');
}

function simsApplySpreadsheetUxV2_() {
  const ss = simsSs_();
  SIMS_USER_SHEETS.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;
    if (name === SIMS_SHEETS.HOME) sheet.setTabColor(SIMS_SHEET_COLORS.USER);
    else if (name === SIMS_SHEETS.SETUP) sheet.setTabColor(SIMS_SHEET_COLORS.SETUP);
    else if (name === SIMS_SHEETS.TODAY) sheet.setTabColor(SIMS_SHEET_COLORS.WORKFLOW);
    else if (name === SIMS_SHEETS.MEASUREMENT_VIEW) sheet.setTabColor(SIMS_SHEET_COLORS.MEASUREMENT);
    else if (name === SIMS_SHEETS.HISTORY_VIEW) sheet.setTabColor(SIMS_SHEET_COLORS.HISTORY);
    sheet.showSheet();
  });
  SIMS_SYSTEM_SHEETS.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;
    sheet.setTabColor(SIMS_SHEET_COLORS.SYSTEM);
    if (sheet.getName() !== SIMS_SHEETS.HOME) sheet.hideSheet();
  });
  simsOpenSheet_(SIMS_SHEETS.HOME);
}

function simsShowSystemSheets() {
  SIMS_SYSTEM_SHEETS.forEach(name => {
    const sheet = simsSs_().getSheetByName(name);
    if (sheet) sheet.showSheet();
  });
  simsToast_('システムタブを表示しました。編集には注意してください。', 'SIMS', 5);
}

function simsHideSystemSheets() {
  SIMS_SYSTEM_SHEETS.forEach(name => {
    const sheet = simsSs_().getSheetByName(name);
    if (sheet) sheet.hideSheet();
  });
  simsOpenSheet_(SIMS_SHEETS.HOME);
  simsToast_('システムタブを非表示にしました。', 'SIMS', 5);
}

function simsStyleUserSheet_(sheet, color) {
  const lastCol = Math.max(sheet.getLastColumn(), 2);
  const lastRow = Math.max(sheet.getLastRow(), 1);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, lastCol).setFontWeight('bold').setFontSize(16).setBackground(color).setFontColor('#ffffff');
  sheet.getRange(1, 1, lastRow, lastCol).setVerticalAlignment('top').setWrap(true);
  sheet.getRange(1, 1, lastRow, lastCol).setBorder(true, true, true, true, true, true);
}

function simsRegisterBlogUrl() {
  simsInitializeCoreSheets();
  const current = simsGetBlogProfile_('BlogUrl', '');
  const res = simsUi_().prompt('ブログURLを登録', 'ブログのトップページURLを入力してください。\n例: https://example.com/\n\n現在: ' + (current || '未登録'), simsUi_().ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== simsUi_().Button.OK) return;
  const url = simsSafeText_(res.getResponseText());
  if (!url) return simsAlert_('登録できません', 'URLが空です。');
  simsSetBlogProfile_('BlogUrl', url, 'ブログのトップページURL');
  simsLog_('RegisterBlogUrl', 'Done', url);
  simsRefreshDashboard();
  simsAlert_('登録しました', 'ブログURLを登録しました。\n' + url);
}

function simsRegisterSearchConsoleProperty() {
  simsInitializeCoreSheets();
  const current = simsGetBlogProfile_('SearchConsoleProperty', simsGetBlogProfile_('BlogUrl', ''));
  const res = simsUi_().prompt('Search Consoleプロパティを登録', 'Search Consoleのプロパティを入力してください。\nURLプレフィックス例: https://example.com/\nドメイン例: sc-domain:example.com\n\n現在: ' + (current || '未登録'), simsUi_().ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== simsUi_().Button.OK) return;
  const property = simsSafeText_(res.getResponseText());
  if (!property) return simsAlert_('登録できません', 'Search Consoleプロパティが空です。');
  simsSetBlogProfile_('SearchConsoleProperty', property, 'Google Search Console property');
  simsLog_('RegisterSearchConsoleProperty', 'Done', property);
  simsRefreshDashboard();
  simsAlert_('登録しました', 'Search Consoleプロパティを登録しました。\n' + property);
}

function simsOpenHome() {
  simsRefreshDashboard();
  simsOpenSheet_(SIMS_SHEETS.HOME);
}
